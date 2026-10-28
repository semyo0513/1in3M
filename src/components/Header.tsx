import React from 'react';
import { Play, Pause, Volume2, VolumeX, Flame } from 'lucide-react';
import { CitizenStatus } from '../types/game';
import { audioManager } from '../utils/audio';

interface HeaderProps {
  citizen: CitizenStatus;
  isPaused: boolean;
  speed: number;
  onTogglePause: () => void;
  onChangeSpeed: (newSpeed: number) => void;
  onOpenMemorial: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  citizen,
  isPaused,
  speed,
  onTogglePause,
  onChangeSpeed,
  onOpenMemorial,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="border-b border-space-700 bg-space-900/90 backdrop-blur sticky top-0 z-30 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* 타이틀 및 거주 정보 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🏮</span>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-amber-300">
                34만 분의 1 : 진주
              </h1>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                1 in 340,000 : JINJU
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-700 hidden sm:block" />

          {/* 현재 나이 및 연도 */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="px-2 py-0.5 rounded bg-space-800 text-amber-200 font-mono font-semibold border border-amber-500/30">
              {citizen.age}세 ({citizen.currentYear}년)
            </span>
            <span className="px-2 py-0.5 rounded bg-space-800 text-sky-300 border border-sky-500/30 font-medium">
              📍 {citizen.district.name.split(' ')[0]}
            </span>
            {citizen.isRelocatedAway && (
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 text-[11px] border border-rose-500/40">
                수도권 상경
              </span>
            )}
          </div>
        </div>

        {/* 컨트롤: 일시정지, 속도, 음소거, 유등 추모관 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 배속 조절 */}
          <div className="flex items-center rounded-lg bg-space-800 p-0.5 border border-slate-700 text-xs font-mono">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChangeSpeed(s);
                  audioManager.playClickSound();
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  speed === s
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* 일시정지 / 재생 버튼 */}
          <button
            onClick={() => {
              onTogglePause();
              audioManager.playClickSound();
            }}
            title={isPaused ? "진행하기 (Space)" : "일시정지 (Space)"}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all border ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                : 'bg-space-800 border-slate-700 text-slate-300 hover:bg-space-700'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? '계속하기' : '일시정지'}</span>
          </button>

          {/* 오디오 토글 */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "소리 켜기" : "음소거"}
            className="p-1.5 rounded-lg bg-space-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-space-700 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          {/* 남강 유등 추모관 열기 */}
          <button
            onClick={() => {
              onOpenMemorial();
              audioManager.playClickSound();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 hover:bg-amber-900/50 transition text-xs sm:text-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">유등 추모관</span>
          </button>
        </div>
      </div>
    </header>
  );
};
