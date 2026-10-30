import React, { useState } from 'react';
import { CitizenStatus, CityMacroIndicators } from '../types/game';
import { Flame, Copy, Check, RotateCcw, HeartHandshake, ShieldCheck } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { Footer } from './Footer';

interface EndingReceiptProps {
  citizen: CitizenStatus;
  cityIndicators: CityMacroIndicators;
  isEduMode?: boolean;
  onRestart: () => void;
  onSendToMemorial: (words: string) => void;
}

export const EndingReceipt: React.FC<EndingReceiptProps> = ({
  citizen,
  cityIndicators,
  isEduMode = false,
  onRestart,
  onSendToMemorial
}) => {
  const [lastWords, setLastWords] = useState('');
  const [selectedEduCard, setSelectedEduCard] = useState('남강의 맑은 물결처럼 이웃을 서로 배려하는 진주가 되길 바랍니다.');
  const [copied, setCopied] = useState(false);
  const [sentToMemorial, setSentToMemorial] = useState(false);

  const eduWordsCards = [
    '남강의 맑은 물결처럼 이웃을 서로 배려하는 진주가 되길 바랍니다.',
    '입장이 달라도 서로의 이유를 먼저 듣고 대화하는 시민이 되겠습니다.',
    '출생은 선택할 수 없었지만, 우리가 함께 만들어갈 미래는 선택할 수 있습니다.',
    '작은 마을과 원도심, 신도심 모두가 소외되지 않고 상생하길 응원합니다.'
  ];

  const handleCopy = () => {
    const textReceipt = `
==================================================
   [ 34만 분의 1 : 진주 — 생애 데이터 영수증 ]
   ${isEduMode ? '(학생 수업용 디브리핑 리포트)' : ''}
==================================================
• 성명: ${citizen.name} (${citizen.gender})
• 출생: ${citizen.birthYear}년, 진주시 ${citizen.district.name}
• 영면: ${citizen.age}세 (${citizen.currentYear}년)
• 삶의 마감: ${citizen.deathCause || '평온한 수명 마감'}
• 평생 주 직업: ${citizen.job}
• 생활 환경: ${isEduMode ? (citizen.incomeDesc || '성실한 일터의 가정') : `${citizen.incomeDecile}분위 (월 ${(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)`}

[생애 4대 지표]
• 건강: ${citizen.health}/100 | 행복: ${citizen.happiness}/100
• 배움: ${citizen.learning}/100 | 유대: ${citizen.bonds}/100

[마주한 지역 갈림길 (${citizen.choicesHistory.length}건)]
${citizen.choicesHistory.map((c, i) => `${i + 1}. [${c.age}세] ${c.issueTitle} ➔ ${c.stance} ("${c.reason}")`).join('\n')}

[내가 남긴 진주 도시 기류]
• 공간 균형 지수: ${cityIndicators.space > 0 ? `+${cityIndicators.space}` : cityIndicators.space}
• 산업 균형 지수: ${cityIndicators.economy > 0 ? `+${cityIndicators.economy}` : cityIndicators.economy}
• 보건복지 지수: ${cityIndicators.welfare > 0 ? `+${cityIndicators.welfare}` : cityIndicators.welfare}
• 문화생태 지수: ${cityIndicators.culture > 0 ? `+${cityIndicators.culture}` : cityIndicators.culture}

"우리가 어디서 태어날지는 스스로 선택할 수 없는 삶의 우연(운)입니다.
 중요한 것은 어떤 처지에서 시작했든 서로를 존중하며
 함께 살아갈 더 나은 공동체를 만들어가는 우리의 선택입니다."
==================================================
1 in 340,000 : JINJU
`;

    navigator.clipboard.writeText(textReceipt.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFloatingLantern = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWords = isEduMode ? selectedEduCard : lastWords.trim();
    if (!finalWords) return;
    audioManager.playChimeSound();
    onSendToMemorial(finalWords);
    setSentToMemorial(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12161f] text-slate-200 border border-amber-500/40 rounded-2xl max-w-xl w-full my-auto shadow-2xl shadow-amber-950/50 p-4 sm:p-6 font-mono text-xs sm:text-sm">
        
        {/* 교육용 디브리핑 핵심 철학 (출생은 운, 고정 문구) */}
        {isEduMode && (
          <div className="mb-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 text-left font-sans">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs mb-1">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>[수업 디브리핑] 함께 살아가는 공동체를 위한 성찰</span>
            </div>
            <p className="text-[11px] text-emerald-100 leading-relaxed break-keep">
              "우리가 어디서, 어떤 환경에서 태어날지는 스스로 선택한 것이 아닌 <strong>'삶의 우연(운)'</strong>입니다.
              중요한 것은 어떤 환경에서 시작했든 서로의 처지를 존중하고, 함께 살아갈 더 나은 진주를 만들어가는 우리들의 선택입니다."
            </p>
          </div>
        )}

        {/* 영수증 상단 헤더 */}
        <div className="text-center pb-3 border-b border-dashed border-slate-700">
          <div className="text-xl mb-1">🏮</div>
          <h2 className="text-base font-bold text-amber-300 tracking-wide font-sans">
            생애 데이터 영수증 (LIFE DATA RECEIPT)
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
            진주시민 33만 4천 명 중 한 사람의 일생 {isEduMode && '· 수업용 요약'}
          </p>
        </div>

        {/* 인적 사항 요약 */}
        <div className="py-2.5 border-b border-dashed border-slate-700 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">출생 장소</span>
            <span className="font-semibold text-sky-300">진주시 {citizen.district.name} ({citizen.district.gameRegionName})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">생애 기간</span>
            <span className="font-semibold text-slate-200">
              {citizen.birthYear}년 ~ {citizen.currentYear}년 ({citizen.age}세)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">삶의 마감</span>
            <span className="font-semibold text-rose-300">{citizen.deathCause || '평온한 영면'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">평생 직업</span>
            <span className="font-semibold text-amber-300">{citizen.job}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">생활 환경</span>
            <span className="font-semibold text-slate-200">
              {isEduMode ? (
                <span className="text-emerald-300 font-sans">{citizen.incomeDesc || '성실한 일터의 가정'}</span>
              ) : (
                <span>{citizen.incomeDecile}분위 (월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)</span>
              )}
            </span>
          </div>
        </div>

        {/* 4대 생애 지표 결과 */}
        <div className="py-2.5 border-b border-dashed border-slate-700">
          <div className="text-[10px] text-slate-400 mb-1">생애 최종 지표</div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="bg-space-900/80 p-1 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">건강</span>
              <span className="font-bold text-rose-400">{citizen.health}</span>
            </div>
            <div className="bg-space-900/80 p-1 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">행복</span>
              <span className="font-bold text-amber-400">{citizen.happiness}</span>
            </div>
            <div className="bg-space-900/80 p-1 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">배움</span>
              <span className="font-bold text-sky-400">{citizen.learning}</span>
            </div>
            <div className="bg-space-900/80 p-1 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">유대</span>
              <span className="font-bold text-emerald-400">{citizen.bonds}</span>
            </div>
          </div>
        </div>

        {/* 마주한 진주의 선택 목록 */}
        <div className="py-2.5 border-b border-dashed border-slate-700">
          <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
            <span>참여한 지역 갈림길</span>
            <span className="text-amber-400 font-semibold">{citizen.choicesHistory.length}건 참여</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto text-xs pr-1">
            {citizen.choicesHistory.map((c, idx) => (
              <div key={idx} className="bg-space-900/60 p-1.5 rounded border border-slate-800">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span className="truncate max-w-[240px] text-[11px]">{c.issueTitle}</span>
                  <span className="text-amber-300 font-mono ml-2 text-[11px]">{c.stance}</span>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  "{c.reason}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 성찰 메모 기록 */}
        {citizen.pausedQuestionAnswers.length > 0 && (
          <div className="py-2.5 border-b border-dashed border-slate-700">
            <div className="text-[10px] text-slate-400 mb-1">생애 길목에서 남겼던 생각들</div>
            <div className="space-y-1 max-h-24 overflow-y-auto text-xs">
              {citizen.pausedQuestionAnswers.map((p, idx) => (
                <div key={idx} className="bg-emerald-950/20 p-1.5 rounded border border-emerald-900/40 text-[10px]">
                  <span className="text-emerald-400 font-bold block">{p.age}세 성찰:</span>
                  <span className="text-slate-300 italic">"{p.answer}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 남강에 유등 띄우기 (마지막 한마디 남기기) */}
        {!sentToMemorial ? (
          <form onSubmit={handleFloatingLantern} className="pt-2.5">
            <label className="block text-[11px] font-semibold text-amber-300 mb-1">
              🕯️ 이 삶을 기리며 남강에 유등 띄우기
            </label>
            {isEduMode ? (
              <div className="space-y-1.5">
                <div className="space-y-1">
                  {eduWordsCards.map((w, idx) => (
                    <label
                      key={idx}
                      className={`block p-2 rounded-lg border text-[11px] cursor-pointer transition ${
                        selectedEduCard === w
                          ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                          : 'bg-space-900 border-slate-800 text-slate-400 hover:bg-space-850'
                      }`}
                    >
                      <input
                        type="radio"
                        name="edu_memorial_word"
                        checked={selectedEduCard === w}
                        onChange={() => setSelectedEduCard(w)}
                        className="mr-1.5 accent-amber-500"
                      />
                      <span className="font-sans leading-snug">{w}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl font-bold text-xs bg-amber-500 text-space-950 hover:bg-amber-400 transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/20"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>남강에 유등 띄우기</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lastWords}
                  onChange={(e) => setLastWords(e.target.value)}
                  placeholder="이 사람에게 남길 마지막 한마디를 적어보세요..."
                  maxLength={60}
                  className="flex-1 bg-space-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!lastWords.trim()}
                  className="px-3.5 py-1.5 rounded-lg font-bold text-xs bg-amber-500 text-space-950 hover:bg-amber-400 disabled:opacity-50 transition flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>유등 띄우기</span>
                </button>
              </div>
            )}
          </form>
        ) : (
          <div className="pt-2 text-center text-xs text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-600/40 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>당신의 유등이 남강의 밤 물결 위에 띄워졌습니다.</span>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-space-900 border border-slate-700 text-xs text-slate-300 hover:text-slate-100 hover:bg-space-850 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료' : '결과 복사'}</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onRestart();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 transition shadow-lg shadow-sky-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다른 삶으로 다시 시작하기</span>
          </button>
        </div>

        <div className="mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>개인정보 외부 전송 0% (만 14세 미만 학생 보호 적용)</span>
        </div>

        {/* 하단 라이선스 및 원작 명시 */}
        <Footer className="border-t border-slate-800/80 bg-space-950 mt-2 py-2" />

      </div>
    </div>
  );
};
