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
    <header className="border-b border-space-700 bg-space-900/95 backdrop-blur-md sticky top-0 z-30 px-2.5 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
        
        {/* 상단 1줄 (모바일: 로고 + 나이 + 위치) */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl">🏮</span>
            <div>
              <h1 className="text-xs sm:text-base font-bold tracking-tight text-amber-300">
                34만 분의 1 : 진주
              </h1>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                1 in 340,000 : JINJU
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          {/* 현재 나이 및 연도, 거주지 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded bg-space-800 text-amber-200 font-mono font-bold border border-amber-500/30 text-[11px] sm:text-xs">
              {citizen.age}세 ({citizen.currentYear}년)
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-space-800 text-sky-300 border border-sky-500/30 font-medium text-[11px] sm:text-xs truncate max-w-[110px] sm:max-w-none">
              📍 {citizen.district.name.split(' ')[0]}
            </span>
            {citizen.isRelocatedAway && (
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 text-[10px] border border-rose-500/40">
                상경
              </span>
            )}
          </div>
        </div>

        {/* 상단 2줄 (모바일) / 우측 (데스크톱): 컨트롤러 */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 pt-1 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
          {/* 배속 조절 */}
          <div className="flex items-center rounded-lg bg-space-850 p-0.5 border border-slate-700 text-[11px] sm:text-xs font-mono">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChangeSpeed(s);
                  audioManager.playClickSound();
                }}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors ${
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
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-xs transition-all border ${
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
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
          </button>

          {/* 남강 유등 추모관 열기 */}
          <button
            onClick={() => {
              onOpenMemorial();
              audioManager.playClickSound();
            }}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 hover:bg-amber-900/50 transition text-xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden xs:inline sm:inline">유등관</span>
          </button>
        </div>

      </div>
    </header>
  );
};
