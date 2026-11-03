import React, { useState } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { audioManager } from '../utils/audio';

export interface PetInfo {
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  icon: string;
  adoptedAge: number;
}

interface PetAdoptionModalProps {
  age: number;
  year: number;
  onConfirm: (pet: PetInfo) => void;
  onCancel?: () => void;
}

interface PetBreedOption {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  tag: string;
  description: string;
  suggestedNames: string[];
  svgGradient: string;
  svgEmoji: string;
}

const PET_BREEDS: PetBreedOption[] = [
  {
    id: 'golden',
    name: '골든 리트리버',
    type: 'dog',
    tag: '천사견 · 대형견',
    description: '사람을 무한히 신뢰하고 다정한 온기를 전해주는 듬직한 가족.',
    suggestedNames: ['보리', '망고', '누룽지', '인절미', '라떼'],
    svgGradient: 'from-amber-400 to-yellow-600',
    svgEmoji: '🦮'
  },
  {
    id: 'maltese',
    name: '말티즈 / 포메라니안',
    type: 'dog',
    tag: '비타민 · 소형견',
    description: '하얗고 몽실몽실한 털, 꼬리를 살랑이며 반겨주는 집안의 활력소.',
    suggestedNames: ['두부', '구름이', '솜이', '콩이', '포근이'],
    svgGradient: 'from-slate-100 to-amber-200',
    svgEmoji: '🐶'
  },
  {
    id: 'jindo_mix',
    name: '진돗개 / 시골 믹스견',
    type: 'dog',
    tag: '충성견 · 든든함',
    description: '영리하고 충직하며 언제나 내 곁을 지켜주는 진주의 든든한 동반자.',
    suggestedNames: ['누렁이', '바람이', '백구', '토리', '장군이'],
    svgGradient: 'from-orange-400 to-amber-700',
    svgEmoji: '🐕'
  },
  {
    id: 'cheese_tabby',
    name: '코숏 치즈 태비',
    type: 'cat',
    tag: '골골송 · 개냥이',
    description: '햇살 아래 무릎에 올라와 나지막이 골골송을 불러주는 다정한 단짝.',
    suggestedNames: ['치즈', '호두', '나비', '살구', '단풍이'],
    svgGradient: 'from-amber-400 to-orange-500',
    svgEmoji: '🐈'
  },
  {
    id: 'russian_blue',
    name: '러시안 블루',
    type: 'cat',
    tag: '은빛 요정 · 차분함',
    description: '신비로운 에메랄드빛 눈동자와 고요하고 우아한 위로를 건네는 친구.',
    suggestedNames: ['은이', '블루', '달이', '새벽이', '먼지'],
    svgGradient: 'from-slate-400 to-slate-700',
    svgEmoji: '🐱'
  },
  {
    id: 'tuxedo_cat',
    name: '턱시도 고양이',
    type: 'cat',
    tag: '젠틀맨 · 애교쟁이',
    description: '단정한 턱시도를 입은 듯 하얀 양말을 신고 호기심 가득한 눈망울.',
    suggestedNames: ['까망이', '오레오', '초코', '턱시', '양말이'],
    svgGradient: 'from-slate-900 to-slate-700',
    svgEmoji: '🐈‍⬛'
  }
];

export const PetAdoptionModal: React.FC<PetAdoptionModalProps> = ({
  age,
  year,
  onConfirm,
  onCancel
}) => {
  const [selectedBreed, setSelectedBreed] = useState<PetBreedOption>(PET_BREEDS[0]);
  const [petName, setPetName] = useState<string>(PET_BREEDS[0].suggestedNames[0]);
  const [customName, setCustomName] = useState<string>('');

  const finalName = customName.trim() || petName;

  const handleSelectBreed = (b: PetBreedOption) => {
    audioManager.playClickSound();
    setSelectedBreed(b);
    setPetName(b.suggestedNames[0]);
    setCustomName('');
  };

  const handleConfirm = () => {
    if (!finalName) return;
    audioManager.playChimeSound();
    onConfirm({
      name: finalName,
      type: selectedBreed.type,
      breed: selectedBreed.name,
      icon: selectedBreed.svgEmoji,
      adoptedAge: age
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#0b0e17] border border-amber-500/40 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-amber-950/60">
        
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-amber-950/80 via-emerald-950/50 to-space-900 border-b border-amber-500/30 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {year}년 ({age}세) · 반려동물과의 만남
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span>🐾 평생을 함께할 가족을 입양합니다</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              반려동물의 종류를 선택하고, 사랑을 담은 따뜻한 이름을 지어주세요.
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 본문: 스크롤 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          
          {/* 1. 반려동물 품종 선택 카드 그리드 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>반려동물 선택 (이미지 카드를 클릭하세요)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PET_BREEDS.map(breed => {
                const isSelected = selectedBreed.id === breed.id;
                return (
                  <button
                    key={breed.id}
                    type="button"
                    onClick={() => handleSelectBreed(breed)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-space-850 border-slate-700/80 hover:border-slate-500 hover:bg-space-800'
                    }`}
                  >
                    {/* 상단 뱃지 & 아이콘 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${breed.svgGradient} flex items-center justify-center text-2xl shadow-inner border border-white/20`}>
                        {breed.svgEmoji}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-space-800 text-slate-400'
                      }`}>
                        {breed.type === 'dog' ? '강아지' : '고양이'}
                      </span>
                    </div>

                    {/* 이름 & 설명 */}
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{breed.name}</span>
                      </h4>
                      <span className="text-[10px] text-amber-300/90 block mb-1">
                        {breed.tag}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                        {breed.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 이름 추천 칩 */}
          <div className="p-3.5 rounded-xl bg-space-850/80 border border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>🏷️ 추천 이름 ({selectedBreed.name})</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                현재 이름: <strong className="text-amber-300 font-bold">{finalName}</strong>
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {selectedBreed.suggestedNames.map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    audioManager.playClickSound();
                    setPetName(name);
                    setCustomName('');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition border ${
                    petName === name && !customName
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-space-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* 직접 입력창 */}
            <div className="pt-1">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value.slice(0, 10))}
                placeholder="직접 부르고 싶은 이름을 적어주세요 (예: 까미, 뭉치, 퐁이)"
                className="w-full bg-space-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 푸터: 확정 버튼 */}
        <div className="p-4 bg-space-950 border-t border-slate-800 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current text-rose-800" />
            <span>'{finalName}'({selectedBreed.name})을(를) 가족으로 맞이하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
