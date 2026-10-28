import React, { useState } from 'react';
import { PauseCircle, ArrowRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface PauseModalProps {
  age: number;
  question: string;
  onConfirm: (answer: string) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ age, question, onConfirm }) => {
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playClickSound();
    onConfirm(memo.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-space-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-emerald-950/40">
        <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs mb-3">
          <PauseCircle className="w-5 h-5" />
          <span>[REFLECT] {age}세, 잠시 멈춤의 시간</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-snug font-serif break-keep">
          "{question}"
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-sans">
              이 순간 당신의 생각이나 이 사람에게 남기고 싶은 한 줄 메모 (선택 입력)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="자유롭게 한 줄을 남겨보세요. (생애 영수증에 영구 각인됩니다)"
              rows={3}
              maxLength={120}
              className="w-full bg-space-850 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
            />
            <div className="text-right text-[10px] text-slate-500 mt-1">
              {memo.length} / 120자
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                audioManager.playClickSound();
                onConfirm('');
              }}
              className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
            >
              생각만 하고 넘어가기
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-space-950 hover:from-emerald-400 hover:to-teal-500 transition shadow-lg shadow-emerald-500/20"
            >
              <span>기록하고 삶 이어가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
