import React, { useState } from 'react';
import { PauseCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface PauseModalProps {
  age: number;
  question: string;
  isEduMode?: boolean;
  onConfirm: (answer: string) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  age,
  question,
  isEduMode = false,
  onConfirm
}) => {
  const [memo, setMemo] = useState('');
  const [selectedCard, setSelectedCard] = useState<string>('');

  // 교육용 추천 생각 카드 풀
  const eduThoughtCards: Record<number, string[]> = {
    5: [
      '놀이터와 자연이 가까워서 이 아이가 안전하고 밝게 뛰어놀았으면 좋겠습니다.',
      '아플 때 바로 갈 수 있는 달빛소아과와 병원이 가까이 있기를 바랍니다.',
      '남강의 푸른 물결과 맑은 하늘이 이 아이에게 따뜻한 고향이 되었을 것입니다.'
    ],
    15: [
      '어른들이 서로 대립하기보다 아이들의 배움과 안전을 위해 대화하길 바랐을 것입니다.',
      '차창 밖으로 보이는 아파트와 공장, 논밭을 보며 내가 살아갈 미래의 모습을 그렸을 것입니다.',
      '어떤 동네에 살든 모든 학생이 공평한 배움의 기회를 누려야 한다고 느꼈을 것입니다.'
    ],
    30: [
      '고향 진주에서 전공을 살릴 좋은 일자리를 얻어 친구들과 함께 남고 싶어 할 것입니다.',
      '남강변 산책로를 걸으며 하루의 피로를 씻고 가족들과 소박한 행복을 꿈꿀 것입니다.',
      '서로의 차이를 인정하고 배려하는 따뜻한 시민 공동체를 바라보고 있을 것입니다.'
    ],
    50: [
      '자녀의 미래와 부모님 돌봄 사이에서, 누군가를 지탱해 주는 든든한 나무가 되고자 합니다.',
      '도시가 발전하면서도 역사와 생태 원형을 잃지 않는 균형이 가장 소중하다고 생각합니다.',
      '내가 내렸던 시민으로서의 선택들이 진주를 조금 더 살기 좋은 곳으로 만들었길 바랍니다.'
    ],
    70: [
      '처음 보았던 진주보다 훨씬 커졌지만, 남강의 평온한 물결만은 변함없이 아름답습니다.',
      '어려운 시절을 함께 버텨온 이웃들에게 진심으로 고마운 마음을 전하고 싶습니다.',
      '출생은 스스로 선택할 수 없는 운이었지만, 함께 살아온 시간은 찬란한 축복이었습니다.'
    ]
  };

  const cards = eduThoughtCards[age] || eduThoughtCards[5];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAnswer = isEduMode && selectedCard ? selectedCard : memo.trim();
    audioManager.playClickSound();
    onConfirm(finalAnswer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-space-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl shadow-emerald-950/40">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-2">
          <PauseCircle className="w-4 h-4" />
          <span>[REFLECT] {age}세, 잠시 멈춤의 시간 {isEduMode && '(생각 성찰)'}</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white mb-3 leading-snug font-serif break-keep">
          "{question}"
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 교육용 모드일 때: 안전한 성찰 카드 선택지 우선 제공 */}
          {isEduMode ? (
            <div>
              <label className="block text-[11px] text-emerald-300 font-medium mb-1.5">
                💡 나의 마음에 가장 와닿는 생각을 골라보세요:
              </label>
              <div className="space-y-1.5">
                {cards.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedCard(c);
                      audioManager.playClickSound();
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                      selectedCard === c
                        ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400/40 font-medium'
                        : 'bg-space-850 border-slate-800 text-slate-300 hover:bg-space-800'
                    }`}
                  >
                    <span className="leading-snug font-sans">{c}</span>
                    {selectedCard === c && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-sans">
                이 순간 당신의 생각이나 이 사람에게 남기고 싶은 한 줄 메모 (선택)
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="자유롭게 한 줄을 남겨보세요. (생애 영수증에 영구 각인됩니다)"
                rows={3}
                maxLength={120}
                className="w-full bg-space-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400"
              />
              <div className="text-right text-[10px] text-slate-500 mt-1">
                {memo.length} / 120자
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                audioManager.playClickSound();
                onConfirm('');
              }}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
            >
              생각만 하고 넘어가기
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-space-950 hover:from-emerald-400 hover:to-teal-500 transition shadow-lg shadow-emerald-500/20"
            >
              <span>기록하고 삶 이어가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
