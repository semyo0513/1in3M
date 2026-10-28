// 진주시 6대 핵심 대립 현안 시나리오 데이터 (FACT / STANCE / CHOICE / WHATIF)
import { DilemmaIssue } from '../types/game';

export const JINJU_DILEMMAS: DilemmaIssue[] = [
  // 1. 생활폐기물 소각장 갈등
  {
    id: 'issue_incinerator',
    title: '2030년 직매립 금지와 생활폐기물 소각장 입지',
    category: '환경 · 자원순환',
    triggerAgeRange: [28, 55],
    factText: '2021년 폐기물관리법 시행규칙 개정으로 2030년부터 비수도권의 종량제 폐기물 직매립이 전면 금지됩니다. 진주시는 하루 280톤 규모(총사업비 1,394억 원)의 단독 소각장을 내동면 매립장 일원에 건립하는 안을 추진 중이나, 사천시와 공동 광역소각장을 지을 경우 국비 보조율이 30%에서 50%로 상승합니다. 반면 내동면 주민들은 음식물처리장·공원묘지에 이은 일방적 희생이라며 천막 농성에 들어갔습니다.',
    factSource: '환경부 폐기물관리법 / 진주시의회 행정사무감사 보고서 (2024~2026)',
    stanceA: {
      actor: '진주시 행정 및 다수 시민',
      summary: '2030년 쓰레기 대란을 막으려면 골든타임이 임박했습니다. 총사업비 20% 이내의 주민편익시설과 숙원사업 지원을 통해 조속히 단독 추진해야 합니다.'
    },
    stanceB: {
      actor: '내동면 주민 대책위원회 & 환경단체',
      summary: '수십 년간 환경기초시설의 피해를 감내해 왔는데 사전 설명도 없이 또 내동면입니까? 전면 재검토 및 광역화, 원천 배출 감량 정책이 선행되어야 합니다.'
    },
    options: [
      {
        stance: '찬성',
        reasons: ['2030년 쓰레기 대란 방지가 최우선이다', '시 재정 부담을 감수하더라도 단독 시설로 신속히 완공해야 한다'],
        impactPersonal: { happiness: -4, bonds: -5, incomeChange: -1 },
        impactCity: { welfare: 15, trust: -10 },
        whatIfText: '당신은 도시 전체의 공익을 위해 찬성표를 던졌습니다. 소각장 착공 절차가 시작되었지만, 내동면 주민들과의 갈등의 골은 깊어졌습니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['주민편익시설(수영장·도서관) 및 가구별 실질적 난방비 지원 보장', '최첨단 저감 설비와 환경영향평가 주민 전면 공개'],
        impactPersonal: { happiness: 2, bonds: 4, learning: 3 },
        impactCity: { welfare: 5, trust: 15 },
        whatIfText: '당신은 상생 보상안을 지지했습니다. 시와 주민협의체 간 마라톤 협상 끝에 진주 서남부 최대 주민스포츠센터 건립이 약속되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['사천시와의 광역소각시설 재추진으로 국비 50% 확보 및 예산 절감', '제로웨이스트 정책 강화로 1인당 배출량 30% 감축'],
        impactPersonal: { learning: 5, happiness: 1 },
        impactCity: { welfare: -10, trust: 5, economy: 10 },
        whatIfText: '당신은 광역화와 감량을 제안했습니다. 사천시와의 지분 및 입지 재협상이 시작되며 일정은 다소 늦어졌으나 광역 상생의 기틀이 마련되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['특정 지역에 혐오시설을 누적시키는 불평등한 행정에 반대한다', '원점 재검토 및 30개 읍면동 균등 분산 입지 검토 필요'],
        impactPersonal: { bonds: 6, happiness: -2 },
        impactCity: { welfare: -15, trust: -5 },
        whatIfText: '당신은 내동면 주민들의 아픔에 연대했습니다. 건립 사업이 일시 유보되었으나 2030년 쓰레기 반출 임시 처리 비용이 발생하기 시작했습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['기술적 환경영향평가 데이터와 사천시와의 협상 결과를 더 지켜보아야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '당신은 신중한 관망을 택했습니다. 치열한 공청회 소식을 지켜보며 정책 결정의 지난함을 실감합니다.'
      }
    ]
  },

  // 2. 혁신도시 vs 원도심 양극화
  {
    id: 'issue_innovation_city',
    title: '충무공동 혁신도시 인프라 집중 vs 원도심 공동화와 폐교 위기',
    category: '도시계획 · 지역균형',
    triggerAgeRange: [14, 46],
    factText: '진주혁신도시(충무공동) 인구는 3.4만 명을 넘어서며 평균연령 30대의 젊은 교육 도시로 부상했고 초중고 과밀학급 문제가 발생했습니다. 반면 성북·중앙동 등 원도심은 인구 60% 이상이 유출되며 100년 역사의 학교들이 신입생 부족으로 통폐합 위기에 몰렸습니다. 한정된 시 예산을 혁신도시 고교 신설·복합문화센터에 둘 것인지, 원도심 도시재생과 작은 학교 살리기에 둘 것인지 논쟁 중입니다.',
    factSource: '진주시 통계연보 및 교육청 학생배치계획 (2024~2026)',
    stanceA: {
      actor: '혁신도시 학부모 & 공공기관 노조',
      summary: '수도권에서 내려온 청년 가족들이 진주에 영구 정착하려면 고등학교 신설과 정주 인프라 확충이 시급합니다. 인구가 느는 곳에 투자하는 것이 순리입니다.'
    },
    stanceB: {
      actor: '원도심 주민자치회 & 전통시장 상인',
      summary: '모든 행정·문화 기능이 혁신도시로 쏠리며 구도심은 밤마다 유령도시가 되고 있습니다. 원도심 청년창업과 작은 학교 특성화 예산이 먼저입니다.'
    },
    options: [
      {
        stance: '찬성',
        reasons: ['혁신도시 정주여건 완성을 통한 수도권 청년 인재의 진주 정착', '과밀학급 해소를 위한 신도시 학교 신설이 시급하다'],
        impactPersonal: { learning: 6, incomeChange: 2, happiness: 1 },
        impactCity: { space: 25, economy: 15 },
        whatIfText: '당신은 신도심 경쟁력 강화를 지지했습니다. 충무공동에 최신 복합학교가 개교했으나 원도심 모교는 분교로 격하되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['원도심 붕괴는 진주 전체의 역사적 정체성을 해친다', '원도심 작은 학교를 예술·IT 특성화 학교로 육성해야 한다'],
        impactPersonal: { bonds: 7, happiness: 3 },
        impactCity: { space: -25, culture: 15 },
        whatIfText: '당신은 원도심 재생을 지지했습니다. 성북동 골목에 청년 공방이 늘어나고 진주초등학교가 스마트 생태학교로 변모하여 폐교를 면했습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['원도심-혁신도시를 잇는 친환경 트램/급행버스 연결망으로 교육·상권 공유', '문산 공공주택지구와 연계한 완충형 균형발전'],
        impactPersonal: { learning: 4, bonds: 3 },
        impactCity: { space: 0, economy: 10, trust: 15 },
        whatIfText: '당신은 상생 교통망을 제안했습니다. 신도심 학생이 원도심 특성화 수업을 듣고, 구도심 주민이 혁신도시 도서관을 누리는 연계망이 구축되었습니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['혁신도시 투자 수익의 일정 비율을 원도심 상생기금으로 의무 적립하는 조건'],
        impactPersonal: { incomeChange: 1, happiness: 2 },
        impactCity: { space: 10, welfare: 10 },
        whatIfText: '당신은 상생기금 연계를 이끌어냈습니다. 혁신도시 개발 이익이 중앙시장 현대화와 구도심 보행로 개선에 투입되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['장기적인 학령인구 감소 추세를 보며 신중히 학교 배치를 결정해야 한다'],
        impactPersonal: { learning: 1 },
        impactCity: { trust: 0 },
        whatIfText: '당신은 인구 추이를 관망했습니다. 교육청의 중장기 용역 결과가 발표되기까지 논쟁이 지속됩니다.'
      }
    ]
  },

  // 3. 공공의료 확충 vs 재정 건전성
  {
    id: 'issue_public_hospital',
    title: '서부경남 공공의료원(진주병원) 건립 규모와 필수의료 공백',
    category: '보건 · 공공복지',
    triggerAgeRange: [25, 60],
    factText: '2013년 진주의료원 폐업 이후 서부경남 지역민들은 심야 소아 응급의료와 감염병 전담 병상 부족을 겪어왔습니다. 경남도의료원 진주병원(300병상 규모) 재건립이 가좌동 일원에 추진 중이나, 해마다 발생할 수백억 원대 운영 적자 보전과 국·도·시비 분담 규모, 민간 병원과의 응급의료 역할 중복을 두고 치열한 논쟁이 벌어지고 있습니다.',
    factSource: '보건복지부 지역거점공공병원 운영평가 / 경상남도 공론화위원회 결과 (2020~2025)',
    stanceA: {
      actor: '보건의료노조 & 취약계층 시민연대',
      summary: '공공의료는 흑자 사업이 아니라 생명 안전망입니다. 300병상 이상 종합병원으로 지어 중증 응급·소아청소년·분만 필수의료를 책임져야 합니다.'
    },
    stanceB: {
      actor: '시의회 재정건전성 파벌 & 일부 민간의료협회',
      summary: '이미 경상국립대병원 등 민간·대학병원이 있는 상황에서 수백억 혈세 적자가 뻔한 대형 공공병원을 짓기보다, 기존 병원에 필수진료 바우처를 주는 것이 효율적입니다.'
    },
    options: [
      {
        stance: '찬성',
        reasons: ['돈보다 생명이 먼저다. 서부경남 어디서든 30분 내 응급 필수의료 접근권 보장', '감염병 위기 시 시민의 최후 보루 확보'],
        impactPersonal: { health: 10, happiness: 5, incomeChange: -2 },
        impactCity: { welfare: -30, trust: 20 },
        whatIfText: '당신은 공공의료 대폭 확충에 힘을 보탰습니다. 훗날 노년기에 닥친 심혈관 응급 상황에서 공공병원의 신속한 닥터헬기-응급실 연계로 목숨을 건지게 됩니다.'
      },
      {
        stance: '반대',
        reasons: ['매년 발생하는 운영 적자로 시 재정이 파탄 나고 다른 복지·문화 예산이 깎인다', '민간 응급의료센터 야간 운영 지원이 더 저렴하고 빠르다'],
        impactPersonal: { health: -4, incomeChange: 3, happiness: -2 },
        impactCity: { welfare: 30, trust: -10 },
        whatIfText: '당신은 시 재정 건전성을 지켰습니다. 세금 인상은 억제되었으나, 야간 소아 응급실이 붐비며 외곽 읍면 주민들의 병원 원정 진료 불편이 이어집니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['경상국립대병원 위탁 운영을 통해 의료진 수준을 담보하고 적자를 최소화하는 조건', '필수 중증외상·어린이 전문 병동에 특화'],
        impactPersonal: { health: 7, learning: 3 },
        impactCity: { welfare: -10, trust: 15 },
        whatIfText: '당신은 국립대병원 위탁 연계를 지지했습니다. 대학병원 의료진이 순환 근무하는 알짜 전문 공공병원 모델이 정착되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['스마트 원격 진료망 및 찾아가는 닥터버스 도입으로 면 지역 어르신 돌봄 강화'],
        impactPersonal: { bonds: 5, health: 3 },
        impactCity: { welfare: 0, economy: 10 },
        whatIfText: '당신은 이동형 의료 모델을 제안했습니다. 수곡·미천 등 산간 면 지역 어르신들에게 주 2회 왕진 서비스가 시작되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['정부의 의대 정원 및 공공임상교수제 배분 결과를 먼저 지켜봐야 한다'],
        impactPersonal: { learning: 1 },
        impactCity: { trust: 0 },
        whatIfText: '당신은 국가 보건의료 정책 추이를 주시합니다.'
      }
    ]
  },

  // 4. 청년 일자리 & 탈진주 갈림길
  {
    id: 'issue_youth_jobs',
    title: '청년 인구 순유출과 우주항공·바이오 신산업 vs 공공기관 의존',
    category: '경제 · 일자리',
    triggerAgeRange: [19, 29],
    factText: '진주시는 6개 대학(경상국립대 등)이 위치해 청년 비율이 24.8%로 경남 1위이지만, 20대 후반 청년의 순유출률 역시 가장 높습니다. 유출 이유의 68%는 "전공을 살릴 양질의 민간 일자리 부족"입니다. 혁신도시 11개 공기업 지역인재 채용 쿼터는 포화 상태이며, 시는 KAI 회전익 비행센터, 우주항공 AAV 실증센터, 바이오 그린스마트밸리를 유치하며 신산업 전환을 꾀하고 있습니다.',
    factSource: '통계청 국내인구이동통계 & 진주시 청년통계 (2024~2026)',
    stanceA: {
      actor: '지역 대학생 & 청년 구직자',
      summary: '공기업 채용문은 좁고 일반 중소기업은 급여와 복지가 수도권에 비해 열악합니다. 양질의 R&D 대기업이나 스타트업 생태계가 없으면 상경할 수밖에 없습니다.'
    },
    stanceB: {
      actor: '진주상공회의소 & 지역 제조업체',
      summary: '지역 청년들이 수도권 공채만 바라보며 지역 강소기업 취업을 기피합니다. 지자체가 청년 주거비와 복지지원금을 보조하여 지역 정착을 유도해야 합니다.'
    },
    options: [
      {
        stance: '찬성',
        reasons: ['우주항공·세라믹·방산 신산업 산단에 시정 역량과 R&D 예산을 총동원해야 한다', '지역 청년 채용 시 파격적 세제 혜택 부여'],
        impactPersonal: { learning: 8, incomeChange: 3, happiness: 4 },
        impactCity: { economy: 30, space: 10 },
        whatIfText: '당신은 신산업 육성에 베팅했습니다. 정촌 우주항공 R&D 센터에 입사하여 고향 진주에서 미래 모빌리티를 개발하는 주역이 됩니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['대기업 유치보다 청년 로컬 크리에이터 및 골목 창업, 사회적경제 지원금 확대', '진주실크·스마트팜 농업 등 전통 가업 청년 승계 특화 지원'],
        impactPersonal: { bonds: 9, happiness: 6, incomeChange: 1 },
        impactCity: { economy: -20, culture: 20 },
        whatIfText: '당신은 로컬 청년 창업의 길을 열었습니다. 중앙시장 청년몰과 수곡 딸기 스마트팜에서 독창적인 브랜드를 일구어 전국적 주목을 받습니다.'
      },
      {
        stance: '반대',
        reasons: ['무리한 산단 확장은 미분양과 시 재정 낭비만 초래한다. 기존 공공기관 2차 이전 유치에 집중해야 한다'],
        impactPersonal: { incomeChange: -1, learning: 2 },
        impactCity: { economy: -10, welfare: 10 },
        whatIfText: '당신은 공공기관 집적을 강조했습니다. 추가 공기업 본사 유치 운동에 참여하며 공공부문 중심의 안정을 추구합니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['수도권 유출을 막기 위해 관내 취업 청년에게 월 50만 원 주거비 및 진주사랑상품권 지원 병행'],
        impactPersonal: { incomeChange: 2, happiness: 5 },
        impactCity: { welfare: -15, trust: 15 },
        whatIfText: '당신은 정착 복지 패키지를 이끌어냈습니다. 실질적인 주거비 절감으로 동기 청년들이 진주 잔류를 선택하기 시작합니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['수도권 상경과 진주 잔류 사이에서 아직 나의 커리어 방향을 결정하지 못했다'],
        impactPersonal: { happiness: -2 },
        impactCity: { trust: 0 },
        whatIfText: '당신은 서울행 고속버스와 진주 중앙도서관 사이에서 깊은 고민의 밤을 보냅니다.'
      }
    ]
  },

  // 5. 대중교통 공영화 vs 자가용 중심 도로망
  {
    id: 'issue_public_transit',
    title: '시내버스 완전공영제 및 무상교통 vs 도심 도로 확장과 주차타워',
    category: '교통 · 이동권',
    triggerAgeRange: [15, 68],
    factText: '진주시는 시내버스 노선 개편 때마다 벽지 노선 감차와 시민 불편, 버스업체 보조금 누수 논란을 겪어왔습니다. 청소년·어르신 100원 버스(무상교통)와 완전공영제 도입 요구가 높은 한편, 자가용 이용자가 급증한 10호광장, 평거-초전 축의 극심한 출퇴근 정체를 해소하기 위해 우회도로 신설과 도심 공영주차장 건립에 예산을 써야 한다는 목소리가 팽팽합니다.',
    factSource: '진주시 대중교통 기본계획 & 시의회 간담회 자료 (2024~2026)',
    stanceA: {
      actor: '진주교통약자연대 & 청소년단체',
      summary: '학생과 노인, 농촌 주민에게 버스는 유일한 발입니다. 민간업체 배불리기 보조금을 중단하고 완전공영제와 청소년·어르신 무상교통을 전면 시행해야 합니다.'
    },
    stanceB: {
      actor: '자가용 출퇴근 시민연합 & 상가번영회',
      summary: '출퇴근길 정체로 10호광장이 마비되고 주차난으로 원도심 상가가 죽어가고 있습니다. 대중교통 적자 메우기보다 막힌 도로를 뚫는 것이 시급합니다.'
    },
    options: [
      {
        stance: '찬성',
        reasons: ['모든 시민의 기본 이동권 보장을 위한 시내버스 완전공영제 및 단계적 무상교통', '자가용 이용 억제를 통한 탄소중립 실천'],
        impactPersonal: { happiness: 6, bonds: 5, incomeChange: 2 },
        impactCity: { welfare: -25, trust: 15 },
        whatIfText: '당신은 버스 공영화를 지지했습니다. 청소년기 교통비 부담이 사라졌고, 훗날 운전면허를 반납한 노년기에도 하모콜버스로 병원을 편안히 다닙니다.'
      },
      {
        stance: '반대',
        reasons: ['시내버스 공영화는 매년 수백억 원의 영구적 시 재정 적자를 초래한다', '우회도로 개설과 공영주차타워 확충으로 체증 해소가 급선무'],
        impactPersonal: { happiness: 3, incomeChange: -1 },
        impactCity: { welfare: 20, economy: 10 },
        whatIfText: '당신은 도로 확장을 선택했습니다. 10호광장 입체교차로와 대형 공영주차장이 완공되어 자가용 출퇴근 시간은 단축되었으나 버스 배차간격은 늘어났습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['외곽 면 지역은 수요응답형 하모콜버스(DRT)와 브라보택시 특화, 도심은 자전거·보행 전용도로망 구축'],
        impactPersonal: { health: 5, learning: 3, happiness: 4 },
        impactCity: { culture: 10, trust: 20 },
        whatIfText: '당신은 하이브리드 교통망을 제안했습니다. 남강변 자전거 출퇴근길이 정비되고, 시골 어르신들은 스마트폰 호출 콜버스로 장을 보러 옵니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['청소년과 70세 이상 어르신에게만 우선 무상교통을 적용하고 일반은 단계적 도입'],
        impactPersonal: { happiness: 4, bonds: 3 },
        impactCity: { welfare: -10, trust: 10 },
        whatIfText: '당신은 세대별 단계적 도입을 이끌어냈습니다. 청소년과 어르신의 외출 빈도가 늘며 동네 골목상권에 활기가 돕니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['시 재정 분석과 버스 노선 빅데이터 분석 결과를 먼저 확인해야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '당신은 교통 빅데이터 분석 결과를 기다립니다.'
      }
    ]
  },

  // 6. 남강유등축제·대첩광장 상업화 vs 원형 보존
  {
    id: 'issue_festival_heritage',
    title: '진주대첩 역사공원 관광상업화 vs 촉석루 남강 역사·생태 원형 보존',
    category: '역사 · 문화 · 관광',
    triggerAgeRange: [20, 65],
    factText: '진주시의 상징인 남강유등축제는 과거 입장료 유료화와 남강 둘레 가림막 설치로 전국적 홍역을 치른 뒤 전면 무료화로 회귀한 역사가 있습니다. 최근에는 17년 만에 완공된 진주대첩 역사공원 지원시설(콘크리트 조형물)의 경관 왜곡 논란과 함께, 남강 수변에 대형 케이블카·관광 모노레일 등 체류형 유료 관광시설을 도입할 것인지를 두고 시민사회의 보존론과 개발론이 맞서고 있습니다.',
    factSource: '진주시 문화예술 기본계획 & 시민사회단체 공동 성명서 (2024~2026)',
    stanceA: {
      actor: '관광호텔·요식업계 & 개발 추진위',
      summary: '관광객이 당일치기로 스쳐 지나가면 지역 경제에 보탬이 안 됩니다. 남강변 랜드마크 체험시설과 야간 상업 콘텐츠를 공격적으로 늘려 체류형 관광도시로 도약해야 합니다.'
    },
    stanceB: {
      actor: '진주참여연대 & 역사문화학계',
      summary: '남강과 진주성은 임진왜란 구국의 성지이자 34만 시민의 쉼터입니다. 과도한 콘크리트 상업화와 가림막 유료화의 우를 반복하지 말고 원형 생태를 보존해야 합니다.'
    },
    options: [
      {
        stance: '찬성',
        reasons: ['체류형 글로벌 관광도시로 도약하여 자영업자와 청년 서비스 일자리 창출', '남강 케이블카와 야간 유등 랜드마크 개발'],
        impactPersonal: { incomeChange: 3, happiness: 2 },
        impactCity: { culture: 30, economy: 20 },
        whatIfText: '당신은 관광 랜드마크 개발을 밀어붙였습니다. 10월마다 전국에서 수백만 인파가 몰려 골목 식당은 문전성시를 이루었으나, 주말마다 소음과 교통 통제가 일상화되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['진주성과 남강의 역사적 원형을 훼손하는 상업 시설물 난립 반대', '시민의 일상 산책과 역사적 숭고함을 지키는 생태 보존'],
        impactPersonal: { happiness: 7, health: 4, bonds: 5 },
        impactCity: { culture: -30, trust: 15 },
        whatIfText: '당신은 역사 원형 보존을 지켰습니다. 남강 둔치는 시민들이 돗자리를 펴고 물멍을 즐기는 온전한 휴식처로 남아 삶의 질을 높여줍니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['상업시설 부지는 남강 수변을 벗어난 구도심 빈집 재생 부지로 제한', '축제 수익금의 절반을 원도심 문화예술인 창작 지원금으로 환원'],
        impactPersonal: { learning: 4, bonds: 4, incomeChange: 1 },
        impactCity: { culture: 10, economy: 10 },
        whatIfText: '당신은 구도심 상생형 문화관광을 설계했습니다. 칠암·망경동 골목길이 감성 카페와 예술가 레지던시로 탈바꿈하며 조화로운 명소가 되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['외지 관광객 중심의 메가 축제 대신, 30개 읍면동 주민이 직접 유등을 띄우는 시민 자치 축제로 전환'],
        impactPersonal: { bonds: 8, happiness: 5 },
        impactCity: { culture: 0, trust: 25 },
        whatIfText: '당신은 시민 참여형 유등제를 이끌었습니다. 문산 아이들과 수곡 어르신들이 직접 소원을 적은 등 수만 개가 남강을 밝히며 깊은 감동을 줍니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['문화재청의 국가유산 현상변경 심의 결과와 주민투표 결과를 종합하여 결정해야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '당신은 전문가 심의와 시민 공론화 절차를 기다립니다.'
      }
    ]
  }
];
