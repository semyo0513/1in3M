import { Achievement, CitizenStatus, CityMacroIndicators } from '../types/game';

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  // 1. 학업 & 입시
  {
    id: 'ach_snu_sky',
    title: '하늘을 찌르는 학구열',
    description: '서울대·연세대·고려대·KAIST·POSTECH 등 최상위 명문대에 합격했습니다.',
    category: 'ACADEMIC',
    iconEmoji: '🏛️'
  },
  {
    id: 'ach_gnu_pride',
    title: '진주의 긍지 경상국립대',
    description: '서부경남의 중심 경상국립대학교에 당당히 입학하여 청춘을 열었습니다.',
    category: 'ACADEMIC',
    iconEmoji: '🎓'
  },
  {
    id: 'ach_retry_victory',
    title: '칠전팔기 N수의 승리',
    description: '재수·삼수 이상의 혹독한 고난을 딛고 끝내 목표 대학에 합격했습니다.',
    category: 'ACADEMIC',
    iconEmoji: '🔥'
  },
  {
    id: 'ach_early_work',
    title: '청년 명장의 첫걸음',
    description: '대학 진학 대신 일찍이 산업 일선에 뛰어들어 경제적 자립을 이루었습니다.',
    category: 'ACADEMIC',
    iconEmoji: '🛠️'
  },

  // 2. 직업 & 커리어
  {
    id: 'ach_aerospace_hero',
    title: '우주항공의 주역',
    description: 'KAI·우주항공청 등 항공우주 방위산업의 핵심 연구원으로 활약했습니다.',
    category: 'CAREER',
    iconEmoji: '🚀'
  },
  {
    id: 'ach_medical_angel',
    title: '생명을 살리는 손길',
    description: '경상국립대병원 등 종합병원 의료 전문직으로 지역 보건에 헌신했습니다.',
    category: 'CAREER',
    iconEmoji: '🩺'
  },
  {
    id: 'ach_educator',
    title: '참스승의 길',
    description: '초·중·고 교사 및 교육전문직으로 수많은 진주의 제자들을 길러냈습니다.',
    category: 'CAREER',
    iconEmoji: '🏫'
  },
  {
    id: 'ach_it_innovator',
    title: '디지털 혁신가',
    description: 'IT·인공지능 소프트웨어 연구원으로 새로운 기술의 지평을 열었습니다.',
    category: 'CAREER',
    iconEmoji: '💻'
  },
  {
    id: 'ach_smart_farmer',
    title: '스마트 영농 명장',
    description: '진주 문산·수곡면 스마트팜 농업인으로 첨단 농업을 선도했습니다.',
    category: 'CAREER',
    iconEmoji: '🌱'
  },
  {
    id: 'ach_turnover_master',
    title: '제2의 인생 개척',
    description: '새로운 도전 끝에 성공적으로 직업군을 전향하고 이직을 완수했습니다.',
    category: 'CAREER',
    iconEmoji: '💼'
  },

  // 3. 자산 & 경제
  {
    id: 'ach_chungmugong_home',
    title: '혁신도시의 주춧돌',
    description: '진주 충무공동 혁신도시 신축 아파트를 자가로 마련하여 안정을 찾았습니다.',
    category: 'WEALTH',
    iconEmoji: '🏢'
  },
  {
    id: 'ach_billionaire_20eok',
    title: '자수성가 거부',
    description: '순자산 20억 원 이상을 달성하여 확고한 경제적 자유를 이루었습니다.',
    category: 'WEALTH',
    iconEmoji: '💰'
  },
  {
    id: 'ach_compound_investor',
    title: '복리의 마법사',
    description: '적립식 지수 투자와 우량주 장기 투자로 복리 자산을 형성했습니다.',
    category: 'WEALTH',
    iconEmoji: '📈'
  },
  {
    id: 'ach_debt_free',
    title: '무차입 경영',
    description: '가계 부채를 모두 갚고 온전한 무부채 순자산 상태를 완성했습니다.',
    category: 'WEALTH',
    iconEmoji: '✨'
  },

  // 4. 가족 & 동행
  {
    id: 'ach_golden_wedding',
    title: '백년가약 금혼식',
    description: '배우자와 35년 이상 서로의 곁을 지키며 아름다운 해로를 누렸습니다.',
    category: 'FAMILY',
    iconEmoji: '💍'
  },
  {
    id: 'ach_soul_pet',
    title: '영혼의 단짝',
    description: '소중한 반려동물을 입양하여 오랜 세월 가족처럼 따뜻하게 함께했습니다.',
    category: 'FAMILY',
    iconEmoji: '🐕'
  },
  {
    id: 'ach_child_success',
    title: '자랑스러운 어버이',
    description: '낳은 자녀를 온 정성으로 길러 대학에 진학시키고 독립시켰습니다.',
    category: 'FAMILY',
    iconEmoji: '👨‍👩‍👧'
  },

  // 5. 지역 & 진주 시민
  {
    id: 'ach_lantern_protector',
    title: '남강의 등불 지킴이',
    description: '남강유등축제 등 진주의 문화와 전통 가치를 지키는 선택을 내렸습니다.',
    category: 'LOCAL',
    iconEmoji: '🏮'
  },
  {
    id: 'ach_jinju_native',
    title: '남강의 영원한 벗',
    description: '평생 타지로 떠나지 않고 진주 땅에 굳건히 뿌리내려 살아왔습니다.',
    category: 'LOCAL',
    iconEmoji: '🏞️'
  },
  {
    id: 'ach_seoul_migrant',
    title: '상경 출향의 꿈',
    description: '수도권 서울로 진출하여 고향 진주를 마음에 품고 새로운 터전을 일궜습니다.',
    category: 'LOCAL',
    iconEmoji: '🚅'
  },

  // 6. 인생 & 웰빙
  {
    id: 'ach_centenarian',
    title: '남강의 장수 신화',
    description: '건강한 몸과 마음으로 85세 이상 장수를 평온하게 누렸습니다.',
    category: 'LIFE',
    iconEmoji: '🕊️'
  },
  {
    id: 'ach_optimist',
    title: '햇살 같은 긍정',
    description: '행복 지표 90점 이상을 달성하여 충만한 기쁨의 삶을 살았습니다.',
    category: 'LIFE',
    iconEmoji: '😊'
  },
  {
    id: 'ach_scholar',
    title: '배움의 현자',
    description: '배움 지표 90점 이상을 달성하여 평생 호기심과 지식을 간직했습니다.',
    category: 'LIFE',
    iconEmoji: '📚'
  },
  {
    id: 'ach_deep_bonds',
    title: '남강처럼 넓은 품',
    description: '유대 지표 90점 이상을 달성하여 이웃과 사회에 깊은 사랑을 베풀었습니다.',
    category: 'LIFE',
    iconEmoji: '🤝'
  }
];

