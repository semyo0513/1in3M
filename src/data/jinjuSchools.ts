// 진주시 관내 실제 초·중·고등학교 공공 데이터베이스 및 권역·성별 매칭 엔진

export interface SchoolEntry {
  name: string;
  level: '초등학교' | '중학교' | '고등학교';
  dongMyeon: string;
  districtIds: string[]; // 연계 행정동 ID
  gender: 'all' | 'male' | 'female'; // 남녀공학, 남학교, 여학교
  category?: 'general' | 'special' | 'meister' | 'arts_sports';
}

// 1. 초등학교 (40여 개교)
export const JINJU_ELEMENTARY_SCHOOLS: SchoolEntry[] = [
  { name: '가람초등학교', level: '초등학교', dongMyeon: '하대동', districtIds: ['hadae'], gender: 'all' },
  { name: '가좌초등학교', level: '초등학교', dongMyeon: '가좌동', districtIds: ['gaho'], gender: 'all' },
  { name: '갈전초등학교', level: '초등학교', dongMyeon: '충무공동', districtIds: ['chungmugong'], gender: 'all' },
  { name: '관봉초등학교', level: '초등학교', dongMyeon: '명석면', districtIds: ['myeongseok'], gender: 'all' },
  { name: '금곡초등학교', level: '초등학교', dongMyeon: '금곡면', districtIds: ['geumgok'], gender: 'all' },
  { name: '금빛초등학교', level: '초등학교', dongMyeon: '금산면', districtIds: ['geumsan'], gender: 'all' },
  { name: '금산초등학교', level: '초등학교', dongMyeon: '금산면', districtIds: ['geumsan'], gender: 'all' },
  { name: '금성초등학교', level: '초등학교', dongMyeon: '상대동', districtIds: ['sangdae'], gender: 'all' },
  { name: '금호초등학교', level: '초등학교', dongMyeon: '금산면', districtIds: ['geumsan'], gender: 'all' },
  { name: '남강초등학교', level: '초등학교', dongMyeon: '상평동', districtIds: ['sangpyeong'], gender: 'all' },
  { name: '내동초등학교', level: '초등학교', dongMyeon: '내동면', districtIds: ['naedong'], gender: 'all' },
  { name: '대곡초등학교', level: '초등학교', dongMyeon: '대곡면', districtIds: ['daegok'], gender: 'all' },
  { name: '도동초등학교', level: '초등학교', dongMyeon: '하대동', districtIds: ['hadae'], gender: 'all' },
  { name: '동진초등학교', level: '초등학교', dongMyeon: '상대동', districtIds: ['sangdae'], gender: 'all' },
  { name: '망경초등학교', level: '초등학교', dongMyeon: '망경동', districtIds: ['cheonjeon'], gender: 'all' },
  { name: '명석초등학교', level: '초등학교', dongMyeon: '명석면', districtIds: ['myeongseok'], gender: 'all' },
  { name: '무지개초등학교', level: '초등학교', dongMyeon: '충무공동', districtIds: ['chungmugong'], gender: 'all' },
  { name: '문산초등학교', level: '초등학교', dongMyeon: '문산읍', districtIds: ['munsan'], gender: 'all' },
  { name: '미천초등학교', level: '초등학교', dongMyeon: '미천면', districtIds: ['micheon'], gender: 'all' },
  { name: '반성초등학교', level: '초등학교', dongMyeon: '일반성면', districtIds: ['ilbanseong', 'ibanseong'], gender: 'all' },
  { name: '배영초등학교', level: '초등학교', dongMyeon: '신안동', districtIds: ['sinan'], gender: 'all' },
  { name: '봉곡초등학교', level: '초등학교', dongMyeon: '봉곡동', districtIds: ['jungang', 'seongbuk'], gender: 'all' },
  { name: '봉래초등학교', level: '초등학교', dongMyeon: '봉래동', districtIds: ['seongbuk'], gender: 'all' },
  { name: '봉원초등학교', level: '초등학교', dongMyeon: '상봉동', districtIds: ['sangbong'], gender: 'all' },
  { name: '사봉초등학교', level: '초등학교', dongMyeon: '사봉면', districtIds: ['sabong'], gender: 'all' },
  { name: '서진초등학교', level: '초등학교', dongMyeon: '평거동', districtIds: ['pyeonggeo'], gender: 'all' },
  { name: '선학초등학교', level: '초등학교', dongMyeon: '옥봉동', districtIds: ['seongbuk', 'jungang'], gender: 'all' },
  { name: '수곡초등학교', level: '초등학교', dongMyeon: '수곡면', districtIds: ['sugok'], gender: 'all' },
  { name: '수정초등학교', level: '초등학교', dongMyeon: '계동', districtIds: ['jungang', 'seongbuk'], gender: 'all' },
  { name: '신안초등학교', level: '초등학교', dongMyeon: '신안동', districtIds: ['sinan'], gender: 'all' },
  { name: '신진초등학교', level: '초등학교', dongMyeon: '평거동', districtIds: ['pyeonggeo'], gender: 'all' },
  { name: '예하초등학교', level: '초등학교', dongMyeon: '정촌면', districtIds: ['jeongchon'], gender: 'all' },
  { name: '은하수초등학교', level: '초등학교', dongMyeon: '충무공동', districtIds: ['chungmugong'], gender: 'all' },
  { name: '장재초등학교', level: '초등학교', dongMyeon: '초전동', districtIds: ['chojang'], gender: 'all' },
  { name: '정촌초등학교', level: '초등학교', dongMyeon: '가좌동', districtIds: ['gaho', 'jeongchon'], gender: 'all' },
  { name: '주약초등학교', level: '초등학교', dongMyeon: '주약동', districtIds: ['cheonjeon', 'gaho'], gender: 'all' },
  { name: '지수초등학교', level: '초등학교', dongMyeon: '지수면', districtIds: ['jisu'], gender: 'all' },
  { name: '진성초등학교', level: '초등학교', dongMyeon: '진성면', districtIds: ['jinseong'], gender: 'all' },
  { name: '진주교육대학교부설초등학교', level: '초등학교', dongMyeon: '신안동', districtIds: ['sinan', 'pyeonggeo'], gender: 'all' },
  { name: '진주초등학교', level: '초등학교', dongMyeon: '비봉동', districtIds: ['sangbong', 'seongbuk'], gender: 'all' },
  { name: '집현초등학교', level: '초등학교', dongMyeon: '집현면', districtIds: ['jiphyeon'], gender: 'all' },
  { name: '천전초등학교', level: '초등학교', dongMyeon: '강남동', districtIds: ['cheonjeon'], gender: 'all' },
  { name: '초전초등학교', level: '초등학교', dongMyeon: '초전동', districtIds: ['chojang'], gender: 'all' },
  { name: '촉석초등학교', level: '초등학교', dongMyeon: '평거동', districtIds: ['pyeonggeo', 'panmun'], gender: 'all' },
  { name: '충무공초등학교', level: '초등학교', dongMyeon: '충무공동', districtIds: ['chungmugong'], gender: 'all' },
  { name: '평거초등학교', level: '초등학교', dongMyeon: '평거동', districtIds: ['pyeonggeo', 'panmun'], gender: 'all' }
];

