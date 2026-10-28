import React from 'react';
import { YearFocus } from '../types/game';
import { BookOpen, Briefcase, HeartHandshake, Sparkles, Compass } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface YearFocusSelectorProps {
  currentFocus: YearFocus;
  onSelectFocus: (focus: YearFocus) => void;
}

export const YearFocusSelector: React.FC<YearFocusSelectorProps> = ({
  currentFocus,
  onSelectFocus
}) => {
  const focuses: { id: YearFocus; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'learning', label: '배움과 탐구', icon: BookOpen, desc: '학업·자격증·지식' },
    { id: 'work', label: '일과 벌이', icon: Briefcase, desc: '직업·승진·소득' },
    { id: 'relationship', label: '사람과 관계', icon: HeartHandshake, desc: '가족·친구·이웃' },
    { id: 'health', label: '몸과 마음', icon: Sparkles, desc: '건강·휴식·치유' },
    { id: 'change', label: '이사와 변화', icon: Compass, desc: '주거 이동·새 출발' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-space-950/95 backdrop-blur-md border-t border-space-700/80 px-3 py-2.5 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-amber-300/80 whitespace-nowrap hidden sm:inline">
          이번 해의 초점:
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-around sm:justify-start">
          {focuses.map((f) => {
            const Icon = f.icon;
            const isSelected = currentFocus === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  onSelectFocus(f.id);
                  audioManager.playClickSound();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm shadow-amber-500/20'
                    : 'bg-space-900 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:bg-space-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
