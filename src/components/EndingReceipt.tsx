import React, { useState } from 'react';
import { CitizenStatus, CityMacroIndicators } from '../types/game';
import { Flame, Copy, Check, RotateCcw, Share2 } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface EndingReceiptProps {
  citizen: CitizenStatus;
  cityIndicators: CityMacroIndicators;
  onRestart: () => void;
  onSendToMemorial: (words: string) => void;
}

export const EndingReceipt: React.FC<EndingReceiptProps> = ({
  citizen,
  cityIndicators,
  onRestart,
  onSendToMemorial
}) => {
  const [lastWords, setLastWords] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentToMemorial, setSentToMemorial] = useState(false);

  const handleCopy = () => {
    const textReceipt = `
==================================================
   [ 34만 분의 1 : 진주 — 생애 데이터 영수증 ]
==================================================
• 성명: ${citizen.name} (${citizen.gender})
• 출생: ${citizen.birthYear}년, 진주시 ${citizen.district.name}
• 영면: ${citizen.age}세 (${citizen.currentYear}년)
• 사망 사유: ${citizen.deathCause || '평온한 영면'}
• 평생 주 직업: ${citizen.job}
• 최종 소득: ${citizen.incomeDecile}분위 (월 ${(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)

[생애 4대 지표]
• 건강: ${citizen.health}/100 | 행복: ${citizen.happiness}/100
• 배움: ${citizen.learning}/100 | 유대: ${citizen.bonds}/100

[마주한 진주의 선택 (${citizen.choicesHistory.length}건)]
${citizen.choicesHistory.map((c, i) => `${i + 1}. [${c.age}세] ${c.issueTitle} ➔ ${c.stance} ("${c.reason}")`).join('\n')}

[내가 남긴 진주 도시 기류]
• 원도심 vs 신도심 지수: ${cityIndicators.space > 0 ? `+${cityIndicators.space}` : cityIndicators.space}
• 골목농가 vs 첨단산단 지수: ${cityIndicators.economy > 0 ? `+${cityIndicators.economy}` : cityIndicators.economy}
• 공공복지 vs 재정건전 지수: ${cityIndicators.welfare > 0 ? `+${cityIndicators.welfare}` : cityIndicators.welfare}
• 역사보존 vs 관광개발 지수: ${cityIndicators.culture > 0 ? `+${cityIndicators.culture}` : cityIndicators.culture}

"한 사람이 도시를 혼자 바꿀 수는 없었지만,
 당신이 남긴 선택들은 진주를 변화시킨 작은 물결이 되었습니다."
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
    if (!lastWords.trim()) return;
    audioManager.playChimeSound();
    onSendToMemorial(lastWords.trim());
    setSentToMemorial(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12161f] text-slate-200 border border-amber-500/40 rounded-2xl max-w-xl w-full my-auto shadow-2xl shadow-amber-950/50 p-5 sm:p-7 font-mono text-xs sm:text-sm">
        
        {/* 영수증 상단 헤더 */}
        <div className="text-center pb-4 border-b border-dashed border-slate-700">
          <div className="text-2xl mb-1">🏮</div>
          <h2 className="text-base sm:text-lg font-bold text-amber-300 tracking-wide font-sans">
            생애 데이터 영수증 (LIFE DATA RECEIPT)
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            진주시민 33만 4천 명 중 한 사람의 일생
          </p>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">
            발행: 진주시 공공데이터 시뮬레이션 엔진 v1.0
          </div>
        </div>

        {/* 인적 사항 요약 */}
        <div className="py-3 border-b border-dashed border-slate-700 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">출생 장소</span>
            <span className="font-semibold text-sky-300">진주시 {citizen.district.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">생애 기간</span>
            <span className="font-semibold text-slate-200">
              {citizen.birthYear}년 ~ {citizen.currentYear}년 ({citizen.age}세)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">영면 사유</span>
            <span className="font-semibold text-rose-300">{citizen.deathCause || '평온한 영면'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">평생 직업</span>
            <span className="font-semibold text-amber-300">{citizen.job}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">최종 소득 분위</span>
            <span className="font-semibold text-slate-200">
              {citizen.incomeDecile}분위 (월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)
            </span>
          </div>
        </div>

        {/* 4대 생애 지표 결과 */}
        <div className="py-3 border-b border-dashed border-slate-700">
          <div className="text-[11px] text-slate-400 mb-1.5">생애 최종 지표</div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-space-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">건강</span>
              <span className="font-bold text-rose-400">{citizen.health}</span>
            </div>
            <div className="bg-space-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">행복</span>
              <span className="font-bold text-amber-400">{citizen.happiness}</span>
            </div>
            <div className="bg-space-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">배움</span>
              <span className="font-bold text-sky-400">{citizen.learning}</span>
            </div>
            <div className="bg-space-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">유대</span>
              <span className="font-bold text-emerald-400">{citizen.bonds}</span>
            </div>
          </div>
        </div>

        {/* 마주한 진주의 선택 목록 */}
        <div className="py-3 border-b border-dashed border-slate-700">
          <div className="text-[11px] text-slate-400 mb-1 flex justify-between">
            <span>마주한 진주의 갈림길</span>
            <span className="text-amber-400 font-semibold">{citizen.choicesHistory.length}건 참여</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs pr-1">
            {citizen.choicesHistory.map((c, idx) => (
              <div key={idx} className="bg-space-900/60 p-2 rounded border border-slate-800">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span className="truncate max-w-[240px]">{c.issueTitle}</span>
                  <span className="text-amber-300 font-mono ml-2">{c.stance}</span>
                </div>
                <div className="text-[10px] text-slate-400 italic mt-0.5">
                  "{c.reason}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 잠시 멈춤 메모 기록 */}
        {citizen.pausedQuestionAnswers.length > 0 && (
          <div className="py-3 border-b border-dashed border-slate-700">
            <div className="text-[11px] text-slate-400 mb-1.5">생애 길목에서 남겼던 생각들</div>
            <div className="space-y-1.5 max-h-28 overflow-y-auto text-xs">
              {citizen.pausedQuestionAnswers.map((p, idx) => (
                <div key={idx} className="bg-emerald-950/20 p-2 rounded border border-emerald-900/40 text-[11px]">
                  <span className="text-emerald-400 font-bold block">{p.age}세의 성찰:</span>
                  <span className="text-slate-300 italic">"{p.answer}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 바코드 연출 */}
        <div className="py-3 text-center border-b border-dashed border-slate-700">
          <div className="tracking-[0.3em] font-mono text-lg text-slate-400 select-none">
            ||| | |||| | | ||||| || | |||| ||
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            JINJU-CITIZEN-HASH-{citizen.birthYear}-{citizen.district.id.toUpperCase()}
          </div>
        </div>

        {/* 남강에 유등 띄우기 (마지막 한마디 남기기) */}
        {!sentToMemorial ? (
          <form onSubmit={handleFloatingLantern} className="pt-3">
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              🕯️ 이 사람의 삶을 기리며 남강에 유등 띄우기
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={lastWords}
                onChange={(e) => setLastWords(e.target.value)}
                placeholder="이 사람에게 남길 마지막 한마디를 적어보세요..."
                maxLength={60}
                className="flex-1 bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!lastWords.trim()}
                className="px-4 py-2 rounded-lg font-bold text-xs bg-amber-500 text-space-950 hover:bg-amber-400 disabled:opacity-50 transition whitespace-nowrap flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>유등 띄우기</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-3 text-center text-xs text-amber-300 bg-amber-950/30 p-2.5 rounded-lg border border-amber-600/40 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>당신의 유등이 남강의 밤 물결 위에 띄워졌습니다.</span>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-space-900 border border-slate-700 text-xs text-slate-300 hover:text-slate-100 hover:bg-space-850 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료' : '영수증 텍스트 복사'}</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onRestart();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 transition shadow-lg shadow-sky-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다른 삶으로 다시 태어나기</span>
          </button>
        </div>

      </div>
    </div>
  );
};
