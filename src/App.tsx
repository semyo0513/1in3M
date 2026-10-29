import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CitizenStatus,
  CohortPerson,
  CityMacroIndicators,
  TimelineEntry,
  YearFocus,
  DilemmaIssue,
  StanceOption
} from './types/game';
import {
  generateRandomBirth,
  generateBirthForDistrict,
  generateCohort,
  updateCohort,
  checkMortality,
  pickPersonalEvent,
  checkDilemmaTrigger,
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
import { SideDashboard } from './components/SideDashboard';
import { YearFocusSelector } from './components/YearFocusSelector';
import { PauseModal } from './components/PauseModal';
import { EndingReceipt } from './components/EndingReceipt';
import { MemorialHall, MemorialRecord } from './components/MemorialHall';
import { BirthModal } from './components/BirthModal';
import { LeftProfilePanel } from './components/LeftProfilePanel';
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

  // 모바일 전용 뷰 탭 ('timeline' | 'impact' | 'cohort')
  const [mobileTab, setMobileTab] = useState<'timeline' | 'impact' | 'cohort'>('timeline');

  // 모달 팝업 상태
  const [isBirthModalOpen, setIsBirthModalOpen] = useState<boolean>(true);
  const [activeDilemma, setActiveDilemma] = useState<DilemmaIssue | null>(null);
  const [activePauseQuestion, setActivePauseQuestion] = useState<{ age: number; question: string } | null>(null);
  const [isEndingOpen, setIsEndingOpen] = useState<boolean>(false);
  const [isMemorialOpen, setIsMemorialOpen] = useState<boolean>(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState<boolean>(false);

  const resolvedDilemmaIds = useRef<Set<string>>(new Set());
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
    setFocus('learning');
    setIsEndingOpen(false);
    setActiveDilemma(null);
    setActivePauseQuestion(null);
    setMobileTab('timeline');

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
      if (e.code === 'Space' && !isBirthModalOpen && !activeDilemma && !activePauseQuestion && !isEndingOpen && !isMemorialOpen) {
        e.preventDefault();
        setIsPaused(prev => !prev);
        audioManager.playClickSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBirthModalOpen, activeDilemma, activePauseQuestion, isEndingOpen, isMemorialOpen]);

  // 1년 진행 틱 함수
  const tickYear = useCallback(() => {
    setCitizen(prevCitizen => {
      if (!prevCitizen.isAlive) return prevCitizen;

      const nextAge = prevCitizen.age + 1;
      const nextYear = prevCitizen.currentYear + 1;

      let { health, happiness, learning, bonds } = prevCitizen;
      if (focus === 'learning') learning = Math.min(100, learning + 3);
      if (focus === 'work') happiness = Math.max(0, happiness - 1);
      if (focus === 'relationship') bonds = Math.min(100, bonds + 3);
      if (focus === 'health') health = Math.min(100, health + 3);
      if (focus === 'change') happiness = Math.min(100, happiness + 2);

      if (nextAge > 65) {
        health = Math.max(0, health - 1);
      }

      // 프로필 발전 (학력, 직업, 소득, 재산, 배우자, 자녀, 곁을 지키는 사람, 행복한 해, 시간 누적, 삶의 결)
      const profileUpdates = advanceCitizenProfile(prevCitizen, nextAge, nextYear, focus);

      const tempCitizen: CitizenStatus = {
        ...prevCitizen,
        ...profileUpdates,
        age: nextAge,
        currentYear: nextYear,
        health,
        happiness,
        learning,
        bonds
      };

      // 1. 사망 판정 (교육용 모드 필터 적용)
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

      // 2. 동시 출생 코호트 갱신
      setCohort(c => updateCohort(c, nextAge));

      // 3. 잠시 멈춤 질문 체크 (5, 15, 30, 50, 70세)
      const pauseDef = PAUSE_QUESTIONS.find(p => p.age === nextAge);
      if (pauseDef) {
        setIsPaused(true);
        const randomQ = pauseDef.questions[Math.floor(Math.random() * pauseDef.questions.length)];
        setActivePauseQuestion({ age: nextAge, question: randomQ });
        audioManager.playChimeSound();
      }

      // 4. 딜레마 체크 (교육용 모드 분기)
      const dilemma = checkDilemmaTrigger(tempCitizen, resolvedDilemmaIds.current, isEduMode);
      if (dilemma && !pauseDef) {
        setIsPaused(true);
        setActiveDilemma(dilemma);
        audioManager.playChimeSound();
      }

      // 5. 일상 인카운터 추첨 (교육용 모드 민감소재 필터)
      const event = pickPersonalEvent(tempCitizen, focus, isEduMode);
      if (event) {
        if (event.impact.health) health = Math.max(0, Math.min(100, health + event.impact.health));
        if (event.impact.happiness) happiness = Math.max(0, Math.min(100, happiness + event.impact.happiness));
        if (event.impact.learning) learning = Math.max(0, Math.min(100, learning + event.impact.learning));
        if (event.impact.bonds) bonds = Math.max(0, Math.min(100, bonds + event.impact.bonds));

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
        bonds
      };
    });
  }, [focus, cityIndicators, isEduMode]);

  // 메인 타이머 루프
  useEffect(() => {
    if (isPaused || isBirthModalOpen || activeDilemma || activePauseQuestion || isEndingOpen || isMemorialOpen) {
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
  }, [isPaused, speed, isBirthModalOpen, activeDilemma, activePauseQuestion, isEndingOpen, isMemorialOpen, tickYear]);

  // 출생 모달에서 삶 시작
  const handleStartLife = () => {
    setIsBirthModalOpen(false);
    setIsPaused(false);
    audioManager.startBGM();
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col select-none">
      
      {/* 1. 상단 바 (헤더 - 교육용 모드 토글 지원) */}
      <Header
        citizen={citizen}
        isPaused={isPaused}
        speed={speed}
        isEduMode={isEduMode}
        onTogglePause={() => setIsPaused(p => !p)}
        onChangeSpeed={setSpeed}
        onToggleEduMode={handleToggleEduMode}
        onOpenMemorial={() => setIsMemorialOpen(true)}
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
      <div className="lg:hidden bg-space-950 border-b border-space-800 px-2 py-1.5 flex items-center justify-around text-xs gap-1">
        <button
          onClick={() => {
            setIsMobileProfileOpen(true);
            audioManager.playClickSound();
          }}
          className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 text-[11px] shrink-0"
        >
          <User className="w-3.5 h-3.5" />
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
            audioManager.playClickSound();
          }}
          className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition relative text-[11px] ${
            mobileTab === 'impact'
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
            audioManager.playClickSound();
          }}
          className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition text-[11px] ${
            mobileTab === 'cohort'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
              : 'text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>동갑내기</span>
        </button>
      </div>

      {/* 4. 메인 콘텐츠: 좌측 프로필 패널 + 텍스트 타임라인 + 사이드 대시보드 */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* 데스크톱: 좌측 패널에 항상 표시되는 인물 프로필 패널 (컴퓨터 화면 전용 고정) */}
        <aside className="hidden lg:flex w-72 xl:w-80 flex-col shrink-0 border-r border-space-800 bg-space-950/70 overflow-hidden">
          <LeftProfilePanel citizen={citizen} isEduMode={isEduMode} />
        </aside>

        {/* 데스크톱: 타임라인 항상 보임 / 모바일: mobileTab === 'timeline'일 때만 보임 */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileTab !== 'timeline' ? 'hidden lg:flex' : 'flex'}`}>
          <TimelineLog entries={timeline} />
        </div>

        {/* 데스크톱: 사이드바 항상 보임 / 모바일: mobileTab이 impact 또는 cohort일 때 보임 */}
        <div className={`w-full lg:w-80 xl:w-88 flex flex-col shrink-0 overflow-hidden ${mobileTab === 'timeline' ? 'hidden lg:flex' : 'flex flex-1'}`}>
          <SideDashboard
            cohort={cohort}
            birthYear={citizen.birthYear}
            choicesHistory={citizen.choicesHistory}
            cityIndicators={cityIndicators}
            activeTab={mobileTab === 'cohort' ? 'cohort' : 'impact'}
            onTabChange={(t) => {
              if (mobileTab !== 'timeline') {
                setMobileTab(t);
              }
            }}
          />
        </div>

      </main>

      {/* 5. 하단 올해의 초점 칩 선택기 */}
      <YearFocusSelector
        currentFocus={focus}
        onSelectFocus={setFocus}
      />

      {/* 화면 우측 상시 교육용 모드 플로팅 전환 버튼 (모달이 닫혀 있을 때 바로 확인/전환) */}
      {!isBirthModalOpen && !activeDilemma && !activePauseQuestion && !isEndingOpen && !isMemorialOpen && (
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

      {/* 모달 2: 4막 딜레마 선택 모달 (보이텔스바흐 원칙 적용) */}
      {activeDilemma && (
        <DilemmaCard
          dilemma={activeDilemma}
          age={citizen.age}
          year={citizen.currentYear}
          isEduMode={isEduMode}
          onSelectOption={handleResolveDilemma}
        />
      )}

      {/* 모달 3: 5대 성찰 질문 잠시 멈춤 모달 (교육용 생각 카드 지원) */}
      {activePauseQuestion && (
        <PauseModal
          age={activePauseQuestion.age}
          question={activePauseQuestion.question}
          isEduMode={isEduMode}
          onConfirm={handleResolvePause}
        />
      )}

      {/* 모달 4: 생애 영수증 및 엔딩 (출생은 운 디브리핑) */}
      {isEndingOpen && (
        <EndingReceipt
          citizen={citizen}
          cityIndicators={cityIndicators}
          isEduMode={isEduMode}
          onRestart={startNewLife}
          onSendToMemorial={handleSendToMemorial}
        />
      )}

      {/* 모달 5: 남강 유등 추모관 */}
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
