import React, { useState } from 'react';
import { DilemmaIssue, StanceOption } from '../types/game';
import { Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface DilemmaCardProps {
  dilemma: DilemmaIssue;
  age: number;
  year: number;
  onSelectOption: (option: StanceOption, reason: string, participation: string) => void;
}

export const DilemmaCard: React.FC<DilemmaCardProps> = ({
  dilemma,
  age,
  year,
  onSelectOption
}) => {
  const [selectedStance, setSelectedStance] = useState<StanceOption['stance']>(dilemma.options[0].stance);
  const [selectedReason, setSelectedReason] = useState<string>(dilemma.options[0].reasons[0]);
  const [participation, setParticipation] = useState<string>('시민 공청회에 참석하여 의견을 낸다');

  const currentOption = dilemma.options.find(o => o.stance === selectedStance) || dilemma.options[0];

  const handleStanceChange = (stance: StanceOption['stance']) => {
    setSelectedStance(stance);
    const opt = dilemma.options.find(o => o.stance === stance);
    if (opt && opt.reasons.length > 0) {
      setSelectedReason(opt.reasons[0]);
    }
    audioManager.playClickSound();
  };

  const participationOptions = [
    '온라인 여론조사 및 시청 민원/서명에 참여한다',
    '시민 공청회에 참석하여 직접 의견을 낸다',
    '이해관계자 주민협의체 또는 비상대책위에 동참한다',
    '관련 자료를 깊이 탐색하며 조용히 지켜본다',
    '특별한 참여 없이 일상에 집중한다'
  ];

  const handleSubmit = () => {
    audioManager.playClickSound();
    onSelectOption(currentOption, selectedReason, participation);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-space-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full my-auto shadow-2xl shadow-amber-950/40 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-amber-950/60 to-space-900 px-5 py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-amber-400/90">
                {age}세 ({year}년) · 진주의 갈림길
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {dilemma.title}
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950 text-amber-300 border border-amber-600/30">
            {dilemma.category}
          </span>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="p-5 space-y-4 overflow-y-auto text-sm">
          
          {/* 1막: FACT 사실 */}
          <div className="bg-space-850 p-3.5 rounded-xl border border-sky-600/30">
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-xs mb-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>[FACT] 공공데이터 및 공식 사실</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans break-keep">
              {dilemma.factText}
            </p>
            <div className="mt-2 text-[11px] text-sky-400/80 font-mono">
              출처: {dilemma.factSource}
            </div>
          </div>

          {/* 2막: STANCE 양측 입장 대립 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="bg-space-850 p-3 rounded-lg border border-slate-700">
              <span className="font-semibold text-amber-300 block mb-1">
                🗣️ {dilemma.stanceA.actor}
              </span>
              <p className="text-slate-300 leading-relaxed break-keep">
                "{dilemma.stanceA.summary}"
              </p>
            </div>
            <div className="bg-space-850 p-3 rounded-lg border border-slate-700">
              <span className="font-semibold text-amber-300 block mb-1">
                🗣️ {dilemma.stanceB.actor}
              </span>
              <p className="text-slate-300 leading-relaxed break-keep">
                "{dilemma.stanceB.summary}"
              </p>
            </div>
          </div>

          {/* 3막: CHOICE 1단계 - 나의 입장 선택 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              1단계: 당신의 입장은 무엇입니까?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dilemma.options.map((opt) => (
                <button
                  key={opt.stance}
                  onClick={() => handleStanceChange(opt.stance)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    selectedStance === opt.stance
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-space-850 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-space-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.stance}</span>
                    {selectedStance === opt.stance && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3막: CHOICE 2단계 - 그 입장을 선택한 이유 */}
          {currentOption.reasons.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                2단계: 당신이 이 입장을 택한 구체적인 이유는 무엇입니까?
              </label>
              <div className="space-y-1.5">
                {currentOption.reasons.map((r) => (
                  <label
                    key={r}
                    onClick={() => audioManager.playClickSound()}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                      selectedReason === r
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        : 'bg-space-850 border-slate-700/60 text-slate-400 hover:bg-space-800 hover:text-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dilemma_reason"
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                      className="accent-amber-500"
                    />
                    <span className="font-sans break-keep">{r}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 3막: CHOICE 3단계 - 시민 참여 방식 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              3단계: 어떻게 참여하시겠습니까?
            </label>
            <select
              value={participation}
              onChange={(e) => setParticipation(e.target.value)}
              className="w-full bg-space-850 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {participationOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* 액션 버튼 */}
        <div className="p-4 bg-space-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-space-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
          >
            이 결정으로 살아가기
          </button>
        </div>

      </div>
    </div>
  );
};
