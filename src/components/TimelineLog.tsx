import React, { useEffect, useRef } from 'react';
import { TimelineEntry, CardLabel } from '../types/game';

interface TimelineLogProps {
  entries: TimelineEntry[];
}

export const TimelineLog: React.FC<TimelineLogProps> = ({ entries }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1) 즉각적인 스크롤 높이 갱신
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // 2) 모바일 및 화면 확대 시 렌더링 딜레이 보정 스크롤
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 60);

    return () => clearTimeout(timer);
  }, [entries]);

  const getLabelBadge = (label?: CardLabel) => {
    switch (label) {
      case 'FACT':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-950/80 text-sky-300 border border-sky-600/40 whitespace-nowrap">
            FACT · 통계/사실
          </span>
        );
      case 'STANCE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-600/40 whitespace-nowrap">
            STANCE · 입장 대립
          </span>
        );
      case 'WHATIF':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-950/80 text-purple-300 border border-purple-600/40 whitespace-nowrap">
            WHATIF · 정책 나비효과
          </span>
        );
      case 'REFLECT':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 whitespace-nowrap">
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
      className="flex-1 min-h-0 min-w-0 w-full overflow-y-auto px-2.5 sm:px-4 md:px-6 py-3 space-y-3.5 scroll-smooth focus:outline-none custom-scrollbar"
    >
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-3.5 pb-20 sm:pb-16 min-w-0 w-full">
        {entries.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 px-4 space-y-3 bg-space-900/60 rounded-2xl border border-slate-800 my-8">
            <div className="text-3xl animate-pulse">🏮</div>
            <h3 className="text-sm font-bold text-amber-300">진주에서의 삶을 준비하고 있습니다</h3>
            <p className="text-xs text-slate-400 leading-relaxed break-keep">
              당신이 태어난 진주의 동네와 매년 마주하는 생애 사건, 지역 통계가 이곳에 실시간으로 기록됩니다.
            </p>
          </div>
        ) : (
          entries.map((item, index) => {
            const isLatest = index === entries.length - 1;
            const isDeath = item.type === 'death';
            const isDilemma = item.type === 'dilemma';
            const isPause = item.type === 'pause';

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-4 rounded-xl transition-all duration-300 border min-w-0 w-full ${
                  isDeath
                    ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                    : isDilemma
                    ? 'bg-amber-950/20 border-amber-800/40 text-slate-100 shadow-lg shadow-amber-950/10'
                    : isPause
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                    : 'bg-space-900/70 border-slate-800/80 hover:border-slate-700/80 text-slate-200'
                } ${isLatest ? 'ring-1 ring-amber-400/30 shadow-md shadow-amber-500/5 animate-fadeIn' : ''}`}
              >
                {/* 헤더: 나이, 연도, 라벨 */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                    <span className="text-xs font-mono font-bold text-amber-300/90 whitespace-nowrap">
                      {item.age}세 ({item.year}년)
                    </span>
                    {getLabelBadge(item.label)}
                  </div>
                  {item.sourceNote && (
                    <span className="text-[10px] text-slate-400 font-sans italic truncate max-w-full">
                      출처: {item.sourceNote}
                    </span>
                  )}
                </div>

                {/* 본문 텍스트 */}
                <p className="text-xs sm:text-sm leading-relaxed tracking-normal font-sans break-keep text-slate-200">
                  {item.text}
                </p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};
