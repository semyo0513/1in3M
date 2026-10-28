// 진주시 시뮬레이션 엔진 및 수학적 모델
import { CitizenStatus, CohortPerson, DistrictInfo, DilemmaIssue, CityMacroIndicators, YearFocus, JobType } from '../types/game';
import { JINJU_DISTRICTS, JINJU_META } from '../data/jinjuData';
import { PERSONAL_EVENTS } from '../data/personalEvents';
import { JINJU_DILEMMAS } from '../data/dilemmas';

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

export function generateRandomBirth(birthYear: number = 2026): CitizenStatus {
  const district = pickDistrictByBirthWeight();
  const gender: '남성' | '여성' = Math.random() < 0.51 ? '남성' : '여성';
  
  // 소득 분위: 1~5분위 (해당 지역의 avgIncomeDecile을 중심으로 정규화)
  const baseDecile = Math.round(district.avgIncomeDecile + (Math.random() * 2 - 1));
  const incomeDecile = Math.max(1, Math.min(5, baseDecile));
  const monthlyIncomeWon = incomeDecile * 1100000 + Math.floor(Math.random() * 600000);

  return {
    name: '진주시민',
    age: 0,
    birthYear,
    currentYear: birthYear,
    district,
    gender,
    job: '청년 구직자',
    incomeDecile,
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

    // 80세 이상 사망 확률
    if (age > 78 && Math.random() < 0.08) {
      return {
        ...p,
        isAlive: false,
        statusText: `${age}세에 영면하였습니다.`
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

// 사망 확률 계산
export function checkMortality(citizen: CitizenStatus, cityIndicators: CityMacroIndicators): { willDie: boolean; cause?: string } {
  if (citizen.health <= 0) {
    return { willDie: true, cause: '건강 악화 및 복합 질환' };
  }

  // 기본 기대수명 (남: 80.8, 여: 86.9)
  const baseLife = citizen.gender === '남성' ? JINJU_META.lifeExpectancy.male : JINJU_META.lifeExpectancy.female;
  
  // 공공의료/복지 지표 보정 (-30 ~ +30): 공공복지가 높을수록 수명 연장
  const welfareBonus = (cityIndicators.welfare * -1) * 0.05; // welfare가 마이너스(공공복지)일수록 보너스
  const effectiveExpectedAge = baseLife + welfareBonus;

  if (citizen.age < 50) {
    // 50세 미만 사망 확률 극히 낮음 (0.05% ~ 0.2%)
    if (Math.random() < 0.001) {
      return { willDie: true, cause: '불의의 불의성 외인사 및 급성 질환' };
    }
    return { willDie: false };
  }

  if (citizen.age >= 50 && citizen.age < 70) {
    // 50~70세: 중증 질환 확률 (0.5% ~ 1.5%)
    const risk = 0.005 + (100 - citizen.health) * 0.0002;
    if (Math.random() < risk) {
      return { willDie: true, cause: pickDeathCause() };
    }
    return { willDie: false };
  }

  if (citizen.age >= 70) {
    // 70세 이상: 나이가 기대수명을 넘을수록 기하급수 증가
    const ageDiff = citizen.age - effectiveExpectedAge;
    const baseRisk = 0.03 + Math.max(0, ageDiff * 0.035);
    const healthRisk = (100 - citizen.health) * 0.002;
    const totalRisk = Math.min(0.85, baseRisk + healthRisk);

    if (Math.random() < totalRisk) {
      return { willDie: true, cause: pickDeathCause() };
    }
  }

  return { willDie: false };
}

function pickDeathCause(): string {
  const causes = JINJU_META.deathCauses;
  const rand = Math.random();
  let acc = 0;
  for (const c of causes) {
    acc += c.weight;
    if (rand < acc) return c.cause;
  }
  return '노환으로 인한 평온한 영면';
}

// 개인 인카운터 추첨
export function pickPersonalEvent(citizen: CitizenStatus, focus: YearFocus) {
  const eligible = PERSONAL_EVENTS.filter(e => {
    if (citizen.age < e.minAge || citizen.age > e.maxAge) return false;
    if (e.focusFilter && e.focusFilter !== focus) return Math.random() < 0.35; // 초점이 맞으면 우선순위
    return true;
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

// 딜레마 카드 발생 조건 검사
export function checkDilemmaTrigger(
  citizen: CitizenStatus,
  resolvedIds: Set<string>
): DilemmaIssue | null {
  for (const dilemma of JINJU_DILEMMAS) {
    if (resolvedIds.has(dilemma.id)) continue;
    const [minAge, maxAge] = dilemma.triggerAgeRange;
    if (citizen.age >= minAge && citizen.age <= maxAge) {
      // 1년에 1개 이하로 적절한 확률(약 45%)로 등장
      if (Math.random() < 0.45 || citizen.age === minAge + 2) {
        return dilemma;
      }
    }
  }
  return null;
}
