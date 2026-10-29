// 진주시 시뮬레이션 엔진 및 수학적 모델 (공공데이터 및 교육용 모드 필터 지원)
import { CitizenStatus, CohortPerson, DistrictInfo, DilemmaIssue, CityMacroIndicators, YearFocus, JobType } from '../types/game';
import { JINJU_DISTRICTS, JINJU_META, getEduIncomeDesc } from '../data/jinjuData';
import { PERSONAL_EVENTS } from '../data/personalEvents';
import { getDilemmas } from '../data/dilemmas';

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
  const monthlyIncomeWon = incomeDecile * 1100000 + Math.floor(Math.random() * 600000);
  const incomeDesc = getEduIncomeDesc(incomeDecile);

  return {
    name: isEduMode ? '진주 학생' : '진주시민',
    age: 0,
    birthYear,
    currentYear: birthYear,
    district,
    gender,
    job: '청년 구직자',
    incomeDecile,
    incomeDesc,
    monthlyIncomeWon,
    health: 90 + Math.floor(Math.random() * 10),
    happiness: 80 + Math.floor(Math.random() * 15),
    learning: 10 + Math.floor(Math.random() * 10),
    bonds: 75 + Math.floor(Math.random() * 15),
    temperament: {
      caution: Math.floor(Math.random() * 100),
      community: Math.floor(Math.random() * 100),
      optimism: Math.floor(Math.random() * 100)
    },
    isAlive: true,
    isRelocatedAway: false,
    flags: new Set<string>(),
    choicesHistory: [],
    pausedQuestionAnswers: []
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

export function pickPersonalEvent(citizen: CitizenStatus, focus: YearFocus, isEduMode: boolean = false) {
  const eligible = PERSONAL_EVENTS.filter(e => {
    if (citizen.age < e.minAge || citizen.age > e.maxAge) return false;
    // 교육용 모드에서는 음주/가계위기 등 민감 소재 이벤트 배제
    if (isEduMode && e.isSensitive) return false;
    if (e.focusFilter && e.focusFilter !== focus) return Math.random() < 0.35;
    return true;
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
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
