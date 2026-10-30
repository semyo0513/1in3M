import React from 'react';
import { LifeChoiceCard, LifeChoiceOption } from '../types/game';
import { Compass, BarChart3, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface LifeChoiceModalProps {
  choiceCard: LifeChoiceCard;
  age: number;
  year: number;
  citizenLearning: number;
  citizenIncomeDecile: number;
  isEduMode?: boolean;
  onSelectOption: (option: LifeChoiceOption) => void;
}

export const LifeChoiceModal: React.FC<LifeChoiceModalProps> = ({
  choiceCard,
  age,
  year,
  citizenLearning,
  citizenIncomeDecile,
  isEduMode = false,
  onSelectOption
}) => {
  const handleSelect = (option: LifeChoiceOption) => {
    audioManager.playClickSound();
    onSelectOption(option);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'YOUTH_MIGRATION':
        return 'from-sky-950/80 to-space-900 border-sky-500/40 text-sky-300';
      case 'MILITARY_DUTY':
        return 'from-emerald-950/80 to-space-900 border-emerald-500/40 text-emerald-300';
      case 'MARRIAGE':
        return 'from-rose-950/80 to-space-900 border-rose-500/40 text-rose-300';
      case 'CHILDCARE':
        return 'from-amber-950/80 to-space-900 border-amber-500/40 text-amber-300';
      case 'SPEND':
        return 'from-yellow-950/80 to-space-900 border-yellow-500/40 text-yellow-300';
      case 'HOBBY':
        return 'from-purple-950/80 to-space-900 border-purple-500/40 text-purple-300';
      case 'MEDICAL':
        return 'from-teal-950/80 to-space-900 border-teal-500/40 text-teal-300';
      case 'WEALTH_GROWTH':
        return 'from-amber-950/90 via-yellow-950/40 to-space-900 border-amber-400/50 text-amber-200';
      default:
        return 'from-amber-950/80 to-space-900 border-amber-500/40 text-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-space-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* 상단 헤더 */}
        <div className={`bg-gradient-to-r ${getCategoryColor(choiceCard.category)} px-4 sm:px-6 py-3.5 sm:py-4 border-b flex items-center justify-between`}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-black/30 border border-white/10">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400/90">
                  {age}세 ({year}년) · 생애 전환 갈림길
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/40 border border-white/15">
                  {choiceCard.categoryName}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug mt-0.5">
                {choiceCard.title}
              </h2>
            </div>
          </div>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          
          {/* 생애 상황 본문 */}
          <div className="bg-space-850 p-4 rounded-xl border border-slate-700/60 text-slate-200 leading-relaxed text-sm">
            {choiceCard.body}
          </div>

          {/* 대한민국 표본 통계 실증 팩트 상자 */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 text-slate-300">
            <BarChart3 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs leading-relaxed">
              <span className="font-bold text-amber-300 block mb-0.5">📊 대한민국 표본 통계 실증 팩트</span>
              {choiceCard.statContextFact}
            </div>
          </div>

          {/* 선택지 목록 */}
          <div className="space-y-2.5 pt-1">
            <div className="text-xs font-bold text-slate-400 px-1">
              어떤 길을 선택하시겠습니까? (선택에 따라 생애 궤적과 지표가 달라집니다)
            </div>

            {choiceCard.options.map((option, idx) => {
              const isLockedByLearning = option.conditions?.learningMin && citizenLearning < option.conditions.learningMin;

              return (
                <button
                  key={option.optionId}
                  onClick={() => !isLockedByLearning && handleSelect(option)}
                  disabled={Boolean(isLockedByLearning)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col gap-2 group ${
                    isLockedByLearning
                      ? 'bg-space-950/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      : 'bg-space-850 hover:bg-space-800 border-slate-700/80 hover:border-amber-500/60 text-slate-100 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-300 transition">
                      <span className="w-5 h-5 rounded-full bg-space-950 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 group-hover:border-amber-400 group-hover:text-amber-400">
                        {idx + 1}
                      </span>
                      <span>{option.label}</span>
                    </div>
                    {!isLockedByLearning && (
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                    )}
                  </div>

                  {/* 조건 부족 안내 */}
                  {isLockedByLearning && (
                    <div className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>선택 불가: 배움 지표 {option.conditions?.learningMin} 이상 필요 (현재: {citizenLearning})</span>
                    </div>
                  )}

                  {/* 지표 영향 요약 칩 */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {option.effects.health !== undefined && option.effects.health !== 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        option.effects.health > 0 ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
                      }`}>
                        건강 {option.effects.health > 0 ? `+${option.effects.health}` : option.effects.health}
                      </span>
                    )}
                    {option.effects.happiness !== undefined && option.effects.happiness !== 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        option.effects.happiness > 0 ? 'bg-amber-950/60 border-amber-500/30 text-amber-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
                      }`}>
                        행복 {option.effects.happiness > 0 ? `+${option.effects.happiness}` : option.effects.happiness}
                      </span>
                    )}
                    {option.effects.learning !== undefined && option.effects.learning !== 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        option.effects.learning > 0 ? 'bg-blue-950/60 border-blue-500/30 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}>
                        배움 {option.effects.learning > 0 ? `+${option.effects.learning}` : option.effects.learning}
                      </span>
                    )}
                    {option.effects.bonds !== undefined && option.effects.bonds !== 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        option.effects.bonds > 0 ? 'bg-violet-950/60 border-violet-500/30 text-violet-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
                      }`}>
                        관계 {option.effects.bonds > 0 ? `+${option.effects.bonds}` : option.effects.bonds}
                      </span>
                    )}
                    {option.effects.spend !== undefined && option.effects.spend !== 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        option.effects.spend > 0 ? 'bg-teal-950/60 border-teal-500/30 text-teal-300' : 'bg-orange-950/60 border-orange-500/30 text-orange-300'
                      }`}>
                        {option.effects.spend > 0 ? '가계 지출 절감' : option.effects.spend < -2 ? '막대한 가계 지출' : '가계 지출 발생'}
                      </span>
                    )}
                    {option.effects.netWorthChange !== undefined && option.effects.netWorthChange !== 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        option.effects.netWorthChange > 0 ? 'bg-amber-950/70 border-amber-400/50 text-amber-300 font-bold' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      }`}>
                        자산 {option.effects.netWorthChange > 0 ? `+${Math.floor(option.effects.netWorthChange / 10000).toLocaleString('ko-KR')}만 원` : `${Math.floor(option.effects.netWorthChange / 10000).toLocaleString('ko-KR')}만 원`}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* 푸터 안내 */}
        <div className="bg-space-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>인생의 모든 선택에는 기회비용과 트레이드오프가 따릅니다.</span>
          <span className="font-mono text-slate-500">통계청 실증 데이터 기반</span>
        </div>

      </div>
    </div>
  );
};

export default LifeChoiceModal;
