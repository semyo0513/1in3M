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
    <div className="bg-space-850/95 border-b border-space-700 px-2.5 sm:px-6 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-2.5 md:gap-4 items-stretch md:items-center justify-between">
        
        {/* 1. 개인 직업 및 소득 */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-space-900/90 px-2.5 py-1.5 rounded-lg border border-slate-700/80">
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium text-slate-200 truncate">{citizen.job}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-slate-300 font-mono text-[11px] sm:text-xs">
              {citizen.incomeDecile}분위 (월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만)
            </span>
          </div>
        </div>

        {/* 2. 4대 스탯 바 (모바일: 4열 배치) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 flex-1">
          {stats.map((s) => (
            <div key={s.label} className="bg-space-900/80 px-2 py-1 rounded-md border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <div className="flex items-center gap-1">
                  <s.icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${s.textColor}`} />
                  <span className="text-slate-400 font-medium text-[10px] sm:text-xs">{s.label}</span>
                </div>
                <span className={`font-mono font-bold text-[10px] sm:text-xs ${s.textColor}`}>{s.val}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${s.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(0, Math.min(100, s.val))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
