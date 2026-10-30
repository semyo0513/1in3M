// 진주시 생애주기 8단계별 개인 일상 인카운터 풀 (0세 ~ 85세)
// 기능 고도화 명세서 v0.3: 중복 방지(onceOnly), 쿨타임(cooldownYears), 8단계 생애주기 반영
import { CardLabel, YearFocus } from '../types/game';

export interface PersonalEventDef {
  id: string;
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  minAge: number;
  maxAge: number;
  onceOnly?: boolean; // 생애 1회만 발생
  cooldownYears?: number; // 재출현 쿨타임 (기본 3~6년)
  sexFilter?: '남성' | '여성';
  focusFilter?: YearFocus;
  districtTypeFilter?: 'rural' | 'urban'; // 면(농촌) vs 동(도시) 권역 구분 필터
  text: string;
  label: CardLabel;
  sourceNote?: string;
  isSensitive?: boolean; // 15세 미만 교육용 모드 제외
  impact: {
    health?: number;
    happiness?: number;
    learning?: number;
    bonds?: number;
    incomeChange?: number;
  };
}

export const PERSONAL_EVENTS: PersonalEventDef[] = [
  // =========================================================================
  // 1단계: 영유아기 (0 ~ 5세) - 영유아 검진, 보육시설, 애착 형성
  // =========================================================================
  {
    id: 'pe_stage1_daycare_lottery',
    stage: 1,
    minAge: 1,
    maxAge: 3,
    onceOnly: true,
    text: '국공립 어린이집 입소 대기 추첨 날. 치열한 경쟁 끝에 동네 어린이집에 입소 번호를 받았습니다.',
    label: 'FACT',
    sourceNote: '보건복지부 어린이집 입소 우선순위 통계',
    impact: { happiness: 4, bonds: 4 }
  },
  {
    id: 'pe_stage1_infant_checkup',
    stage: 1,
    minAge: 1,
    maxAge: 4,
    cooldownYears: 3,
    text: '영유아 국가건강검진을 받았습니다. 키와 몸무게가 백분위 50%대로 아주 건강하게 자라고 있다는 진단을 받았습니다.',
    label: 'FACT',
    sourceNote: '국민건강보험공단 영유아 건강검진',
    impact: { health: 5, happiness: 3 }
  },
  {
    id: 'pe_stage1_night_fever',
    stage: 1,
    minAge: 2,
    maxAge: 5,
    cooldownYears: 3,
    text: '한밤중 갑작스러운 고열로 진주 시내 야간 소아과 응급실을 찾았습니다. 부모님의 간호 속에 새벽녘 열이 내렸습니다.',
    label: 'PERSONAL',
    impact: { health: -3, bonds: 6, happiness: 1 }
  },
  {
    id: 'pe_stage1_jinjustroll',
    stage: 1,
    minAge: 2,
    maxAge: 5,
    cooldownYears: 4,
    text: '유모차를 타고 진주성 잔디광장과 금호지 수변공원으로 가족 나들이를 다녀왔습니다. 남강 바람을 맞으며 평온하게 낮잠에 듭니다.',
    label: 'PERSONAL',
    impact: { happiness: 6, health: 3, bonds: 5 }
  },

  // =========================================================================
  // 2단계: 아동기 (6 ~ 11세) - 초등 입학, 돌봄교실, 기초 사교육
  // =========================================================================
  {
    id: 'pe_stage2_afterschool_care',
    stage: 2,
    minAge: 6,
    maxAge: 8,
    cooldownYears: 3,
    text: '맞벌이 부모님을 위해 학교 늘봄학교(돌봄교실)와 방과후 프로그램에 참여하여 또래들과 종이접기와 보드게임을 즐깁니다.',
    label: 'FACT',
    sourceNote: '교육부 늘봄학교 및 초등돌봄교실 통계',
    impact: { learning: 4, bonds: 5 }
  },
  {
    id: 'pe_stage2_taekwondo_piano',
    stage: 2,
    minAge: 7,
    maxAge: 10,
    cooldownYears: 4,
    focusFilter: 'learning',
    text: '방과 후 노란 학원버스를 타고 태권도장과 피아노 학원을 순회합니다. 태권도 품띠를 따고 부모님께 자랑스럽게 보여드렸습니다.',
    label: 'PERSONAL',
    impact: { health: 5, learning: 4, happiness: 4 }
  },
  {
    id: 'pe_stage2_pool_summer',
    stage: 2,
    minAge: 8,
    maxAge: 11,
    cooldownYears: 4,
    focusFilter: 'health',
    text: '여름방학을 맞아 진주실내수영장에서 어린이 수영 강습을 받았습니다. 물장구를 치며 친구들과 시원한 여름을 보냅니다.',
    label: 'PERSONAL',
    impact: { health: 6, happiness: 5 }
  },
  {
    id: 'pe_stage2_yudeung_first',
    stage: 2,
    minAge: 8,
    maxAge: 11,
    onceOnly: true,
    text: '진주남강유등축제 현장에서 가족들과 소망등을 직접 달았습니다. 남강 위에 둥둥 뜬 오색 등불을 보며 마냥 신기해합니다.',
    label: 'PERSONAL',
    impact: { happiness: 8, bonds: 6 }
  },
  {
    id: 'pe_stage2_rural_bus',
    stage: 2,
    minAge: 7,
    maxAge: 11,
    districtTypeFilter: 'rural',
    cooldownYears: 3,
    text: '면 지역 통학버스를 타고 굽이굽이 시골길을 달립니다. 창밖으로 비닐하우스와 사계절 물드는 논밭 풍경이 펼쳐집니다.',
    label: 'PERSONAL',
    impact: { happiness: 4, bonds: 4, health: 3 }
  },
  {
    id: 'pe_stage2_urban_walk',
    stage: 2,
    minAge: 7,
    maxAge: 11,
    districtTypeFilter: 'urban',
    cooldownYears: 3,
    text: '동네 보행로를 따라 단짝 친구들과 쫑알쫑알 수다를 떨며 등교합니다. 교문 앞 문구점에서 달콤한 간식을 나눠 먹습니다.',
    label: 'PERSONAL',
    impact: { happiness: 4, bonds: 5, health: 2 }
  },

  // =========================================================================
  // 3단계: 청소년기 (12 ~ 18세) - 중·고교 배정, 사교육 격차, 대입 준비
  // =========================================================================
  {
    id: 'pe_stage3_academy_late_bus',
    stage: 3,
    minAge: 13,
    maxAge: 17,
    cooldownYears: 3,
    focusFilter: 'learning',
    text: '평거동·초전동 학원가에서 밤 10시까지 수업을 듣고 심야 귀가버스를 탔습니다. 창밖으로 스쳐 지나가는 불빛 속에 눈꺼풀이 무겁습니다.',
    label: 'PERSONAL',
    impact: { learning: 7, happiness: -3, health: -3 }
  },
  {
    id: 'pe_stage3_namgang_bike',
    stage: 3,
    minAge: 13,
    maxAge: 17,
    cooldownYears: 4,
    focusFilter: 'relationship',
    text: '시험이 끝난 주말, 친구들과 진양호에서 칠암동 남강변까지 자전거를 달렸습니다. 촉석루 맞은편 편의점에서 컵라면을 먹으며 웃음을 터뜨립니다.',
    label: 'PERSONAL',
    impact: { bonds: 8, happiness: 7, health: 4 }
  },
  {
    id: 'pe_stage3_k_entrepreneur',
    stage: 3,
    minAge: 13,
    maxAge: 16,
    onceOnly: true,
    focusFilter: 'learning',
    text: '학교 현장체험학습으로 지수면 승산마을 K-기업가정신센터를 탐방했습니다. 나눔과 불굴의 개척정신을 마음에 새깁니다.',
    label: 'FACT',
    sourceNote: '진주시 K-기업가정신 교육센터',
    impact: { learning: 6, happiness: 4 }
  },
  {
    id: 'pe_stage3_high_sat_study',
    stage: 3,
    minAge: 17,
    maxAge: 18,
    onceOnly: true,
    text: '수능과 진로 결정을 앞둔 고3의 여름. 독서실 백색소음 속에서 커피를 마시며 진로 희망서를 적어 내려갑니다.',
    label: 'PERSONAL',
    impact: { learning: 9, health: -4, happiness: -4 }
  },

  // =========================================================================
  // 4단계: 청년 초기 (19 ~ 24세) - 대학 생활, 아르바이트, 병역
  // =========================================================================
  {
    id: 'pe_stage4_college_parttime',
    stage: 4,
    minAge: 20,
    maxAge: 23,
    cooldownYears: 3,
    focusFilter: 'work',
    text: '가좌동 대학로 카페와 편의점에서 주말 아르바이트를 하며 용돈과 생활비를 법니다. 시급을 계산하며 청년의 독립을 배웁니다.',
    label: 'PERSONAL',
    impact: { learning: 3, health: -2, happiness: 2, incomeChange: 1 }
  },
  {
    id: 'pe_stage4_youth_certificate',
    stage: 4,
    minAge: 21,
    maxAge: 24,
    cooldownYears: 4,
    focusFilter: 'learning',
    text: '진주시 청년 자격증 응시료 지원을 받아 컴퓨터활용능력과 한국사 1급을 취득했습니다. 취업 스펙에 한 줄을 보탭니다.',
    label: 'FACT',
    sourceNote: '진주시 청년 인구정책 청년 자격증 응시료 지원',
    impact: { learning: 6, happiness: 4 }
  },
  {
    id: 'pe_stage4_campus_festival',
    stage: 4,
    minAge: 20,
    maxAge: 23,
    cooldownYears: 3,
    focusFilter: 'relationship',
    text: '캠퍼스 축제 잔디밭에서 잔디에 돗자리를 깔고 통기타 밴드 공연을 보며 청춘의 자유를 만끽합니다.',
    label: 'PERSONAL',
    impact: { bonds: 6, happiness: 6 }
  },

  // =========================================================================
  // 5단계: 청년 후기 (25 ~ 33세) - 첫 직장, 독립, 청첩장 러시
  // =========================================================================
  {
    id: 'pe_stage5_first_job_entry',
    stage: 5,
    minAge: 25,
    maxAge: 28,
    onceOnly: true,
    text: '치열한 면접을 거쳐 첫 직장에 정규직으로 입사했습니다. 신입사원 사원증을 목에 걸고 남강변을 바라보며 깊은 숨을 내쉽니다.',
    label: 'PERSONAL',
    impact: { learning: 6, happiness: 6, incomeChange: 2 }
  },
  {
    id: 'pe_stage5_independent_housing',
    stage: 5,
    minAge: 26,
    maxAge: 30,
    onceOnly: true,
    focusFilter: 'change',
    text: '청년 버팀목 전세자금대출을 받아 부모님 품을 떠나 원도심 인근 투룸으로 첫 독립을 시작했습니다. 직접 가구를 조립합니다.',
    label: 'PERSONAL',
    impact: { happiness: 5, learning: 3, bonds: 2 }
  },
  {
    id: 'pe_stage5_wedding_guest_rush',
    stage: 5,
    minAge: 28,
    maxAge: 33,
    cooldownYears: 3,
    focusFilter: 'relationship',
    text: '주말마다 대학 동기와 직장 동료들의 청첩장이 쏟아집니다. 축의금 봉투를 챙기며 오랜만에 만난 동창들과 근황을 나눕니다.',
    label: 'PERSONAL',
    impact: { bonds: 6, happiness: 2, incomeChange: -1 }
  },

  // =========================================================================
  // 6단계: 중년 초기 (34 ~ 44세) - 맞벌이, 육아 전쟁, 승진, 내 집 마련
  // =========================================================================
  {
    id: 'pe_stage6_work_promotion',
    stage: 6,
    minAge: 35,
    maxAge: 42,
    onceOnly: true,
    focusFilter: 'work',
    text: '회사에서 중간관리자 대리·과장으로 승진했습니다. 팀의 중심 실무를 맡으며 야근이 잦아졌지만 급여 통장이 두둑해집니다.',
    label: 'PERSONAL',
    impact: { learning: 5, incomeChange: 3, health: -3 }
  },
  {
    id: 'pe_stage6_family_chojeon_park',
    stage: 6,
    minAge: 34,
    maxAge: 44,
    cooldownYears: 3,
    focusFilter: 'health',
    text: '주말 오후 초전공원 메타세쿼이아 숲길에서 돗자리를 펴고 온 가족이 도시락을 먹었습니다. 나뭇잎 사이로 따스한 햇살이 부서집니다.',
    label: 'PERSONAL',
    impact: { happiness: 7, health: 4, bonds: 5 }
  },
  {
    id: 'pe_stage6_moonlight_hospital',
    stage: 6,
    minAge: 34,
    maxAge: 42,
    cooldownYears: 4,
    text: '아이가 밤늦게 열이 펄펄 끓어 진주시 달빛어린이병원을 찾아 줄을 섰습니다. 의사의 빠른 처방에 부모의 가슴을 쓸어내립니다.',
    label: 'FACT',
    sourceNote: '보건복지부 지정 진주시 달빛어린이병원',
    impact: { health: -2, bonds: 6, happiness: 2 }
  },

  // =========================================================================
  // 7단계: 중년 후기 (45 ~ 59세) - 샌드위치 위기, 건강검진, 주된 직장 은퇴
  // =========================================================================
  {
    id: 'pe_stage7_sandwich_burden',
    stage: 7,
    minAge: 47,
    maxAge: 56,
    cooldownYears: 4,
    text: '자녀의 학원비와 대학 등록금 지출이 절정에 달한 가운데, 연로하신 부모님의 노인장기요양등급 신청을 위해 서류를 챙깁니다.',
    label: 'FACT',
    sourceNote: '통계청 가계금융복지조사 50대 샌드위치 가계 실태',
    impact: { happiness: -4, health: -3, bonds: 5 }
  },
  {
    id: 'pe_stage7_cancer_screening',
    stage: 7,
    minAge: 45,
    maxAge: 58,
    cooldownYears: 4,
    focusFilter: 'health',
    text: '국가 암검진 위·대장 내시경에서 작은 용종 두 개를 떼어냈습니다. 의사의 경고를 듣고 식습관 개선과 운동을 다짐합니다.',
    label: 'FACT',
    sourceNote: '국민건강보험공단 40대 이상 암검진 통계',
    impact: { health: 4, happiness: 2 }
  },
  {
    id: 'pe_stage7_geumhoji_walk',
    stage: 7,
    minAge: 50,
    maxAge: 59,
    cooldownYears: 3,
    focusFilter: 'health',
    text: '금산면 금호지 생태공원 수변 데크길을 매일 아침 만 보씩 걷습니다. 물안개 피는 호수를 바라보며 복잡한 마음을 비웁니다.',
    label: 'PERSONAL',
    impact: { health: 7, happiness: 5 }
  },
  {
    id: 'pe_stage7_main_job_retire',
    stage: 7,
    minAge: 57,
    maxAge: 60,
    onceOnly: true,
    focusFilter: 'work',
    text: '수십 년간 젊음을 바친 주된 직장에서 정년퇴직을 맞았습니다. 후배들이 건넨 꽃다발을 들고 남강변을 홀로 오래 걸었습니다.',
    label: 'PERSONAL',
    impact: { learning: 2, happiness: -3, bonds: 4 }
  },

  // =========================================================================
  // 8단계: 노년기 (60세 이상) - 크레바스, 연금, 파크골프, 평온한 여생
  // =========================================================================
  {
    id: 'pe_stage8_pension_start',
    stage: 8,
    minAge: 63,
    maxAge: 66,
    onceOnly: true,
    text: '오랜 소득 공백기(크레바스)를 버텨내고 만 65세 국민연금 첫 입금 알림을 받았습니다. 통장을 보며 안도의 한숨을 쉽니다.',
    label: 'FACT',
    sourceNote: '국민연금공단 노령연금 수급 개시 통계',
    impact: { happiness: 6, incomeChange: 1 }
  },
  {
    id: 'pe_stage8_park_golf',
    stage: 8,
    minAge: 65,
    maxAge: 82,
    cooldownYears: 3,
    focusFilter: 'relationship',
    text: '남강 둔치 파크골프장에서 동년배 벗들과 경기를 즐겼습니다. 시원한 강바람 속에서 나이스 샷을 외치며 웃음꽃을 피웁니다.',
    label: 'PERSONAL',
    impact: { health: 6, happiness: 6, bonds: 6 }
  },
  {
    id: 'pe_stage8_silver_welfare',
    stage: 8,
    minAge: 68,
    maxAge: 80,
    cooldownYears: 4,
    focusFilter: 'learning',
    text: '상대동 노인종합복지관에서 붓글씨 서예와 스마트폰 활용 강좌를 듣습니다. 새로운 지식을 익히는 배움의 즐거움을 누립니다.',
    label: 'PERSONAL',
    impact: { learning: 4, happiness: 5, bonds: 4 }
  },
  {
    id: 'pe_stage8_grandchild_reunion',
    stage: 8,
    minAge: 72,
    maxAge: 85,
    cooldownYears: 3,
    text: '명절을 맞아 외지에 나갔던 자녀와 손주들이 집을 가득 채웠습니다. 손주의 고사리손을 잡으며 살아온 날들의 고마움을 느낍니다.',
    label: 'PERSONAL',
    impact: { happiness: 9, bonds: 8 }
  }
];
