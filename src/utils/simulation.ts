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

// 한국형 생애 스트레스 곡선 연령별 연간 자연 변화량 D(a) (통계청 생명표 및 신체 발달 데이터 반영)
export function getAgeStressDelta(age: number): {
  health: number;
  happiness: number;
  learning: number;
  bonds: number;
} {
  // 0~12세 (유소년기): 신체 발달, 면역력 증가, 호기심과 배움 활발
  if (age <= 12) return { health: 0.8, happiness: 0.2, learning: 1.5, bonds: 0.5 };
  // 13~18세 (청소년기): 학업/입시 스트레스, 그러나 신체적 기초 체력과 세포 회복력 우수
  if (age <= 18) return { health: 0.2, happiness: -1.0, learning: 2.0, bonds: 0.0 };
  // 19~29세 (청년기): 신체적 최전성기, 취업/진로 고민
  if (age <= 29) return { health: 0.0, happiness: -0.6, learning: 0.5, bonds: -0.2 };
  // 30~44세 (청장년기): 직장 생활과 사회 적응, 업무 지식 및 실무 능력 축적
  if (age <= 44) return { health: -0.5, happiness: -0.3, learning: 0.2, bonds: 0.0 };
  // 45~59세 (중년기): 직무 전문성 정점, 인생의 연륜과 성숙한 유대
  if (age <= 59) return { health: -1.2, happiness: -0.4, learning: 0.2, bonds: 0.1 };
  // 60~74세 (전기 노년기): 은퇴 후 여가, 손주, 복지관/동호회 교류 활성화 (결정성 지능 유지)
  if (age <= 74) return { health: -2.0, happiness: -0.2, learning: -0.1, bonds: 0.2 };
  // 75세 이상 (후기 노년기): 고령에 따른 신체 쇠약과 친구들의 사별로 인한 완만한 감퇴
  return { health: -3.0, happiness: -0.6, learning: -0.3, bonds: -0.4 };
}

