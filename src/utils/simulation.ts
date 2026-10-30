// 진주시 시뮬레이션 엔진 및 수학적 모델 (공공데이터 및 교육용 모드 필터 지원)
import { CitizenStatus, CohortPerson, DistrictInfo, DilemmaIssue, CityMacroIndicators, YearFocus, JobType, SpouseInfo, HappiestYearInfo, LifeArchetypeInfo } from '../types/game';
import { JINJU_DISTRICTS, JINJU_META, getEduIncomeDesc } from '../data/jinjuData';
import { PERSONAL_EVENTS, PersonalEventDef } from '../data/personalEvents';
import { getDilemmas } from '../data/dilemmas';
import { checkLifeChoiceTrigger } from '../data/lifeChoices';
import { pickElementarySchool, pickMiddleSchool, pickHighSchool } from '../data/jinjuSchools';

export { checkLifeChoiceTrigger };

// Box-Muller 변환을 통한 정규분포 난수 생성 N(mean, std^2)
export function randNormal(mean: number, std: number): number {
  const u1 = Math.max(1e-6, Math.random());
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

// 한계효용 체감 및 상향 저항 비대칭 수식 (명세서 3.3)
export function applyDiminishingReturns(current: number, rawDelta: number): number {
  const ratio = Math.max(0, Math.min(1, current / 100));
  if (rawDelta > 0) {
    return rawDelta * (1 - Math.pow(ratio, 1.5));
  } else {
    return rawDelta * (1 + 0.30 * ratio);
  }
}

// 한국형 생애 스트레스 곡선 연령별 연간 자연 변화량 D(a) (명세서 3.2)
export function getAgeStressDelta(age: number): {
  health: number;
  happiness: number;
  learning: number;
  bonds: number;
} {
  if (age <= 12) return { health: 0.5, happiness: 0.0, learning: 1.5, bonds: 0.5 };
  if (age <= 18) return { health: -1.0, happiness: -2.8, learning: 2.5, bonds: -0.5 };
  if (age <= 29) return { health: -0.5, happiness: -2.0, learning: 0.5, bonds: -2.0 };
  if (age <= 44) return { health: -1.8, happiness: -1.2, learning: -2.0, bonds: -1.5 };
  if (age <= 59) return { health: -2.5, happiness: -2.5, learning: -1.8, bonds: -2.0 };
  if (age <= 74) return { health: -3.2, happiness: -1.5, learning: -2.0, bonds: -2.8 };
  return { health: -4.8, happiness: -2.0, learning: -2.5, bonds: -3.5 };
}

// 연간 삶의 초점(Focus) 선택 시 기회비용(Trade-off) 매트릭스 (명세서 3.4)
export function getFocusDeltas(focus: YearFocus): {
  health: number;
  happiness: number;
  learning: number;
  bonds: number;
} {
  switch (focus) {
    case 'learning':
      return { learning: 6.5, health: -2.0, bonds: -2.0, happiness: -1.0 };
    case 'work':
      return { learning: 1.5, health: -4.5, happiness: -3.5, bonds: -3.0 };
    case 'relationship':
      return { bonds: 7.0, happiness: 3.0, learning: -1.5, health: 0 };
    case 'health':
      return { health: 6.5, happiness: 4.0, learning: -1.5, bonds: 0 };
    case 'change':
      return { happiness: 6.5, learning: 1.5, health: 1.0, bonds: -1.0 };
  }
}

export interface PresetProfile {
  id: string;
  name: string;
  districtId: string;
  tag: string;
  headline: string;
  desc: string;
  defaultDecile: number;
}

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'chungmugong_lh',
    name: '혁신도시 공기업 자녀',
    districtId: 'chungmugong',
    tag: '신도심 · 공공기관',
    headline: '충무공동 대단지 아파트',
    desc: '수도권에서 진주로 이전해 온 공공기관 임직원 가정. 쾌적한 신도시 인프라와 과밀학급 속에서 자랍니다.',
    defaultDecile: 5
  },
  {
    id: 'seongbuk_market',
    name: '원도심 전통시장 상인 자녀',
    districtId: 'seongbuk',
    tag: '원도심 · 골목상권',
    headline: '진주성 앞 성북동 골목',
    desc: '중앙시장과 논개시장의 유서 깊은 상인 가정. 진주의 역사적 자부심과 원도심 상권 침체의 갈림길을 봅니다.',
    defaultDecile: 3
  },
  {
    id: 'sugok_smartfarm',
    name: '수곡 수출딸기 스마트팜 자녀',
    districtId: 'sugok',
    tag: '농촌특화 · 수출농업',
    headline: '수곡면 첨단 비닐하우스',
    desc: '전국 최고 품질의 딸기를 해외로 수출하는 고소득 농가. 맑은 남강 상류 자연과 면 지역 장거리 통학을 경험합니다.',
    defaultDecile: 4
  },
  {
    id: 'gaho_college',
    name: '경상국립대 앞 대학가 자녀',
    districtId: 'gaho',
    tag: '대학가 · 청년문화',
    headline: '가좌동 대학로 원룸촌',
    desc: '수만 명의 대학생이 오가는 청년 문화의 거리. 20대 청년들의 졸업 후 상경과 일자리 고민을 가장 가까이서 체감합니다.',
    defaultDecile: 3
  },
  {
    id: 'pyeonggeo_academy',
    name: '평거 10호광장 명문학원가 자녀',
    districtId: 'pyeonggeo',
    tag: '명문학군 · 남강변',
    headline: '평거동 대형 학원가',
    desc: '남강 둔치 쉼터와 10호광장 학원 빌딩들. 높은 교육열과 학업 경쟁, 의대·명문대 진학의 열기 속에 성장합니다.',
    defaultDecile: 4
  }
];

