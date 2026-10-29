// 진주시 대립 현안 시나리오 데이터 (일반 실명 모드 & 학생 교육용 가명화/종결사례 모드)
import { DilemmaIssue } from '../types/game';

// 1. 일반 모드용 딜레마 (실명 및 최신 보도 기반)
export const JINJU_DILEMMAS_NORMAL: DilemmaIssue[] = [
  // 실명 1: 생활폐기물 소각장 갈등
  {
    id: 'issue_incinerator',
    title: '2030년 직매립 금지와 생활폐기물 소각장 입지',
    category: '환경 · 자원순환',
    triggerAgeRange: [28, 55],
    factText: '2021년 폐기물관리법 시행규칙 개정으로 2030년부터 비수도권의 종량제 폐기물 직매립이 전면 금지됩니다. 진주시는 하루 280톤 규모(총사업비 1,394억 원)의 단독 소각장을 내동면 매립장 일원에 건립하는 안을 추진 중이나, 사천시와 공동 광역소각장을 지을 경우 국비 보조율이 30%에서 50%로 상승합니다. 반면 내동면 주민들은 음식물처리장·공원묘지에 이은 일방적 희생이라며 반발하고 있습니다.',
    factSource: '환경부 폐기물관리법 / 진주시의회 행정사무감사 보고서',
    stanceA: {
      actor: '진주시 행정 및 다수 시민',
      summary: '2030년 쓰레기 대란을 막으려면 골든타임이 임박했습니다. 총사업비 20% 이내의 주민편익시설과 숙원사업 지원을 통해 조속히 단독 추진해야 합니다.'
    },
    stanceB: {
      actor: '내동면 주민 대책위원회 & 환경단체',
      summary: '수십 년간 환경기초시설의 피해를 감내해 왔는데 사전 설명도 없이 또 내동면입니까? 전면 재검토 및 광역화, 원천 배출 감량 정책이 선행되어야 합니다.'
    },
    counterArgumentForPro: '반대 측 주민들은 이미 수십 년간 매립장·하수처리장 등 기피시설을 한 마을에 떠안아 왔다는 절박한 누적 피해를 호소하고 있습니다.',
    counterArgumentForCon: '추진 측은 2030년 직매립이 금지되면 쓰레기를 타지로 비싸게 반출해야 해 시민 1인당 쓰레기 처리비가 폭등할 것을 깊이 우려하고 있습니다.',
    isEduModeSafe: false,
    options: [
      {
        stance: '찬성',
        reasons: ['2030년 쓰레기 대란 방지가 최우선이다', '시 재정 부담을 감수하더라도 단독 시설로 신속히 완공해야 한다'],
        impactPersonal: { happiness: -4, bonds: -5, incomeChange: -1 },
        impactCity: { welfare: 15, trust: -10 },
        whatIfText: '도시 전체의 공익을 위해 찬성표를 던졌습니다. 소각장 착공 절차가 시작되었으나 내동면 주민들과의 갈등이 깊어졌습니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['주민편익시설(수영장·도서관) 및 가구별 실질적 난방비 지원 보장', '최첨단 저감 설비와 환경영향평가 주민 전면 공개'],
        impactPersonal: { happiness: 2, bonds: 4, learning: 3 },
        impactCity: { welfare: 5, trust: 15 },
        whatIfText: '상생 보상안을 지지했습니다. 시와 주민협의체 간 협상 끝에 진주 서남부 최대 주민스포츠센터 건립이 약속되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['사천시와의 광역소각시설 재추진으로 국비 50% 확보 및 예산 절감', '제로웨이스트 정책 강화로 1인당 배출량 30% 감축'],
        impactPersonal: { learning: 5, happiness: 1 },
        impactCity: { welfare: -10, trust: 5, economy: 10 },
        whatIfText: '광역화와 감량을 제안했습니다. 사천시와의 재협상이 시작되며 일정은 늦어졌으나 지자체 간 상생 기틀이 마련되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['특정 지역에 혐오시설을 누적시키는 불평등한 행정에 반대한다', '원점 재검토 및 30개 읍면동 균등 분산 입지 검토 필요'],
        impactPersonal: { bonds: 6, happiness: -2 },
        impactCity: { welfare: -15, trust: -5 },
        whatIfText: '내동면 주민들의 아픔에 연대했습니다. 건립 사업이 유보되었으나 2030년 쓰레기 임시 처리 비용이 발생하기 시작했습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['기술적 환경영향평가 데이터와 사천시와의 협상 결과를 더 지켜보아야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '신중한 관망을 택했습니다. 정책 결정의 지난함을 실감합니다.'
      }
    ]
  },

  // 실명 2: 혁신도시 vs 원도심 양극화
  {
    id: 'issue_innovation_city',
    title: '충무공동 혁신도시 인프라 집중 vs 원도심 공동화와 폐교 위기',
    category: '도시계획 · 지역균형',
    triggerAgeRange: [14, 46],
    factText: '진주혁신도시(충무공동) 인구는 3.4만 명을 넘어서며 평균연령 30대의 젊은 교육 도시로 부상했고 초중고 과밀학급 문제가 발생했습니다. 반면 성북·중앙동 등 원도심은 인구 60% 이상이 유출되며 100년 역사의 학교들이 신입생 부족으로 통폐합 위기에 몰렸습니다. 한정된 시 예산을 혁신도시 고교 신설에 둘 것인지, 원도심 도시재생과 작은 학교 살리기에 둘 것인지 논쟁 중입니다.',
    factSource: '진주시 통계연보 및 교육청 학생배치계획',
    stanceA: {
      actor: '혁신도시 학부모 & 공공기관 노조',
      summary: '수도권에서 내려온 청년 가족들이 진주에 영구 정착하려면 고등학교 신설과 정주 인프라 확충이 시급합니다. 인구가 느는 곳에 투자하는 것이 순리입니다.'
    },
    stanceB: {
      actor: '원도심 주민자치회 & 전통시장 상인',
      summary: '모든 행정·문화 기능이 혁신도시로 쏠리며 구도심은 밤마다 유령도시가 되고 있습니다. 원도심 청년창업과 작은 학교 특성화 예산이 먼저입니다.'
    },
    counterArgumentForPro: '원도심 주민들은 학교가 사라지면 젊은 부모들이 완전히 떠나 동네 자체가 소멸할 것이라 절규합니다.',
    counterArgumentForCon: '혁신도시 학부모들은 좁은 모듈러 교실에서 30명 넘는 아이들이 부대끼며 통학하는 현실을 견디기 어렵습니다.',
    isEduModeSafe: false,
    options: [
      {
        stance: '찬성',
        reasons: ['혁신도시 정주여건 완성을 통한 수도권 청년 인재의 진주 정착', '과밀학급 해소를 위한 신도시 학교 신설이 시급하다'],
        impactPersonal: { learning: 6, incomeChange: 2, happiness: 1 },
        impactCity: { space: 25, economy: 15 },
        whatIfText: '신도심 경쟁력 강화를 지지했습니다. 충무공동에 최신 복합학교가 개교했으나 원도심 모교는 분교로 격하되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['원도심 붕괴는 진주 전체의 역사적 정체성을 해친다', '원도심 작은 학교를 예술·IT 특성화 학교로 육성해야 한다'],
        impactPersonal: { bonds: 7, happiness: 3 },
        impactCity: { space: -25, culture: 15 },
        whatIfText: '원도심 재생을 지지했습니다. 성북동 골목에 청년 공방이 늘어나고 초등학교가 특성화 생태학교로 변모하여 폐교를 면했습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['원도심-혁신도시를 잇는 통학 셔틀버스와 교육·문화 인프라 공유', '공동학구제를 통한 원도심 작은 학교 지원'],
        impactPersonal: { learning: 4, bonds: 3 },
        impactCity: { space: 0, economy: 10, trust: 15 },
        whatIfText: '상생 방안을 제안했습니다. 신도심 학생이 원도심 특성화 수업을 듣고 교육 격차를 줄이는 실험이 시작되었습니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['혁신도시 개발 이익의 일부를 원도심 작은 학교 살리기 기금으로 의무 적립하는 조건'],
        impactPersonal: { incomeChange: 1, happiness: 2 },
        impactCity: { space: 10, welfare: 10 },
        whatIfText: '상생기금 조성을 이끌어냈습니다. 신도심 개발 이익이 구도심 학교 환경 개선에 투입되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['장기적인 학생 수 감소 추이를 보며 신중히 결정해야 한다'],
        impactPersonal: { learning: 1 },
        impactCity: { trust: 0 },
        whatIfText: '교육청의 중장기 학생배치 용역 결과를 지켜보며 논의를 이어갑니다.'
      }
    ]
  },

  // 실명 3: 서부경남 공공병원 신설
  {
    id: 'issue_public_hospital',
    title: '서부경남 공공의료원(진주병원) 건립 규모와 필수의료 공백',
    category: '보건 · 공공복지',
    triggerAgeRange: [25, 60],
    factText: '2013년 진주의료원 폐업 이후 서부경남 지역민들은 심야 소아 응급의료와 감염병 전담 병상 부족을 겪어왔습니다. 경남도의료원 진주병원(300병상 규모) 재건립이 가좌동 일원에 추진 중이나, 매년 발생할 수백억 원대 운영 적자 보전과 민간 병원과의 응급의료 역할 중복을 두고 치열한 논쟁이 벌어지고 있습니다.',
    factSource: '보건복지부 지역거점공공병원 운영평가 / 경상남도 공론화위원회 결과',
    stanceA: {
      actor: '보건의료노조 & 취약계층 시민연대',
      summary: '공공의료는 흑자 사업이 아니라 생명 안전망입니다. 300병상 이상 종합병원으로 지어 중증 응급·소아청소년·분만 필수의료를 책임져야 합니다.'
    },
    stanceB: {
      actor: '시의회 재정건전성 파벌 & 일부 민간의료협회',
      summary: '이미 대학병원과 민간 병원이 있는 상황에서 수백억 혈세 적자가 뻔한 대형 공공병원을 짓기보다, 기존 병원에 필수진료 바우처를 주는 것이 효율적입니다.'
    },
    counterArgumentForPro: '신중론자들은 매년 발생하는 막대한 운영 적자가 결국 시민 세금 부담으로 돌아와 다른 복지 사업이 축소될 것을 걱정합니다.',
    counterArgumentForCon: '확충론자들은 민간 병원이 수익성을 이유로 기피하는 야간 소아 응급실이나 감염병 병상은 공공이 아니면 아무도 책임지지 않는다고 강조합니다.',
    isEduModeSafe: false,
    options: [
      {
        stance: '찬성',
        reasons: ['돈보다 생명이 먼저다. 30분 내 응급 필수의료 접근권 보장', '감염병 위기 시 시민의 최후 보루 확보'],
        impactPersonal: { health: 10, happiness: 5, incomeChange: -2 },
        impactCity: { welfare: -30, trust: 20 },
        whatIfText: '공공의료 대폭 확충에 힘을 보탰습니다. 훗날 노년기에 닥친 응급 상황에서 공공병원의 신속한 진료로 건강을 회복하게 됩니다.'
      },
      {
        stance: '반대',
        reasons: ['매년 발생하는 운영 적자로 시 재정이 부담된다', '민간 응급의료센터 야간 운영 지원이 더 저렴하고 빠르다'],
        impactPersonal: { health: -4, incomeChange: 3, happiness: -2 },
        impactCity: { welfare: 30, trust: -10 },
        whatIfText: '재정 건전성을 지켰습니다. 세금 인상은 억제되었으나 야간 소아 응급실 병상 부족 문제는 지속되었습니다.'
      },
      {
        stance: '조건부 찬성',
        reasons: ['국립대병원 위탁 운영을 통해 의료진 수준을 담보하고 적자를 최소화하는 조건'],
        impactPersonal: { health: 7, learning: 3 },
        impactCity: { welfare: -10, trust: 15 },
        whatIfText: '대학병원 위탁 연계를 지지했습니다. 전문성과 공공성을 동시에 갖춘 전문 병원 모델이 정착되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['스마트 원격 진료망 및 찾아가는 닥터버스 도입으로 면 지역 어르신 돌봄 강화'],
        impactPersonal: { bonds: 5, health: 3 },
        impactCity: { welfare: 0, economy: 10 },
        whatIfText: '이동형 의료 모델을 제안했습니다. 산간 면 지역 어르신들에게 정기 왕진 서비스가 시작되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['정부의 공공의료 예산 지원 규모를 먼저 지켜봐야 한다'],
        impactPersonal: { learning: 1 },
        impactCity: { trust: 0 },
        whatIfText: '국가 보건의료 정책 추이를 주시합니다.'
      }
    ]
  }
];

