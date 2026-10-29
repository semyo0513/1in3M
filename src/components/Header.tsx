import React from 'react';
import { Play, Pause, Volume2, VolumeX, Flame, GraduationCap, User } from 'lucide-react';
import { CitizenStatus } from '../types/game';
import { audioManager } from '../utils/audio';

interface HeaderProps {
  citizen: CitizenStatus;
  isPaused: boolean;
  speed: number;
  isEduMode: boolean;
  onTogglePause: () => void;
  onChangeSpeed: (newSpeed: number) => void;
  onToggleEduMode: () => void;
  onOpenMemorial: () => void;
  onOpenProfile?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  citizen,
  isPaused,
  speed,
  isEduMode,
  onTogglePause,
  onChangeSpeed,
  onToggleEduMode,
  onOpenMemorial,
  onOpenProfile,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="border-b border-space-700 bg-space-900/95 backdrop-blur-md sticky top-0 z-30 px-2.5 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
        
        {/* 상단 1줄 (모바일: 로고 + 나이 + 위치 + 교육모드 배지) */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl">🏮</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-base font-bold tracking-tight text-amber-300">
                  34만 분의 1 : 진주
                </h1>
                {isEduMode && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold flex items-center gap-0.5">
                    <GraduationCap className="w-3 h-3 text-emerald-400" />
                    <span>교육용</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                1 in 340,000 : JINJU {isEduMode && '(수업용 축약 & 민감정보 보호 모드)'}
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

        {/* 상단 2줄 (모바일) / 우측 (데스크톱): 프로필 + 교육용 모드 토글 + 컨트롤러 */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 pt-1 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
          
          {/* 내 삶의 프로필 버튼 (언제든 팝업/확인 가능) */}
          {onOpenProfile && (
            <button
              onClick={() => {
                onOpenProfile();
                audioManager.playClickSound();
              }}
              title="내 삶의 궤적 및 프로필 (학력, 직업, 배우자, 자녀, 재산, 삶의 결)"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition border bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] sm:text-xs">내 프로필</span>
            </button>
          )}

          {/* 학생 교육용 모드 전환 버튼 */}
          <button
            onClick={() => {
              onToggleEduMode();
              audioManager.playClickSound();
            }}
            title={isEduMode ? "일반 시민 모드로 전환" : "학생 교육용 모드 (민감소재 제외, 가명화 사례) 실행"}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition border shadow-sm ${
              isEduMode
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${isEduMode ? 'text-emerald-400 animate-pulse' : 'text-emerald-300'}`} />
            <span className="text-[11px] sm:text-xs">
              {isEduMode ? '🎓 수업모드 ON' : '🎓 학생 교육용 모드'}
            </span>
          </button>

          {/* 배속 조절 (교육용 모드에서는 15분 수업 완주를 위해 1x, 2x, 3x 지원) */}
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