// 2. 중학교 (22개교)
export const JINJU_MIDDLE_SCHOOLS: SchoolEntry[] = [
  { name: '개양중학교', level: '중학교', dongMyeon: '가좌동', districtIds: ['gaho'], gender: 'all' },
  { name: '경남꿈키움중학교', level: '중학교', dongMyeon: '진성면', districtIds: ['jinseong'], gender: 'all', category: 'special' },
  { name: '경상국립대학교사범대학부설중학교', level: '중학교', dongMyeon: '가좌동', districtIds: ['gaho'], gender: 'all' },
  { name: '경해여자중학교', level: '중학교', dongMyeon: '평거동', districtIds: ['pyeonggeo', 'panmun', 'sinan', 'ihyeon'], gender: 'female' },
  { name: '금곡중학교', level: '중학교', dongMyeon: '금곡면', districtIds: ['geumgok'], gender: 'all' },
  { name: '대곡중학교', level: '중학교', dongMyeon: '대곡면', districtIds: ['daegok'], gender: 'all' },
  { name: '대아중학교', level: '중학교', dongMyeon: '이현동', districtIds: ['ihyeon', 'pyeonggeo', 'sinan'], gender: 'male' },
  { name: '명석중학교', level: '중학교', dongMyeon: '명석면', districtIds: ['myeongseok'], gender: 'all' },
  { name: '문산중학교', level: '중학교', dongMyeon: '충무공동', districtIds: ['chungmugong', 'munsan'], gender: 'all' },
  { name: '반성중학교', level: '중학교', dongMyeon: '일반성면', districtIds: ['ilbanseong', 'ibanseong', 'sabong'], gender: 'all' },
  { name: '삼현여자중학교', level: '중학교', dongMyeon: '상대동', districtIds: ['sangdae', 'sangpyeong', 'hadae'], gender: 'female' },
  { name: '선인국제중학교', level: '중학교', dongMyeon: '대곡면', districtIds: ['daegok'], gender: 'all', category: 'special' },
  { name: '지수중학교', level: '중학교', dongMyeon: '지수면', districtIds: ['jisu'], gender: 'all' },
  { name: '진명여자중학교', level: '중학교', dongMyeon: '상봉동', districtIds: ['sangbong', 'seongbuk', 'jungang'], gender: 'female' },
  { name: '진서중학교', level: '중학교', dongMyeon: '서부권역', districtIds: ['sugok', 'daepyeong'], gender: 'all' },
  { name: '진주남중학교', level: '중학교', dongMyeon: '가좌동', districtIds: ['gaho', 'cheonjeon'], gender: 'male' },
  { name: '진주동명중학교', level: '중학교', dongMyeon: '초전동', districtIds: ['chojang', 'hadae'], gender: 'male' },
  { name: '진주동중학교', level: '중학교', dongMyeon: '하대동', districtIds: ['hadae', 'sangpyeong', 'chojang'], gender: 'all' },
  { name: '진주봉원중학교', level: '중학교', dongMyeon: '상봉동', districtIds: ['sangbong', 'seongbuk'], gender: 'male' },
  { name: '진주여자중학교', level: '중학교', dongMyeon: '신안동', districtIds: ['sinan', 'pyeonggeo', 'ihyeon'], gender: 'female' },
  { name: '진주제일중학교', level: '중학교', dongMyeon: '강남동', districtIds: ['cheonjeon'], gender: 'male' },
  { name: '진주중앙중학교', level: '중학교', dongMyeon: '상대동', districtIds: ['sangdae', 'sangpyeong'], gender: 'male' },
  { name: '진주중학교', level: '중학교', dongMyeon: '상봉동', districtIds: ['sangbong', 'seongbuk', 'jungang'], gender: 'male' }
];

