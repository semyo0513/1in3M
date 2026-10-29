import React from 'react';
import { Heart, Smile, BookOpen, Users, Briefcase, Coins, User } from 'lucide-react';
import { CitizenStatus, CityMacroIndicators } from '../types/game';

interface StatusBarsProps {
  citizen: CitizenStatus;
  cityIndicators: CityMacroIndicators;
  isEduMode?: boolean;
  onOpenMobileProfile?: () => void;
}

function formatWealth(won: number): string {
  if (!won || won <= 0) return '0원';
  const manWon = Math.floor(won / 10000);
  if (manWon >= 10000) {
    const eok = Math.floor(manWon / 10000);
    const rest = manWon % 10000;
    return rest > 0 ? `${eok}억 ${rest.toLocaleString('ko-KR')}만 원` : `${eok}억 원`;
  }
  return `${manWon.toLocaleString('ko-KR')}만 원`;
}

export const StatusBars: React.FC<StatusBarsProps> = ({
  citizen,
  isEduMode = false,
  onOpenMobileProfile
}) => {
  const stats = [
    { label: '건강', val: citizen.health, icon: Heart, color: 'from-rose-500 to-rose-400', textColor: 'text-rose-400' },
    { label: '행복', val: citizen.happiness, icon: Smile, color: 'from-amber-400 to-amber-300', textColor: 'text-amber-400' },
    { label: '배움', val: citizen.learning, icon: BookOpen, color: 'from-sky-400 to-blue-500', textColor: 'text-sky-400' },
    { label: '유대', val: citizen.bonds, icon: Users, color: 'from-emerald-400 to-teal-400', textColor: 'text-emerald-400' },
  ];

  return (
    <div className="bg-space-850/95 border-b border-space-700 px-2.5 sm:px-6 py-2 text-xs">
      <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row gap-2.5 md:gap-4 items-stretch md:items-center justify-between">
        
        {/* 1. 개인 직업 및 소득/재산 환경 (생애 주기에 따라 동적 갱신) */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-space-900/90 px-2.5 py-1.5 rounded-lg border border-slate-700/80">
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-100 truncate">
              {citizen.jobTitle || citizen.job}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-slate-300 font-sans text-[11px] sm:text-xs">
              {isEduMode ? (
                <span className="text-emerald-300 font-medium">{citizen.incomeDesc || '성실한 일터의 가정'}</span>
              ) : (
                <span className="font-mono">
                  {citizen.age < 20 ? (
                    `재산 ${formatWealth(citizen.netWorthWon)}`
                  ) : (
                    `월 ${(citizen.monthlyIncomeWon / 10000).toLocaleString('ko-KR')}만 (재산 ${formatWealth(citizen.netWorthWon)})`
                  )}
                </span>
              )}
            </span>
          </div>

          {/* 모바일 전용: 프로필 팝업 열기 버튼 */}
          {onOpenMobileProfile && (
            <button
              onClick={onOpenMobileProfile}
              className="lg:hidden ml-auto shrink-0 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/25 transition"
            >
              <User className="w-3 h-3" />
              <span>프로필</span>
            </button>
          )}
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
