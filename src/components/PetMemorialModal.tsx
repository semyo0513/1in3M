import React, { useState } from 'react';
import { Heart, Sparkles, Footprints, Flame, Flower2, HeartHandshake } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { PetInfo } from '../types/game';

interface PetMemorialModalProps {
  pet: PetInfo;
  citizenAge: number;
  year: number;
  deathCause: string;
  onResolve: (memorialAction: string, impact: { happiness: number; bonds: number; learning: number }) => void;
}

interface MemorialOption {
  id: string;
  title: string;
  badge: string;
  description: string;
  subText: string;
  icon: React.ReactNode;
  impact: { happiness: number; bonds: number; learning: number };
}

export const PetMemorialModal: React.FC<PetMemorialModalProps> = ({
  pet,
  citizenAge,
  year,
  deathCause,
  onResolve
}) => {
  const yearsTogether = Math.max(1, citizenAge - pet.adoptedAge);
  const petAge = 1 + yearsTogether;

  const options: MemorialOption[] = [
    {
      id: 'river_nature',
      title: '남강변 자연 수목장 및 산책로 추모',
      badge: '자연의 품 · 마음 치유',
      icon: <Flower2 className="w-5 h-5 text-emerald-400" />,
      description: `평생 함께 걷던 진주 남강 둔치와 망진산 숲길의 따스한 햇살 아래 안치합니다. 아이는 자연의 바람이 되어 언제나 곁에 머뭅니다.`,
      subText: '가슴 깊은 애도와 함께 슬픔을 평온으로 승화시킵니다.',
      impact: { happiness: 10, bonds: 6, learning: 4 }
    },
    {
      id: 'shelter_volunteer',
      title: '진주시 유기동물 보호소 봉사 및 후원',
      badge: '선한 영향력 · 생명 존중',
      icon: <HeartHandshake className="w-5 h-5 text-amber-400" />,
      description: `'${pet.name}'의 이름으로 도움이 절실한 진주의 유기동물 보호소에 사료를 정기 후원하고 주말 봉사를 시작합니다.`,
      subText: '이별의 슬픔을 다른 생명을 살리는 따뜻한 온기로 바꿉니다.',
      impact: { happiness: 5, bonds: 15, learning: 8 }
    },
    {
      id: 'memorial_stone',
      title: '가정 내 메모리얼 스톤 마련 및 유품 간직',
      badge: '영원한 기억 · 애틋한 사랑',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      description: `아이의 부드러운 털 한 줌과 발도장으로 작은 메모리얼 스톤을 빚어 서재에 둡니다. 평생 내 곁에서 함께한 소중한 가족을 잊지 않습니다.`,
      subText: '언제든 손을 뻗으면 닿는 곳에서 아이와의 추억을 영원히 기립니다.',
      impact: { happiness: 6, bonds: 8, learning: 10 }
    }
  ];

  const [selectedOption, setSelectedOption] = useState<MemorialOption>(options[0]);

  const handleConfirm = () => {
    audioManager.playChimeSound();
    onResolve(selectedOption.title, selectedOption.impact);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 animate-fadeIn">
      <div className="bg-[#0e0c15] border border-purple-500/40 rounded-2xl max-w-xl w-full max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/70">
        
        {/* 헤더: 무지개 다리 비주얼 */}
        <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/80 border-b border-purple-500/30 p-3.5 sm:p-5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {year}년 ({citizenAge}세) · 영원한 이별의 순간
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              🌈 무지개다리를 건너다
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1.5 flex items-center gap-2">
            <span>{pet.icon}</span>
            <span>'{pet.name}'과의 마지막 작별 인사</span>
          </h2>
          <p className="text-xs text-purple-200/80 mt-0.5">
            {yearsTogether}년 동안 가장 헌신적이고 다정했던 가족이 평온한 안식에 들었습니다.
          </p>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-4 custom-scrollbar">
          
          {/* 반려동물 추모 헌정 카드 */}
          <div className="bg-gradient-to-b from-purple-950/40 to-slate-900/60 p-3.5 rounded-xl border border-purple-500/30 space-y-2.5 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-900/40 border border-purple-400/50 text-3xl shadow-lg shadow-purple-500/20 mx-auto">
              {pet.icon}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1.5">
                <span>{pet.breed}</span>
                <span className="text-amber-300">'{pet.name}'</span>
                <span className="text-xs font-normal text-slate-400">(향년 {petAge}세)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {pet.adoptedAge}세에 만나 <strong className="text-purple-300">{yearsTogether}년 동안</strong> 당신의 기쁨과 슬픔을 온전히 함께했습니다.
              </p>
            </div>

            {/* 사망 사유 안내 */}
            <div className="bg-black/40 rounded-lg p-2.5 border border-slate-800 text-left text-xs">
              <div className="flex items-center gap-1.5 text-rose-300 font-semibold mb-1">
                <Footprints className="w-3.5 h-3.5" />
                <span>떠나간 사유: {deathCause}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                마지막 숨을 거두는 순간까지 주인의 냄새와 따뜻한 손길을 느끼며 눈을 감았습니다. 아이가 떠난 자리에 깃든 깊은 사랑은 사라지지 않습니다.
              </p>
            </div>
          </div>

          {/* 추모 및 애도 방식 선택지 */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>떠난 아이를 기리는 방식 선택</span>
            </label>
            <div className="space-y-2">
              {options.map(opt => {
                const isSelected = selectedOption.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      audioManager.playClickSound();
                      setSelectedOption(opt);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition relative flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-400 shadow-md shadow-purple-500/20 ring-1 ring-purple-400/50'
                        : 'bg-space-850/80 border-slate-700/80 hover:border-slate-500 hover:bg-space-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {opt.title}
                        </h4>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-purple-500 text-white font-bold' : 'bg-space-900 text-slate-400'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">
                      {opt.description}
                    </p>

                    <div className="text-[10px] text-purple-300/80 flex items-center justify-between pt-0.5">
                      <span>{opt.subText}</span>
                      <span className="font-mono text-amber-300">
                        {opt.impact.happiness > 0 ? `행복 +${opt.impact.happiness}` : ''} {opt.impact.bonds > 0 ? `유대 +${opt.impact.bonds}` : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 푸터: 확인 버튼 */}
        <div className="p-3 sm:p-4 bg-space-950 border-t border-slate-800 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current text-rose-400" />
            <span>'{pet.name}'의 안식을 빌며 추모를 마칩니다</span>
          </button>
        </div>
      </div>
    </div>
  );
};