// 연간 삶의 초점(Focus) 선택 시 기회비용(Trade-off) 매트릭스
export function getFocusDeltas(focus: YearFocus): {
  health: number;
  happiness: number;
  learning: number;
  bonds: number;
} {
  switch (focus) {
    case 'learning':
      // 배움: 지식 습득, 학업 및 전문 자격증 성취
      return { learning: 5.5, health: -0.2, bonds: -0.4, happiness: 0.5 };
    case 'work':
      // 일: 직무 숙련 및 경력 개발 (실무 배움 축적), 업무 피로 (-0.9), 여가 감소
      return { learning: 2.0, health: -0.9, happiness: -1.0, bonds: -0.4 };
    case 'relationship':
      // 사람·가족: 정서적 안정 및 유대감 대폭 강화 (배움 지식은 소멸하지 않음)
      return { bonds: 5.5, happiness: 3.5, learning: 0.0, health: 0.3 };
    case 'health':
      // 몸과 마음: 운동, 휴식, 치료로 건강 대폭 회복
      return { health: 6.5, happiness: 3.5, learning: 0.0, bonds: 0.2 };
    case 'change':
      // 취미·여가: 활력과 행복 증진, 새로운 세상 경험
      return { happiness: 5.5, learning: 1.5, health: 0.5, bonds: 0.0 };
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
    // 통계청 신생아 건강 기준선: 한국의 영아 의료체계 반영 (85~96)
    health: Math.round(Math.max(80, Math.min(98, 88 + randNormal(0, 3)))),
    happiness: Math.round(Math.max(50, Math.min(85, 65 + 2 * (incomeDecile - 3) + randNormal(0, 4)))),
    learning: Math.round(Math.max(40, Math.min(75, 55 + 2 * (incomeDecile - 3) + randNormal(0, 4)))),
    bonds: Math.round(Math.max(50, Math.min(85, 68 + 2 * (incomeDecile - 3) + randNormal(0, 4)))),
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

  // 4. 월소득 및 순자산 (저축 누적, 부동산 자산 상승, 복리 투자, 연금 체계)
  let monthlyIncomeWon = 0;
  if (nextAge < 8) monthlyIncomeWon = 0;
  else if (nextAge <= 13) monthlyIncomeWon = 30000;
  else if (nextAge <= 16) monthlyIncomeWon = 70000;
  else if (nextAge <= 19) monthlyIncomeWon = 150000;
  else if (nextAge <= 24) monthlyIncomeWon = education.includes('대학교') ? 450000 : 2100000;
  else if (nextAge <= 34) monthlyIncomeWon = prev.incomeDecile * 700000 + 2000000;
  else if (nextAge <= 44) monthlyIncomeWon = prev.incomeDecile * 950000 + 2600000;
  else if (nextAge <= 58) monthlyIncomeWon = prev.incomeDecile * 1150000 + 3200000;
  else if (nextAge <= 64) monthlyIncomeWon = prev.incomeDecile * 850000 + 2400000;
  else {
    // 65세 이상 기본 국민연금
    let pension = prev.incomeDecile * 280000 + 1400000;
    // 개인형 IRP/퇴직연금 추가 수령
    if (prev.flags?.has('SOLID_PENSION') || prev.flags?.has('BALANCED_RETIREMENT')) {
      pension += 800000;
    }
    // 주택연금 종신 수령 추가
    if (prev.flags?.has('REVERSE_MORTGAGE')) {
      pension += 1500000;
    }
    monthlyIncomeWon = pension;
  }

  // 부업/배당 등 현금흐름 추가
  if (prev.flags?.has('LOCAL_ENTREPRENEUR') && nextAge <= 64) {
    monthlyIncomeWon += 700000;
  }
  if (prev.flags?.has('DIVIDEND_CASHFLOW')) {
    monthlyIncomeWon += 400000;
  }

  let netWorthWon = prev.netWorthWon || 500000;
  if (nextAge < 20) {
    netWorthWon += Math.floor(monthlyIncomeWon * 12 * 0.4);
  } else if (nextAge <= 64) {
    const saveRate = focus === 'work' ? 0.38 : (focus === 'learning' ? 0.22 : 0.28);
    const yearlySavings = Math.floor(monthlyIncomeWon * 12 * saveRate);
    netWorthWon += yearlySavings;

    // 부동산 보유 시 매년 인플레이션 및 도시 성장(혁신도시/초전/평거) 자산 가치 상승 (연 2.4%)
    if (prev.flags?.has('HOME_OWNER_CHUNGMUGONG') || prev.flags?.has('HOME_OWNER_CHOJEON') || prev.flags?.has('WEALTH_EXPANDED')) {
      const propertyGrowth = Math.floor(netWorthWon * 0.024);
      netWorthWon += propertyGrowth;
    }

    // 복리 투자자(ETF/우량주 적립식) 장기 복리 수익 (연 3.5%)
    if (prev.flags?.has('COMPOUND_INVESTOR')) {
      const investGain = Math.floor(netWorthWon * 0.035);
      netWorthWon += investGain;
    }
  } else {
    // 은퇴 후: 주택연금/개인연금이 있으면 자산 보전, 없으면 완만한 생활비 소진
    if (prev.flags?.has('REVERSE_MORTGAGE') || prev.flags?.has('SOLID_PENSION')) {
      netWorthWon = Math.max(60000000, netWorthWon);
    } else {
      netWorthWon = Math.max(30000000, netWorthWon - 2500000);
    }
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

    // 통계청 고령기 사망 확률 반영 (75세 이상부터 점진적 자연 영면)
    if (age >= 75 && age < 85 && Math.random() < 0.035) {
      return {
        ...p,
        isAlive: false,
        statusText: `${age}세에 가족들의 배웅 속에 평온하게 영면하였습니다.`
      };
    }
    if (age >= 85 && Math.random() < 0.12) {
      return {
        ...p,
        isAlive: false,
        statusText: `${age}세에 천수를 누리고 평온하게 영면하였습니다.`
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
  // 1. 교육용 모드에서는 학생 정서 보호 및 교육적 취지를 위해 만 65세 이전 돌연사 완전 차단
  if (isEduMode && citizen.age < 65) {
    return { willDie: false };
  }

  // 2. 만 60세 이상에서 건강이 0 이하로 완전히 소진된 경우 노환/만성 쇠약 영면 판정
  if (citizen.age >= 60 && citizen.health <= 0) {
    return { willDie: true, cause: isEduMode ? '자연스러운 건강 쇠약으로 인한 평온한 영면' : '만성 복합 질환 및 건강 쇠약' };
  }

  const baseLife = citizen.gender === '남성' ? JINJU_META.lifeExpectancy.male : JINJU_META.lifeExpectancy.female;
  const welfareBonus = (cityIndicators.welfare * -1) * 0.05;
  const effectiveExpectedAge = baseLife + welfareBonus;

  // 통계청 연령별 실제 연간 사망확률 (qx)
  let baseDeathRate = 0;

  if (citizen.age < 15) {
    // 0~14세 소아/청소년 사망률: 10만명당 약 10명 (0.01%)
    baseDeathRate = 0.00010;
  } else if (citizen.age < 30) {
    // 15~29세 청년기 사망률: 10만명당 약 38명 (0.038%) - 주로 불의의 교통사고/외인사
    baseDeathRate = 0.00038;
  } else if (citizen.age < 50) {
    // 30~49세 청장년기 사망률: 10만명당 약 120명 (0.12%)
    baseDeathRate = 0.00120;
  } else if (citizen.age < 65) {
    // 50~64세 중장년기 사망률: 1,000명당 약 4.5명 (0.45%)
    baseDeathRate = 0.00450;
  } else if (citizen.age < 75) {
    // 65~74세 전기 고령기 사망률: 100명당 약 1.8명 (1.8%)
    baseDeathRate = 0.01800;
  } else if (citizen.age < 85) {
    // 75~84세 후기 고령기 사망률: 100명당 약 5.5명 (5.5%) + 기대수명 초과분
    const ageDiff = Math.max(0, citizen.age - effectiveExpectedAge);
    baseDeathRate = 0.05500 + ageDiff * 0.030;
  } else {
    // 85세 이상 초고령기 사망률: 약 12% 이상 + 급증
    const ageDiff = citizen.age - effectiveExpectedAge;
    baseDeathRate = 0.12000 + Math.max(0, ageDiff * 0.040);
  }

  // 건강 점수에 따른 위험도 보정:
  // 50세 이전에는 건강 점수가 사망에 미치는 영향이 극히 제한적(응급의료 체계 및 자연 회복력),
  // 50세 이후부터 만성질환 취약도로 작용
  let healthRiskMultiplier = 1.0;
  if (citizen.age >= 50) {
    if (citizen.health < 40) {
      healthRiskMultiplier = 1.0 + (40 - citizen.health) * 0.025; // 저건강 시 위험도 완만한 증가
    } else if (citizen.health > 70) {
      healthRiskMultiplier = 0.75; // 장수 보너스
    }
  }

  const finalRisk = Math.min(0.85, baseDeathRate * healthRiskMultiplier);

  if (Math.random() < finalRisk) {
    return { willDie: true, cause: pickDeathCause(citizen.age, isEduMode) };
  }

  return { willDie: false };
}

function pickDeathCause(age: number = 70, isEduMode: boolean = false): string {
  // 청년기(40세 미만) 불의의 사고/급성 사망
  if (age < 40) {
    return isEduMode ? '불의의 교통안전 사고' : '불의의 교통사고 및 외인사';
  }

  // 교육용 모드일 때는 자살(eduModeExclude: true) 완전 제외
  let causes = isEduMode 
    ? JINJU_META.deathCauses.filter(c => !c.eduModeExclude)
    : JINJU_META.deathCauses;

  // 60세 미만에서는 치매나 노환(C07, C99) 제외
  if (age < 60) {
    causes = causes.filter(c => c.code !== 'C07' && c.code !== 'C99');
  }

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
