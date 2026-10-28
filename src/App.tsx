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
  generateCohort,
  updateCohort,
  checkMortality,
  pickPersonalEvent,
  checkDilemmaTrigger,
  getRandomJob
} from './utils/simulation';
import { PAUSE_QUESTIONS } from './data/pauseQuestions';
import { audioManager } from './utils/audio';

import { Header } from './components/Header';
import { StatusBars } from './components/StatusBars';
import { TimelineLog } from './components/TimelineLog';
import { DilemmaCard } from './components/DilemmaCard';
import { CohortPanel } from './components/CohortPanel';
import { YearFocusSelector } from './components/YearFocusSelector';
import { PauseModal } from './components/PauseModal';
import { EndingReceipt } from './components/EndingReceipt';
import { MemorialHall, MemorialRecord } from './components/MemorialHall';
import { BirthModal } from './components/BirthModal';

const BASE_YEAR_TICK_MS = 6000; // 1년 = 6초 (0.5x=12초, 1x=6초, 2x=3초 - 몰입감과 템포의 황금 밸런스)

export const App: React.FC = () => {
  // 메인 상태
  const [citizen, setCitizen] = useState<CitizenStatus>(() => generateRandomBirth(2026));
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
  const [isPaused, setIsPaused] = useState<boolean>(true); // 처음엔 출생 모달 확인 후 시작
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 모달 팝업 상태
  const [isBirthModalOpen, setIsBirthModalOpen] = useState<boolean>(true);
  const [activeDilemma, setActiveDilemma] = useState<DilemmaIssue | null>(null);
  const [activePauseQuestion, setActivePauseQuestion] = useState<{ age: number; question: string } | null>(null);
  const [isEndingOpen, setIsEndingOpen] = useState<boolean>(false);
  const [isMemorialOpen, setIsMemorialOpen] = useState<boolean>(false);

  const resolvedDilemmaIds = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);

  // 게임 초기화
  const startNewLife = useCallback(() => {
    const newCitizen = generateRandomBirth(2026);
    const newCohort = generateCohort(2026, newCitizen.district.id);
    setCitizen(newCitizen);
    setCohort(newCohort);
    setCityIndicators({ space: 0, economy: 0, welfare: 0, culture: 0, trust: 50 });
    resolvedDilemmaIds.current.clear();
    setFocus('learning');
    setIsEndingOpen(false);
    setActiveDilemma(null);
    setActivePauseQuestion(null);

    // 출생 첫 로그
    setTimeline([
      {
        id: 'log_birth',
        year: 2026,
        age: 0,
        type: 'birth',
        label: 'FACT',
        sourceNote: '2026 진주시 출생통계 (연 1,855명)',
        text: `2026년, 진주시 ${newCitizen.district.name}에서 태어났습니다. ${newCitizen.district.description}`
      }
    ]);

    setIsBirthModalOpen(true);
    setIsPaused(true);
  }, []);

  // 최초 로드 시 초기 로그 세팅
  useEffect(() => {
    setTimeline([
      {
        id: 'log_birth',
        year: citizen.birthYear,
        age: 0,
        type: 'birth',
        label: 'FACT',
        sourceNote: '진주시 출생통계',
        text: `2026년, 진주시 ${citizen.district.name}에서 태어났습니다. ${citizen.district.description}`
      }
    ]);
  }, []);

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

      // 직업 갱신
      let nextJob = prevCitizen.job;
      if (nextAge === 19 || nextAge === 26 || nextAge === 65) {
        nextJob = getRandomJob(prevCitizen.district.id, nextAge);
      }

      // 초점 보정
      let { health, happiness, learning, bonds } = prevCitizen;
      if (focus === 'learning') learning = Math.min(100, learning + 3);
      if (focus === 'work') happiness = Math.max(0, happiness - 1);
      if (focus === 'relationship') bonds = Math.min(100, bonds + 3);
      if (focus === 'health') health = Math.min(100, health + 3);
      if (focus === 'change') happiness = Math.min(100, happiness + 2);

      // 자연 노화 페널티
      if (nextAge > 65) {
        health = Math.max(0, health - 1);
      }

      // 1. 사망 판정
      const tempCitizen: CitizenStatus = {
        ...prevCitizen,
        age: nextAge,
        currentYear: nextYear,
        health,
        happiness,
        learning,
        bonds,
        job: nextJob
      };

      const mortality = checkMortality(tempCitizen, cityIndicators);
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
            sourceNote: '통계청 생명표 및 사망원인통계',
            text: `${nextAge}세의 나이로 남강의 곁에서 영면하였습니다. (사유: ${mortality.cause})`
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

      // 4. 딜레마 체크 (우선순위)
      const dilemma = checkDilemmaTrigger(tempCitizen, resolvedDilemmaIds.current);
      if (dilemma && !pauseDef) {
        setIsPaused(true);
        setActiveDilemma(dilemma);
        audioManager.playChimeSound();
      }

      // 5. 일상 인카운터 추첨
      const event = pickPersonalEvent(tempCitizen, focus);
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
  }, [focus, cityIndicators]);

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

    // 개인 스탯 및 도시 지표 반영
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

    // 타임라인에 딜레마 및 나비효과 추가
    setTimeline(t => [
      ...t,
      {
        id: `dilemma_choice_${Date.now()}`,
        year: citizen.currentYear,
        age: citizen.age,
        type: 'dilemma',
        label: 'STANCE',
        sourceNote: activeDilemma.factSource,
        text: `[진주의 선택] "${activeDilemma.title}"에서 당신은 [${option.stance}]을(를) 택했습니다. (이유: "${reason}" / 참여: ${participation})`
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

  // 유등 추모관에 저장
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
      
      {/* 1. 상단 바 (헤더) */}
      <Header
        citizen={citizen}
        isPaused={isPaused}
        speed={speed}
        onTogglePause={() => setIsPaused(p => !p)}
        onChangeSpeed={setSpeed}
        onOpenMemorial={() => setIsMemorialOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. 상태 게이지 (개인 4대 지표 + 도시 트레이드오프) */}
      <StatusBars
        citizen={citizen}
        cityIndicators={cityIndicators}
      />

      {/* 3. 메인 콘텐츠: 텍스트 타임라인 + 코호트 사이드바 */}
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row overflow-hidden">
        {/* 중앙 생애 타임라인 로그 */}
        <TimelineLog entries={timeline} />

        {/* 우측 동시 출생자 4인 코호트 */}
        <CohortPanel cohort={cohort} birthYear={citizen.birthYear} />
      </main>

      {/* 4. 하단 이번 해의 초점 칩 선택기 */}
      <YearFocusSelector
        currentFocus={focus}
        onSelectFocus={setFocus}
      />

      {/* 모달 1: 출생 모달 */}
      {isBirthModalOpen && (
        <BirthModal
          citizen={citizen}
          onStartLife={handleStartLife}
        />
      )}

      {/* 모달 2: 4막 딜레마 선택 모달 */}
      {activeDilemma && (
        <DilemmaCard
          dilemma={activeDilemma}
          age={citizen.age}
          year={citizen.currentYear}
          onSelectOption={handleResolveDilemma}
        />
      )}

      {/* 모달 3: 5대 성찰 질문 잠시 멈춤 모달 */}
      {activePauseQuestion && (
        <PauseModal
          age={activePauseQuestion.age}
          question={activePauseQuestion.question}
          onConfirm={handleResolvePause}
        />
      )}

      {/* 모달 4: 생애 영수증 및 엔딩 */}
      {isEndingOpen && (
        <EndingReceipt
          citizen={citizen}
          cityIndicators={cityIndicators}
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

    </div>
  );
};

export default App;