// 현재 시민 상태에서 달성된 업적 목록 판정 함수
export function evaluateAchievements(
  citizen: CitizenStatus,
  cityIndicators: CityMacroIndicators,
  alreadyUnlockedIds: Set<string> = new Set()
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !alreadyUnlockedIds.has(id)) {
      const def = MASTER_ACHIEVEMENTS.find(a => a.id === id);
      if (def) {
        newlyUnlocked.push({
          ...def,
          unlockedAt: { year: citizen.currentYear, age: citizen.age }
        });
      }
    }
  };

  // 1. 학업
  const cName = citizen.collegeName || '';
  check('ach_snu_sky', ['서울대', '연세', '고려', 'KAIST', '포항공', '한국과학기술원'].some(k => cName.includes(k)));
  check('ach_gnu_pride', cName.includes('경상국립대'));
  check('ach_retry_victory', Boolean(citizen.collegeName && (citizen.collegeRetryCount || 0) >= 1));
  check('ach_early_work', Boolean(citizen.flags?.has('EARLY_LOCAL_CAREER')));

  // 2. 직업
  const j = citizen.jobTitle || citizen.job || '';
  check('ach_aerospace_hero', j.includes('항공') || j.includes('우주') || j.includes('KAI'));
  check('ach_medical_angel', j.includes('의료') || j.includes('간호') || j.includes('병원'));
  check('ach_educator', j.includes('교사') || j.includes('교육'));
  check('ach_it_innovator', j.includes('소프트웨어') || j.includes('IT') || j.includes('인공지능'));
  check('ach_smart_farmer', j.includes('스마트팜') || j.includes('원예') || citizen.job === '시설원예 스마트팜 농업인');
  check('ach_turnover_master', Boolean(citizen.flags?.has('CAREER_CHOSEN') && citizen.choicesHistory.some(c => c.issueTitle.includes('이직') || c.issueTitle.includes('커리어 전향'))));

  // 3. 자산
  check('ach_chungmugong_home', Boolean(citizen.flags?.has('HOME_OWNER_CHUNGMUGONG')));
  check('ach_billionaire_20eok', citizen.netWorthWon >= 2000000000);
  check('ach_compound_investor', Boolean(citizen.flags?.has('COMPOUND_INVESTOR')));
  check('ach_debt_free', citizen.age >= 40 && citizen.totalDebtWon === 0 && citizen.netWorthWon >= 300000000);

  // 4. 가족
  check('ach_golden_wedding', Boolean(citizen.spouse && !citizen.spouse.passedAway && citizen.spouse.yearsTogether >= 35));
  check('ach_soul_pet', Boolean(citizen.pet && (citizen.age - citizen.pet.adoptedAge) >= 10));
  check('ach_child_success', Boolean(citizen.childrenList?.some(c => c.collegeName || (c.milestoneSeen?.includes(19)))));

  // 5. 지역
  check('ach_lantern_protector', citizen.choicesHistory.some(c => c.issueTitle.includes('유등축제') && (c.stance.includes('전통') || c.stance.includes('무료') || c.stance.includes('상생'))));
  check('ach_jinju_native', citizen.age >= 60 && !citizen.isRelocatedAway);
  check('ach_seoul_migrant', citizen.isRelocatedAway);

  // 6. 인생
  check('ach_centenarian', citizen.age >= 85);
  check('ach_optimist', citizen.happiness >= 90);
  check('ach_scholar', citizen.learning >= 90);
  check('ach_deep_bonds', citizen.bonds >= 90);

  return newlyUnlocked;
}
