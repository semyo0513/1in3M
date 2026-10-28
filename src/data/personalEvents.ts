// 개인 생애주기별 일상 인카운터 풀 (0세 ~ 85세)
import { CardLabel, YearFocus } from '../types/game';

export interface PersonalEventDef {
  id: string;
  minAge: number;
  maxAge: number;
  focusFilter?: YearFocus;
  text: string;
  label: CardLabel;
  sourceNote?: string;
  impact: {
    health?: number;
    happiness?: number;
    learning?: number;
    bonds?: number;
    incomeChange?: number;
  };
}

export const PERSONAL_EVENTS: PersonalEventDef[] = [
  // --- 영유아기 (0~6세) ---
  {
    id: 'pe_0_baby_care',
    minAge: 1,
    maxAge: 3,
    text: '부모님이 진주시 임신·출산 축하금과 영유아 의료비 지원을 신청했습니다. 보건소 예방접종을 무사히 마쳤습니다.',
    label: 'FACT',
    sourceNote: '진주시 보건소 모자보건 지원사업',
    impact: { health: 5, bonds: 4 }
  },
  {
    id: 'pe_0_namgang_stroll',
    minAge: 2,
    maxAge: 5,
    text: '유모차를 타고 남강 둔치 대나무숲길을 산책했습니다. 바람에 바스락거리는 대숲 소리를 들으며 평온한 낮잠에 듭니다.',
    label: 'PERSONAL',
    impact: { happiness: 6, health: 3 }
  },
  {
    id: 'pe_0_kindergarten',
    minAge: 4,
    maxAge: 6,
    text: '동네 국공립 어린이집에 다니기 시작했습니다. 처음으로 부모님 곁을 떠나 또래 친구들과 장난감을 나누어 씁니다.',
    label: 'PERSONAL',
    impact: { learning: 5, bonds: 4 }
  },

  // --- 학령기 (7~18세) ---
  {
    id: 'pe_school_entrance',
    minAge: 7,
    maxAge: 8,
    text: '커다란 책가방을 메고 초등학교에 입학했습니다. 노란 신호등 앞에서 녹색어머니회의 손을 잡고 건널목을 건넙니다.',
    label: 'PERSONAL',
    impact: { learning: 6, bonds: 5 }
  },
  {
    id: 'pe_10_square_academy',
    minAge: 11,
    maxAge: 14,
    focusFilter: 'learning',
    text: '평거동 10호광장 학원가로 셔틀버스를 타고 오갑니다. 늦은 밤 학원 창가에서 빽빽한 아파트 불빛을 바라봅니다.',
    label: 'PERSONAL',
    impact: { learning: 8, happiness: -3, health: -2 }
  },
  {
    id: 'pe_rural_school_bus',
    minAge: 9,
    maxAge: 13,
    text: '면 지역 통학버스를 타고 굽이굽이 시골길을 달립니다. 창밖으로 비닐하우스와 계절마다 물드는 논밭이 보입니다.',
    label: 'PERSONAL',
    impact: { happiness: 4, bonds: 5, health: 3 }
  },
  {
    id: 'pe_bike_riding',
    minAge: 13,
    maxAge: 17,
    focusFilter: 'relationship',
    text: '친구들과 진양호에서 칠암동 남강변까지 자전거를 달렸습니다. 노을 지는 촉석루 맞은편 편의점에서 컵라면을 나눠 먹었습니다.',
    label: 'PERSONAL',
    impact: { bonds: 9, happiness: 8, health: 4 }
  },
  {
    id: 'pe_high_school_sat',
    minAge: 17,
    maxAge: 18,
    text: '수능과 진로를 앞둔 고3의 여름. 경남학생안전체험관과 비봉산 독서실을 오가며 잠을 쫓습니다.',
    label: 'PERSONAL',
    impact: { learning: 10, health: -4, happiness: -5 }
  },

  // --- 청년기 (19~29세) ---
  {
    id: 'pe_univ_gnu_festival',
    minAge: 20,
    maxAge: 23,
    focusFilter: 'relationship',
    text: '경상국립대 대동제 주막에서 동기들과 밤새 잔을 부딪쳤습니다. "졸업하고 어디서 일할 거냐"는 물음이 오고 갑니다.',
    label: 'PERSONAL',
    impact: { bonds: 7, happiness: 6 }
  },
  {
    id: 'pe_jinju_youth_pass',
    minAge: 22,
    maxAge: 26,
    focusFilter: 'work',
    text: '진주시 청년 자격증 응시료 지원을 받아 기사 자격증에 합격했습니다. 이력서에 첫 국가기술자격을 적어 넣습니다.',
    label: 'FACT',
    sourceNote: '진주시 청년 인구정책 사업',
    impact: { learning: 7, happiness: 4 }
  },
  {
    id: 'pe_first_job_anxiety',
    minAge: 24,
    maxAge: 28,
    focusFilter: 'work',
    text: '취업 준비생의 계절. 가좌동 원룸에서 첫 취업 서류를 제출하며 서울과 진주 사이의 수많은 공고를 번갈아 봅니다.',
    label: 'PERSONAL',
    impact: { learning: 5, happiness: -4 }
  },
  {
    id: 'pe_yudeung_volunteer',
    minAge: 21,
    maxAge: 27,
    text: '10월 남강유등축제에서 시민 자원봉사자로 참여했습니다. 촉석루 성벽 아래 붉게 타오르는 불꽃놀이를 지켜봅니다.',
    label: 'PERSONAL',
    impact: { bonds: 6, happiness: 7 }
  },

  // --- 청·장년기 (30~49세) ---
  {
    id: 'pe_home_purchase',
    minAge: 32,
    maxAge: 38,
    focusFilter: 'change',
    text: '오랜 저축과 은행 대출을 묶어 가족과 함께 살 첫 아파트 분양권을 계약했습니다. 매달 원리금 상환 계획표를 짭니다.',
    label: 'PERSONAL',
    impact: { happiness: 5, incomeChange: -2, bonds: 6 }
  },
  {
    id: 'pe_childcare_hustle',
    minAge: 31,
    maxAge: 40,
    focusFilter: 'relationship',
    text: '아이의 열감기로 새벽에 달빛어린이병원을 찾아 발을 동동 굴렀습니다. 다행히 아침에 열이 내렸습니다.',
    label: 'PERSONAL',
    impact: { health: -3, bonds: 8, happiness: 2 }
  },
  {
    id: 'pe_work_promotion',
    minAge: 36,
    maxAge: 46,
    focusFilter: 'work',
    text: '직장에서 중간관리자 팀장으로 승진했습니다. 팀원들을 이끌며 지역 상생 프로젝트를 총괄합니다.',
    label: 'PERSONAL',
    impact: { learning: 6, incomeChange: 4, health: -2 }
  },
  {
    id: 'pe_chojeon_park_weekend',
    minAge: 34,
    maxAge: 48,
    focusFilter: 'health',
    text: '주말 오후, 초전공원 메타세쿼이아 숲길에서 돗자리를 펴고 가족들과 도시락을 먹었습니다. 평화로운 햇살이 내립니다.',
    label: 'PERSONAL',
    impact: { happiness: 8, health: 4, bonds: 6 }
  },

  // --- 중·노년기 (50~69세) ---
  {
    id: 'pe_parents_care',
    minAge: 50,
    maxAge: 59,
    focusFilter: 'relationship',
    text: '고령이 된 부모님의 관절 수술을 위해 칠암동 대학병원을 오갑니다. 간병과 일 사이에서 부모님의 굽은 등을 바라봅니다.',
    label: 'PERSONAL',
    impact: { bonds: 7, health: -4, happiness: -3 }
  },
  {
    id: 'pe_retirement_crossroads',
    minAge: 58,
    maxAge: 62,
    focusFilter: 'work',
    text: '수십 년 일해 온 일터에서 정년퇴직을 맞이했습니다. 동료들이 건넨 꽃다발을 안고 남강변을 홀로 오래 걸었습니다.',
    label: 'PERSONAL',
    impact: { learning: 3, happiness: -2, bonds: 5 }
  },
  {
    id: 'pe_geumhoji_walking',
    minAge: 55,
    maxAge: 68,
    focusFilter: 'health',
    text: '금산면 금호지 생태공원 수변 데크길을 매일 아침 만 보씩 걷기 시작했습니다. 무릎 통증이 한결 가벼워졌습니다.',
    label: 'PERSONAL',
    impact: { health: 8, happiness: 6 }
  },

  // --- 노년기 (70~85세) ---
  {
    id: 'pe_silver_welfare_club',
    minAge: 70,
    maxAge: 79,
    focusFilter: 'relationship',
    text: '상대동 노인복지관에서 동네 벗들과 장기를 두고 서예를 배웁니다. 젊은 날의 진주를 추억하며 웃음꽃을 피웁니다.',
    label: 'PERSONAL',
    impact: { bonds: 8, happiness: 7, learning: 3 }
  },
  {
    id: 'pe_health_checkup_senior',
    minAge: 72,
    maxAge: 84,
    focusFilter: 'health',
    text: '정기 건강검진에서 혈압과 혈당 관리를 잘했다는 칭찬을 들었습니다. 의사 선생님이 처방한 약을 꼼꼼히 챙겨 먹습니다.',
    label: 'PERSONAL',
    impact: { health: 5, happiness: 4 }
  },
  {
    id: 'pe_grandchild_visit',
    minAge: 74,
    maxAge: 85,
    text: '외지로 나갔던 손주들이 명절에 찾아와 용돈을 쥐여주었습니다. 손주의 작은 손을 잡으며 지나온 생애를 반추합니다.',
    label: 'PERSONAL',
    impact: { happiness: 10, bonds: 9 }
  }
];
