import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CitizenStatus,
  CohortPerson,
  CityMacroIndicators,
  TimelineEntry,
  YearFocus,
  DilemmaIssue,
  StanceOption,
  LifeChoiceCard,
  LifeChoiceOption
} from './types/game';
import {
  generateRandomBirth,
  generateBirthForDistrict,
  generateCohort,
  updateCohort,
  checkMortality,
  pickPersonalEvent,
  checkDilemmaTrigger,
  checkLifeChoiceTrigger,
  applyDiminishingReturns,
  getAgeStressDelta,
  getFocusDeltas,
  getRandomJob,
  PresetProfile,
  advanceCitizenProfile
} from './utils/simulation';
import { PAUSE_QUESTIONS } from './data/pauseQuestions';
import { getEduIncomeDesc } from './data/jinjuData';
import { audioManager } from './utils/audio';

import { Header } from './components/Header';
import { StatusBars } from './components/StatusBars';
import { TimelineLog } from './components/TimelineLog';
import { DilemmaCard } from './components/DilemmaCard';
import { LifeChoiceModal } from './components/LifeChoiceModal';
import { SideDashboard } from './components/SideDashboard';
import { YearFocusSelector } from './components/YearFocusSelector';
import { PauseModal } from './components/PauseModal';
import { EndingReceipt } from './components/EndingReceipt';
import { MemorialHall, MemorialRecord } from './components/MemorialHall';
import { BirthModal } from './components/BirthModal';
import { LeftProfilePanel } from './components/LeftProfilePanel';
import { Footer } from './components/Footer';
import { ScrollText, Scale, Users, GraduationCap, User } from 'lucide-react';

const BASE_YEAR_TICK_MS = 6000; // 1년 = 6초 (15분 내 완주 가능한 템포)

