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
  },

  // 실명 4: [원도심 학교 통폐합] 봉원중학교·진주여중 등 원도심 학교 통폐합 및 신도심 이전
  {
    id: 'issue_school_closure_bongwon',
    title: '원도심 학령인구 감소와 봉원중학교 등 관내 학교 통폐합',
    category: '교육 · 학교 자치',
    triggerAgeRange: [13, 50],
    districtFilter: ['sangbong', 'seongbuk', 'jungang', 'chojang', 'chungmugong'],
    requireSchools: ['진주봉원중학교', '진주여자중학교', '봉원초등학교', '봉래초등학교', '진주초등학교'],
    factText: '상봉동·성북동 등 원도심 지역의 학령인구 급감으로 봉원중학교와 진주여중 등 유서 깊은 중학교들의 학급 수가 급격히 줄어들었습니다. 경상남도교육청은 교육과정 정상화와 신도심(초전·충무공동) 과밀학급 해소를 위해 원도심 학교의 신도심 이전 재배치 또는 남녀공학 통폐합을 추진하고 있습니다. 그러나 동문회와 원도심 주민들은 70년 전통 모교의 역사 단절과 원도심의 공동화를 우려하며 거세게 반발하고 있습니다.',
    factSource: '경상남도교육청 진주관내 중학교 학교군 개편안 및 학교재배치 타당성조사',
    stanceA: {
      actor: '도교육청 및 신도심 학부모 연대',
      summary: '한 학년에 1~2학급에 불과한 소규모 학교에서는 체육대회나 동아리 활동 등 정상적인 교과 수업이 불가능합니다. 신도심으로 이전하거나 통합해 학생들의 실질적 학습권을 보장해야 합니다.'
    },
    stanceB: {
      actor: '봉원중·원도심 학교 동문회 및 상봉동 주민자치회',
      summary: '학교는 동네의 정체성이자 젊은 부모가 머무는 최후의 보루입니다. 학생 수가 적다고 신도심으로 학교를 빼앗아가면 원도심은 완전히 노인들만 남는 폐허가 됩니다.'
    },
    counterArgumentForPro: '학교 이전을 찬성할 때 생각할 점: 70년 세월 동안 동네를 지켜온 모교가 사라질 때 원도심 주민들과 졸업생들이 겪는 뿌리 뽑힌 상실감을 고려해야 합니다.',
    counterArgumentForCon: '학교 존치를 요구할 때 생각할 점: 전교생 60명 학교에서 친구 사귀기도 어렵고 선택과목도 개설되지 못해 학습권 침해를 겪는 아이들의 현실을 외면할 수 없습니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['기존 상봉동 학교 부지를 청소년 복합문화센터·공공도서관으로 100% 환원하는 조건으로 신도심 이전', '남녀공학 개편으로 학급 규모 유지'],
        impactPersonal: { learning: 6, bonds: 4, happiness: 2 },
        impactCity: { space: 15, welfare: 10, trust: 15 },
        whatIfText: '문화복합공간 환원을 전제로 학교 이전에 합의했습니다. 신도심에는 첨단 학교가 들어서고 기존 교사는 주민 문화 쉼터로 재탄생했습니다.'
      },
      {
        stance: '반대',
        reasons: ['70년 역사 모교 존치와 원도심 공동화 방지', '작은 학교의 장점을 살린 인문·예술 특성화 거점중학교 육성'],
        impactPersonal: { bonds: 8, happiness: 4 },
        impactCity: { space: -20, culture: 20 },
        whatIfText: '모교 지키기에 나섰습니다. 봉원중학교는 전교생 1:1 맞춤형 진로 멘토링 특성화 학교로 거듭나며 원도심 골목의 활기를 지켰습니다.'
      },
      {
        stance: '찬성',
        reasons: ['신도심 과밀학급 해소와 학생들의 다양한 교과 선택권 보장이 최우선'],
        impactPersonal: { learning: 7, happiness: 1 },
        impactCity: { space: 25, economy: 10 },
        whatIfText: '교육 행정의 효율성을 지지했습니다. 신도심 이전으로 쾌적한 학습 환경이 열렸으나 원도심 상권은 학생 감소의 타격을 입었습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['신도심-원도심 간 광역 공동학구제 스쿨버스 운영으로 신도심 학생을 원도심 학교로 유입'],
        impactPersonal: { learning: 4, bonds: 5 },
        impactCity: { space: 0, trust: 20 },
        whatIfText: '역발상 통학 모델을 제안했습니다. 신도심 학생들이 스쿨버스를 타고 원도심 작은 학교로 통학하며 자연 친화적 교육을 받게 되었습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['재학생들과 학부모들의 전수 설문조사 결과를 먼저 확인하고 결정해야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '당사자인 학생들의 목소리를 가장 먼저 듣기 위해 신중히 지켜봅니다.'
      }
    ]
  },

  // 실명 5: [남강유등축제 유무료화] 유등축제 입장료 징수 vs 시민 열린 쉼터
  {
    id: 'issue_yudeung_normal_fee',
    title: '대한민국 명예대표축제 남강유등축제의 유료화 논쟁과 시민의 쉼터',
    category: '문화관광 · 시민 자치',
    triggerAgeRange: [16, 60],
    districtFilter: ['seongbuk', 'cheonjeon', 'jungang', 'gaho', 'sinan', 'pyeonggeo'],
    factText: '진주남강유등축제는 임진왜란 진주성 전투에서 유래한 7만 개 유등의 세계적 축제입니다. 2015년 축제 자립화를 위해 전면 유료화(성인 1만 원)와 남강 둘레 2.8km 가림막 설치를 단행했을 당시, 외지 관광객 수입은 늘었으나 "시민들이 산책하던 남강을 붉은 천막으로 가로막았다"는 거센 시민 저항과 갈등을 겪었습니다. 이후 시민 자율 무료화로 환원되었으나, 매년 40억 원이 넘는 시 예산 투입과 상인-시민 간 유무료화 논쟁은 지금도 계속되고 있습니다.',
    factSource: '진주시 남강유등축제 백서 및 진주시의회 문화복지위원회 감사록',
    stanceA: {
      actor: '축제재단 및 원도심 상인연합회',
      summary: '언제까지 시민 혈세로만 축제를 치를 수는 없습니다. 외지 관광객에게 정당한 입장료나 부교 통행료를 받아 콘텐츠를 혁신하고 상권을 살려야 합니다.'
    },
    stanceB: {
      actor: '진주 시민사회 및 남강 산책 주민 모임',
      summary: '남강과 진주성은 조상들의 얼이 깃든 시민 모두의 안식처입니다. 가림막을 치고 입장료를 받는 것은 시민의 권리를 침해하고 축제의 역사적 본질을 훼손합니다.'
    },
    counterArgumentForPro: '유료화를 주장할 때 생각할 점: 가림막으로 막힌 남강변을 바라보며 자부심 대신 소외감을 느껴야 했던 시민들의 깊은 상처를 헤아려야 합니다.',
    counterArgumentForCon: '무료화를 주장할 때 생각할 점: 40억 원의 시 보조금이 고갈되면 축제 안전 요원 배치와 유등 품질이 저하되어 전국 축제로서의 명성을 잃게 됩니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['진주시민은 신분증 확인 후 100% 무료 입장, 외지 관광객에게만 진주사랑상품권 연계 유료 티켓 판매'],
        impactPersonal: { happiness: 4, learning: 3, incomeChange: 1 },
        impactCity: { culture: 15, welfare: 10, trust: 25 },
        whatIfText: '시민 우대와 상품권 페이백 모델을 이끌어냈습니다. 시민의 자부심을 지키면서 외지 관광객 소비가 중앙시장으로 흘러들어 상권이 활기를 띠었습니다.'
      },
      {
        stance: '반대',
        reasons: ['가림막 없는 완전 무료 개방 원칙 고수', '유등 띄우기 시민 자치 펀딩으로 혈세 투입 절감'],
        impactPersonal: { happiness: 7, bonds: 6 },
        impactCity: { culture: -10, trust: 20 },
        whatIfText: '시민의 열린 강변을 수호했습니다. 가을밤 붉은 가림막 없이 온 가족이 남강 둔치에 돗자리를 펴고 은은한 유등 불빛을 감상합니다.'
      },
      {
        stance: '찬성',
        reasons: ['글로벌 명품 축제로의 도약과 세계적 유등 조형물 확충을 위한 전면 유료화'],
        impactPersonal: { incomeChange: 2, learning: 4 },
        impactCity: { culture: 30, economy: 20 },
        whatIfText: '세계화를 지지했습니다. 첨단 드론 쇼와 미디어아트 유등이 화려하게 밤하늘을 수놓았으나 강변 산책로 일부 통제는 감수해야 했습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['부교(배다리) 통행료와 유등 띄우기 소원 체험권만 선택적 유료화로 재원 조달'],
        impactPersonal: { learning: 5, bonds: 3 },
        impactCity: { culture: 10, trust: 15 },
        whatIfText: '체험 선택 유료화 해법을 제시했습니다. 입장권 갈등 없이 누구나 자유롭게 축제를 즐기며 성공적인 절충점을 찾았습니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['시민 여론조사와 축제 재정 건전성 평가 결과를 더 종합적으로 보고 싶다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '공공성과 경제성의 균형을 고민하며 시민 공론장을 지켜봅니다.'
      }
    ]
  },

  // 실명 6: [지수면 승산마을 K-기업가정신 vs 조용한 마을 보존]
  {
    id: 'issue_k_entrepreneur_jisu',
    title: '지수면 승산마을 K-기업가정신 수도 관광벨트화와 한옥마을 보존',
    category: '역사문화 · 지역개발',
    triggerAgeRange: [22, 65],
    districtFilter: ['jisu', 'jinseong', 'sabong', 'ilbanseong'],
    factText: '진주시 지수면 승산마을은 삼성 이병철, LG 구인회, 효성 조홍제 등 대한민국 대표 글로벌 창업주들을 배출한 옛 지수초등학교가 있는 유서 깊은 한옥마을입니다. 진주시는 이곳을 "K-기업가정신 수도"로 선포하고 대규모 관광호텔, 주차장, 기업가 교육센터를 건립하여 연간 수십만 관광객을 유치하려 합니다. 반면 고요한 종택을 지켜온 고령의 원주민들은 관광객 소음과 한옥마을 상업화로 인한 평온한 삶의 파괴를 호소하고 있습니다.',
    factSource: '중소벤처기업진흥공단 K-기업가정신센터 및 진주시 관광개발과 종합계획',
    stanceA: {
      actor: '진주시 관광진흥과 및 경제인 연합',
      summary: '기업가정신은 진주가 가진 전 세계 유일무이한 역사문화 자산입니다. 소멸해가는 농촌 마을에 도로를 뚫고 관광객을 불러모아야 청년이 돌아오고 지역경제가 살아납니다.'
    },
    stanceB: {
      actor: '승산마을 문중 종손 및 원주민 대책위',
      summary: '수백 년을 이어온 남명 조식 선생의 경의(敬義) 사상과 고즈넉한 한옥 골목이 상업적 펜션과 대형 버스 매연으로 뒤덮이고 있습니다. 마을의 원형과 고요함을 보존해야 합니다.'
    },
    counterArgumentForPro: '개발을 찬성할 때 생각할 점: 평생 조용히 농사지으며 살아온 시골 어르신들이 매일 쏟아지는 관광객 카메라와 소음으로 겪는 사생활 침해를 살펴야 합니다.',
    counterArgumentForCon: '보존을 요구할 때 생각할 점: 관광 개발마저 없으면 아이 울음소리가 끊긴 지수면은 10년 뒤 완전한 인구 소멸 고위험 지역으로 전락한다는 경고를 외면할 수 없습니다.',
    isEduModeSafe: true,
    options: [
      {
        stance: '조건부 찬성',
        reasons: ['마을 외곽에 환승주차장을 짓고 마을 내부는 전기 셔틀만 운행하는 저탄소 생태 한옥마을 모델', '마을 농산물 직거래 장터 수익 문중 환원'],
        impactPersonal: { learning: 6, bonds: 4, incomeChange: 1 },
        impactCity: { culture: 20, economy: 15, trust: 20 },
        whatIfText: '친환경 상생 관광을 지지했습니다. 고즈넉한 한옥 골목길의 정취를 해치지 않으면서 전국의 청년 창업가들이 찾아오는 배움터가 되었습니다.'
      },
      {
        stance: '반대',
        reasons: ['인위적 테마파크식 관광지 개발 중단', '승산마을 한옥과 종택의 국가등록문화재 지정 및 원형 영구 보존'],
        impactPersonal: { bonds: 7, happiness: 4 },
        impactCity: { culture: -10, trust: 15 },
        whatIfText: '마을의 고요함과 정신을 지켰습니다. 화려한 상업시설 대신 은은한 흙담길과 종택의 기품이 온전히 후손들에게 전해졌습니다.'
      },
      {
        stance: '찬성',
        reasons: ['K-기업가정신 글로벌 연수원과 리조트 조성으로 진주 동부권 관광 대도약 추진'],
        impactPersonal: { incomeChange: 3, happiness: 1 },
        impactCity: { economy: 30, culture: 20 },
        whatIfText: '세계적 기업가정신 명소 육성을 지지했습니다. 전국에서 교육생들이 몰려들며 진주 동부권에 활발한 경제적 낙수효과가 발생했습니다.'
      },
      {
        stance: '대안 제시',
        reasons: ['관광객 유치보다 청년 스타트업 인큐베이팅 캠퍼스로 조성하여 실질적 청년 창업 인구 정주 유도'],
        impactPersonal: { learning: 8, happiness: 3 },
        impactCity: { economy: 20, space: 10, trust: 15 },
        whatIfText: '청년 창업 캠퍼스 모델을 제안했습니다. 옛 지수초등학교 교실에서 청년들이 밤낮으로 아이디어를 나누며 한국의 새 벤처를 일굽니다.'
      },
      {
        stance: '판단 보류',
        reasons: ['마을 주민들과의 1:1 보상·정주 여건 협약 결과를 먼저 확인해야 한다'],
        impactPersonal: { learning: 2 },
        impactCity: { trust: 0 },
        whatIfText: '마을 공동체와 지자체 간의 협상 과정을 주의 깊게 지켜봅니다.'
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

// 모드에 따라 딜레마 목록 반환 (시민의 거주지, 학교, 연령 프로필에 따라 맞춤 가중 추천)
export function getDilemmas(isEduMode: boolean): DilemmaIssue[] {
  if (isEduMode) {
    // 교육용 모드에서는 안전성이 보장된 교육용 딜레마 및 종결 실명 사례(유등축제, 학교통폐합, 승산마을 등) 포함
    const safeNormalDilemmas = JINJU_DILEMMAS_NORMAL.filter(d => d.isEduModeSafe);
    return [...JINJU_DILEMMAS_EDU, ...safeNormalDilemmas];
  }
  return JINJU_DILEMMAS_NORMAL;
}
