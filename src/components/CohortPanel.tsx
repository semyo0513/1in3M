import React from 'react';
import { CohortPerson } from '../types/game';
import { Users2, MapPin } from 'lucide-react';

interface CohortPanelProps {
  cohort: CohortPerson[];
  birthYear: number;
}

export const CohortPanel: React.FC<CohortPanelProps> = ({ cohort, birthYear }) => {
  return (
    <div className="bg-space-900 border-l border-space-700 w-full lg:w-80 flex flex-col p-4 text-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
        <Users2 className="w-4 h-4 text-sky-400" />
        <h3 className="font-semibold text-slate-200">
          동시 출생 코호트
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">
          ({birthYear}년생 4인)
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
        같은 해 진주에서 태어났지만, 다른 동네와 직업에서 삶을 살아가는 동갑내기들입니다.
      </p>

      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {cohort.map((p) => (
          <div
            key={p.id}
            className={`p-3 rounded-xl border transition-all ${
              p.isAlive
                ? 'bg-space-850/90 border-slate-800/90 hover:border-slate-700'
                : 'bg-space-950/40 border-slate-900 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                {p.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-800 text-slate-400 border border-slate-700/60 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-sky-400" />
                {p.district}
              </span>
            </div>

            <div className="text-[11px] text-amber-300/90 font-medium mb-1">
              {p.job}
            </div>

            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              {p.statusText}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
        실제 진주시 인구 구조 및 이동률 시뮬레이션
      </div>
    </div>
  );
};
