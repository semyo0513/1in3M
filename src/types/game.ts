// 34만 분의 1 : 진주 - 타입 정의 (공공데이터 및 교육용 모드 지원)

export type DistrictType = 'new_town' | 'old_downtown' | 'rural';

export type GameRegionCode = 
  | 'GR1' // 혁신도시권
  | 'GR2' // 아파트 밀집 신도심
  | 'GR3' // 도심 혼합·주택형
  | 'GR4' // 도시근교 읍·면
  | 'GR5' // 농촌 면
  | 'GR6'; // 시설 인접(내동)

export interface DistrictInfo {
  id: string;
  code: string; // D01 ~ U16
  name: string;
  type: DistrictType;
  gameRegionCode: GameRegionCode;
  gameRegionName: string;
  population: number;
  households: number;
  apartmentRatio: number; // 아파트 가구 비율 (0~1)
  birthWeight: number; // 1855명 중 출생 비중 (가구 수 비례 PROXY)
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
  incomeDecile: number; // 1~5분위 (교육용 모드에서는 서술형 매핑)
  incomeDesc?: string; // 교육용 서술형 표현
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
  // 보이텔스바흐 원칙: 학생이 찬성/반대를 고를 때 읽어봐야 할 상대방의 이유
  counterArgumentForPro: string; // 찬성 지지 학생이 먼저 읽어야 할 반대측의 합리적 이유
  counterArgumentForCon: string; // 반대 지지 학생이 먼저 읽어야 할 찬성측의 합리적 이유
  options: StanceOption[];
  isEduModeSafe?: boolean; // 교육용 모드 지원 여부 (실제 지명/기업 노출 제외 또는 가명화)
}

export interface CityMacroIndicators {
  space: number; // -100(원도심 재생) ~ +100(신도심 집중)
  economy: number; // -100(전통/골목) ~ +100(첨단/우주항공)
  welfare: number; // -100(보편 공공복지) ~ +100(시 재정 건전성)
  culture: number; // -100(역사/생태 보존) ~ +100(관광 상업화)
  trust: number; // 0 ~ 100 시민 신뢰
}

export type YearFocus = 'learning' | 'work' | 'relationship' | 'health' | 'change';

export interface DeathCauseStat {
  code: string;
  cause: string;
  ratePer100k: number; // 인구 10만 명당 연령표준화 사망률 (2023 진주시)
  weight: number; // 사인 구성 가중치
  sensitiveFlag: boolean;
  eduModeExclude: boolean;
}
