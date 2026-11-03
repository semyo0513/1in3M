import React, { useState } from 'react';
import { Baby, Heart, Sparkles, Check } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface ChildNamingModalProps {
  gender: '아들' | '딸';
  parentName: string;
  age: number;
  year: number;
  onConfirm: (name: string, gender: '아들' | '딸') => void;
}

const PRESET_BOY_NAMES = ['민준', '서준', '도윤', '예준', '하준', '시우', '은우', '지호', '준우', '건우'];
const PRESET_GIRL_NAMES = ['서연', '서아', '지아', '하윤', '하은', '지유', '채원', '유나', '수아', '예린'];

export const ChildNamingModal: React.FC<ChildNamingModalProps> = ({
  gender,
  parentName,
  age,
  year,
  onConfirm
}) => {
  const defaultNames = gender === '아들' ? PRESET_BOY_NAMES : PRESET_GIRL_NAMES;
  const [selectedName, setSelectedName] = useState<string>(defaultNames[0]);
  const [customName, setCustomName] = useState<string>('');

  const finalName = customName.trim() || selectedName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalName) return;
    audioManager.playChimeSound();
    onConfirm(finalName, gender);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-amber-500/40 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl shadow-amber-950/50">
        
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-amber-950/80 via-rose-950/60 to-space-900 border-b border-amber-500/30 p-5 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-300 mb-2">
            <Baby className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {year}년 · 새로운 생명의 탄생 ({age}세)
          </span>
          <h2 className="text-xl font-bold text-white mt-2">
            사랑스러운 <span className={gender === '아들' ? 'text-sky-300' : 'text-rose-300'}>{gender}</span>이 태어났습니다!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            부모 {parentName}의 품에 안긴 소중한 아이의 이름을 지어주세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* 추천 이름 선택 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>추천 이름 (클릭하여 선택)</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {defaultNames.map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    audioManager.playClickSound();
                    setSelectedName(name);
                    setCustomName('');
                  }}
                  className={`py-1.5 rounded-lg text-xs font-medium transition border ${
                    selectedName === name && !customName
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                      : 'bg-space-850 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* 직접 입력 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              또는 직접 이름 입력하기
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value.slice(0, 8))}
              placeholder="예: 하율, 도경, 윤아"
              className="w-full bg-space-850 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 결정 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-current text-rose-800" />
              <span>'{finalName}'(으)로 출생신고 완료하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