export const App: React.FC = () => {
  // 교육용 모드 초기화 (?edu=1 감지)
  const [isEduMode, setIsEduMode] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('edu') === '1';
  });

  // 메인 상태
  const [citizen, setCitizen] = useState<CitizenStatus>(() => generateRandomBirth(2026, isEduMode));
  const [cohort, setCohort] = useState<CohortPerson[]>(() => generateCohort(2026, citizen.district.id));
  const [cityIndicators, setCityIndicators] = useState<CityMacroIndicators>({
    space: 0,
    economy: 0,
    welfare: 0,
    culture: 0,
    trust: 50
  });
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [focus, setFocus] = useState<YearFocus>('learning');

  // 컨트롤 상태
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 모바일 전용 뷰 탭 ('profile' | 'timeline' | 'impact' | 'cohort')
  const [mobileTab, setMobileTab] = useState<'profile' | 'timeline' | 'impact' | 'cohort'>('timeline');

  // 사이드 대시보드 탭 ('impact' | 'cohort' - 데스크톱 및 모바일 독립 제어)
  const [dashboardTab, setDashboardTab] = useState<'impact' | 'cohort'>('impact');

  // 모달 팝업 상태
  const [isBirthModalOpen, setIsBirthModalOpen] = useState<boolean>(true);
  const [activeDilemma, setActiveDilemma] = useState<DilemmaIssue | null>(null);
  const [activeLifeChoice, setActiveLifeChoice] = useState<LifeChoiceCard | null>(null);
  const [activePauseQuestion, setActivePauseQuestion] = useState<{ age: number; question: string } | null>(null);
  const [isEndingOpen, setIsEndingOpen] = useState<boolean>(false);
  const [isMemorialOpen, setIsMemorialOpen] = useState<boolean>(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState<boolean>(false);

  const resolvedDilemmaIds = useRef<Set<string>>(new Set());
  const resolvedLifeChoiceIds = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);

  // 교육용 모드 토글
  const handleToggleEduMode = () => {
    const nextMode = !isEduMode;
    setIsEduMode(nextMode);
    
    // URL 파라미터 동기화
    const url = new URL(window.location.href);
    if (nextMode) {
      url.searchParams.set('edu', '1');
    } else {
      url.searchParams.delete('edu');
    }
    window.history.replaceState({}, '', url.toString());

    // 진행 중인 상태도 교육용 서술형 표현으로 즉시 보정
    setCitizen(prev => ({
      ...prev,
      name: nextMode ? '진주 학생' : '진주시민',
      incomeDesc: getEduIncomeDesc(prev.incomeDecile)
    }));
  };

  // 캐릭터 재추첨 (무작위)
  const handleRerollRandom = useCallback(() => {
    const newCitizen = generateRandomBirth(2026, isEduMode);
    setCitizen(newCitizen);
    setCohort(generateCohort(2026, newCitizen.district.id));
  }, [isEduMode]);

  // 프리셋 인물 선택
  const handleSelectPreset = useCallback((preset: PresetProfile) => {
    const newCitizen = generateBirthForDistrict(preset.districtId, 2026, preset.defaultDecile, isEduMode);
    setCitizen(newCitizen);
    setCohort(generateCohort(2026, newCitizen.district.id));
  }, [isEduMode]);

  // 게임 초기화 (다시 태어나기)
  const startNewLife = useCallback(() => {
    const newCitizen = generateRandomBirth(2026, isEduMode);
    const newCohort = generateCohort(2026, newCitizen.district.id);
    setCitizen(newCitizen);
    setCohort(newCohort);
    setCityIndicators({ space: 0, economy: 0, welfare: 0, culture: 0, trust: 50 });
    resolvedDilemmaIds.current.clear();
    resolvedLifeChoiceIds.current.clear();
    setFocus('learning');
    setIsEndingOpen(false);
    setActiveDilemma(null);
    setActiveLifeChoice(null);
    setActivePauseQuestion(null);
    setMobileTab('timeline');
    setDashboardTab('impact');

    setTimeline([
      {
        id: 'log_birth',
        year: 2026,
        age: 0,
        type: 'birth',
        label: 'FACT',
        sourceNote: isEduMode ? '진주시 공공통계 표본틀 (n=905)' : '2026 진주시 출생통계 (연 1,855명)',
        text: `2026년, 진주시 ${newCitizen.district.name}에서 태어났습니다. ${newCitizen.district.description}`
      }
    ]);

    setIsBirthModalOpen(true);
    setIsPaused(true);
  }, [isEduMode]);

  // 최초 로드 시 초기 로그 세팅
  useEffect(() => {
    setTimeline([
      {
        id: 'log_birth',
        year: citizen.birthYear,
        age: 0,
        type: 'birth',
        label: 'FACT',
        sourceNote: isEduMode ? '진주시 공공통계 표본틀 (n=905)' : '진주시 출생통계',
        text: `2026년, 진주시 ${citizen.district.name}에서 태어났습니다. ${citizen.district.description}`
      }
    ]);
  }, [citizen.district.name, citizen.district.description, citizen.birthYear, isEduMode]);

  // 오디오 토글
  const handleToggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  // 키보드 스페이스바 일시정지 토글
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isBirthModalOpen && !activeDilemma && !activeLifeChoice && !activePauseQuestion && !isEndingOpen && !isMemorialOpen) {
        e.preventDefault();
        setIsPaused(prev => !prev);
        audioManager.playClickSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBirthModalOpen, activeDilemma, activeLifeChoice, activePauseQuestion, isEndingOpen, isMemorialOpen]);

  // 1년 진행 틱 함수 (명세서 3.0 동적 밸런싱 & 한국형 스트레스 곡선 & 중복 방지)
  const tickYear = useCallback(() => {
    setCitizen(prevCitizen => {
      if (!prevCitizen.isAlive) return prevCitizen;

      const nextAge = prevCitizen.age + 1;
      const nextYear = prevCitizen.currentYear + 1;

      // 1. 초점(Focus)에 따른 기회비용 변동분 (명세서 3.4)
      const fDeltas = getFocusDeltas(focus);

      // 2. 한국형 생애 스트레스 곡선에 따른 연령별 자연 변화량 D(a) (명세서 3.2)
      const aDeltas = getAgeStressDelta(nextAge);

      // 3. 행복 기준선 회귀 (기질적 낙관도 기준선 [48, 58])
      const bHappy = 48 + 10 * ((prevCitizen.temperament?.optimism || 50) / 100);
      const happyReversion = -0.12 * (prevCitizen.happiness - bHappy);

      // 4. 가계 부채 발생 시 페널티
      const debtPenaltyHappiness = prevCitizen.hasDebtRisk ? -1.5 : 0;
      const debtPenaltyHealth = prevCitizen.hasDebtRisk ? -1.0 : 0;

      // 5. 합산 원시 변동치
      const rawDHealth = fDeltas.health + aDeltas.health + debtPenaltyHealth;
      const rawDHappiness = fDeltas.happiness + aDeltas.happiness + happyReversion + debtPenaltyHappiness;
      const rawDLearning = fDeltas.learning + aDeltas.learning;
      const rawDBonds = fDeltas.bonds + aDeltas.bonds;

      // 6. 한계효용 체감 및 상향 저항 비대칭 수식 적용 (명세서 3.3)
      let health = Math.max(0, Math.min(100, Math.round(prevCitizen.health + applyDiminishingReturns(prevCitizen.health, rawDHealth))));
      let happiness = Math.max(0, Math.min(100, Math.round(prevCitizen.happiness + applyDiminishingReturns(prevCitizen.happiness, rawDHappiness))));
      let learning = Math.max(0, Math.min(100, Math.round(prevCitizen.learning + applyDiminishingReturns(prevCitizen.learning, rawDLearning))));
      let bonds = Math.max(0, Math.min(100, Math.round(prevCitizen.bonds + applyDiminishingReturns(prevCitizen.bonds, rawDBonds))));

      // 7. 쿨타임 매년 1씩 차감 (명세서 1.2)
      const nextCooldowns: Record<string, number> = {};
      for (const [k, v] of Object.entries(prevCitizen.eventCooldowns || {})) {
        if (v > 1) nextCooldowns[k] = v - 1;
      }
      const nextSeenOnce = new Set(prevCitizen.seenOnceEvents || []);
      const nextCounts = { ...(prevCitizen.eventCounts || {}) };

      // 프로필 발전 (학력, 직업, 소득, 재산, 배우자, 자녀, 곁을 지키는 사람, 행복한 해, 시간 누적, 삶의 결, 연령별 취미 자동전환)
      const profileUpdates = advanceCitizenProfile(prevCitizen, nextAge, nextYear, focus);

      const tempCitizen: CitizenStatus = {
        ...prevCitizen,
        ...profileUpdates,
        age: nextAge,
        currentYear: nextYear,
        health,
        happiness,
        learning,
        bonds,
        eventCooldowns: nextCooldowns,
        seenOnceEvents: nextSeenOnce,
        eventCounts: nextCounts
      };

      // 8. 사망 판정 (교육용 모드 필터 적용)
      const mortality = checkMortality(tempCitizen, cityIndicators, isEduMode);
      if (mortality.willDie) {
        setIsPaused(true);
        setIsEndingOpen(true);
        audioManager.playChimeSound();

        setTimeline(t => [
          ...t,
          {
            id: `log_death_${nextAge}`,
            year: nextYear,
            age: nextAge,
            type: 'death',
            label: 'FACT',
            sourceNote: isEduMode ? '통계청 생명표' : '통계청 2023 사망원인통계',
            text: isEduMode
              ? `${nextAge}세의 나이로 가족과 이웃들의 따뜻한 배웅 속에 평온하게 삶을 마감하였습니다.`
              : `${nextAge}세의 나이로 남강의 곁에서 영면하였습니다. (사유: ${mortality.cause})`
          }
        ]);

        return {
          ...tempCitizen,
          isAlive: false,
          deathCause: mortality.cause
        };
      }

      // 9. 동시 출생 코호트 갱신
      setCohort(c => updateCohort(c, nextAge));

      // 10. 대한민국 표본 통계 기반 생애 전환 선택 카드 체크 (명세서 2.0: 청년유출, 병역, 결혼, 출산, 고정비, 취미, 의료)
      const lifeChoice = checkLifeChoiceTrigger(nextAge, tempCitizen.gender, tempCitizen.flags, resolvedLifeChoiceIds.current, isEduMode);
      if (lifeChoice) {
        setIsPaused(true);
        setActiveLifeChoice(lifeChoice);
        audioManager.playChimeSound();
      }

      // 11. 잠시 멈춤 질문 체크 (5, 15, 30, 50, 70세)
      const pauseDef = PAUSE_QUESTIONS.find(p => p.age === nextAge);
      if (pauseDef && !lifeChoice) {
        setIsPaused(true);
        const randomQ = pauseDef.questions[Math.floor(Math.random() * pauseDef.questions.length)];
        setActivePauseQuestion({ age: nextAge, question: randomQ });
        audioManager.playChimeSound();
      }

      // 12. 진주시 실제 초·중·고 진학 마일스톤 로그 (8세, 14세, 17세, 19세)
      if (nextAge === 8 && tempCitizen.elementarySchool) {
        setTimeline(t => [
          ...t,
          {
            id: `log_school_elem_${nextAge}`,
            year: nextYear,
            age: nextAge,
            type: 'milestone',
            label: 'FACT',
            sourceNote: '진주교육지원청 초등학교 학구 배정',
            text: `커다란 책가방을 메고 진주 ${tempCitizen.elementarySchool}에 입학했습니다. 노란 신호등 앞에서 녹색어머니회의 손을 잡고 등굣길을 걷습니다.`
          }
        ]);
      } else if (nextAge === 14 && tempCitizen.middleSchool) {
        setTimeline(t => [
          ...t,
          {
            id: `log_school_mid_${nextAge}`,
            year: nextYear,
            age: nextAge,
            type: 'milestone',
            label: 'FACT',
            sourceNote: '진주시 중학교 학교군 배정',
            text: `단정한 새 교복을 입고 ${tempCitizen.middleSchool}에 진학했습니다. 새로운 단짝 친구들과 학업의 첫걸음을 뗍니다.`
          }
        ]);
      } else if (nextAge === 17 && tempCitizen.highSchool) {
        setTimeline(t => [
          ...t,
          {
            id: `log_school_high_${nextAge}`,
            year: nextYear,
            age: nextAge,
            type: 'milestone',
            label: 'FACT',
            sourceNote: '경상남도교육청 평준화 일반고·특목고 배정',
            text: `진주의 고등학교인 ${tempCitizen.highSchool}에 입학했습니다. 야간 자율학습과 동아리 활동 속에서 진로를 고민합니다.`
          }
        ]);
      } else if (nextAge === 19 && tempCitizen.highSchool) {
        setTimeline(t => [
          ...t,
          {
            id: `log_school_grad_${nextAge}`,
            year: nextYear,
            age: nextAge,
            type: 'milestone',
            label: 'PERSONAL',
            text: `정들었던 ${tempCitizen.highSchool} 교정을 나서며 졸업장을 품에 안았습니다. 함께 웃고 울던 친구들과 성인의 길목에 섭니다.`
          }
        ]);
      }

      // 13. 지역 현안 딜레마 체크 (보이텔스바흐 원칙)
      const dilemma = checkDilemmaTrigger(tempCitizen, resolvedDilemmaIds.current, isEduMode);
      if (dilemma && !pauseDef && !lifeChoice) {
        setIsPaused(true);
        setActiveDilemma(dilemma);
        audioManager.playChimeSound();
      }

      // 14. 일상 인카운터 추첨 (중복 방지 & 쿨타임 & 감쇠 가중치 적용 - 명세서 1.2)
      const event = pickPersonalEvent(tempCitizen, focus, isEduMode);
      if (event) {
        // 인카운터 효과도 한계효용 체감 비대칭 수식 적용
        if (event.impact.health) health = Math.max(0, Math.min(100, Math.round(health + applyDiminishingReturns(health, event.impact.health))));
        if (event.impact.happiness) happiness = Math.max(0, Math.min(100, Math.round(happiness + applyDiminishingReturns(happiness, event.impact.happiness))));
        if (event.impact.learning) learning = Math.max(0, Math.min(100, Math.round(learning + applyDiminishingReturns(learning, event.impact.learning))));
        if (event.impact.bonds) bonds = Math.max(0, Math.min(100, Math.round(bonds + applyDiminishingReturns(bonds, event.impact.bonds))));

        nextCounts[event.id] = (nextCounts[event.id] || 0) + 1;
        if (event.onceOnly) {
          nextSeenOnce.add(event.id);
        }
        if (event.cooldownYears) {
          nextCooldowns[event.id] = event.cooldownYears;
        }

        setTimeline(t => [
          ...t,
          {
            id: `log_pe_${nextAge}_${Date.now()}`,
            year: nextYear,
            age: nextAge,
            type: 'growth',
            label: event.label,
            sourceNote: event.sourceNote,
            text: event.text
          }
        ]);
      }

      return {
        ...tempCitizen,
        health,
        happiness,
        learning,
        bonds,
        seenOnceEvents: nextSeenOnce,
        eventCooldowns: nextCooldowns,
        eventCounts: nextCounts
      };
    });
  }, [focus, cityIndicators, isEduMode]);

  // 메인 타이머 루프
  useEffect(() => {
    if (isPaused || isBirthModalOpen || activeDilemma || activeLifeChoice || activePauseQuestion || isEndingOpen || isMemorialOpen) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = Math.round(BASE_YEAR_TICK_MS / speed);
    timerRef.current = window.setInterval(tickYear, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, speed, isBirthModalOpen, activeDilemma, activeLifeChoice, activePauseQuestion, isEndingOpen, isMemorialOpen, tickYear]);

  // 출생 모달에서 삶 시작
  const handleStartLife = () => {
    setIsBirthModalOpen(false);
    setIsPaused(false);
    audioManager.startBGM();
  };

  // 대한민국 표본 통계 기반 생애 전환 선택 완료 핸들러 (명세서 2.0)
  const handleResolveLifeChoice = (option: LifeChoiceOption) => {
    if (!activeLifeChoice) return;

    resolvedLifeChoiceIds.current.add(activeLifeChoice.choiceCardId);

    setCitizen(prev => {
      const eff = option.effects;
      const nextFlags = new Set(prev.flags);
      if (option.grantFlag) nextFlags.add(option.grantFlag);
      if (option.removeFlag) nextFlags.delete(option.removeFlag);

      // 한계효용 체감 비대칭 수식 적용 (명세서 3.3)
      const dHealth = applyDiminishingReturns(prev.health, eff.health || 0);
      const dHappiness = applyDiminishingReturns(prev.happiness, eff.happiness || 0);
      const dLearning = applyDiminishingReturns(prev.learning, eff.learning || 0);
      const dBonds = applyDiminishingReturns(prev.bonds, eff.bonds || 0);

      const nextIncomeDecile = Math.max(1, Math.min(5, prev.incomeDecile + (eff.incomeChange || 0)));
      const nextDebtRisk = prev.hasDebtRisk || (eff.spend !== undefined && eff.spend <= -2 && nextIncomeDecile <= 2);

      // 결혼 분기 선택 시 배우자 정보 즉시 생성
      let nextSpouse = prev.spouse;
      if (option.grantFlag?.startsWith('MARRIED_') && !nextSpouse) {
        const spouseNames = prev.gender === '남성'
          ? ['지은', '서연', '민서', '수빈', '유진', '하은', '지우', '소희']
          : ['민준', '도윤', '준서', '예준', '지훈', '서진', '현우', '동현'];
        const chosenName = spouseNames[Math.floor(Math.random() * spouseNames.length)];
        nextSpouse = {
          name: chosenName,
          marriedAge: prev.age,
          yearsTogether: 1,
          passedAway: false
        };
      }

      // 출산 분기 선택 시 자녀 수 반영
      let nextChildren = prev.childrenCount;
      if (option.optionId === 'CHILD_ONE_FOCUS' && nextChildren === 0) {
        nextChildren = 1;
      } else if (option.optionId === 'CHILD_MULTI_BLESSING') {
        nextChildren = Math.max(2, nextChildren + 2);
      }

      // 취미 선택 반영
      let nextHobby = prev.hobby;
      if (option.optionId === 'HOBBY_IDOL_ROOT') nextHobby = 'K-POP 아이돌 및 대중가수 팬덤';
      else if (option.optionId === 'HOBBY_SPORT_ROOT') nextHobby = '남강 둔치 러닝 및 생활체육';
      else if (option.optionId === 'HOBBY_READ_ROOT') nextHobby = '독서와 작은 도서관 모임';
      else if (option.optionId === 'HOBBY_MUSIC_ROOT') nextHobby = '통기타·건반 연주 및 아마추어 밴드';

      return {
        ...prev,
        health: Math.max(0, Math.min(100, Math.round(prev.health + dHealth))),
        happiness: Math.max(0, Math.min(100, Math.round(prev.happiness + dHappiness))),
        learning: Math.max(0, Math.min(100, Math.round(prev.learning + dLearning))),
        bonds: Math.max(0, Math.min(100, Math.round(prev.bonds + dBonds))),
        incomeDecile: nextIncomeDecile,
        incomeDesc: getEduIncomeDesc(nextIncomeDecile),
        hasDebtRisk: nextDebtRisk,
        spouse: nextSpouse,
        childrenCount: nextChildren,
        hobby: nextHobby,
        flags: nextFlags
      };
    });

    setTimeline(t => [
      ...t,
      {
        id: `life_choice_${Date.now()}`,
        year: citizen.currentYear,
        age: citizen.age,
        type: 'milestone',
        label: 'STANCE',
        sourceNote: activeLifeChoice.categoryName,
        text: `[생애의 결단: ${activeLifeChoice.title}] "${option.label}"을(를) 선택했습니다. ${option.consequenceText || ''}`
      }
    ]);

    setActiveLifeChoice(null);
    setIsPaused(false);
  };

  // 딜레마 선택 완료 핸들러
  const handleResolveDilemma = (option: StanceOption, reason: string, participation: string) => {
    if (!activeDilemma) return;

    resolvedDilemmaIds.current.add(activeDilemma.id);

    setCitizen(prev => {
      const p = option.impactPersonal;
      return {
        ...prev,
        health: Math.max(0, Math.min(100, prev.health + (p.health || 0))),
        happiness: Math.max(0, Math.min(100, prev.happiness + (p.happiness || 0))),
        learning: Math.max(0, Math.min(100, prev.learning + (p.learning || 0))),
        bonds: Math.max(0, Math.min(100, prev.bonds + (p.bonds || 0))),
        incomeDecile: Math.max(1, Math.min(5, prev.incomeDecile + (p.incomeChange || 0))),
        choicesHistory: [
          ...prev.choicesHistory,
          {
            year: prev.currentYear,
            age: prev.age,
            issueId: activeDilemma.id,
            issueTitle: activeDilemma.title,
            stance: option.stance,
            reason,
            impactSummary: option.whatIfText
          }
        ]
      };
    });

    setCityIndicators(prev => {
      const c = option.impactCity;
      return {
        space: Math.max(-100, Math.min(100, prev.space + (c.space || 0))),
        economy: Math.max(-100, Math.min(100, prev.economy + (c.economy || 0))),
        welfare: Math.max(-100, Math.min(100, prev.welfare + (c.welfare || 0))),
        culture: Math.max(-100, Math.min(100, prev.culture + (c.culture || 0))),
        trust: Math.max(0, Math.min(100, prev.trust + (c.trust || 0)))
      };
    });

    setTimeline(t => [
      ...t,
      {
        id: `dilemma_choice_${Date.now()}`,
        year: citizen.currentYear,
        age: citizen.age,
        type: 'dilemma',
        label: 'STANCE',
        sourceNote: activeDilemma.factSource,
        text: `[진주의 선택] "${activeDilemma.title}"에서 [${option.stance}]을(를) 택했습니다. (이유: "${reason}" / 참여: ${participation})`
      },
      {
        id: `dilemma_whatif_${Date.now()}`,
        year: citizen.currentYear,
        age: citizen.age,
        type: 'dilemma',
        label: 'WHATIF',
        text: option.whatIfText
      }
    ]);

    setActiveDilemma(null);
    setIsPaused(false);
  };

  // 잠시 멈춤 완료 핸들러
  const handleResolvePause = (answer: string) => {
    if (!activePauseQuestion) return;

    if (answer) {
      setCitizen(prev => ({
        ...prev,
        pausedQuestionAnswers: [
          ...prev.pausedQuestionAnswers,
          { age: activePauseQuestion.age, question: activePauseQuestion.question, answer }
        ]
      }));

      setTimeline(t => [
        ...t,
        {
          id: `pause_log_${Date.now()}`,
          year: citizen.currentYear,
          age: activePauseQuestion.age,
          type: 'pause',
          label: 'REFLECT',
          text: `[${activePauseQuestion.age}세의 성찰] "${activePauseQuestion.question}" ➔ "${answer}"`
        }
      ]);
    }

    setActivePauseQuestion(null);
    setIsPaused(false);
  };

  // 유등 추모관에 저장 (외부 전송 없이 로컬 브라우저에만 보관)
  const handleSendToMemorial = (words: string) => {
    const record: MemorialRecord = {
      id: `memorial_${Date.now()}`,
      birthYear: citizen.birthYear,
      deathYear: citizen.currentYear,
      age: citizen.age,
      district: citizen.district.name.split(' ')[0],
      job: citizen.job,
      words,
      choicesCount: citizen.choicesHistory.length
    };

    try {
      const existing = localStorage.getItem('jinju_life_memorials');
      const list: MemorialRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem('jinju_life_memorials', JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#07090e] text-slate-100 flex flex-col select-none overflow-hidden">
      
      {/* 1. 상단 바 (헤더 - 프로필 열기 & 교육용 모드 토글 지원) */}
      <Header
        citizen={citizen}
        isPaused={isPaused}
        speed={speed}
        isEduMode={isEduMode}
        onTogglePause={() => setIsPaused(p => !p)}
        onChangeSpeed={setSpeed}
        onToggleEduMode={handleToggleEduMode}
        onOpenMemorial={() => setIsMemorialOpen(true)}
        onOpenProfile={() => setIsMobileProfileOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. 상태 게이지 (개인 4대 지표 - 교육용 서술형 지원) */}
      <StatusBars
        citizen={citizen}
        cityIndicators={cityIndicators}
        isEduMode={isEduMode}
        onOpenMobileProfile={() => setIsMobileProfileOpen(true)}
      />

      {/* 3. 모바일 전용 뷰 전환 탭 바 (lg:hidden) */}
      <div className="lg:hidden bg-space-950 border-b border-space-800 px-2 py-1.5 flex items-center justify-around text-xs gap-1 shrink-0">
        <button
          onClick={() => {
            setMobileTab('profile');
            audioManager.playClickSound();
          }}
          className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-bold text-[11px] transition ${
            mobileTab === 'profile'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>내 프로필</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('timeline');
            audioManager.playClickSound();
          }}
          className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition text-[11px] ${
            mobileTab === 'timeline'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-400'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>생애 기록</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('impact');
            setDashboardTab('impact');
            audioManager.playClickSound();
          }}
          className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition relative text-[11px] ${
            mobileTab === 'impact' && dashboardTab === 'impact'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-400'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>내 선택·도시</span>
          {citizen.choicesHistory.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => {
            setMobileTab('cohort');
            setDashboardTab('cohort');
            audioManager.playClickSound();
          }}
          className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition text-[11px] ${
            mobileTab === 'cohort' || (mobileTab === 'impact' && dashboardTab === 'cohort')
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
              : 'text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>동갑내기 4인</span>
        </button>
      </div>

      {/* 4. 메인 콘텐츠: 좌측 프로필 패널 + 텍스트 타임라인 + 사이드 대시보드 */}
      <main className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* 데스크톱: 좌측 패널에 항상 표시되는 인물 프로필 패널 (컴퓨터 화면 전용 고정) */}
        <aside className="hidden lg:flex w-72 xl:w-80 flex-col shrink-0 border-r border-space-800 bg-space-950/70 overflow-hidden h-full min-h-0">
          <LeftProfilePanel citizen={citizen} isEduMode={isEduMode} />
        </aside>

        {/* 모바일 뷰 1: 내 프로필 (mobileTab === 'profile') */}
        <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${mobileTab === 'profile' ? 'flex lg:hidden' : 'hidden'}`}>
          <LeftProfilePanel citizen={citizen} isEduMode={isEduMode} />
        </div>

        {/* 데스크톱: 타임라인 항상 보임 / 모바일: mobileTab === 'timeline'일 때만 보임 */}
        <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${mobileTab !== 'timeline' ? 'hidden lg:flex' : 'flex'}`}>
          <TimelineLog entries={timeline} />
        </div>

        {/* 데스크톱: 사이드바 항상 보임 / 모바일: mobileTab이 impact 또는 cohort일 때 보임 */}
        <div className={`w-full lg:w-80 xl:w-88 flex flex-col shrink-0 overflow-hidden h-full min-h-0 ${mobileTab === 'timeline' || mobileTab === 'profile' ? 'hidden lg:flex' : 'flex flex-1'}`}>
          <SideDashboard
            cohort={cohort}
            birthYear={citizen.birthYear}
            choicesHistory={citizen.choicesHistory}
            cityIndicators={cityIndicators}
            activeTab={dashboardTab}
            onTabChange={setDashboardTab}
          />
        </div>

      </main>

      {/* 5. 하단 올해의 초점 칩 선택기 */}
      <YearFocusSelector
        currentFocus={focus}
        onSelectFocus={setFocus}
      />

      {/* 6. 웹 하단부(Footer) 저작자 및 라이선스 명시 (명세서 4.0 필수 표기) */}
      <Footer />

      {/* 화면 우측 상시 교육용 모드 플로팅 전환 버튼 (모달이 닫혀 있을 때 바로 확인/전환) */}
      {!isBirthModalOpen && !activeDilemma && !activeLifeChoice && !activePauseQuestion && !isEndingOpen && !isMemorialOpen && (
        <aside aria-label="교육용 모드 빠른 전환" className="fixed bottom-14 right-3 sm:bottom-16 sm:right-5 z-20">
          <button
            onClick={() => {
              handleToggleEduMode();
              audioManager.playClickSound();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-bold transition-all border transform hover:scale-105 active:scale-95 ${
              isEduMode
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-500/20'
                : 'bg-space-900/90 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950'
            }`}
            title={isEduMode ? "일반 시민 모드로 전환" : "학생 교육용 안심 모드로 즉시 전환"}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${isEduMode ? 'text-emerald-400 animate-pulse' : 'text-emerald-300'}`} />
            <span>{isEduMode ? '🎓 교육모드 ON' : '🎓 학생 교육용 모드'}</span>
          </button>
        </aside>
      )}

      {/* 모달 1: 출생 및 인물 선택 모달 */}
      {isBirthModalOpen && (
        <BirthModal
          citizen={citizen}
          isEduMode={isEduMode}
          onStartLife={handleStartLife}
          onRerollRandom={handleRerollRandom}
          onSelectPreset={handleSelectPreset}
          onToggleEduMode={handleToggleEduMode}
        />
      )}

      {/* 모달 2: 대한민국 표본 통계 기반 생애 전환 선택 모달 (명세서 2.0: 청년유출, 병역, 결혼, 출산, 고정비, 취미, 의료) */}
      {activeLifeChoice && (
        <LifeChoiceModal
          choiceCard={activeLifeChoice}
          age={citizen.age}
          year={citizen.currentYear}
          citizenLearning={citizen.learning}
          citizenIncomeDecile={citizen.incomeDecile}
          isEduMode={isEduMode}
          onSelectOption={handleResolveLifeChoice}
        />
      )}

      {/* 모달 3: 4막 딜레마 선택 모달 (보이텔스바흐 원칙 적용) */}
      {activeDilemma && (
        <DilemmaCard
          dilemma={activeDilemma}
          age={citizen.age}
          year={citizen.currentYear}
          isEduMode={isEduMode}
          onSelectOption={handleResolveDilemma}
        />
      )}

      {/* 모달 4: 5대 성찰 질문 잠시 멈춤 모달 (교육용 생각 카드 지원) */}
      {activePauseQuestion && (
        <PauseModal
          age={activePauseQuestion.age}
          question={activePauseQuestion.question}
          isEduMode={isEduMode}
          onConfirm={handleResolvePause}
        />
      )}

      {/* 모달 5: 생애 영수증 및 엔딩 (출생은 운 디브리핑) */}
      {isEndingOpen && (
        <EndingReceipt
          citizen={citizen}
          cityIndicators={cityIndicators}
          isEduMode={isEduMode}
          onRestart={startNewLife}
          onSendToMemorial={handleSendToMemorial}
        />
      )}

      {/* 모달 6: 남강 유등 추모관 */}
      {isMemorialOpen && (
        <MemorialHall
          onClose={() => setIsMemorialOpen(false)}
        />
      )}

      {/* 모바일 전용: 프로필 팝업 모달 (별도로 열고 닫을 수 있도록 지원) */}
      {isMobileProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-space-950 border border-slate-700/80 rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[85vh] h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex-1 overflow-hidden">
              <LeftProfilePanel
                citizen={citizen}
                isEduMode={isEduMode}
                onCloseMobile={() => setIsMobileProfileOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
