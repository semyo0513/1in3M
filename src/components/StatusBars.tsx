import React from 'react';
import { Heart, Smile, BookOpen, Users, Briefcase, Coins } from 'lucide-react';
import { CitizenStatus, CityMacroIndicators } from '../types/game';

interface StatusBarsProps {
  citizen: CitizenStatus;
  cityIndicators: CityMacroIndicators;
}

export const StatusBars: React.FC<StatusBarsProps> = ({ citizen, cityIndicators }) => {
  const stats = [
    { label: '건강', val: citizen.health, icon: Heart, color: 'from-rose-500 to-rose-400', textColor: 'text-rose-400' },
    { label: '행복', val: citizen.happiness, icon: Smile, color: 'from-amber-400 to-amber-300', textColor: 'text-amber-400' },
    { label: '배움', val: citizen.learning, icon: BookOpen, color: 'from-sky-400 to-blue-500', textColor: 'text-sky-400' },
    { label: '유대', val: citizen.bonds, icon: Users, color: 'from-emerald-400 to-teal-400', textColor: 'text-emerald-400' },
  ];

  return (
    <div className="bg-space-850 border-b border-space-700 px-3 sm:px-6 py-3 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* 1. 개인 4대 생애 지표 & 직업 */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 flex-1">
          {/* 직업 및 소득 뱃지 */}
          <div className="flex items-center gap-2 bg-space-900/90 px-2.5 py-1.5 rounded-lg border border-slate-700/80">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-200">{citizen.job}</span>
            <span className="text-slate-500">|</span>
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-300 font-mono">
              소득 {citizen.incomeDecile}분위 (월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)
            </span>
          </div>

          {/* 4대 스탯 바 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
            {stats.map((s) => (
              <div key={s.label} className="bg-space-900/70 px-2.5 py-1 rounded-md border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <s.icon className={`w-3 h-3 ${s.textColor}`} />
                    <span className="text-slate-400 font-medium">{s.label}</span>
                  </div>
                  <span className={`font-mono font-bold ${s.textColor}`}>{s.val}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${s.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(0, Math.min(100, s.val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 진주시 4대 대립 기류 게이지 (트레이드오프) */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-800 pt-2 lg:pt-0 lg:pl-5 flex flex-col justify-center">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span className="font-medium text-slate-300">진주시 도시 기류 (트레이드오프 지표)</span>
            <span className="text-[10px] text-slate-500">시민들의 선택이 누적된 방향</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            {/* 공간 축 */}
            <div className="bg-space-900/60 p-1.5 rounded border border-slate-800/80">
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>원도심</span>
                <span className="text-sky-300 font-mono">{cityIndicators.space > 0 ? `+${cityIndicators.space}` : cityIndicators.space}</span>
                <span>신도심</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full relative">
                <div
                  className="absolute top-0 bottom-0 w-2 bg-sky-400 rounded-full -translate-x-1 transition-all duration-500"
                  style={{ left: `${((cityIndicators.space + 100) / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* 산업 축 */}
            <div className="bg-space-900/60 p-1.5 rounded border border-slate-800/80">
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>골목·농가</span>
                <span className="text-amber-300 font-mono">{cityIndicators.economy > 0 ? `+${cityIndicators.economy}` : cityIndicators.economy}</span>
                <span>첨단산단</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full relative">
                <div
                  className="absolute top-0 bottom-0 w-2 bg-amber-400 rounded-full -translate-x-1 transition-all duration-500"
                  style={{ left: `${((cityIndicators.economy + 100) / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* 복지 축 */}
            <div className="bg-space-900/60 p-1.5 rounded border border-slate-800/80">
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>공공복지</span>
                <span className="text-emerald-300 font-mono">{cityIndicators.welfare > 0 ? `+${cityIndicators.welfare}` : cityIndicators.welfare}</span>
                <span>재정건전</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full relative">
                <div
                  className="absolute top-0 bottom-0 w-2 bg-emerald-400 rounded-full -translate-x-1 transition-all duration-500"
                  style={{ left: `${((cityIndicators.welfare + 100) / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* 문화 축 */}
            <div className="bg-space-900/60 p-1.5 rounded border border-slate-800/80">
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>역사원형</span>
                <span className="text-purple-300 font-mono">{cityIndicators.culture > 0 ? `+${cityIndicators.culture}` : cityIndicators.culture}</span>
                <span>관광개발</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full relative">
                <div
                  className="absolute top-0 bottom-0 w-2 bg-purple-400 rounded-full -translate-x-1 transition-all duration-500"
                  style={{ left: `${((cityIndicators.culture + 100) / 200) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
