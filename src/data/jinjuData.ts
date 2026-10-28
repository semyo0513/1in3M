// 진주시 30개 읍·면·동 실제 공공통계 기반 데이터 (2025~2026 기준 인구 약 33.4만 명)
import { DistrictInfo } from '../types/game';

export const JINJU_DISTRICTS: DistrictInfo[] = [
  // --- 신도심 및 핵심 성장 권역 ---
  {
    id: 'chungmugong',
    name: '충무공동 (진주혁신도시)',
    type: 'new_town',
    population: 34250,
    birthWeight: 0.22, // 신생아 5명 중 1명 이상 스폰
    avgIncomeDecile: 4.5,
    agingRate: 0.065,
    description: '11개 공공기관과 영유아·학부모 비중이 압도적인 진주에서 가장 젊은 혁신도시.',
    tags: ['LH본사', '공공기관', '과밀학급', '신도시']
  },
  {
    id: 'pyeonggeo',
    name: '평거동',
    type: 'new_town',
    population: 28400,
    birthWeight: 0.14,
    avgIncomeDecile: 4.2,
    agingRate: 0.12,
    description: '남강변 대규모 아파트 단지와 10호광장 대형 학원가가 밀집한 진주의 전통적 명문 학군.',
    tags: ['학원가', '10호광장', '남강변', '아파트단지']
  },
  {
    id: 'chojang',
    name: '초장동 (초전신도심)',
    type: 'new_town',
    population: 31200,
    birthWeight: 0.15,
    avgIncomeDecile: 4.1,
    agingRate: 0.09,
    description: '초전공원과 신축 주거단지가 들어서며 젊은 맞벌이 가구가 폭발적으로 늘어난 주거 권역.',
    tags: ['초전공원', '신축아파트', '어린이', '동부권거점']
  },
  {
    id: 'gaho',
    name: '가호동 (가좌·호탄·개양)',
    type: 'new_town',
    population: 26800,
    birthWeight: 0.11,
    avgIncomeDecile: 3.3,
    agingRate: 0.14,
    description: '경상국립대 가좌캠퍼스와 고속버스터미널(복합터미널 이전)이 위치한 청년·대학 문화의 심장부.',
    tags: ['경상국립대', '대학가', '청년밀집', '남사진주IC']
  },
  {
    id: 'panmun',
    name: '판문동',
    type: 'new_town',
    population: 23100,
    birthWeight: 0.08,
    avgIncomeDecile: 3.7,
    agingRate: 0.15,
    description: '진양호와 평거 택지지구의 연장선에 위치하여 생태 관광과 쾌적한 주거가 공존하는 곳.',
    tags: ['진양호', '전원주택', '생태휴식']
  },
  {
    id: 'sinan',
    name: '신안동',
    type: 'new_town',
    population: 11200,
    birthWeight: 0.04,
    avgIncomeDecile: 3.6,
    agingRate: 0.19,
    description: '공설운동장과 음악분수대, 신안천을 낀 안정된 1기 주거 타운.',
    tags: ['공설운동장', '음악분수', '생활체육']
  },

  // --- 역사와 전통의 원도심 권역 ---
  {
    id: 'seongbuk',
    name: '성북동',
    type: 'old_downtown',
    population: 10400,
    birthWeight: 0.02,
    avgIncomeDecile: 2.8,
    agingRate: 0.32,
    description: '촉석루와 진주성, 진주대첩 역사공원을 품은 진주의 뿌리이자 인구 감소와 고령화에 직면한 구도심.',
    tags: ['진주성', '촉석루', '대첩광장', '원도심재생']
  },
  {
    id: 'jungang',
    name: '중앙동',
    type: 'old_downtown',
    population: 12100,
    birthWeight: 0.025,
    avgIncomeDecile: 2.9,
    agingRate: 0.30,
    description: '진주중앙시장, 논개시장, 지하도상가가 모여 있는 역사 깊은 상업 1번지.',
    tags: ['중앙시장', '논개시장', '전통상인', '청년몰']
  },
  {
    id: 'cheonjeon',
    name: '천전동 (칠암·망경·주약)',
    type: 'old_downtown',
    population: 28500,
    birthWeight: 0.06,
    avgIncomeDecile: 3.4,
    agingRate: 0.22,
    description: '경상국립대 칠암캠퍼스(의대/간호대), 구 진주역 철도 재생 부지, 망진산 유등테마공원이 공존.',
    tags: ['구진주역', '칠암캠퍼스', '망진산', '의료복합']
  },
  {
    id: 'sangdae',
    name: '상대동',
    type: 'old_downtown',
    population: 19800,
    birthWeight: 0.035,
    avgIncomeDecile: 3.1,
    agingRate: 0.24,
    description: '진주시청이 위치한 행정 중심지이자 옛 법원 이전 이후 골목상권 활성화를 꾀하는 곳.',
    tags: ['진주시청', '행정타운', '골목상권']
  },
  {
    id: 'hadae',
    name: '하대동',
    type: 'old_downtown',
    population: 22400,
    birthWeight: 0.045,
    avgIncomeDecile: 3.2,
    agingRate: 0.20,
    description: '원도심 동부 상권의 최대 요충지로 젊은 층의 먹자골목과 주거 단지가 조화를 이룸.',
    tags: ['하대먹자골목', '청년상권', '주택가']
  },
  {
    id: 'sangpyeong',
    name: '상평동',
    type: 'old_downtown',
    population: 10800,
    birthWeight: 0.015,
    avgIncomeDecile: 3.0,
    agingRate: 0.26,
    description: '진주 제1의 노후 산업단지(상평일반산단)로 전통 기계·실크 산업의 재생 혁신이 진행되는 곳.',
    tags: ['상평산단', '제조업', '실크산업', '노후산단재생']
  },
  {
    id: 'sangbong',
    name: '상봉동',
    type: 'old_downtown',
    population: 13500,
    birthWeight: 0.015,
    avgIncomeDecile: 2.7,
    agingRate: 0.33,
    description: '진주고등학교 등 교육 역사가 깊으나 비봉산 아래 노후 단독주택 비중이 높은 고령 주거지.',
    tags: ['진주고', '비봉산', '노후주거', '고령화']
  },
  {
    id: 'ihyeon',
    name: '이현동',
    type: 'old_downtown',
    population: 10100,
    birthWeight: 0.015,
    avgIncomeDecile: 3.0,
    agingRate: 0.25,
    description: '원도심과 서부 서하농촌 권역을 잇는 관문 주거지역.',
    tags: ['나불천', '서부관문']
  },

  // --- 배후 읍·면 및 농촌·특화 권역 ---
  {
    id: 'munsan',
    name: '문산읍',
    type: 'rural',
    population: 8600,
    birthWeight: 0.02,
    avgIncomeDecile: 3.3,
    agingRate: 0.28,
    description: '혁신도시 배후 주거지와 문산 공공주택지구 계획, 문산 단감·배 특화 과수원이 공존.',
    tags: ['문산단감', '배후도시', '제2혁신후보']
  },
  {
    id: 'geumsan',
    name: '금산면',
    type: 'rural',
    population: 19500,
    birthWeight: 0.04,
    avgIncomeDecile: 3.5,
    agingRate: 0.18,
    description: '공군교육사령부와 아름다운 금호지 유원지, 전국 유명 풋고추 시설하우스 주산지.',
    tags: ['금호지', '공군교사', '풋고추', '도농복합']
  },
  {
    id: 'naedong',
    name: '내동면',
    type: 'rural',
    population: 5400,
    birthWeight: 0.008,
    avgIncomeDecile: 3.2,
    agingRate: 0.31,
    description: '남강댐 하류와 내동 쓰레기매립장 사업소가 위치하여 2030 소각장 입지 갈등의 최전선인 곳.',
    tags: ['쓰레기매립장', '소각장갈등', '남강댐하류', '환경시설누적']
  },
  {
    id: 'sugok',
    name: '수곡면',
    type: 'rural',
    population: 2150,
    birthWeight: 0.003,
    avgIncomeDecile: 3.8, // 수출 딸기 고소득 농가
    agingRate: 0.49,
    description: '전국 최고 품질을 자랑하는 수출 딸기 비닐하우스 스마트팜의 성지이자 초고령 농촌.',
    tags: ['수곡딸기', '수출농업', '스마트팜', '초고령화']
  },
  {
    id: 'jeongchon',
    name: '정촌면',
    type: 'rural',
    population: 8100,
    birthWeight: 0.015,
    avgIncomeDecile: 3.6,
    agingRate: 0.21,
    description: '우주항공국가산단 배후이자 정촌일반산단, 강주연못이 있는 서남부 산업 거점.',
    tags: ['우주항공산단', '강주연못', '공룡화석지']
  },
  {
    id: 'daegok',
    name: '대곡면',
    type: 'rural',
    population: 3600,
    birthWeight: 0.004,
    avgIncomeDecile: 3.6,
    agingRate: 0.46,
    description: '파프리카, 방울토마토 시설원예 농업의 중심지.',
    tags: ['파프리카', '시설원예', '고령화']
  },
  {
    id: 'jisu',
    name: '지수면',
    type: 'rural',
    population: 1550,
    birthWeight: 0.001,
    avgIncomeDecile: 3.0,
    agingRate: 0.52,
    description: '삼성·LG·효성 등 글로벌 기업 창업주들을 배출한 승산마을과 K-기업가정신 교육 메카.',
    tags: ['K기업가정신', '승산마을', '초고령화']
  },
  {
    id: 'jinseong',
    name: '진성면',
    type: 'rural',
    population: 2200,
    birthWeight: 0.002,
    avgIncomeDecile: 2.9,
    agingRate: 0.48,
    description: '동부 5개 면의 중심이자 경남과학교육원이 있는 전형적인 농촌 마을.',
    tags: ['과학교육원', '동부농촌']
  },
  {
    id: 'ilbanseong',
    name: '일반성면',
    type: 'rural',
    population: 2700,
    birthWeight: 0.002,
    avgIncomeDecile: 2.8,
    agingRate: 0.47,
    description: '반성역과 5일장 반성시장의 전통이 살아있는 동부 거점 시장 마을.',
    tags: ['반성장날', '반성역']
  },
  {
    id: 'ibanseong',
    name: '이반성면',
    type: 'rural',
    population: 1600,
    birthWeight: 0.001,
    avgIncomeDecile: 2.7,
    agingRate: 0.53,
    description: '사계절 아름다운 경상남도수목원과 가산일반산단이 인접한 청정 자연 농촌.',
    tags: ['경남도수목원', '자연청정']
  },
  {
    id: 'sabong',
    name: '사봉면',
    type: 'rural',
    population: 1500,
    birthWeight: 0.001,
    avgIncomeDecile: 2.8,
    agingRate: 0.51,
    description: '사봉일반산단과 논농사가 어우러진 동부 끝자락 마을.',
    tags: ['사봉산단', '평야농촌']
  },
  {
    id: 'geumgok',
    name: '금곡면',
    type: 'rural',
    population: 2300,
    birthWeight: 0.002,
    avgIncomeDecile: 2.9,
    agingRate: 0.47,
    description: '고성군과 경계를 이루며 친환경 쌀과 미나리를 재배하는 평화로운 마을.',
    tags: ['남부경계', '친환경농업']
  },
  {
    id: 'jiphyeon',
    name: '집현면',
    type: 'rural',
    population: 4800,
    birthWeight: 0.006,
    avgIncomeDecile: 3.1,
    agingRate: 0.36,
    description: '시내와 인접한 전원주택단지와 오이·호박 시설재배지가 형성된 도농 연결지.',
    tags: ['전원주택', '도농인접']
  },
  {
    id: 'micheon',
    name: '미천면',
    type: 'rural',
    population: 1800,
    birthWeight: 0.001,
    avgIncomeDecile: 2.8,
    agingRate: 0.54,
    description: '진주의 가장 북쪽 끝, 맑은 자연 속 곶감과 한우 축산이 발달한 산골 마을.',
    tags: ['최북단', '미천곶감', '축산']
  },
  {
    id: 'myeongseok',
    name: '명석면',
    type: 'rural',
    population: 4100,
    birthWeight: 0.005,
    avgIncomeDecile: 3.0,
    agingRate: 0.39,
    description: '산청·함양으로 향하는 길목, 비봉산 둘레길과 친환경 농업이 자리잡은 곳.',
    tags: ['북부관문', '친환경']
  },
  {
    id: 'daepyeong',
    name: '대평면',
    type: 'rural',
    population: 1050,
    birthWeight: 0.001,
    avgIncomeDecile: 3.0,
    agingRate: 0.48,
    description: '남강댐 진양호 상수원보호구역으로 코스모스 축제와 친환경 딸기·토마토를 키우는 아름다운 수변 마을.',
    tags: ['상수원보호구역', '코스모스', '수변마을']
  }
];

export const JINJU_META = {
  totalPopulation: 334360,
  youthRatio: 0.2482, // 청년 비율 24.82% (경남 시부 1위)
  annualBirths: 1855,
  totalFertilityRate: 1.005,
  lifeExpectancy: {
    male: 80.8,
    female: 86.9,
  },
  // 연령대별 주요 사망 원인 확률 가중치
  deathCauses: [
    { cause: '악성신생물 (암)', weight: 0.28 },
    { cause: '심장 질환', weight: 0.16 },
    { cause: '폐렴 및 호흡기 질환', weight: 0.13 },
    { cause: '뇌혈관 질환 (뇌졸중)', weight: 0.11 },
    { cause: '노환 및 복합성 쇠약', weight: 0.18 },
    { cause: '외인사 (불의의 사고 등)', weight: 0.07 },
    { cause: '기타 내과 질환', weight: 0.07 }
  ]
};