export function pickDistrictByBirthWeight(): DistrictInfo {
  const totalWeight = JINJU_DISTRICTS.reduce((sum, d) => sum + d.birthWeight, 0);
  let rand = Math.random() * totalWeight;

  for (const d of JINJU_DISTRICTS) {
    if (rand < d.birthWeight) {
      return d;
    }
    rand -= d.birthWeight;
  }
  return JINJU_DISTRICTS[0];
}

const JOBS_BY_DISTRICT: Record<string, JobType[]> = {
  chungmugong: ['공공기관 임직원', '초·중·고 교사 및 교육직', '우주항공 엔지니어', '종합병원 간호사·의료직'],
  pyeonggeo: ['초·중·고 교사 및 교육직', '원도심 소상공인·자영업', '제조업·기계 연구원', '문화·관광 서비스업'],
  chojang: ['공공기관 임직원', '제조업·기계 연구원', '종합병원 간호사·의료직', '초·중·고 교사 및 교육직'],
  gaho: ['청년 구직자', '문화·관광 서비스업', '원도심 소상공인·자영업', '우주항공 엔지니어'],
  seongbuk: ['원도심 소상공인·자영업', '문화·관광 서비스업', '초·중·고 교사 및 교육직', '은퇴 및 프리랜서'],
  jungang: ['원도심 소상공인·자영업', '문화·관광 서비스업', '청년 구직자'],
  sangpyeong: ['제조업·기계 연구원', '원도심 소상공인·자영업', '은퇴 및 프리랜서'],
  munsan: ['시설원예 스마트팜 농업인', '공공기관 임직원', '원도심 소상공인·자영업'],
  geumsan: ['시설원예 스마트팜 농업인', '초·중·고 교사 및 교육직', '원도심 소상공인·자영업'],
  naedong: ['원도심 소상공인·자영업', '시설원예 스마트팜 농업인', '제조업·기계 연구원'],
  sugok: ['시설원예 스마트팜 농업인', '은퇴 및 프리랜서'],
  jeongchon: ['우주항공 엔지니어', '제조업·기계 연구원', '공공기관 임직원'],
  default: ['원도심 소상공인·자영업', '제조업·기계 연구원', '시설원예 스마트팜 농업인', '청년 구직자']
};

