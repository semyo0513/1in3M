// 대한민국 표본 통계 기반 생애 다지선다 의사결정 (Life_Choices) 데이터 풀
// 통계청, 교육부, 고용노동부, 질병관리청 국가공인통계 실증 팩트 반영

import { LifeChoiceCard } from '../types/game';

export const LIFE_CHOICES: LifeChoiceCard[] = [
  // =========================================================================
  // 1. 청년 유출 (1차: 19세 대학 진학 갈림길)
  // =========================================================================
  {
    choiceCardId: 'LC-MIG-STAGE1-19',
    category: 'YOUTH_MIGRATION',
    categoryName: '지역 청년 유출 (1차)',
    title: '19세 대학 진학의 갈림길',
    ageRange: [19, 19],
    body: '고등학교를 졸업하며 진로를 결정할 순간이 찾아왔습니다. 진주 지역 대학에 진학하여 지역에 남을지, 높은 주거비와 생활비를 감수하더라도 서울·수도권이나 인근 광역시로 유학을 떠날지 선택해야 합니다.',
    statContextFact: '동남지방통계청 인구이동통계에 따르면, 비수도권 청년의 첫 번째 대규모 유출은 만 19세 대학 진학 시점에 발생하며, 수도권 유학 시 주거비·생활비로 연평균 1,200만~1,800만 원의 가계 부담이 발생합니다.',
    options: [
      {
        optionId: 'OPT_STAY_GNU',
        label: '경상국립대·진주교대 등 지역 국립대에 진학하여 진주에 남는다',
        effects: {
          learning: 6,
          happiness: 4,
          health: 2,
          bonds: 8,
          spend: 1 // 주거비 절감
        },
        grantFlag: 'COLLEGE_LOCAL_GNU',
        consequenceText: '등록금이 저렴하고 통학이 수월해 가족의 경제적 부담을 덜었습니다. 오랜 친구들과 남강변 캠퍼스 낭만을 누립니다.'
      },
      {
        optionId: 'OPT_LEAVE_SEOUL_COLLEGE',
        label: '원룸 월세와 생활비 부담을 감수하고 서울·수도권 4년제 대학으로 상경한다',
        conditions: { learningMin: 50 },
        effects: {
          learning: 9,
          happiness: -2,
          health: -4,
          bonds: -6,
          spend: -3 // 막대한 주거/생활비 지출
        },
        grantFlag: 'MIGRATED_SEOUL_COLLEGE',
        consequenceText: '서울 신촌·혜화동 좁은 원룸에서 자취를 시작했습니다. 수도권의 다양한 문화와 인프라를 누리지만 숨 가쁜 생활비 압박이 시작됩니다.'
      },
      {
        optionId: 'OPT_LOCAL_TECH_JOB',
        label: '연암공대 등 직업기술대학 진학 또는 상평·정촌 산단으로 조기 취업한다',
        effects: {
          learning: 4,
          happiness: 2,
          health: -1,
          bonds: 5,
          incomeChange: 1,
          spend: 1
        },
        grantFlag: 'EARLY_LOCAL_CAREER',
        consequenceText: '실용적인 기술을 익혀 남들보다 빠르게 경제적 자립을 시작했습니다. 첫 급여를 받아 부모님께 내의를 선물합니다.'
      }
    ]
  },

  // =========================================================================
  // 2. 청년 유출 (2차: 25~28세 첫 직장 구직 갈림길)
  // =========================================================================
  {
    choiceCardId: 'LC-MIG-STAGE2-26',
    category: 'YOUTH_MIGRATION',
    categoryName: '지역 청년 유출 (2차)',
    title: '청년 구직과 정주 갈림길',
    ageRange: [25, 28],
    body: '대학 졸업과 본격적인 구직 시기가 찾아왔습니다. 진주에 남아 혁신도시 공공기관이나 지역 기업에 취업할지, 더 넓은 기회를 찾아 서울·수도권이나 창원·부산 등 대도시로 떠날지 결정해야 합니다.',
    statContextFact: '동남지방통계청 청년인구이동 통계에 따르면, 진주 등 비수도권 청년의 2차 유출은 25~28세(첫 직장 진입)에 집중되며, 주요 사유의 71.4%가 "양질의 일자리 부족"입니다.',
    options: [
      {
        optionId: 'STAY_INNOVATION_PUBLIC',
        label: '진주 혁신도시 공공기관(지역인재 전형) 및 공무원 시험에 도전한다',
        conditions: { learningMin: 55 },
        effects: {
          learning: 5,
          happiness: -3,
          health: -3,
          bonds: 2,
          spend: -1
        },
        grantFlag: 'JOB_PUBLIC_CORP_CANDIDATE',
        consequenceText: '충무공동 도서관과 스터디 카페를 오가며 지역인재 가산점을 노리고 NCS와 공기업 전공 필기를 준비합니다.'
      },
      {
        optionId: 'STAY_LOCAL_SME_IND',
        label: '정촌·사봉 항공산단 제조기업이나 진주 시내 보건·서비스 직종에 바로 취업한다',
        effects: {
          learning: 2,
          happiness: 3,
          health: -2,
          bonds: 6,
          incomeChange: 1,
          spend: 1
        },
        grantFlag: 'JOB_LOCAL_SME',
        consequenceText: '고향 진주에서 곧바로 사회인으로 자립했습니다. 익숙한 동네와 가족 곁에서 안정적인 첫 발걸음을 뗍니다.'
      },
      {
        optionId: 'LEAVE_SEOUL_METRO',
        label: '높은 월세와 지옥철 통근을 감수하더라도 서울·판교 수도권 기업으로 상경한다',
        effects: {
          learning: 7,
          happiness: -2,
          health: -5,
          bonds: -7,
          incomeChange: 1,
          spend: -3
        },
        grantFlag: 'MIGRATED_OUT_SEOUL',
        consequenceText: '서울 가산디지털단지 인근 원룸에 짐을 풀었습니다. 높은 주거비와 만원 지하철에 지치지만 거대한 커리어 기회를 체감합니다.'
      }
    ]
  },

  // =========================================================================
  // 3. 병역 의무 (남성 20~21세)
  // =========================================================================
  {
    choiceCardId: 'LC-MIL-MALE-20',
    category: 'MILITARY_DUTY',
    categoryName: '의무 병역 이행',
    title: '대한민국 청년의 병역 의무',
    ageRange: [20, 21],
    genderFilter: '남성',
    body: '병무청으로부터 입영통지서가 날아왔습니다. 진주 금산면에 위치한 공군교육사령부나 육군 현역으로 복무할지, 복무 방식을 고민합니다.',
    statContextFact: '병무청 통계에 따르면 대한민국 20대 초반 남성의 현역 입영률은 85% 이상이며, 18~21개월의 복무 기간 동안 학업과 사회 진입이 약 2년간 유예됩니다.',
    options: [
      {
        optionId: 'MIL_AIRFORCE_JINJU',
        label: '진주 금산면 공군교육사령부로 입대하여 공군 특기병으로 복무한다',
        effects: {
          health: 4,
          happiness: -4,
          learning: 2,
          bonds: 3,
          spend: 0
        },
        grantFlag: 'MILITARY_COMPLETED_AIRFORCE',
        consequenceText: '고향 진주 금산면 교육사에서 훈련을 마치고 성실히 국방의 의무를 다했습니다. 규칙적인 생활로 체력이 단련되었습니다.'
      },
      {
        optionId: 'MIL_ARMY_ACTIVE',
        label: '육군 현역으로 전방 부대에 입대하여 가장 빠르게 만기 전역한다',
        effects: {
          health: 5,
          happiness: -5,
          learning: -1,
          bonds: 2,
          spend: 0
        },
        grantFlag: 'MILITARY_COMPLETED_ARMY',
        consequenceText: '혹한기 훈련과 전방 경계 근무를 거쳐 당당한 예비역 병장이 되었습니다. 전우들과 평생 잊지 못할 추억을 쌓았습니다.'
      },
      {
        optionId: 'MIL_TECH_DELAY',
        label: '기사 자격증 취득 및 산업기능요원(방위산업체) 복무를 목표로 입대를 1년 미룬다',
        conditions: { learningMin: 45 },
        effects: {
          learning: 6,
          happiness: -3,
          health: -2,
          bonds: -1,
          spend: -1
        },
        grantFlag: 'MILITARY_POSTPONED',
        consequenceText: '자격증 취득에 몰두하며 산단 병역특례를 준비합니다. 주변 친구들의 입대 소식에 마음 한구석이 초조해집니다.'
      }
    ]
  },

  // =========================================================================
  // 4. 결혼과 파트너십 (28~36세, 만혼 현실과 지역 여건)
  // =========================================================================
  {
    choiceCardId: 'LC-MAR-DECIDE-31',
    category: 'MARRIAGE',
    categoryName: '결혼과 파트너십',
    title: '만혼 시대의 결혼과 주거 선택',
    ageRange: [28, 36],
    excludeFlags: ['MARRIED', 'DECLARED_SINGLE'],
    body: '주변 동기들과 친구들의 청첩장이 쏟아지는 나이. 평균 초혼 연령(남 34세, 여 32세)을 전후하여 당신의 삶을 함께할 파트너십과 주거 형태를 결정해야 합니다.',
    statContextFact: '통계청 인구동향조사 기준 평균 초혼 연령은 남성 34.0세, 여성 31.6세이며, 미혼 남녀가 결혼을 망설이는 가장 큰 이유는 "결혼 자금(주거비) 부족(31.3%)"과 "고용 불안정(22.1%)"입니다.',
    options: [
      {
        optionId: 'MAR-01',
        label: '가치관·취미가 통하는 파트너와 실속형 작은 결혼식을 올린다 (전세대출 출발)',
        effects: {
          happiness: 12,
          bonds: 14,
          health: 0,
          learning: -1,
          spend: -1
        },
        grantFlag: 'MARRIED_VALUE_PARTNER',
        consequenceText: '허례허식을 줄이고 남강변 전세 아파트에서 소박하게 신혼을 시작했습니다. 함께 저녁을 먹고 산책하는 일상의 기쁨이 큽니다.'
      },
      {
        optionId: 'MAR-02',
        label: '진주 지역 내 안정적 직장(공공기관·교직·전문직) 파트너와 맞벌이 결혼을 한다',
        conditions: { bondsMin: 40 },
        effects: {
          happiness: 6,
          bonds: 10,
          health: -2,
          learning: 0,
          incomeChange: 2,
          spend: 1 // 맞벌이 가구 소득 합산 효과
        },
        grantFlag: 'MARRIED_DUAL_INCOME',
        consequenceText: '부부 합산 소득이 늘어나 신혼부부 특별공급 청약과 내 집 마련에 한결 자신감이 붙었습니다. 양가 명절 조율이 새로운 과제입니다.'
      },
      {
        optionId: 'MAR-03',
        label: '타 지역(창원·부산·수도권) 직장인 파트너와 결혼하여 주말부부를 이어간다',
        effects: {
          happiness: 3,
          bonds: 6,
          health: -6,
          learning: 0,
          spend: -2 // 왕복 KTX/고속버스비 발생
        },
        grantFlag: 'MARRIED_WEEKEND_COUPLE',
        consequenceText: '금요일 밤 진주역에서 만나고 일요일 밤 헤어지는 주말부부 생활이 시작되었습니다. 각자의 커리어는 지켰지만 왕복 피로가 누적됩니다.'
      },
      {
        optionId: 'MAR-04',
        label: '비혼을 선언하고 1인 가구로서의 커리어와 취미, 반려동물과의 삶에 집중한다',
        effects: {
          happiness: 7,
          learning: 8,
          health: 2,
          bonds: -3,
          spend: 0
        },
        grantFlag: 'DECLARED_SINGLE',
        consequenceText: '온전한 내 시간과 가처분 소득을 확보했습니다. 남들의 시선에 얽매이지 않고 나만의 취향과 재무 계획을 세워나갑니다.'
      },
      {
        optionId: 'MAR-05',
        label: '주거 자금과 마음의 여유가 부족해 결혼 결정을 2~3년 더 미룬다',
        effects: {
          happiness: -3,
          bonds: -2,
          learning: 1,
          health: 0,
          spend: 0
        },
        grantFlag: 'POSTPONED_MARRIAGE',
        consequenceText: '명절 때마다 "결혼은 언제 하냐"는 어른들의 성화에 스트레스를 받지만, 아직은 통장 잔고와 커리어가 먼저입니다.'
      }
    ]
  },

  // =========================================================================
  // 5. 출산과 돌봄 (30~40세, 직장 규모별 육아 양극화)
  // =========================================================================
  {
    choiceCardId: 'LC-CHILD-DECIDE-32',
    category: 'CHILDCARE',
    categoryName: '출산과 자녀 계획',
    title: '자녀 출산과 가족 구성의 선택',
    ageRange: [30, 38],
    requireFlags: ['MARRIED_VALUE_PARTNER', 'MARRIED_DUAL_INCOME', 'MARRIED_WEEKEND_COUPLE'],
    excludeFlags: ['HAS_CHILDREN', 'DECLARED_DINK'],
    body: '결혼 후 안정적인 보금자리를 꾸린 부부. 아이를 낳을 것인지, 낳는다면 몇 명을 키울 것인지 인생의 중대한 선택을 앞두고 있습니다.',
    statContextFact: '대한민국 합계출산율은 0.7명대(OECD 최하위)이며, 무자녀 딩크족의 주요 선택 사유는 "경제적 양육비 부담(43.8%)"과 "일·가정 양립의 어려움(28.5%)"입니다.',
    options: [
      {
        optionId: 'CHILD_NONE_DINK',
        label: '무자녀(딩크)를 선택하고 부부 두 사람의 삶과 재정 안정에 집중한다',
        effects: {
          happiness: 5,
          health: 3,
          bonds: 4,
          learning: 2,
          spend: 1
        },
        grantFlag: 'DECLARED_DINK',
        consequenceText: '부부만의 여유로운 주말과 해외여행, 가처분 소득을 유지합니다. 40대 사교육비와 육아 번아웃 걱정에서 자유롭습니다.'
      },
      {
        optionId: 'CHILD_ONE_FOCUS',
        label: '자녀 1명을 낳아 온 사랑과 현실적 여력을 집중해 키운다',
        effects: {
          happiness: 9,
          bonds: 16,
          health: -6,
          learning: -2,
          spend: -2
        },
        grantFlag: 'HAS_CHILDREN',
        consequenceText: '작고 소중한 첫 아이가 태어났습니다. 밤잠을 설치며 기저귀를 갈지만 배냇짓 한 번에 온 세상의 피로가 녹아내립니다.'
      },
      {
        optionId: 'CHILD_MULTI_BLESSING',
        label: '다자녀(2명 이상)를 계획하여 복작복작한 온기를 품은 가정을 만든다',
        effects: {
          happiness: 12,
          bonds: 24,
          health: -12,
          learning: -5,
          spend: -3 // 지출 가중
        },
        grantFlag: 'HAS_CHILDREN',
        consequenceText: '아이들의 웃음소리로 집안이 늘 북적입니다. 진주시 다자녀 출산지원금 혜택을 받지만 식비와 양육비 지출이 껑충 뜁니다.'
      }
    ]
  },
  {
    choiceCardId: 'LC-CHILDCARE-DUAL-33',
    category: 'CHILDCARE',
    categoryName: '영유아 돌봄 분기',
    title: '출산 후 일·가정 양립의 현실',
    ageRange: [31, 39],
    requireFlags: ['HAS_CHILDREN'],
    excludeFlags: ['CHILDCARE_WAY_RESOLVED'],
    body: '출산휴가가 끝나가고 복직의 날이 다가옵니다. 맞벌이를 유지하며 아이를 어떻게 돌볼지, 직장 규모와 가계 상황에 맞는 현실적인 선택을 해야 합니다.',
    statContextFact: '고용노동부 일·가정 양립 실태조사에 따르면, 공공기관·대기업의 육아휴직 사용률은 70%를 웃도는 반면, 30인 미만 중소기업 및 자영업자는 대체인력 부족과 소득 단절로 사용률이 20%대에 불과합니다.',
    options: [
      {
        optionId: 'CARE_PARENTAL_LEAVE',
        label: '법정 육아휴직 1년을 당당히 사용하고 안정적으로 복직한다 (공공기관·대기업형)',
        effects: {
          bonds: 12,
          happiness: 6,
          health: 1,
          learning: -2,
          spend: -1
        },
        grantFlag: 'CHILDCARE_WAY_RESOLVED',
        consequenceText: '육아휴직급여를 수령하며 아이의 첫 걸음마를 온전히 함께 지켜보았습니다. 경력 단절 없이 1년 후 본 직무로 복귀했습니다.'
      },
      {
        optionId: 'CARE_GRANDPARENTS',
        label: '진주 시내에 계신 양가 부모님께 매달 양육비를 드리고 황혼육아 지원을 받는다',
        effects: {
          bonds: 5,
          happiness: -2,
          health: -1,
          learning: 0,
          spend: -2
        },
        grantFlag: 'CHILDCARE_WAY_RESOLVED',
        consequenceText: '부부의 직장 경력을 지켜냈지만, 연로하신 부모님의 관절 통증과 육아 방식 차이로 인한 소소한 갈등이 찾아옵니다.'
      },
      {
        optionId: 'CARE_FULLDAY_BURN',
        label: '어린이집 종일반에 보내고 아이가 아플 때마다 연차 눈치를 보며 버틴다',
        effects: {
          bonds: -2,
          happiness: -7,
          health: -9,
          learning: -3,
          spend: -1
        },
        grantFlag: 'CHILDCARE_WAY_RESOLVED',
        consequenceText: '퇴근 시간마다 헐레벌떡 어린이집으로 달립니다. 야근과 등하원 전쟁 속에서 부부의 만성 피로와 번아웃이 깊어집니다.'
      },
      {
        optionId: 'CARE_CAREER_BREAK',
        label: '육아휴직을 쓸 수 없는 직장 여건상 부부 중 한 명이 퇴사하고 전업 육아를 맡는다',
        effects: {
          bonds: 9,
          happiness: -4,
          health: 2,
          learning: -6,
          incomeChange: -2,
          spend: -2
        },
        grantFlag: 'CHILDCARE_WAY_RESOLVED',
        consequenceText: '가정의 돌봄은 안정되었지만 외벌이로 줄어든 수입에 허리띠를 졸라맵니다. 경력 단절에 대한 불안감이 마음 한편에 남습니다.'
      }
    ]
  },

  // =========================================================================
  // 6. 가계 소비와 3대 고정비 (30대 주거비 / 40대 사교육비 / 소비 기조)
  // =========================================================================
  {
    choiceCardId: 'LC-SPEND-HOUSING-34',
    category: 'SPEND',
    categoryName: '30대 구조적 주거비',
    title: '내 집 마련과 대출의 갈림길',
    ageRange: [33, 39],
    body: '전세 만기 시점이 다가오며 주거 안정을 위한 큰 결단이 필요합니다. 대출을 얼마나 일으켜 어디에 보금자리를 잡을 것인가요?',
    statContextFact: '통계청 가계금융복지조사 기준 30대 가구의 연소득 대비 원리금 상환 비율(DSR)은 평균 24.6%에 달하며, 무리한 영끌 매수 가구는 금리 인상 시 가계 부채 부실 위험에 직면합니다.',
    options: [
      {
        optionId: 'HOUSE_RENT_DEFENSIVE',
        label: '원도심·면 지역 노후 주택 또는 공공임대 아파트에 거주하며 저축 여력을 지킨다',
        effects: {
          happiness: -3,
          health: 1,
          bonds: 1,
          spend: 2 // 주거비 최소화
        },
        grantFlag: 'HOUSING_DEFENSIVE',
        consequenceText: '대출 이자 부담이 없어 통장 잔고는 안전하지만, 좁은 주차 공간과 노후 배관으로 일상적 불편을 겪습니다.'
      },
      {
        optionId: 'HOUSE_MID_STABLE',
        label: '평거·신안·가좌동 구축 아파트를 적정 담보대출로 매수하여 안정적으로 정착한다',
        effects: {
          happiness: 4,
          health: 0,
          bonds: 3,
          spend: -1
        },
        grantFlag: 'HOUSING_STABLE',
        consequenceText: '가처분 소득의 25%를 원리금으로 성실히 상환하며 남강 둔치 산책로와 학군 인프라를 무난하게 누립니다.'
      },
      {
        optionId: 'HOUSE_INNOVATION_OVERLEVERAGE',
        label: '혁신도시·초전동 신축 브랜드 아파트를 영끌 대출로 분양받아 프리미엄을 노린다',
        effects: {
          happiness: 9,
          health: -3,
          bonds: 2,
          spend: -3 // 고비용 지출 플래그
        },
        grantFlag: 'HOUSING_OVERLEVERAGED',
        consequenceText: '호화로운 신축 커뮤니티와 지하주차장에 만족하지만, 매달 나가는 높은 대출 이자에 외식 한번 마음 편히 못 합니다.'
      }
    ]
  },
  {
    choiceCardId: 'LC-SPEND-EDU-43',
    category: 'SPEND',
    categoryName: '40대 자녀 사교육비',
    title: '초·중·고 자녀 학원비와 입시 지원',
    ageRange: [42, 48],
    requireFlags: ['HAS_CHILDREN'],
    body: '자녀가 중·고등학교에 진학하며 입시 경쟁이 본격화되었습니다. 평거동과 초전동 대형 학원가로 쏟아져 들어가는 사교육 열풍 속에서 가계 교육비 예산을 결정해야 합니다.',
    statContextFact: '교육부·통계청 사교육비조사에 따르면 대한민국 초·중·고 학생의 사교육 참여율은 78.5%이며, 월평균 사교육비는 1인당 50만~80만 원으로 가계 소득의 20~30% 이상을 차지합니다.',
    options: [
      {
        optionId: 'EDU_PUBLIC_EBS',
        label: '학원 대신 공교육과 EBS 강의, 진주시립도서관을 활용한 자기주도학습을 권한다',
        effects: {
          happiness: -4,
          learning: -1,
          health: 1,
          bonds: -2,
          spend: 2 // 교육비 절약
        },
        grantFlag: 'EDU_SELF_STUDY',
        consequenceText: '노후 준비 자금은 굳건히 지켜냈지만, 주변 친구들이 전부 학원에 간 사이 아이가 느끼는 불안감을 달래야 합니다.'
      },
      {
        optionId: 'EDU_STANDARD_SUBJECT',
        label: '국·영·수 주요 과목 단과학원과 진주시 미래세대 장학 혜택을 적절히 지원한다',
        effects: {
          happiness: 2,
          learning: 4,
          health: -1,
          bonds: 2,
          spend: -1
        },
        grantFlag: 'EDU_BALANCED_ACADEMY',
        consequenceText: '자녀의 학업 성취도를 무난히 끌어올리며 가계 지출과의 균형을 유지합니다. 아이는 밤 10시에 학원 버스를 타고 귀가합니다.'
      },
      {
        optionId: 'EDU_ALL_IN_PRIVATE',
        label: '평거동 대형 종합학원 풀코스와 주말 1:1 과외에 올인하여 의대·명문대 입시를 지원한다',
        effects: {
          happiness: -2,
          learning: 8,
          health: -4,
          bonds: -3,
          spend: -3 // 막대한 사교육비
        },
        grantFlag: 'EDU_HEAVY_INVESTMENT',
        consequenceText: '월 소득의 40% 이상이 학원비로 빠져나가 노후 저축이 사실상 중단되었습니다. 부모는 허리띠를 졸라매고 자녀는 수면 부족에 시달립니다.'
      }
    ]
  },

  // =========================================================================
  // 7. 취미와 여가 (4대 취미 및 서울 원정비용)
  // =========================================================================
  {
    choiceCardId: 'LC-HOBBY-CHOOSE-16',
    category: 'HOBBY',
    categoryName: '평생 취미와 여가 선택',
    title: '당신의 삶을 채울 4대 취미의 시작',
    ageRange: [15, 23],
    excludeFlags: ['HOBBY_SELECTED'],
    body: '반복되는 학업과 일상 속에서 영혼에 숨을 불어넣어 줄 취미를 선택할 시간입니다. 어떤 활동에 당신의 여가와 열정을 쏟으시겠습니까?',
    statContextFact: '문체부 국민여가활동조사에 따르면 한국인의 여가 활동은 대중문화 팬덤, 생활체육, 인문독서, 생활음악으로 크게 분화되며, 진주 등 비수도권은 대형 공연 관람 시 서울 원정 비용이 추가로 발생합니다.',
    options: [
      {
        optionId: 'HOBBY_IDOL_ROOT',
        label: 'K-POP 아이돌 및 대중가수 팬덤 활동 (음원 스밍, 콘서트, 팬클럽)',
        effects: { happiness: 8, bonds: 5, learning: 2, health: -1, spend: -1 },
        grantFlag: 'HOBBY_IDOL',
        consequenceText: '삶의 비타민 같은 최애 가수가 생겼습니다. 포토카드를 모으고 음원 발매일마다 스트리밍을 돌립니다.'
      },
      {
        optionId: 'HOBBY_SPORT_ROOT',
        label: '남강 둔치 러닝, 헬스 웨이트 트레이닝, 배드민턴 등 생활체육',
        effects: { health: 8, happiness: 5, bonds: 4, learning: 1, spend: 0 },
        grantFlag: 'HOBBY_SPORT',
        consequenceText: '남강변 맑은 공기를 가르며 달리기 시작했습니다. 땀을 흠뻑 흘리고 난 뒤의 개운함이 일상의 활력이 됩니다.'
      },
      {
        optionId: 'HOBBY_READ_ROOT',
        label: '진주시립도서관과 동네 독립서점을 오가는 독서·인문학 북클럽',
        effects: { learning: 8, happiness: 4, bonds: 3, health: 0, spend: 1 },
        grantFlag: 'HOBBY_READ',
        consequenceText: '주말마다 서가 사이를 거닐며 사유의 깊이를 더합니다. 독서모임 벗들과 책 한 권을 두고 깊은 대화를 나눕니다.'
      },
      {
        optionId: 'HOBBY_MUSIC_ROOT',
        label: '통기타·건반 레슨 및 직장인 아마추어 밴드·합창단 활동',
        effects: { happiness: 7, bonds: 6, learning: 5, health: 0, spend: -1 },
        grantFlag: 'HOBBY_MUSIC',
        consequenceText: '손가락 끝에 굳은살이 박이도록 악기를 연습합니다. 합주실에서 악기 소리가 하나로 어우러질 때 전율을 느낍니다.'
      }
    ]
  },
  {
    choiceCardId: 'LC-HOBBY-IDOL-EXPEDITION-24',
    category: 'HOBBY',
    categoryName: '팬덤과 서울 원정',
    title: '진주발 서울 콘서트 원정의 딜레마',
    ageRange: [22, 35],
    requireFlags: ['HOBBY_IDOL'],
    excludeFlags: ['IDOL_EXPEDITION_DECIDED'],
    body: '좋아하는 가수의 단독 콘서트가 서울 올림픽공원 체조경기장에서 열립니다. 티켓팅에 성공했지만 왕복 KTX 요금과 서울 숙박비가 만만치 않습니다.',
    statContextFact: '비수도권 거주 청년이 서울에서 열리는 대형 대중음악 콘서트에 참석할 경우, 티켓 가격(약 15만 원) 외에 왕복 KTX(진주-서울 왕복 11만 5천 원)와 1박 숙박비 등 25만~35만 원의 지역 격차 부대비용이 발생합니다.',
    options: [
      {
        optionId: 'IDOL_SEOUL_TRIP',
        label: '진주역 첫차 KTX를 타고 상경하여 현장 스탠딩과 떼창의 열기를 만끽한다',
        effects: { happiness: 14, bonds: 6, health: -4, learning: 0, spend: -3 },
        grantFlag: 'IDOL_EXPEDITION_DECIDED',
        consequenceText: '꿈만 같던 서울 콘서트 현장에서 온 힘을 다해 응원봉을 흔들었습니다. 통장은 홀쭉해졌지만 평생 잊지 못할 추억을 새겼습니다.'
      },
      {
        optionId: 'IDOL_ONLINE_STREAM',
        label: '원정 비용이 부담되니 집에서 온라인 라이브 스트리밍과 굿즈로 아쉬움을 달랜다',
        effects: { happiness: 6, bonds: 2, health: 1, learning: 0, spend: -1 },
        grantFlag: 'IDOL_EXPEDITION_DECIDED',
        consequenceText: '모니터 앞에서 응원봉을 흔들며 안방 1열 콘서트를 즐겼습니다. 30만 원의 원정 경비를 아껴 다음 앨범을 기다립니다.'
      }
    ]
  },

  // =========================================================================
  // 8. 건강 관리와 의료 이용 (3대 한국형 의료 딜레마)
  // =========================================================================
  {
    choiceCardId: 'LC-MED-TIME-POOR-38',
    category: 'MEDICAL',
    categoryName: '시간 부족형 미충족 의료',
    title: '과로와 통증, 병원 갈 시간의 딜레마',
    ageRange: [28, 52],
    body: '수개월째 지속되는 목·허리 디스크 통증과 만성 위장 장애. 직장 눈치와 밀린 업무로 인해 평일 낮 병원 진료를 받기가 쉽지 않습니다.',
    statContextFact: '질병관리청 국민건강영양조사에 따르면 한국 성인의 미충족 의료 사유 1위는 "직장·학업 등으로 인한 시간 부족(41.4%)"이며, 야간진료 의원과 진통제로 버티는 비율이 높습니다.',
    options: [
      {
        optionId: 'MED_TAKE_HALF_DAY',
        label: '직장 눈치와 업무 지연을 무릅쓰고 당당히 평일 반차를 내어 정밀 진료와 물리치료를 받는다',
        effects: { health: 7, happiness: -1, bonds: 0, learning: 0, spend: -1 },
        grantFlag: 'MED_PROACTIVE_CARE',
        consequenceText: '의사의 정확한 진단을 받고 도수·물리치료를 받아 묵은 통증이 크게 완화되었습니다. 오후에 복귀하니 책상에 결재 서류가 쌓여 있습니다.'
      },
      {
        optionId: 'MED_NIGHT_CLINIC',
        label: '퇴근 후 시내 야간진료 의원이나 주말 문 여는 병원을 찾아 대증 처방만 받는다',
        effects: { health: 2, happiness: -3, bonds: 0, learning: 0, spend: 0 },
        grantFlag: 'MED_NIGHT_CARE',
        consequenceText: '피곤한 몸을 이끌고 야간진료 대기실에서 1시간을 기다려 약을 탔습니다. 당장 급한 불은 껐지만 피로가 가시지 않습니다.'
      },
      {
        optionId: 'MED_PAINKILLER_HOLD',
        label: '반차 내기가 눈치 보여 약국 소염진통제만 사 먹으며 주말까지 버틴다',
        effects: { health: -6, happiness: -2, bonds: 0, learning: 0, spend: 0 },
        grantFlag: 'MED_UNMET_TIME',
        consequenceText: '진통제로 통증을 억누르며 야근을 해냈지만, 약효가 떨어질 때마다 쑤시는 통증에 인상을 찌푸립니다.'
      }
    ]
  },
  {
    choiceCardId: 'LC-MED-DENTAL-EXAM-52',
    category: 'MEDICAL',
    categoryName: '급여 vs 비급여 의료 부담',
    title: '국가건강검진과 치과 임플란트 목돈',
    ageRange: [48, 68],
    body: '국민건강보험공단 무료 암 검진 통지서와 함께, 흔들리는 어금니 치과 견적서(비급여 임플란트 수백만 원)를 받아 들었습니다.',
    statContextFact: '보건복지부 국민보건의료실태조사에 따르면 한국의 공공 건강보험 보장률은 약 65% 수준이며, 치과 보철·임플란트 및 비급여 정밀 초음파·MRI는 가계의 직접 목돈 부담을 초래합니다.',
    options: [
      {
        optionId: 'MED_DENTAL_FULL_CARE',
        label: '목돈 지출을 감수하고 치과 임플란트 시술과 비급여 수면 위·대장 내시경을 즉시 완료한다',
        effects: { health: 10, happiness: 5, bonds: 0, learning: 0, spend: -3 },
        grantFlag: 'MED_DENTAL_COMPLETED',
        consequenceText: '저축해 둔 목돈이 쑥 빠져나갔지만 마음 편히 음식을 씹고 소화할 수 있게 되었습니다. 초기 대장 용종도 미리 제거했습니다.'
      },
      {
        optionId: 'MED_DENTAL_BASIC_COVER',
        label: '무료 기본 국가검진과 건강보험 급여가 적용되는 기본 치료(발치·틀니 등)만 진행한다',
        effects: { health: 3, happiness: 0, bonds: 0, learning: 0, spend: 0 },
        grantFlag: 'MED_DENTAL_BASIC',
        consequenceText: '비용 지출을 최소화하며 급한 치료를 마쳤습니다. 딱딱한 음식을 씹을 때 약간의 불편함이 남습니다.'
      },
      {
        optionId: 'MED_DENTAL_POSTPONE_FEAR',
        label: '치과 견적비용이 너무 부담스러워 한쪽으로만 씹으며 치료를 차일피일 미룬다',
        effects: { health: -8, happiness: -5, bonds: -1, learning: 0, spend: 1 },
        grantFlag: 'MED_DENTAL_UNMET',
        consequenceText: '당장의 목돈 지출은 막았지만 잇몸 뼈가 녹아내리고 턱관절 통증으로 식사 시간이 괴로워집니다.'
      }
    ]
  },
  {
    choiceCardId: 'LC-MED-SEVERE-BIG5-62',
    category: 'MEDICAL',
    categoryName: '지역 종합병원 vs 서울 빅5 원정',
    title: '중증 질환 진단과 서울 원정 진료',
    ageRange: [56, 78],
    body: '정밀검사 결과 큰 수술과 장기 항암 치료가 필요한 중증 판정을 받았습니다. 진주의 경상국립대병원에서 치료받을지, KTX를 타고 서울 대형 병원으로 원정 진료를 떠날지 결정해야 합니다.',
    statContextFact: '국민건강보험공단 통계에 따르면 비수도권 암 환자의 약 30%가 수도권 "빅5 병원"으로 원정 진료를 떠나며, 환자방 단기 월세·KTX 교통비·간병비(일 13만~15만 원)로 막대한 비의료비가 소요됩니다.',
    options: [
      {
        optionId: 'MED_SEOUL_BIG5',
        label: 'KTX 이동 고통과 서울 환자방 숙박비, 간병비를 감수하고 서울 빅5 대형 병원으로 원정 치료를 간다',
        effects: { health: 15, happiness: -4, bonds: -3, learning: 0, spend: -4 },
        grantFlag: 'SEOUL_MEDICAL_EXPEDITION',
        consequenceText: '새벽 KTX를 타고 서울 병원을 오가며 국내 최고 명의의 수술을 성공적으로 마쳤습니다. 가계 재정에 큰 타격을 입었지만 생명의 끈을 지켜냈습니다.'
      },
      {
        optionId: 'MED_JINJU_REGIONAL_UNIV',
        label: '진주 권역책임의료기관인 경상국립대병원에서 가족 곁을 지키며 통원 치료를 받는다',
        effects: { health: 12, happiness: 3, bonds: 6, learning: 0, spend: -1 },
        grantFlag: 'REGIONAL_MEDICAL_CARE',
        consequenceText: '익숙한 집에서 가족들의 따뜻한 간병을 받으며 치료를 마쳤습니다. 장거리 이동 피로 없이 지역 의료진의 헌신 속에 건강을 회복해 나갑니다.'
      },
      {
        optionId: 'MED_DELAY_COST_FEAR',
        label: '수술비와 간병비 부담이 두려워 적극적 입원을 미루고 통원 약물 치료로만 버틴다',
        effects: { health: -18, happiness: -12, bonds: -4, learning: 0, spend: 0 },
        grantFlag: 'CRITICAL_UNMET_MEDICAL',
        consequenceText: '자식들에게 짐이 되기 싫어 아픔을 숨기며 버텼지만 병세가 눈에 띄게 악화되었습니다. 가족들의 마음이 무겁게 가라앉습니다.'
      }
    ]
  }
];

export function checkLifeChoiceTrigger(
  age: number,
  gender: '남성' | '여성',
  flags: Set<string>,
  resolvedChoiceIds: Set<string>,
  isEduMode: boolean = false
): LifeChoiceCard | null {
  for (const card of LIFE_CHOICES) {
    if (resolvedChoiceIds.has(card.choiceCardId)) continue;
    const [minAge, maxAge] = card.ageRange;
    if (age < minAge || age > maxAge) continue;
    if (card.genderFilter && card.genderFilter !== gender) continue;

    // 플래그 조건 검사
    if (card.requireFlags && !card.requireFlags.some(f => flags.has(f))) continue;
    if (card.requireAnyFlags && !card.requireAnyFlags.some(f => flags.has(f))) continue;
    if (card.excludeFlags && card.excludeFlags.some(f => flags.has(f))) continue;

    // 특정 나이 고정 또는 일정 확률로 트리거
    if (age === minAge || Math.random() < 0.65) {
      return card;
    }
  }
  return null;
}