// 2. 학생 교육용 모드 딜레마 (가명화·종결사례 중심, 특정 지역/낙인 배제, 보이텔스바흐 원칙 충족)
export const JINJU_DILEMMAS_EDU: DilemmaIssue[] = [
  // 교육용 1: [종결된 실제 역사적 사례] 남강유등축제 유료화 논쟁 (2015~2016)
  {
    id: 'edu_issue_yudeung_fee',
    title: '전통 축제의 유료화와 시민 쉼터의 공공성 (남강유등축제 사례)',
    category: '문화 · 시민 자치',
    triggerAgeRange: [14, 45],
    factText: '진주시의 상징인 남강유등축제는 축제의 재정 자립과 세계화를 위해 2015년 입장 유료화(성인 1만 원, 남강 둘레 가림막 설치)를 시행했습니다. 유료화 첫해 재정 자립도는 높아졌으나 시민들이 일상적으로 산책하던 강변이 차단되어 큰 논란이 일었고, 경상남도의 야외 축제 무료 권고 등을 거쳐 다시 무료화로 환원된 역사적 사례입니다.',
    factSource: '진주시 남강유등축제 기록물 & 경상남도 권고안 (2015~2016 종결 사례)',
    stanceA: {
      actor: '축제 재정자립 및 상업화 지지 측',
      summary: '수십억 원의 시민 혈세만 쏟아붓는 축제는 지속되기 어렵습니다. 입장료를 받아 콘텐츠 품질을 높이고 외지 관광객을 유치해 관광 산업을 키워야 합니다.'
    },
    stanceB: {
      actor: '시민 일상성 및 공공성 수호 측',
      summary: '남강은 진주시민 모두의 열린 쉼터이자 조상들의 숭고한 역사입니다. 가림막을 쳐서 시민의 접근을 막고 돈을 받는 것은 축제의 본래 정신에 어긋납니다.'
    },
    counterArgumentForPro: '무료화를 지지하는 시민들은 "우리 세금으로 가꾼 남강 둔치를 가림막으로 가로막혀 산책조차 못 하는 것은 시민의 권리를 침해당하는 것"이라 느낍니다.',
    counterArgumentForCon: '유료화를 지지하는 측은 "매년 축제 적자를 시민 세금으로만 메우면, 아이들 학교나 노인 복지에 쓸 시 예산이 그만큼 줄어든다"는 현실적 한계를 지적합니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['진주시민은 완전 무료로 개방하고 외지 관광객에게만 합리적 입장료를 받는 상생안', '축제 수익금 전액을 시민 문화 복지기금으로 환원'],
        impactPersonal: { learning: 5, bonds: 4, happiness: 3 },
        impactCity: { culture: 10, welfare: 10, trust: 20 },
        whatIfText: '시민과 관광객이 상생하는 해법을 제시했습니다. 시민의 휴식권을 지키면서 축제 재정의 자립성을 높이는 모범 사례로 기록되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['남강은 시민 모두의 공공재이므로 가림막 없는 완전 무료 개방 원칙 고수', '유등 만들기 시민 자치 참여로 축제 예산 절감'],
        impactPersonal: { happiness: 6, bonds: 6 },
        impactCity: { culture: -15, trust: 15 },
        whatIfText: '축제의 공공성을 지켰습니다. 시민들이 가을밤 남강변 둔치에 모여 자유롭게 유등을 바라보며 자부심을 느낍니다.'
      },
      {
        stance: '찬성',
        reasons: ['수익자 부담 원칙에 따라 고품격 체류형 글로벌 축제로 육성', '축제 수입으로 지역 상권 청년 일자리 창출'],
        impactPersonal: { incomeChange: 2, learning: 3 },
        impactCity: { culture: 25, economy: 15 },
        whatIfText: '세계적인 축제로의 도약을 지지했습니다. 고품질 유등 조형물이 늘어났으나 일상적 강변 산책에는 다소 제약이 생겼습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['입장료 대신 체험 프로그램(유등 띄우기 키트 등) 선택적 유료화로 재정 확충'],
        impactPersonal: { learning: 4, happiness: 4 },
        impactCity: { culture: 5, trust: 15 },
        whatIfText: '선택적 체험 유료화 모델을 이끌어냈습니다. 입장 제한 없이 자발적 참여로 축제 예산을 보태는 평화로운 해법이 되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['공공성과 경제적 자립 양쪽의 가치가 팽팽하므로 시민 공청회 의견을 더 들어보고 싶다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '두 가치 사이의 무게를 신중히 비교하며 시민 토론의 과정을 깊이 지켜봅니다.'
      }
    ]
  },

  // 교육용 2: [가명화 사례] A마을 친환경 자원순환센터(소각시설) 입지와 주민 상생
  {
    id: 'edu_issue_waste_center',
    title: '도시 쓰레기 처리시설과 A마을 주민 상생 (자원순환센터 딜레마)',
    category: '환경 · 절차적 정의',
    triggerAgeRange: [16, 50],
    factText: '도시에서 매일 배출되는 수백 톤의 생활 쓰레기를 안전하게 처리하기 위해 첨단 친환경 자원순환센터 건립이 시급합니다. 시는 부지 조건이 우수한 A마을 인근을 후보지로 검토 중이나, A마을 주민들은 "이미 마을 주변에 여러 기반시설이 들어서 있는데 또 우리 마을인가"라며 사전 설명 부족과 절차적 불평등을 호소하고 있습니다.',
    factSource: '환경 정책 가상 교육용 시나리오 (실제 자원회수시설 입지 갈등 모델링)',
    stanceA: {
      actor: '도시 전체의 안정적 환경 관리를 중시하는 측',
      summary: '쓰레기 대란이 오면 30만 시민 전체가 피해를 봅니다. 최첨단 무공해 정화시설을 갖추고 마을에 주민 수영장·도서관 등 대규모 편익시설을 지어 신속히 추진해야 합니다.'
    },
    stanceB: {
      actor: '입지 후보지 A마을 주민 및 환경정의 단체',
      summary: '필요한 시설이라는 점은 알지만 왜 늘 특정 마을만 양보해야 합니까? 결정 전 주민과의 투명한 대화와 후보지 균등 분산, 쓰레기 배출량 감량 노력이 먼저입니다.'
    },
    counterArgumentForPro: '찬성하는 학생이 알아야 할 점: A마을 주민들은 "내 집 앞이어서 반대하는 것(NIMBY)"이 아니라, 수십 년간 사전 설명 없이 일방적으로 결정되어 온 행정 절차의 불공정함을 지적하고 있습니다.',
    counterArgumentForCon: '반대하는 학생이 알아야 할 점: 쓰레기 처리시설이 늦어지면 매립지가 꽉 차 도시 전체에 쓰레기 수거 중단 위기가 닥치고 처리 비용이 눈덩이처럼 불어납니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['주민이 직접 감시하는 환경 모니터링단 구성 및 마을 복지기금 지원 보장', '충분한 사전 공청회를 거치는 조건'],
        impactPersonal: { learning: 5, bonds: 4, happiness: 2 },
        impactCity: { welfare: 10, trust: 20 },
        whatIfText: '절차적 상생안을 택했습니다. 주민 대표가 시설 운영에 참여하고 친환경 에너지를 마을 난방으로 나누어 쓰는 모델이 정착되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['이웃 도시와의 광역 공동 건립으로 비용과 부지 부담 분산', '전 시민 분리배출 30% 감량 캠페인 우선'],
        impactPersonal: { learning: 6, happiness: 3 },
        impactCity: { welfare: 0, economy: 10, trust: 15 },
        whatIfText: '원천 감량과 광역 상생을 제안했습니다. 학생들과 시민들이 플라스틱 줄이기에 동참하며 처리시설 규모를 대폭 줄였습니다.'
      },
      {
        stance: '찬성',
        reasons: ['도시 전체의 쓰레기 대란을 막는 공익이 최우선이다', '파격적인 마을 보상금으로 주민 숙원사업 해결'],
        impactPersonal: { happiness: -2, incomeChange: 1 },
        impactCity: { welfare: 15, trust: -5 },
        whatIfText: '도시 전체의 공익을 우선했습니다. 시설 착공으로 쓰레기 대란은 막았으나 마을 주민들의 서운함을 달래는 과제가 남았습니다.'
      },
      {
        stance: '반대',
        reasons: ['주민 동의 없는 일방적 입지 지정 철회', '특정 지역에만 부담을 주는 환경 불평등 해소'],
        impactPersonal: { bonds: 5, happiness: 1 },
        impactCity: { welfare: -15, trust: 5 },
        whatIfText: 'A마을 주민들의 절차적 권리를 지켰습니다. 사업은 유보되었으나 임시 쓰레기 처리 방안을 찾기 위한 추가 논의가 시작되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['과학적 환경 영향 조사 결과와 주민들의 구체적 요구사항을 더 공부해보고 결정하고 싶다'],
        impactPersonal: { learning: 3 },
        impactCity: { trust: 0 },
        whatIfText: '신중한 태도로 양측의 근거를 더 깊이 탐구합니다.'
      }
    ]
  },

  // 교육용 3: [가명화 사례] 지역 B제조공장의 구조조정과 청년 고용 상생
  {
    id: 'edu_issue_factory_job',
    title: '오래된 지역 공장의 위기와 일자리 지키기 (B공장 상생 협약)',
    category: '경제 · 노동과 일터',
    triggerAgeRange: [18, 48],
    factText: '50년간 지역의 기둥 역할을 해온 전통 제조업 B공장이 원자재 가격 상승과 건설 경기 침체로 큰 경영 위기를 맞았습니다. 회사는 생존을 위해 공장 부지 일부 매각과 인력 감축을 검토하고 있으나, 노동자들과 지역 상인들은 대규모 실업과 지역 상권 붕괴를 우려하며 고용 보장을 촉구하고 있습니다.',
    factSource: '지역 산업 전환 가상 교육용 시나리오 (실제 제조업 회생 사례 일반화)',
    stanceA: {
      actor: '공장 정상화 및 채권단 측',
      summary: '적자가 누적되어 회사가 완전히 부도나면 모든 일자리가 사라집니다. 뼈를 깎는 구조조정과 비효율 자산 매각으로 일단 회사를 살려야 합니다.'
    },
    stanceB: {
      actor: '노동조합 및 지역 소상공인 연대',
      summary: '수십 년간 땀 흘려 일해 온 숙련 노동자들을 한순간에 내보내는 것은 가혹합니다. 지자체와 노사가 고통을 분담하여 일자리를 지켜야 합니다.'
    },
    counterArgumentForPro: '구조조정을 지지하는 학생이 고려할 점: 해고된 노동자 가정이 겪을 생계 곤란과 지역 골목 식당의 연쇄 폐업이라는 인간적 아픔을 깊이 헤아려야 합니다.',
    counterArgumentForCon: '고용 보장을 요구하는 학생이 고려할 점: 공장이 파산하여 문을 닫으면 단 한 명의 일자리도 건지지 못한다는 냉혹한 경제적 현실을 직시해야 합니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['근로시간 단축을 통한 일자리 나누기(잡 셰어링)로 해고 최소화', '지자체의 긴급 경영자금 지원 및 노동자 전직 교육 병행'],
        impactPersonal: { learning: 5, bonds: 4, happiness: 3 },
        impactCity: { economy: 10, welfare: -5, trust: 20 },
        whatIfText: '노사정 일자리 나누기 협약을 맺었습니다. 노동시간을 조금씩 줄여 아무도 일터를 떠나지 않고 위기를 함께 이겨냈습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['친환경 신소재 제품 개발로 B공장의 사업 구조를 전면 전환', '지역 청년 엔지니어 채용으로 기술 혁신'],
        impactPersonal: { learning: 7, incomeChange: 1 },
        impactCity: { economy: 20, trust: 15 },
        whatIfText: '친환경 미래 산업으로의 피벗을 이끌었습니다. 새로운 세라믹 신소재 개발에 성공하여 다시금 수출 활로를 열었습니다.'
      },
      {
        stance: '찬성',
        reasons: ['시장 원리에 따른 신속한 경영 정상화로 기업 파산 방지'],
        impactPersonal: { incomeChange: 2, happiness: -2 },
        impactCity: { economy: 10, welfare: 10 },
        whatIfText: '회사의 신속한 회생을 도왔습니다. 부채는 줄어들었으나 퇴직한 이웃들의 재취업 지원 과제가 남았습니다.'
      },
      {
        stance: '반대',
        reasons: ['일방적 구조조정에 반대하며 노동자의 생존권 전면 보장'],
        impactPersonal: { bonds: 6, happiness: 1 },
        impactCity: { economy: -10, welfare: -10 },
        whatIfText: '노동자들의 든든한 울타리가 되었습니다. 고용은 지켰으나 회사의 자금난을 풀기 위한 추가 방안이 논의됩니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['기업의 재무제표와 노사 간 대화 경과를 좀 더 면밀히 살펴본 뒤 판단하고 싶다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '노사정 대화의 진전을 차분히 지켜보며 정책적 대안을 모색합니다.'
      }
    ]
  },

  // 교육용 4: [학교와 교육 자치] 원도심 작은 학교 활성화 vs 신도심 교육 인프라
  {
    id: 'edu_issue_school_rebalance',
    title: '작은 학교 살리기와 신도심 과밀학급 해소 (교육 공동체의 선택)',
    category: '교육 · 학교 자치',
    triggerAgeRange: [12, 40],
    factText: '학생 수가 줄어드는 구도심의 오래된 학교들은 신입생이 줄어 통폐합 위기에 처한 반면, 아파트가 새로 들어선 신도심 학교들은 교실이 부족해 운동장에 임시 모듈러 교실을 짓고 있습니다. 한정된 교육 예산을 신도심 학교 증설에 우선 쓸 것인지, 원도심 작은 학교를 특성화 생태학교로 지원해 학생을 분산시킬 것인지 논의가 뜨겁습니다.',
    factSource: '진주시 교육통계연보 및 학생배치계획 기반 시나리오',
    stanceA: {
      actor: '신도심 학부모 및 학생들',
      summary: '운동장도 좁고 한 반에 30명이 넘는 콩나물 교실에서 수업을 듣고 있습니다. 아이들이 안전하고 쾌적하게 공부할 수 있도록 교실 확충이 시급합니다.'
    },
    stanceB: {
      actor: '원도심 마을주민 및 작은 학교 동문회',
      summary: '학교는 동네의 심장입니다. 학교가 문을 닫으면 젊은 가족들이 다 떠나 마을이 사라집니다. 작은 학교만의 장점을 살린 특성화 프로그램을 지원해야 합니다.'
    },
    counterArgumentForPro: '신도심 증설을 지지할 때 생각할 점: 작은 학교가 폐교되면 그 학교를 오랫동안 사랑해 온 아이들과 마을 어르신들이 겪을 상실감을 돌아보아야 합니다.',
    counterArgumentForCon: '작은 학교 지원을 지지할 때 생각할 점: 신도심 아이들이 좁은 교실에서 매일 겪는 급식실 대기 줄과 안전사고 위험을 외면할 수 없습니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['공동통학구역을 지정해 신도심 아이들이 원도심 작은 학교로 스쿨버스를 타고 다닐 수 있게 지원', '작은 학교에 악기·AI 특성화 수업 집중'],
        impactPersonal: { learning: 6, bonds: 5, happiness: 4 },
        impactCity: { space: 0, welfare: 10, trust: 25 },
        whatIfText: '상생 통학 모델을 선택했습니다. 신도심의 과밀이 줄고 원도심 작은 학교는 자연 속 예술 학교로 소문나며 두 지역 모두 만족했습니다.'
      },
      {
        stance: '찬성',
        reasons: ['학생 수가 많은 신도심 학교에 교실과 체육관을 우선 신축해 학습권 보장'],
        impactPersonal: { learning: 5, happiness: 2 },
        impactCity: { space: 20, economy: 10 },
        whatIfText: '신도심 쾌적한 교실 확충을 이끌었습니다. 과밀학급은 해소되었으나 원도심 모교의 학생 수 감소는 지속되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['마을 교육공동체 유지를 위해 원도심 학교 통폐합 전면 반대 및 마을도서관 연계'],
        impactPersonal: { bonds: 7, happiness: 3 },
        impactCity: { space: -20, culture: 15 },
        whatIfText: '작은 학교 지키기에 앞장섰습니다. 동네 골목마다 아이들의 웃음소리가 이어지며 온 마을이 아이를 함께 키우는 학교가 되었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['신도심과 원도심 학교 간 자매결연 계절학기 수업 및 시설 공동 이용'],
        impactPersonal: { learning: 4, bonds: 4 },
        impactCity: { space: 5, trust: 15 },
        whatIfText: '학교 간 상호 교류 프로그램을 만들었습니다. 서로 다른 환경의 친구들이 교류하며 진주 전체를 배움터로 삼았습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['학생들의 실제 통학 거리와 만족도 조사를 먼저 종합적으로 분석해야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '학생들의 목소리를 더 자세히 듣기 위한 학생 설문조사를 제안합니다.'
      }
    ]
  }
];

// 모드에 따라 딜레마 목록 반환
export function getDilemmas(isEduMode: boolean): DilemmaIssue[] {
  return isEduMode ? JINJU_DILEMMAS_EDU : JINJU_DILEMMAS_NORMAL;
}