// 3. 고등학교 (20여 개교)
export const JINJU_HIGH_SCHOOLS: SchoolEntry[] = [
  { name: '경남정보고등학교', level: '고등학교', dongMyeon: '상대동', districtIds: ['sangdae', 'sangpyeong'], gender: 'all', category: 'meister' },
  { name: '경남체육고등학교', level: '고등학교', dongMyeon: '진성면', districtIds: ['jinseong'], gender: 'all', category: 'arts_sports' },
  { name: '경상국립대학교사범대학부설고등학교', level: '고등학교', dongMyeon: '가좌동', districtIds: ['gaho'], gender: 'all', category: 'general' },
  { name: '경해여자고등학교', level: '고등학교', dongMyeon: '평거동', districtIds: ['pyeonggeo', 'panmun', 'sinan', 'ihyeon'], gender: 'female', category: 'general' },
  { name: '대아고등학교', level: '고등학교', dongMyeon: '이현동', districtIds: ['ihyeon', 'pyeonggeo', 'panmun', 'sinan'], gender: 'male', category: 'general' },
  { name: '명신고등학교', level: '고등학교', dongMyeon: '초전동', districtIds: ['chojang', 'hadae'], gender: 'all', category: 'general' },
  { name: '삼현여자고등학교', level: '고등학교', dongMyeon: '상대동', districtIds: ['sangdae', 'sangpyeong', 'hadae'], gender: 'female', category: 'general' },
  { name: '선명여자고등학교', level: '고등학교', dongMyeon: '상봉동', districtIds: ['sangbong', 'seongbuk'], gender: 'female', category: 'meister' },
  { name: '경남예술고등학교', level: '고등학교', dongMyeon: '문산읍', districtIds: ['munsan', 'chungmugong'], gender: 'all', category: 'arts_sports' },
  { name: '진서고등학교', level: '고등학교', dongMyeon: '서부권역', districtIds: ['sugok', 'daepyeong'], gender: 'all', category: 'general' },
  { name: '진양고등학교', level: '고등학교', dongMyeon: '충무공동', districtIds: ['chungmugong', 'munsan'], gender: 'all', category: 'general' },
  { name: '진주고등학교', level: '고등학교', dongMyeon: '상봉동', districtIds: ['sangbong', 'seongbuk', 'jungang', 'sinan'], gender: 'male', category: 'general' },
  { name: '진주기계공업고등학교', level: '고등학교', dongMyeon: '상평동', districtIds: ['sangpyeong', 'sangdae'], gender: 'male', category: 'meister' },
  { name: '진주동명고등학교', level: '고등학교', dongMyeon: '초전동', districtIds: ['chojang', 'hadae'], gender: 'male', category: 'general' },
  { name: '진주여자고등학교', level: '고등학교', dongMyeon: '봉곡동', districtIds: ['jungang', 'seongbuk', 'sinan'], gender: 'female', category: 'general' },
  { name: '진주외국어고등학교', level: '고등학교', dongMyeon: '일반성면', districtIds: ['ilbanseong', 'ibanseong', 'sabong'], gender: 'all', category: 'special' },
  { name: '진주제일여자고등학교', level: '고등학교', dongMyeon: '하대동', districtIds: ['hadae', 'chojang', 'sangdae'], gender: 'female', category: 'general' },
  { name: '진주중앙고등학교', level: '고등학교', dongMyeon: '상대동', districtIds: ['sangdae', 'sangpyeong'], gender: 'all', category: 'general' },
  { name: '경남항공고등학교(관련)', level: '고등학교', dongMyeon: '정촌/관내', districtIds: ['jeongchon'], gender: 'all', category: 'meister' },
  { name: '진주바이오마이스터고등학교', level: '고등학교', dongMyeon: '칠암동', districtIds: ['cheonjeon'], gender: 'all', category: 'meister' }
];