export function getRandomJob(districtId: string, age: number): JobType {
  if (age < 19) return '청년 구직자';
  if (age >= 65) return '은퇴 및 프리랜서';

  const pool = JOBS_BY_DISTRICT[districtId] || JOBS_BY_DISTRICT.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateRandomBirth(birthYear: number = 2026, isEduMode: boolean = false): CitizenStatus {
  const district = pickDistrictByBirthWeight();
  return generateBirthForDistrict(district.id, birthYear, undefined, isEduMode);
}

const HOBBIES = [
  '노래·악기 연주',
  '남강변 자전거 라이딩',
  '진주성 역사 답사·기록',
  '베란다 분재와 텃밭 가꾸기',
  '독서와 작은 도서관 모임',
  '사진 촬영과 남강 일몰 기록',
  '배드민턴과 생활 체육'
];

export function generateBirthForDistrict(
  districtId: string,
  birthYear: number = 2026,
  overrideDecile?: number,
  isEduMode: boolean = false
): CitizenStatus {
  const district = JINJU_DISTRICTS.find(d => d.id === districtId) || JINJU_DISTRICTS[0];
  const gender: '남성' | '여성' = Math.random() < 0.51 ? '남성' : '여성';

  const baseDecile = overrideDecile ?? Math.round(district.avgIncomeDecile + (Math.random() * 2 - 1));
  const incomeDecile = Math.max(1, Math.min(5, baseDecile));
  const monthlyIncomeWon = 0; // 0세 영유아 직접 소득 0원 (가구 환경은 소득분위로)
  const incomeDesc = getEduIncomeDesc(incomeDecile);
  const hobby = HOBBIES[Math.floor(Math.random() * HOBBIES.length)];
  const districtName = district.name.split(' ')[0];

  // 진주시 실제 초·중·고 배정
  const elementarySchool = pickElementarySchool(district.id);
  const middleSchool = pickMiddleSchool(district.id, gender);
  const highSchool = pickHighSchool(district.id, gender);

  return {
    name: isEduMode ? '진주 학생' : '진주시민',
    age: 0,
    birthYear,
    currentYear: birthYear,
    district,
    gender,
    job: '청년 구직자',
    jobTitle: '영유아 (가정보육·어린이집)',
    education: '미취학 (영유아)',
    elementarySchool,
    middleSchool,
    highSchool,
    incomeDecile,
    incomeDesc,
    monthlyIncomeWon,
    netWorthWon: 500000, // 50만 원 (돌 축하금 등)
    hobby,
    spouse: null,
    childrenCount: 0,
    farewellCompanion: '사랑으로 품어준 부모님과 가족',
    happiestYear: {
      age: 0,
      year: birthYear,
      note: `${districtName}에서 따뜻한 축복 속에 태어난 해`
    },
    timeSpent: {
      learning: 0,
      work: 0,
      relationship: 0,
      health: 0,
      change: 0
    },
    lifeArchetype: {
      title: '새싹을 틔운 진주의 아이',
      summary: `${districtName}에 뿌리내린 삶이었어요. 새로운 삶의 걸음을 내딛는 순간이에요.`
    },
    // 명세서 3.2 (1): 출생 시 초기값 하향 및 정규분포화
    // S_init = clamp(50 + 3 * (incomeDecile - 3) + N(0, 5^2), 38, 68)
    health: Math.round(Math.max(45, Math.min(78, 65 + randNormal(0, 4)))),
    happiness: Math.round(Math.max(38, Math.min(68, 50 + 3 * (incomeDecile - 3) + randNormal(0, 5)))),
    learning: Math.round(Math.max(38, Math.min(68, 45 + 3 * (incomeDecile - 3) + randNormal(0, 5)))),
    bonds: Math.round(Math.max(38, Math.min(68, 52 + 3 * (incomeDecile - 3) + randNormal(0, 5)))),
    temperament: {
      caution: Math.floor(Math.random() * 100),
      community: Math.floor(Math.random() * 100),
      optimism: Math.floor(Math.random() * 100)
    },
    isAlive: true,
    isRelocatedAway: false,
    flags: new Set<string>(),
    seenOnceEvents: new Set<string>(),
    eventCooldowns: {},
    eventCounts: {},
    choicesHistory: [],
    pausedQuestionAnswers: []
  };
}

export function advanceCitizenProfile(
  prev: CitizenStatus,
  nextAge: number,
  nextYear: number,
  focus: YearFocus
): {
  job: JobType;
  jobTitle: string;
  education: string;
  elementarySchool: string;
  middleSchool: string;
  highSchool: string;
  monthlyIncomeWon: number;
  netWorthWon: number;
  spouse: SpouseInfo | null;
  childrenCount: number;
  farewellCompanion: string;
  happiestYear: HappiestYearInfo;
  timeSpent: Record<YearFocus, number>;
  lifeArchetype: LifeArchetypeInfo;
  hobby: string;
} {
  // 진주시 실제 학교 계승/확보
  const elementarySchool = prev.elementarySchool || pickElementarySchool(prev.district.id);
  const middleSchool = prev.middleSchool || pickMiddleSchool(prev.district.id, prev.gender);
  const highSchool = prev.highSchool || pickHighSchool(prev.district.id, prev.gender);

  // 1. 시간을 쓴 곳 누적
  const prevTimeSpent = prev.timeSpent || { learning: 0, work: 0, relationship: 0, health: 0, change: 0 };
  const timeSpent: Record<YearFocus, number> = {
    learning: prevTimeSpent.learning || 0,
    work: prevTimeSpent.work || 0,
    relationship: prevTimeSpent.relationship || 0,
    health: prevTimeSpent.health || 0,
    change: prevTimeSpent.change || 0,
    [focus]: (prevTimeSpent[focus] || 0) + 1
  };

  // 2. 학력 발전 (실제 진주 학교 명칭 반영)
  let education = prev.education || '미취학 (영유아)';
  if (nextAge < 8) {
    education = '미취학 (영유아)';
  } else if (nextAge <= 13) {
    education = `초등학교 (${elementarySchool})`;
  } else if (nextAge <= 16) {
    education = `중학교 (${middleSchool})`;
  } else if (nextAge <= 19) {
    education = `고등학교 (${highSchool})`;
  } else if (nextAge === 20) {
    if (prev.learning >= 65) education = `대학교 (경상국립대 / ${highSchool} 졸)`;
    else if (prev.learning >= 35) education = `전문학사 (연암공대 / ${highSchool} 졸)`;
    else education = `고등학교 (${highSchool} 졸업)`;
  } else if (nextAge >= 26 && education.startsWith('고등학교') && timeSpent.learning >= 10) {
    education = `방통대 학사 (${highSchool} 졸)`;
  }

  // 3. 직업 및 직책 발전 (학교 명칭 연동)
  let job = prev.job;
  let jobTitle = prev.jobTitle || '영유아';

  if (nextAge < 8) {
    job = '청년 구직자';
    jobTitle = '영유아 (가정·어린이집)';
  } else if (nextAge <= 13) {
    job = '청년 구직자';
    jobTitle = `초등학생 (${elementarySchool})`;
  } else if (nextAge <= 16) {
    job = '청년 구직자';
    jobTitle = `중학생 (${middleSchool})`;
  } else if (nextAge <= 19) {
    job = '청년 구직자';
    jobTitle = `고등학생 (${highSchool})`;
  } else if (nextAge <= 24) {
    if (education.includes('대학교')) {
      job = '청년 구직자';
      jobTitle = '대학생 (학업 및 준비)';
    } else {
      job = getRandomJob(prev.district.id, nextAge);
      jobTitle = `${job} · 사회초년생`;
    }
  } else if (nextAge <= 34) {
    if (job === '청년 구직자' || job === '은퇴 및 프리랜서') {
      job = getRandomJob(prev.district.id, nextAge);
    }
    jobTitle = `${job} · 사원·주임`;
  } else if (nextAge <= 44) {
    jobTitle = `${job} · 대리·과장`;
  } else if (nextAge <= 58) {
    jobTitle = `${job} · 팀장·부장`;
  } else if (nextAge <= 64) {
    jobTitle = `${job} · 부장·책임`;
  } else {
    // 65세 이상 은퇴
    job = '은퇴 및 프리랜서';
    jobTitle = '부장 · 은퇴';
  }

  // 4. 월소득 및 순자산 (저축 누적)
  let monthlyIncomeWon = 0;
  if (nextAge < 8) monthlyIncomeWon = 0;
  else if (nextAge <= 13) monthlyIncomeWon = 30000;
  else if (nextAge <= 16) monthlyIncomeWon = 70000;
  else if (nextAge <= 19) monthlyIncomeWon = 150000;
  else if (nextAge <= 24) monthlyIncomeWon = education.includes('대학교') ? 450000 : 1800000;
  else if (nextAge <= 34) monthlyIncomeWon = prev.incomeDecile * 600000 + 1800000;
  else if (nextAge <= 44) monthlyIncomeWon = prev.incomeDecile * 850000 + 2200000;
  else if (nextAge <= 58) monthlyIncomeWon = prev.incomeDecile * 1000000 + 2600000;
  else if (nextAge <= 64) monthlyIncomeWon = prev.incomeDecile * 800000 + 2000000;
  else monthlyIncomeWon = prev.incomeDecile * 250000 + 1300000; // 은퇴 연금

  let netWorthWon = prev.netWorthWon || 500000;
  if (nextAge < 20) {
    netWorthWon += Math.floor(monthlyIncomeWon * 12 * 0.4);
  } else if (nextAge <= 64) {
    const saveRate = focus === 'work' ? 0.35 : 0.25;
    netWorthWon += Math.floor(monthlyIncomeWon * 12 * saveRate);
  } else {
    netWorthWon = Math.max(10000000, netWorthWon - 1500000);
  }

  // 5. 배우자 및 자녀
  let spouse: SpouseInfo | null = prev.spouse ? { ...prev.spouse } : null;
  let childrenCount = prev.childrenCount || 0;

  if (!spouse && nextAge >= 28 && nextAge <= 38 && prev.bonds >= 50) {
    // 결혼 확률 25%
    if (Math.random() < 0.25) {
      const spouseNames = prev.gender === '남성'
        ? ['지은', '서연', '민서', '수빈', '유진', '하은', '지우', '소희']
        : ['민준', '도윤', '준서', '예준', '지훈', '서진', '현우', '동현'];
      const chosenName = spouseNames[Math.floor(Math.random() * spouseNames.length)];
      spouse = {
        name: chosenName,
        marriedAge: nextAge,
        yearsTogether: 1,
        passedAway: false
      };
    }
  } else if (spouse) {
    if (!spouse.passedAway) {
      spouse.yearsTogether += 1;
      // 78세 이상일 때 배우자 먼저 사별 확률 3%
      if (nextAge >= 78 && Math.random() < 0.03) {
        spouse.passedAway = true;
      }
    }
  }

  if (spouse && !spouse.passedAway && nextAge >= 29 && nextAge <= 39 && childrenCount < 2) {
    if (Math.random() < 0.20) {
      childrenCount += 1;
    }
  }

  // 6. 곁을 지키는 사람 / 마지막 배웅
  let farewellCompanion = '오랜 친구 한 명';
  if (nextAge < 20) {
    farewellCompanion = '사랑으로 품어준 부모님과 가족';
  } else if (spouse && !spouse.passedAway) {
    farewellCompanion = `늘 곁을 지켜준 배우자 ${spouse.name}와 가족`;
  } else if (spouse && spouse.passedAway) {
    farewellCompanion = childrenCount > 0 ? '든든한 자녀들과 오랜 친구' : '오랜 친구 한 명';
  } else if (childrenCount > 0) {
    farewellCompanion = '다정한 자녀들과 이웃들';
  } else if (prev.bonds >= 60) {
    farewellCompanion = '오랜 친구 한 명과 다정한 이웃들';
  } else {
    farewellCompanion = '조용히 곁을 지킨 이웃 복지사';
  }

  // 7. 가장 행복했던 해
  let happiestYear = prev.happiestYear || {
    age: 0,
    year: prev.birthYear,
    note: '남강의 축복 속에 태어난 해'
  };
  if (prev.happiness >= 80 && (nextAge === 1 || prev.happiness > (happiestYear as any).score || 0)) {
    happiestYear = {
      age: nextAge,
      year: nextYear,
      note: `${nextAge}세 (${nextYear}년)`
    };
    (happiestYear as any).score = prev.happiness;
  }

  // 8. 이 삶의 결 (Archetype)
  const focusKeys: YearFocus[] = ['work', 'relationship', 'learning', 'health', 'change'];
  focusKeys.sort((a, b) => timeSpent[b] - timeSpent[a]);
  const topFocus = focusKeys[0];

  const districtName = prev.district.name.split(' ')[0];
  let title = '한 우물을 파는 장인';
  let summary = `${districtName}에 뿌리내린 삶이었어요. 부장으로 일하며 보람을 찾는 날이 많았어요.`;

  if (topFocus === 'work') {
    title = '한 우물을 파는 장인';
    summary = `${districtName}에 뿌리내린 삶이었어요. 부장으로 일하며 보람을 찾는 날이 많았어요.`;
  } else if (topFocus === 'relationship') {
    title = '따뜻한 이웃을 품은 정원사';
    summary = `${districtName}에서 가족과 오랜 이웃들에게 다정한 온기를 건네며 남강처럼 넉넉하게 살아온 삶이었어요.`;
  } else if (topFocus === 'learning') {
    title = '배움에 진심이었던 탐구자';
    summary = `남강의 지혜를 머금고 평생 호기심을 잃지 않으며 꾸준히 세상과 지식을 익혀온 삶이었어요.`;
  } else if (topFocus === 'health') {
    title = '남강의 물결을 닮은 자유인';
    summary = `소박한 일상과 자연 속에서 마음의 평온을 찾고 몸과 마음의 조화를 소중히 여겼던 삶이었어요.`;
  } else if (topFocus === 'change') {
    title = '새로운 지평을 연 개척자';
    summary = `한 자리에 안주하지 않고 삶의 크고 작은 변화를 기꺼이 받아들이며 다채로운 풍경을 걸어온 삶이었어요.`;
  }

  // 9. 연령별 취미 자동 전환 (명세서 2.4)
  let hobby = prev.hobby || '남강변 산책과 휴식';
  if (nextAge >= 65) {
    if (hobby.includes('러닝') || hobby.includes('라이딩') || hobby.includes('체육') || hobby.includes('배드민턴') || hobby.includes('등산') || hobby.includes('산악')) {
      hobby = '남강 둔치 파크골프 클럽';
    } else if (hobby.includes('독서') || hobby.includes('도서관') || hobby.includes('글쓰기')) {
      hobby = '큰글자도서 열람 및 진주 문인협회';
    } else if (hobby.includes('노래') || hobby.includes('악기') || hobby.includes('아이돌') || hobby.includes('팬덤') || hobby.includes('가수') || hobby.includes('트로트')) {
      hobby = '트로트 팬카페 및 복지관 노래교실';
    }
  } else if (nextAge >= 50) {
    if (hobby.includes('러닝') || hobby.includes('라이딩') || hobby.includes('체육') || hobby.includes('배드민턴')) {
      hobby = '월아산·비봉산 주말 산악회 등산';
    } else if (hobby.includes('아이돌') || hobby.includes('가수')) {
      hobby = '트로트 가수 팬카페 및 진주 콘서트';
    }
  }

  const lifeArchetype = { title, summary };

  return {
    job,
    jobTitle,
    education,
    elementarySchool,
    middleSchool,
    highSchool,
    monthlyIncomeWon,
    netWorthWon,
    spouse,
    childrenCount,
    farewellCompanion,
    happiestYear,
    timeSpent,
    lifeArchetype,
    hobby
  };
}

export function generateCohort(birthYear: number, excludeDistrictId: string): CohortPerson[] {
  const names = ['김도윤', '이서연', '박준서', '최지우', '정예준', '강민서', '조하은', '윤시우'];
  const shuffledNames = [...names].sort(() => Math.random() - 0.5);

  const candidateDistricts = JINJU_DISTRICTS.filter(d => d.id !== excludeDistrictId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return candidateDistricts.map((d, idx) => ({
    id: `cohort_${idx}`,
    name: shuffledNames[idx] || `동갑내기 ${idx + 1}`,
    district: d.name.split(' ')[0],
    job: '어린이',
    statusText: `${d.name.split(' ')[0]}에서 태어났습니다.`,
    isAlive: true
  }));
}

export function updateCohort(cohort: CohortPerson[], age: number): CohortPerson[] {
  return cohort.map(p => {
    if (!p.isAlive) return p;

    if (age > 78 && Math.random() < 0.08) {
      return {
        ...p,
        isAlive: false,
        statusText: `${age}세에 평온하게 영면하였습니다.`
      };
    }

    let statusText = p.statusText;
    let job = p.job;

    if (age === 7) {
      statusText = '동네 초등학교에 입학했습니다.';
      job = '초등학생';
    } else if (age === 13) {
      statusText = '중학교로 진학했습니다.';
      job = '중학생';
    } else if (age === 16) {
      statusText = '고등학교에 진학했습니다.';
      job = '고등학생';
    } else if (age === 19) {
      if (Math.random() < 0.4) {
        statusText = '수도권 대학으로 진학해 서울로 떠났습니다.';
        job = '타지 대학생';
      } else {
        statusText = '경상국립대에 진학하여 진주에 남았습니다.';
        job = '대학생';
      }
    } else if (age === 26) {
      const jobPool = ['LH 본사 공채 합격', '정촌 우주항공 엔지니어', '중앙시장 가업 승계', '진주교사 임용', '상평산단 정규직'];
      const chosen = jobPool[Math.floor(Math.random() * jobPool.length)];
      statusText = `${chosen}으로 사회생활을 시작했습니다.`;
      job = chosen.split(' ')[0];
    } else if (age === 33) {
      statusText = '결혼하여 남강변 신축 아파트에 보금자리를 꾸렸습니다.';
    } else if (age === 45) {
      statusText = '직장에서 팀장으로 승진하며 자녀 교육에 힘쓰고 있습니다.';
    } else if (age === 60) {
      statusText = '정년퇴직 후 남강변 텃밭을 일구며 여유를 즐깁니다.';
      job = '은퇴자';
    } else if (age === 75) {
      statusText = '노인복지관에서 서예를 배우며 평온한 나날을 보냅니다.';
    }

    return { ...p, statusText, job };
  });
}

export function checkMortality(
  citizen: CitizenStatus,
  cityIndicators: CityMacroIndicators,
  isEduMode: boolean = false
): { willDie: boolean; cause?: string } {
  if (citizen.health <= 0) {
    return { willDie: true, cause: isEduMode ? '자연스러운 건강 쇠약으로 인한 영면' : '건강 악화 및 복합 질환' };
  }

  const baseLife = citizen.gender === '남성' ? JINJU_META.lifeExpectancy.male : JINJU_META.lifeExpectancy.female;
  const welfareBonus = (cityIndicators.welfare * -1) * 0.05;
  const effectiveExpectedAge = baseLife + welfareBonus;

  // 교육용 모드에서는 학생 정서 보호를 위해 50세 이전 돌연사 확률을 0으로 차단
  if (isEduMode && citizen.age < 65) {
    return { willDie: false };
  }

  if (citizen.age < 50) {
    if (Math.random() < 0.001) {
      return { willDie: true, cause: '불의의 외인사 및 급성 질환' };
    }
    return { willDie: false };
  }

  if (citizen.age >= 50 && citizen.age < 70) {
    const risk = 0.005 + (100 - citizen.health) * 0.0002;
    if (Math.random() < risk) {
      return { willDie: true, cause: pickDeathCause(isEduMode) };
    }
    return { willDie: false };
  }

  if (citizen.age >= 70) {
    const ageDiff = citizen.age - effectiveExpectedAge;
    const baseRisk = 0.03 + Math.max(0, ageDiff * 0.035);
    const healthRisk = (100 - citizen.health) * 0.002;
    const totalRisk = Math.min(0.85, baseRisk + healthRisk);

    if (Math.random() < totalRisk) {
      return { willDie: true, cause: pickDeathCause(isEduMode) };
    }
  }

  return { willDie: false };
}

function pickDeathCause(isEduMode: boolean = false): string {
  // 교육용 모드일 때는 자살(eduModeExclude: true)을 완전 제외
  const causes = isEduMode 
    ? JINJU_META.deathCauses.filter(c => !c.eduModeExclude)
    : JINJU_META.deathCauses;

  const totalWeight = causes.reduce((sum, c) => sum + c.weight, 0);
  const rand = Math.random() * totalWeight;
  let acc = 0;
  for (const c of causes) {
    acc += c.weight;
    if (rand < acc) {
      return isEduMode ? `${c.cause}을(를) 앓은 끝에 평온한 영면` : c.cause;
    }
  }
  return '노환으로 인한 평온한 영면';
}

export function pickPersonalEvent(
  citizen: CitizenStatus,
  focus: YearFocus,
  isEduMode: boolean = false
): PersonalEventDef | null {
  const isRural = citizen.district.type === 'rural';
  const seenOnce = citizen.seenOnceEvents || new Set<string>();
  const cooldowns = citizen.eventCooldowns || {};
  const counts = citizen.eventCounts || {};

  // 1. 후보군 필터링 (영구 차단 및 쿨타임 검사 - 명세서 1.2)
  const eligible = PERSONAL_EVENTS.filter(e => {
    if (citizen.age < e.minAge || citizen.age > e.maxAge) return false;
    if (isEduMode && e.isSensitive) return false;
    if (e.sexFilter && e.sexFilter !== citizen.gender) return false;
    if (e.onceOnly && seenOnce.has(e.id)) return false;
    if ((cooldowns[e.id] || 0) > 0) return false;

    // 면(농촌) vs 동(도시) 권역 필터
    if (e.districtTypeFilter) {
      if (e.districtTypeFilter === 'rural' && !isRural) return false;
      if (e.districtTypeFilter === 'urban' && isRural) return false;
    }

    return true;
  });

  if (eligible.length === 0) return null;

  // 2. 누적 노출 횟수 기반 가중치 감쇠 수식 (명세서 1.2: W'_e = W_e * 0.35^c_e)
  let totalWeight = 0;
  const weightedCandidates = eligible.map(e => {
    let baseW = 10;
    if (e.focusFilter && e.focusFilter === focus) baseW = 25;
    else if (e.focusFilter && e.focusFilter !== focus) baseW = 4;

    const c_e = counts[e.id] || 0;
    const decayedW = baseW * Math.pow(0.35, c_e);
    totalWeight += decayedW;
    return { event: e, weight: decayedW };
  });

  let rand = Math.random() * totalWeight;
  for (const item of weightedCandidates) {
    if (rand < item.weight) {
      return item.event;
    }
    rand -= item.weight;
  }
  return weightedCandidates[0]?.event || null;
}

export function checkDilemmaTrigger(
  citizen: CitizenStatus,
  resolvedIds: Set<string>,
  isEduMode: boolean = false
): DilemmaIssue | null {
  const dilemmas = getDilemmas(isEduMode);

  for (const dilemma of dilemmas) {
    if (resolvedIds.has(dilemma.id)) continue;
    const [minAge, maxAge] = dilemma.triggerAgeRange;
    if (citizen.age >= minAge && citizen.age <= maxAge) {
      if (Math.random() < 0.45 || citizen.age === minAge + 2) {
        return dilemma;
      }
    }
  }
  return null;
}
