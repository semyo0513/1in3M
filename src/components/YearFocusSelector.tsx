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
    { id: 'learning', label: '배움·공부', icon: BookOpen, desc: '자격증·학업' },
    { id: 'work', label: '일·소득', icon: Briefcase, desc: '직업·야근/투잡' },
    { id: 'relationship', label: '사람·가족', icon: HeartHandshake, desc: '가족·친구·모임' },
    { id: 'health', label: '몸과 마음', icon: Sparkles, desc: '휴식·치료·운동' },
    { id: 'change', label: '취미·여가', icon: Compass, desc: '덕질·문화·여가' }
  ];

  return (
    <div className="bg-space-950/95 border-t border-space-800 px-2 sm:px-4 py-2 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-amber-300/80 whitespace-nowrap hidden sm:inline">
          올해의 초점:
        </span>

        <div className="flex items-center gap-1.5 flex-1 justify-between sm:justify-start overflow-x-auto py-0.5 no-scrollbar">
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
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm shadow-amber-500/20 font-bold'
                    : 'bg-space-900 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-space-850'
                }`}
              >
                <Icon className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
