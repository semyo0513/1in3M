import React, { useEffect, useRef } from 'react';
import { TimelineEntry, CardLabel } from '../types/game';

interface TimelineLogProps {
  entries: TimelineEntry[];
}

export const TimelineLog: React.FC<TimelineLogProps> = ({ entries }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const getLabelBadge = (label?: CardLabel) => {
    switch (label) {
      case 'FACT':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-950/80 text-sky-300 border border-sky-600/40">
            FACT · 통계/사실
          </span>
        );
      case 'STANCE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-600/40">
            STANCE · 입장 대립
          </span>
        );
      case 'WHATIF':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-950/80 text-purple-300 border border-purple-600/40">
            WHATIF · 정책 나비효과
          </span>
        );
      case 'REFLECT':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
            REFLECT · 생각 멈춤
          </span>
        );
      case 'PERSONAL':
      default:
        return null;
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 min-w-0 w-full overflow-y-auto p-3 sm:p-6 space-y-4 scroll-smooth focus:outline-none custom-scrollbar"
    >
      <div className="max-w-3xl mx-auto space-y-3.5 pb-28 sm:pb-24 min-w-0">
        {entries.map((item, index) => {
          const isLatest = index === entries.length - 1;
          const isDeath = item.type === 'death';
          const isDilemma = item.type === 'dilemma';
          const isPause = item.type === 'pause';

          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-xl transition-all duration-300 border ${
                isDeath
                  ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                  : isDilemma
                  ? 'bg-amber-950/20 border-amber-800/40 text-slate-100 shadow-lg shadow-amber-950/10'
                  : isPause
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                  : 'bg-space-900/70 border-slate-800/80 hover:border-slate-700/80 text-slate-200'
              } ${isLatest ? 'ring-1 ring-amber-400/20 animate-fadeIn' : ''}`}
            >
              {/* 헤더: 나이, 연도, 라벨 */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300/90">
                    {item.age}세 ({item.year}년)
                  </span>
                  {getLabelBadge(item.label)}
                </div>
                {item.sourceNote && (
                  <span className="text-[10px] text-slate-400 font-sans italic">
                    출처: {item.sourceNote}
                  </span>
                )}
              </div>

              {/* 본문 텍스트 */}
              <p className="text-sm leading-relaxed tracking-normal font-sans break-keep">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
