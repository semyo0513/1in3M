import React, { useState } from 'react';
import { MASTER_ACHIEVEMENTS } from '../data/achievements';
import { Achievement } from '../types/game';
import { Trophy, Award, CheckCircle2, Lock, X, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface AchievementModalProps {
  unlockedAchievements: Achievement[];
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  unlockedAchievements,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const unlockedMap = new Map(unlockedAchievements.map(a => [a.id, a]));
  const totalCount = MASTER_ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'ALL', label: '전체' },
    { id: 'ACADEMIC', label: '학업·입시' },
    { id: 'CAREER', label: '직업·커리어' },
    { id: 'WEALTH', label: '자산·경제' },
    { id: 'FAMILY', label: '가족·동행' },
    { id: 'LOCAL', label: '진주 로컬' },
    { id: 'LIFE', label: '인생·웰빙' }
  ];

  const filtered = MASTER_ACHIEVEMENTS.filter(a => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn select-none">
      <div className="bg-space-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 상단 헤더 */}
        <div className="bg-gradient-to-r from-amber-950/80 via-space-900 to-space-950 border-b border-amber-500/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  생애 업적 도감
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {unlockedCount} / {totalCount} ({progressPercent}%)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                34만 분의 1 : 진주 시민의 명예의 전당
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 달성률 프로그레스 바 */}
        <div className="px-5 py-2.5 bg-space-950/60 border-b border-space-800 flex items-center gap-3">
          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold shrink-0">
            {progressPercent}% 달성
          </span>
        </div>

        {/* 카테고리 필터 탭 */}
        <div className="px-4 py-2 border-b border-space-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                audioManager.playClickSound();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-space-950 font-bold shadow'
                  : 'bg-space-850 text-slate-400 hover:text-white hover:bg-space-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 업적 리스트 */}
        <div className="p-4 sm:p-5 flex-1 min-h-0 overflow-y-auto space-y-2.5 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filtered.map(ach => {
              const unlocked = unlockedMap.get(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border transition flex items-start gap-3 ${
                    unlocked
                      ? 'bg-gradient-to-br from-amber-950/30 to-space-850 border-amber-500/40 shadow-sm'
                      : 'bg-space-900/60 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                    unlocked
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-500'
                  }`}>
                    {unlocked ? ach.iconEmoji : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`font-bold text-xs truncate ${unlocked ? 'text-amber-200' : 'text-slate-400'}`}>
                        {ach.title}
                      </span>
                      {unlocked && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{unlocked.unlockedAt ? `${unlocked.unlockedAt.age}세` : '달성'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="p-3 bg-space-950 border-t border-space-800 text-center text-[11px] text-slate-500">
          모든 생애 선택과 분기에 따라 총 24개의 인생 업적이 도감에 영구 소장됩니다.
        </div>

      </div>
    </div>
  );
};
