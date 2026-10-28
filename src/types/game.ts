// 34만 분의 1 : 진주 - 타입 정의

export type DistrictType = 'new_town' | 'old_downtown' | 'rural';

export interface DistrictInfo {
  id: string;
  name: string;
  type: DistrictType;
  population: number;
  birthWeight: number; // 1855명 중 출생 비중
  avgIncomeDecile: number; // 평균 소득분위 (1~5)
  agingRate: number; // 고령화율 (0~1)
  description: string;
  tags: string[];
}

export type JobType = 
  | '공공기관 임직원'
  | '제조업·기계 연구원'
  | '우주항공 엔지니어'
  | '초·중·고 교사 및 교육직'
  | '원도심 소상공인·자영업'
  | '시설원예 스마트팜 농업인'
  | '종합병원 간호사·의료직'
  | '문화·관광 서비스업'
  | '청년 구직자'
  | '은퇴 및 프리랜서';

export interface CitizenStatus {
  name: string;
  age: number;
  birthYear: number;
  currentYear: number;
  district: DistrictInfo;
  gender: '남성' | '여성';
  job: JobType;
  incomeDecile: number; // 1~5분위
  monthlyIncomeWon: number; // 월 소득 추정치
  
  // 4대 생애 지표 (0 ~ 100)
  health: number;
  happiness: number;
  learning: number;
  bonds: number;

  // 내재 기질
  temperament: {
    caution: number; // 신중(100) <-> 모험(0)
    community: number; // 공동체(100) <-> 개인(0)
    optimism: number; // 낙관(100) <-> 현실(0)
  };

  isAlive: boolean;
  deathCause?: string;
  isRelocatedAway: boolean; // 탈진주(출향민) 여부
  flags: Set<string>;
  choicesHistory: ChoiceRecord[];
  pausedQuestionAnswers: { age: number; question: string; answer: string }[];
  memorialWords?: string;
}

export interface ChoiceRecord {
  year: number;
  age: number;
  issueId: string;
  issueTitle: string;
  stance: string;
  reason: string;
  impactSummary: string;
}

export interface CohortPerson {
  id: string;
  name: string;
  district: string;
  job: string;
  statusText: string;
  isAlive: boolean;
}

export type CardLabel = 'FACT' | 'STANCE' | 'WHATIF' | 'PERSONAL' | 'REFLECT';

export interface TimelineEntry {
  id: string;
  year: number;
  age: number;
  text: string;
  label?: CardLabel;
  sourceNote?: string;
  type: 'birth' | 'growth' | 'dilemma' | 'pause' | 'milestone' | 'death';
}

export interface StanceOption {
  stance: '찬성' | '조건부 찬성' | '반대' | '대안 제시' | '판단 보류';
  reasons: string[];
  impactPersonal: {
    health?: number;
    happiness?: number;
    learning?: number;
    bonds?: number;
    incomeChange?: number;
  };
  impactCity: {
    space?: number; // +신도심, -원도심
    economy?: number; // +첨단산단, -골목농업
    welfare?: number; // +재정건전, -공공복지
    culture?: number; // +랜드마크, -원형보존
    trust?: number;
  };
  whatIfText: string;
}

export interface DilemmaIssue {
  id: string;
  title: string;
  category: string;
  triggerAgeRange: [number, number];
  locationFilter?: DistrictType[];
  factText: string;
  factSource: string;
  stanceA: {
    actor: string;
    summary: string;
  };
  stanceB: {
    actor: string;
    summary: string;
  };
  options: StanceOption[];
}

export interface CityMacroIndicators {
  space: number; // -100(원도심 재생) ~ +100(신도심 집중)
  economy: number; // -100(전통/골목) ~ +100(첨단/우주항공)
  welfare: number; // -100(보편 공공복지) ~ +100(시 재정 건전성)
  culture: number; // -100(역사/생태 보존) ~ +100(관광 상업화)
  trust: number; // 0 ~ 100 시민 신뢰
}

export type YearFocus = 'learning' | 'work' | 'relationship' | 'health' | 'change';
