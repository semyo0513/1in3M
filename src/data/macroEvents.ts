import { CardLabel } from '../types/game';

export interface MacroEventDef {
  id: string;
  minAge: number;
  maxAge: number;
  cooldownYears: number;
  text: string;
  sourceNote: string;
  label: CardLabel;
  impact: {
    health?: number;
    happiness?: number;
    learning?: number;
    bonds?: number;
    netWorthChange?: number; // 가계 자산 직접 변동 (난방비/이자부담/성과급 등)
  };
}

export const MACRO_EVENTS: MacroEventDef[] = [
  {
    id: 'macro_oil_shock',
    minAge: 20,
    maxAge: 85,
    cooldownYears: 6,
    text: '중동 분쟁 격화로 국제 유가가 배럴당 110달러를 돌파했습니다. 주유비와 도시가스 난방비 고지서가 껑충 뛰고, 진주 시내 물가와 상평산단 물류비가 출렁입니다.',
    sourceNote: '한국석유공사 유가정보서비스 오피넷 & 통계청 소비자물가지수',
    label: 'FACT',
    impact: { happiness: -5, health: -1, netWorthChange: -1800000 }
  },
  {
    id: 'macro_geopolitical_grain_war',
    minAge: 20,
    maxAge: 85,
    cooldownYears: 7,
    text: '유라시아 곡물 수출 지대의 지정학적 전쟁 장기화로 글로벌 밀·식용유 수급난이 덮쳤습니다. 진주 시내 단골 식당의 음식값과 장바구니 밥상 물가가 크게 올랐습니다.',
    sourceNote: 'UN 식량농업기구(FAO) 세계식량가격지수 & 농림축산식품부',
    label: 'FACT',
    impact: { happiness: -4, netWorthChange: -1200000 }
  },
  {
    id: 'macro_fed_interest_hike',
    minAge: 26,
    maxAge: 70,
    cooldownYears: 6,
    text: '미국 연방준비제도(Fed)의 급격한 긴축으로 시중 은행 대출금리가 6~7%대로 치솟았습니다. 주택담보대출 이자 부담이 가중되어 외식과 여가 예산을 긴축합니다.',
    sourceNote: '한국은행 경제통계시스템(ECOS) 가계대출 금리 동향',
    label: 'FACT',
    impact: { happiness: -6, health: -2, netWorthChange: -2500000 }
  },
  {
    id: 'macro_aerospace_defense_boom',
    minAge: 22,
    maxAge: 65,
    cooldownYears: 6,
    text: 'K-방산 및 우주항공 수주 호조로 진주·사천 항공우주 산업클러스터가 세계적인 주목을 받습니다. 지역 협력업체에 활기가 돌고 특별 성과급과 채용 문호가 넓어졌습니다.',
    sourceNote: '산업통상자원부 방위산업·우주항공 수출통계',
    label: 'FACT',
    impact: { happiness: 6, learning: 3, netWorthChange: 3200000 }
  },
  {
    id: 'macro_climate_extreme_flood',
    minAge: 20,
    maxAge: 88,
    cooldownYears: 7,
    text: '지구온난화로 인한 기록적 집중호우로 남강 수위가 위험 수위까지 치솟았습니다. 진주시 재난대책본부가 비상 가동되었고, 이웃들과 흙포대를 쌓으며 공동체의 연대를 다졌습니다.',
    sourceNote: '기상청 국가기후데이터센터 & 환경부 남강 홍수통제소',
    label: 'FACT',
    impact: { bonds: 5, happiness: -4, health: -3, netWorthChange: -900000 }
  },
  {
    id: 'macro_pandemic_wave',
    minAge: 18,
    maxAge: 85,
    cooldownYears: 8,
    text: '신종 호흡기 감염병의 전 세계적 확산으로 사회적 거리두기와 마스크 착용이 일상화되었습니다. 남강변 산책로가 한산해지고 디지털 비대면 문화가 깊숙이 자리 잡았습니다.',
    sourceNote: '질병관리청 감염병 감시연보 & 보건복지부',
    label: 'FACT',
    impact: { health: -3, bonds: -4, learning: 4, happiness: -4 }
  },
  {
    id: 'macro_ai_automation_wave',
    minAge: 20,
    maxAge: 65,
    cooldownYears: 6,
    text: '글로벌 생성형 AI와 첨단 자동화 시스템이 일터에 전격 도입되었습니다. 낯선 디지털 업무 툴을 밤늦게 공부하느라 머리가 지끈거리지만, 작업 생산성이 훌쩍 향상되었습니다.',
    sourceNote: '과학기술정보통신부 인공지능(AI) 산업 실태조사',
    label: 'FACT',
    impact: { learning: 7, happiness: 2, health: -2 }
  },
  {
    id: 'macro_stock_rally_dividend',
    minAge: 25,
    maxAge: 75,
    cooldownYears: 5,
    text: '글로벌 첨단 기술주 랠리와 K-배터리·반도체 수출 실적 반등으로 국내 증시가 깜짝 상승했습니다. 틈틈이 모아온 우량주 적립식 투자 계좌에서 기분 좋은 수익이 발생했습니다.',
    sourceNote: '한국거래소(KRX) 유가증권시장 동향 보고서',
    label: 'FACT',
    impact: { happiness: 6, netWorthChange: 2600000 }
  }
];

export function pickMacroEvent(
  age: number,
  seenEvents: Set<string>,
  cooldowns: Record<string, number>
): MacroEventDef | null {
  if (age < 20) return null; // 성인기 이후 본격적인 거시 경제/국제 정세 체감

  // 연간 22%의 확률로 글로벌 거시/국제정세 악재·호재 인카운터 발생
  if (Math.random() > 0.22) return null;

  const eligible = MACRO_EVENTS.filter(e => {
    if (age < e.minAge || age > e.maxAge) return false;
    if ((cooldowns[e.id] || 0) > 0) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  // 덜 노출된 이벤트를 우선적으로 선택
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled[0];
}