// 초등학교 배정 로직 (거주지 기반)
export function pickElementarySchool(districtId: string): string {
  const matches = JINJU_ELEMENTARY_SCHOOLS.filter(s => s.districtIds.includes(districtId));
  if (matches.length > 0) {
    return matches[Math.floor(Math.random() * matches.length)].name;
  }
  // 인근 배정 기본값
  return '진주초등학교';
}

// 중학교 배정 로직 (거주지 & 성별 기반)
export function pickMiddleSchool(districtId: string, gender: '남성' | '여성'): string {
  const genderCode = gender === '남성' ? 'male' : 'female';
  
  // 1순위: 같은 행정동 + 성별 일치(남/여) 또는 남녀공학(all)
  const exact = JINJU_MIDDLE_SCHOOLS.filter(s => 
    s.districtIds.includes(districtId) && (s.gender === genderCode || s.gender === 'all')
  );
  if (exact.length > 0) {
    return exact[Math.floor(Math.random() * exact.length)].name;
  }

  // 2순위: 성별 적합 전체 중학교 중 무작위
  const general = JINJU_MIDDLE_SCHOOLS.filter(s => s.gender === genderCode || s.gender === 'all');
  return general[Math.floor(Math.random() * general.length)].name;
}

// 고등학교 배정 로직 (거주지 & 성별 & 관심 분야)
export function pickHighSchool(
  districtId: string,
  gender: '남성' | '여성',
  categoryPreference?: 'general' | 'meister' | 'arts_sports' | 'special'
): string {
  const genderCode = gender === '남성' ? 'male' : 'female';

  // 1순위: 희망 계열 + 성별 부합
  let pool = JINJU_HIGH_SCHOOLS.filter(s => 
    (s.gender === genderCode || s.gender === 'all') &&
    (!categoryPreference || s.category === categoryPreference)
  );

  // 같은 권역 우선 배정 가중치
  const localMatch = pool.filter(s => s.districtIds.includes(districtId));
  if (localMatch.length > 0 && Math.random() < 0.7) {
    return localMatch[Math.floor(Math.random() * localMatch.length)].name;
  }

  if (pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)].name;
  }

  // 기본 fallback
  return gender === '남성' ? '진주고등학교' : '진주여자고등학교';
}
