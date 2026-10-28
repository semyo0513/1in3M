import React from 'react';
import { CitizenStatus } from '../types/game';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface BirthModalProps {
  citizen: CitizenStatus;
  onStartLife: () => void;
}

export const BirthModal: React.FC<BirthModalProps> = ({ citizen, onStartLife }) => {
  const temperDesc = () => {
    const { caution, community, optimism } = citizen.temperament;
    const traits = [];
    if (caution > 50) traits.push('돌다리도 두드려보는 신중한');
    else traits.push('새로운 길을 주저하지 않는 모험적인');

    if (community > 50) traits.push('이웃과 함께 어울리기를 좋아하는');
    else traits.push('자신만의 고요한 영역을 아끼는');

    if (optimism > 50) traits.push('남강의 맑은 햇살처럼 긍정적인');
    else traits.push('현실을 차분하고 냉철하게 바라보는');

    return traits.join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080d] flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-lg w-full text-center space-y-6">
        
        {/* 상단 엠블럼 */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-3xl shadow-xl shadow-amber-500/10 animate-pulse">
          🏮
        </div>

        {/* 타이틀 */}
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-400/80 uppercase">
            34만 분의 1 : 진주
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 font-serif tracking-tight">
            새로운 삶의 첫 울음소리
          </h2>
        </div>

        {/* 출생 카드 */}
        <div className="bg-space-900 border border-slate-700/80 rounded-2xl p-6 text-left space-y-3.5 shadow-2xl font-sans text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-sky-400 font-semibold">
            <MapPin className="w-4 h-4" />
            <span>2026년, 진주시 {citizen.district.name}에서 태어났습니다.</span>
          </div>

          <p className="text-slate-300 leading-relaxed break-keep">
            {citizen.district.description}
          </p>

          <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>가구 소득 분위</span>
              <span className="font-semibold text-slate-200">
                {citizen.incomeDecile}분위 (평균 월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원 수준)
              </span>
            </div>
            <div className="flex justify-between">
              <span>성별 및 성향</span>
              <span className="font-semibold text-slate-200">{citizen.gender}</span>
            </div>
          </div>

          <div className="bg-space-850 p-3 rounded-xl border border-slate-800 text-xs text-amber-200/90 leading-relaxed font-serif italic">
            "이 아이는 {temperDesc()} 기질을 품고 첫 세상을 마주합니다."
          </div>
        </div>

        {/* 시작 버튼 */}
        <div className="pt-2">
          <button
            onClick={() => {
              audioManager.playChimeSound();
              onStartLife();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-space-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>이 삶을 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            ※ 실시간 1분 = 1년의 시간 흐름 (언제든 일시정지 및 배속 가능)
          </p>
        </div>

      </div>
    </div>
  );
};
