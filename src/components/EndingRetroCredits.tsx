import React, { useState, useEffect } from 'react';
import { CitizenStatus } from '../types/game';
import { Play, Pause, RotateCcw, Heart, Sparkles, Award } from 'lucide-react';

interface EndingRetroCreditsProps {
  citizen: CitizenStatus;
}

export const EndingRetroCredits: React.FC<EndingRetroCreditsProps> = ({ citizen }) => {
  const [currentStepAge, setCurrentStepAge] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const maxAge = citizen.age;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepAge(prev => {
        if (prev >= maxAge) {
          return 0; // 루프 재생
        }
        return prev + 1;
      });
    }, 280); // 약 0.28초마다 1년씩 전진

    return () => clearInterval(timer);
  }, [isPlaying, maxAge]);

  // 나이에 따른 캐릭터 외형 및 칭호
  const getStageInfo = (age: number) => {
    if (age < 8) return { emoji: '👶', label: '영유아기', desc: `${citizen.district.name.split(' ')[0]}의 아기` };
    if (age < 14) return { emoji: '🎒', label: '초등학생', desc: citizen.elementarySchool || '초등학교 등굣길' };
    if (age < 17) return { emoji: '🧑‍🎓', label: '중학생', desc: citizen.middleSchool || '중학교 단짝들과' };
    if (age < 20) return { emoji: '📖', label: '고등학생', desc: citizen.highSchool || '수능과 입시의 땀방울' };
    if (age < 25) {
      if (citizen.collegeName) return { emoji: '🎓', label: '대학 청춘', desc: `${citizen.collegeName} 캠퍼스` };
      return { emoji: '🛠️', label: '청년 자립', desc: '산업 일선 사회초년생' };
    }
    if (age < 50) return { emoji: '💼', label: '중견 사회인', desc: citizen.jobTitle || citizen.job };
    if (age < 65) return { emoji: '👔', label: '장년의 기둥', desc: `${citizen.jobTitle || citizen.job}` };
    return { emoji: '🧓', label: '남강의 황혼', desc: '은퇴 후 평온한 삶' };
  };

  const stage = getStageInfo(currentStepAge);

  // 생애 하이라이트 로그 매핑
  const milestones = [
    { age: 0, text: `2026년 진주시 ${citizen.district.name.split(' ')[0]}에서 탄생` },
    { age: 8, text: `진주 ${citizen.elementarySchool || '초등학교'} 입학` },
    { age: 14, text: `${citizen.middleSchool || '중학교'} 진학` },
    { age: 17, text: `${citizen.highSchool || '고등학교'} 입학` },
    { age: 19, text: citizen.collegeName ? `${citizen.collegeName} 합격 입학` : '고교 졸업 및 사회 진출' },
    { age: 26, text: `직업: ${citizen.jobTitle || citizen.job} 확정` },
    ...(citizen.spouse ? [{ age: citizen.spouse.marriedAge || 30, text: `반려자 '${citizen.spouse.name}'와(과) 백년가약` }] : []),
    ...(citizen.childrenCount > 0 ? [{ age: 34, text: `자녀 '${citizen.childrenList?.[0]?.name || '아이'}' 탄생` }] : []),
    ...(citizen.flags?.has('HOME_OWNER_CHUNGMUGONG') ? [{ age: 38, text: '혁신도시 신축 아파트 자가 마련' }] : []),
    ...(citizen.pet ? [{ age: citizen.pet.adoptedAge, text: `반려동물 '${citizen.pet.name}' 입양` }] : []),
    { age: 65, text: '평생의 일터에서 은퇴, 남강변 산책' },
    { age: citizen.age, text: `${citizen.age}세의 나이로 남강의 곁에서 영면` }
  ];

  const currentMilestone = [...milestones].reverse().find(m => m.age <= currentStepAge);

  return (
    <div className="w-full bg-[#05070c] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 shadow-2xl relative overflow-hidden select-none font-mono">
      
      {/* 레트로 CRT 모니터 스캔라인 효과 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none z-10" />

      {/* 상단 타이틀 바 */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 z-20 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-emerald-400 font-bold tracking-wider">RETRO LIFE CREDITS · 생애 회상록</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="px-2 py-0.5 rounded bg-space-850 hover:bg-space-800 text-slate-300 border border-slate-700 text-[10px] flex items-center gap-1"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isPlaying ? '일시정지' : '재생'}</span>
          </button>
          <button
            onClick={() => setCurrentStepAge(0)}
            className="px-2 py-0.5 rounded bg-space-850 hover:bg-space-800 text-slate-300 border border-slate-700 text-[10px] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-sky-400" />
            <span>처음부터</span>
          </button>
        </div>
      </div>

      {/* 중앙 레트로 픽셀 스테이지 무대 */}
      <div className="h-44 sm:h-52 w-full rounded-xl bg-gradient-to-b from-[#060b18] via-[#091326] to-[#040812] border border-slate-800/80 relative flex flex-col justify-between p-3 overflow-hidden shadow-inner">
        
        {/* 밤하늘 별과 은하수 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-3 left-10 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" />
          <div className="absolute top-7 left-32 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-80" />
          <div className="absolute top-5 right-20 w-1 h-1 bg-cyan-300 rounded-full opacity-70 animate-ping" />
          <div className="absolute top-12 right-40 w-1 h-1 bg-white rounded-full opacity-50" />
          {/* 촉석루 실루엣 */}
          <div className="absolute bottom-10 right-6 text-2xl opacity-20 pointer-events-none">
            🏯
          </div>
        </div>

        {/* 상단: 현재 나이 및 연도 & 마일스톤 자막 */}
        <div className="z-10 text-center space-y-1">
          <div className="inline-block px-3 py-1 rounded-full bg-space-950/80 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-lg">
            {citizen.birthYear + currentStepAge}년 · {currentStepAge}세 [{stage.label}]
          </div>
          <div className="text-xs sm:text-sm font-sans font-bold text-slate-100 drop-shadow line-clamp-1">
            {currentMilestone ? currentMilestone.text : stage.desc}
          </div>
        </div>

        {/* 하단: 걸어가는 픽셀 캐릭터 무대 트랙 */}
        <div className="z-10 relative">
          
          {/* 캐릭터와 동행인들 */}
          <div
            className="flex items-end gap-1.5 transition-all duration-300"
            style={{
              transform: `translateX(${Math.min(85, Math.max(5, (currentStepAge / maxAge) * 85))}%)`
            }}
          >
            {/* 본인 캐릭터 */}
            <div className="flex flex-col items-center">
              <span className="text-3xl filter drop-shadow animate-bounce">
                {stage.emoji}
              </span>
              <span className="text-[9px] text-amber-300 font-bold bg-space-950/90 px-1 rounded border border-amber-500/40 whitespace-nowrap">
                {citizen.name}
              </span>
            </div>

            {/* 배우자 (결혼 후 함께 걸어감) */}
            {citizen.spouse && currentStepAge >= (citizen.spouse.marriedAge || 30) && (
              <div className="flex flex-col items-center">
                <span className="text-2xl filter drop-shadow">
                  {citizen.gender === '남성' ? '👩' : '👨'}
                </span>
                <span className="text-[8px] text-pink-300 bg-space-950/90 px-1 rounded border border-pink-500/40 whitespace-nowrap">
                  {citizen.spouse.name}
                </span>
              </div>
            )}

            {/* 자녀 (출산 후 함께 걸어감) */}
            {citizen.childrenCount > 0 && currentStepAge >= 34 && currentStepAge < 55 && (
              <div className="flex flex-col items-center">
                <span className="text-xl filter drop-shadow">
                  {citizen.childrenList?.[0]?.gender === '아들' ? '👦' : '👧'}
                </span>
                <span className="text-[8px] text-sky-300 bg-space-950/90 px-1 rounded border border-sky-500/40 whitespace-nowrap">
                  {citizen.childrenList?.[0]?.name || '자녀'}
                </span>
              </div>
            )}

            {/* 반려동물 (입양 후 꼬리 흔들며 동행) */}
            {citizen.pet && currentStepAge >= citizen.pet.adoptedAge && currentStepAge <= citizen.pet.adoptedAge + 15 && (
              <div className="flex flex-col items-center">
                <span className="text-xl filter drop-shadow animate-pulse">
                  {citizen.pet.icon}
                </span>
                <span className="text-[8px] text-amber-200 bg-space-950/90 px-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                  {citizen.pet.name}
                </span>
              </div>
            )}
          </div>

          {/* 남강변 길 바닥 & 물결 타일 */}
          <div className="w-full h-3 bg-gradient-to-r from-emerald-950 via-slate-800 to-emerald-950 border-t border-emerald-500/40 mt-1 relative">
            <div className="absolute inset-0 bg-repeat-x opacity-40 text-[8px] text-emerald-400 overflow-hidden">
              ░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓░▒▓
            </div>
          </div>
          {/* 남강 물결 */}
          <div className="w-full h-2 bg-gradient-to-r from-blue-900 via-sky-800 to-blue-900 border-t border-sky-400/30">
            <div className="text-[7px] text-sky-300 text-center tracking-widest opacity-60">
              ~~~ 南江 물결 ~~~
            </div>
          </div>

        </div>

      </div>

      {/* 하단 생애 타임슬라이더 컨트롤 */}
      <div className="space-y-1.5 z-20">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0세 ({citizen.birthYear}년 출생)</span>
          <span className="text-amber-300 font-bold">생애 {Math.round((currentStepAge / maxAge) * 100)}% 진행 중</span>
          <span>{citizen.age}세 ({citizen.currentYear}년 영면)</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxAge}
          value={currentStepAge}
          onChange={(e) => {
            setCurrentStepAge(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
      </div>

    </div>
  );
};
