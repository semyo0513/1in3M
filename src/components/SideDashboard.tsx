import React, { useState } from 'react';
import { CohortPerson, ChoiceRecord, CityMacroIndicators } from '../types/game';
import { Users2, MapPin, Scale, Sparkles, History, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface SideDashboardProps {
  cohort: CohortPerson[];
  birthYear: number;
  choicesHistory: ChoiceRecord[];
  cityIndicators: CityMacroIndicators;
  activeTab?: 'impact' | 'cohort';
  onTabChange?: (tab: 'impact' | 'cohort') => void;
}

export const SideDashboard: React.FC<SideDashboardProps> = ({
  cohort,
  birthYear,
  choicesHistory,
  cityIndicators,
  activeTab: externalTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'impact' | 'cohort'>('impact');
  const activeTab = externalTab ?? internalTab;

  const handleTabClick = (t: 'impact' | 'cohort') => {
    if (onTabChange) onTabChange(t);
    else setInternalTab(t);
    audioManager.playClickSound();
  };

  const latestChoice = choicesHistory.length > 0 ? choicesHistory[choicesHistory.length - 1] : null;

  // 도시 지표 해석 도우미
  const getSpaceLabel = (val: number) => {
    if (val > 15) return '충무공동·초전 등 신도심 인프라 쏠림 심화';
    if (val < -15) return '원도심 도시재생 및 작은 학교 집중 지원';
    return '원도심과 신도심 간 상대적 균형 상태';
  };

  const getEconomyLabel = (val: number) => {
    if (val > 15) return '우주항공·세라믹 첨단 신산업 육성 가속';
    if (val < -15) return '중앙시장 골목상권 및 수곡 스마트팜 보호';
    return '전통 가업과 미래 신산업의 공존';
  };

  const getWelfareLabel = (val: number) => {
    if (val < -15) return '서부경남 공공병원 확충 및 필수의료 안전망 강화';
    if (val > 15) return '시 재정 건전성 방어 및 민간 효율 우선';
    return '공공의료와 시 재정 간 완충 상태';
  };

  const getCultureLabel = (val: number) => {
    if (val > 15) return '남강 케이블카 등 체류형 메가 관광 랜드마크화';
    if (val < -15) return '진주성·촉석루 역사 생태 원형 보존 우선';
    return '일상 쉼터와 관광 상업화의 절충';
  };

  return (
    <div className="w-full h-full min-w-0 min-h-0 flex flex-col bg-space-900 lg:border-l border-space-700 text-xs">
      
      {/* 사이드바 상단 탭 헤더 */}
      <div className="p-2 sm:p-2.5 border-b border-space-700 bg-space-950/80 shrink-0 w-full min-w-0">
        <div className="flex rounded-xl bg-space-850 p-1 border border-slate-800">
          <button
            onClick={() => handleTabClick('impact')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-medium ${
              activeTab === 'impact'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>내 선택 & 도시 변화</span>
            {choicesHistory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-space-950 text-[10px] font-bold">
                {choicesHistory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('cohort')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-medium ${
              activeTab === 'cohort'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>동갑내기 4인</span>
          </button>
        </div>
      </div>

      {/* 탭 1: 내 선택으로 변화된 상황 (명시적 피드백) */}
      {activeTab === 'impact' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 pb-28 sm:pb-8 w-full min-w-0 custom-scrollbar">
          
          {/* 최근 내 선택 피드백 카드 */}
          {latestChoice ? (
            <div className="bg-gradient-to-br from-amber-950/30 to-space-850 border border-amber-500/40 rounded-xl p-3 sm:p-3.5 shadow-md">
              <div className="flex items-center justify-between mb-1 text-[11px]">
                <span className="font-mono text-amber-400 font-bold">
                  최근 나의 결정 ({latestChoice.age}세)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                  {latestChoice.stance}
                </span>
              </div>

              <h4 className="font-bold text-slate-100 text-xs sm:text-sm mb-1 line-clamp-1">
                {latestChoice.issueTitle}
              </h4>

              <div className="text-[11px] text-slate-300 italic mb-2 bg-space-900/60 p-2 rounded border border-slate-800">
                "{latestChoice.reason}"
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-purple-300 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{latestChoice.impactSummary}</span>
              </div>
            </div>
          ) : (
            <div className="bg-space-850/60 p-3 rounded-xl border border-slate-800 text-slate-400 text-center py-5">
              <Scale className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
              <p className="font-medium text-slate-300 mb-0.5">아직 마주한 갈림길이 없습니다</p>
              <p className="text-[11px] text-slate-500">
                청소년기(14세), 청년기(25세) 등 생애 주기에 따라 진주시의 대립 현안이 열립니다.
              </p>
            </div>
          )}

          {/* 내 선택이 빚어낸 진주시 트레이드오프 게이지 현황 */}
          <div className="bg-space-850/90 rounded-xl p-3 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <span>진주시 도시 기류 현황</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                사회적 신뢰도 {cityIndicators.trust}%
              </span>
            </div>

            {/* 1. 공간 축 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">공간: 원도심 vs 신도심</span>
                <span className="font-mono font-bold text-sky-300">
                  {cityIndicators.space > 0 ? `+${cityIndicators.space} 신도심` : cityIndicators.space < 0 ? `${cityIndicators.space} 원도심` : '0 균형'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all duration-500"
                  style={{ width: `${Math.max(5, ((cityIndicators.space + 100) / 200) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">{getSpaceLabel(cityIndicators.space)}</p>
            </div>

            {/* 2. 경제 축 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">경제: 골목농가 vs 첨단산단</span>
                <span className="font-mono font-bold text-amber-300">
                  {cityIndicators.economy > 0 ? `+${cityIndicators.economy} 첨단산단` : cityIndicators.economy < 0 ? `${cityIndicators.economy} 골목농가` : '0 절충'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${Math.max(5, ((cityIndicators.economy + 100) / 200) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">{getEconomyLabel(cityIndicators.economy)}</p>
            </div>

            {/* 3. 복지 축 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">보건복지: 공공복지 vs 재정건전</span>
                <span className="font-mono font-bold text-emerald-300">
                  {cityIndicators.welfare < 0 ? `${cityIndicators.welfare} 공공복지` : cityIndicators.welfare > 0 ? `+${cityIndicators.welfare} 재정건전` : '0 중립'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(5, ((cityIndicators.welfare + 100) / 200) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">{getWelfareLabel(cityIndicators.welfare)}</p>
            </div>

            {/* 4. 문화 축 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">역사문화: 생태보존 vs 관광개발</span>
                <span className="font-mono font-bold text-purple-300">
                  {cityIndicators.culture > 0 ? `+${cityIndicators.culture} 관광개발` : cityIndicators.culture < 0 ? `${cityIndicators.culture} 생태보존` : '0 조화'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${Math.max(5, ((cityIndicators.culture + 100) / 200) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">{getCultureLabel(cityIndicators.culture)}</p>
            </div>

          </div>

          {/* 내가 내린 선택 히스토리 목록 */}
          {choicesHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>나의 선택 발자취 ({choicesHistory.length}건)</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {choicesHistory.slice().reverse().map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-space-850 border border-slate-800 text-[11px]">
                    <div className="flex justify-between items-center font-semibold mb-0.5 min-w-0 gap-2">
                      <span className="text-slate-200 truncate flex-1 min-w-0">{c.issueTitle}</span>
                      <span className="text-amber-300 font-mono shrink-0 ml-1">
                        {c.age}세 · {c.stance}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[10px] line-clamp-1 break-all">
                      "{c.reason}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 탭 2: 동시 출생 코호트 (동갑내기 4인) */}
      {activeTab === 'cohort' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 pb-28 sm:pb-8 w-full min-w-0 custom-scrollbar">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-semibold text-slate-300">
              {birthYear}년생 동갑내기 4인
            </span>
            <span className="text-[10px] text-slate-500">
              실시간 상태
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            같은 해 진주에서 태어났지만, 다른 권역과 직업에서 살아가는 시민들의 삶입니다.
          </p>

          <div className="space-y-2.5">
            {cohort.map((p) => (
              <div
                key={p.id}
                className={`p-3 rounded-xl border transition-all ${
                  p.isAlive
                    ? 'bg-space-850/90 border-slate-800 hover:border-slate-700'
                    : 'bg-space-950/40 border-slate-900 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1 min-w-0 gap-2">
                  <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5 min-w-0 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.isAlive ? 'bg-sky-400' : 'bg-slate-600'}`}></span>
                    <span className="truncate">{p.name}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-800 text-slate-400 border border-slate-700/60 flex items-center gap-1 shrink-0">
                    <MapPin className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                    <span>{p.district}</span>
                  </span>
                </div>

                <div className="text-[11px] text-amber-300/90 font-medium mb-1 truncate">
                  {p.job}
                </div>

                <p className="text-[11px] text-slate-400 leading-normal font-sans break-keep">
                  {p.statusText}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-2 text-[10px] text-slate-500 text-center border-t border-slate-800/80 pt-2">
            통계청 인구 이동 및 직업 분포 모델링
          </div>
        </div>
      )}

    </div>
  );
};
