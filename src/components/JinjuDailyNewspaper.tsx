import React, { useRef, useState } from 'react';
import { CitizenStatus, CityMacroIndicators } from '../types/game';
import { Newspaper, Printer, Copy, Check, Share2, Sparkles, Heart } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface JinjuDailyNewspaperProps {
  citizen: CitizenStatus;
  cityIndicators: CityMacroIndicators;
}

function formatWealth(won: number): string {
  if (!won || won <= 0) return '0원';
  const manWon = Math.floor(won / 10000);
  if (manWon >= 10000) {
    const eok = Math.floor(manWon / 10000);
    const rest = manWon % 10000;
    return rest > 0 ? `${eok}억 ${rest.toLocaleString('ko-KR')}만 원` : `${eok}억 원`;
  }
  return `${manWon.toLocaleString('ko-KR')}만 원`;
}

export const JinjuDailyNewspaper: React.FC<JinjuDailyNewspaperProps> = ({
  citizen,
  cityIndicators
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const districtName = citizen.district.name.split(' ')[0];
  const issueNo = (citizen.birthYear * 170 + citizen.age * 3).toLocaleString('ko-KR');

  const headline = `진주 ${districtName} 출신 ${citizen.jobTitle || citizen.job} '${citizen.name}' 옹, 향년 ${citizen.age}세로 남강 곁에 영면`;

  const copySummaryText = () => {
    const text = `[진주일보 생애 호외 - 제${issueNo}호]
"${headline}"
- 출생: ${citizen.birthYear}년 진주시 ${citizen.district.name}
- 학력: ${citizen.education}
- 직업: ${citizen.jobTitle || citizen.job}
- 최종 자산: 순자산 ${formatWealth(citizen.netWorthWon)} (총자산 ${formatWealth(citizen.totalAssetsWon || citizen.netWorthWon)})
- 곁을 지킨 이: ${citizen.spouse ? `배우자 ${citizen.spouse.name}` : ''} ${citizen.childrenCount > 0 ? `자녀 ${citizen.childrenCount}명` : ''} ${citizen.pet ? `반려동물 '${citizen.pet.name}'` : ''}
- 삶의 결: "${citizen.lifeArchetype.title}" - ${citizen.lifeArchetype.summary}
- 영면 사유: ${citizen.deathCause || '평온한 자연 수명 다함'}
▶ 34만 분의 1 : 진주 (https://semyo0513.github.io/1in3M/)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    audioManager.playClickSound();
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    audioManager.playClickSound();
    window.print();
  };

  return (
    <div className="w-full flex flex-col space-y-3 select-none">
      
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between text-xs bg-space-900 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200">나의 인생 신문 (진주일보 호외)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copySummaryText}
            className="px-3 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition font-medium text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? '신문 기사 복사됨!' : '기사 복사'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-space-950 font-bold flex items-center gap-1.5 transition text-xs shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>신문 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>

      {/* 신문 본체 (빈티지 뉴스페이퍼 스타일) */}
      <div
        ref={paperRef}
        className="bg-[#f6f2e9] text-stone-900 rounded-xl p-5 sm:p-7 shadow-2xl border-4 border-stone-800 font-serif relative overflow-hidden"
      >
        {/* 신문 헤더: 제호 */}
        <div className="border-b-4 border-stone-900 pb-2 text-center">
          <div className="flex justify-between items-center text-[10px] text-stone-600 font-mono border-b border-stone-400 pb-1 mb-2">
            <span>제 {issueNo} 호 (특별호외)</span>
            <span className="font-bold">진주 시민 34만 분의 1의 생애 기록</span>
            <span>{citizen.currentYear}년 11월 3일 (화요일)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-widest text-stone-950 my-1 font-serif">
            晉 州 日 報
          </h1>
          <div className="text-[11px] sm:text-xs text-stone-700 font-sans tracking-wide">
            JINJU DAILY NEWS · 진주시민의 삶과 남강의 역사를 기록하는 정론직필
          </div>
        </div>

        {/* 1면 메인 톱기사 헤드라인 */}
        <div className="my-4 border-b-2 border-stone-900 pb-3">
          <span className="text-xs font-sans font-bold bg-stone-900 text-[#f6f2e9] px-2 py-0.5 rounded">
            [생애 종합 1면 톱기사]
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-stone-950 mt-1.5 leading-snug tracking-tight">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 mt-2 leading-relaxed italic">
            "2026년 진주시 {districtName}에서 태어나 온갖 시대의 격변과 갈림길 속에서도 꿋꿋하게 자신만의 삶의 결을 지켜온 {citizen.name} 옹이 {citizen.currentYear}년 향년 {citizen.age}세로 남강의 곁에서 영면하였다."
          </p>
        </div>

        {/* 신문 3열 그리드 본문 기사 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
          
          {/* 기사 1: 학업과 청춘의 발자취 */}
          <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-stone-400 pb-3 sm:pb-0 sm:pr-3">
            <h3 className="font-bold text-sm text-stone-950 border-b border-stone-900 pb-1 flex items-center gap-1 font-sans">
              <span>🎓 학업과 청춘의 궤적</span>
            </h3>
            <p className="text-stone-800 text-[11px] leading-relaxed">
              고인은 어린 시절 진주 {citizen.elementarySchool || '초등학교'}와 {citizen.highSchool || '고등학교'}를 거쳤으며, 
              {citizen.collegeName ? (
                ` ${citizen.collegeName} ${citizen.collegeMajor || ''}에 진학하여 청춘의 학문을 닦았다.`
              ) : (
                ' 일찍이 실용적 기술을 익혀 산업 일선에서 자립의 발판을 다졌다.'
              )}
            </p>
            <div className="bg-stone-200/80 p-2 rounded text-[11px] font-mono text-stone-800">
              학업 지표: <strong>{citizen.learning}점</strong> / 학력: {citizen.education}
            </div>
          </div>

          {/* 기사 2: 일터와 일군 자산 */}
          <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-stone-400 pb-3 sm:pb-0 sm:pr-3">
            <h3 className="font-bold text-sm text-stone-950 border-b border-stone-900 pb-1 flex items-center gap-1 font-sans">
              <span>💼 평생의 일터와 자산</span>
            </h3>
            <p className="text-stone-800 text-[11px] leading-relaxed">
              사회에 첫발을 디딘 이래 <strong>{citizen.jobTitle || citizen.job}</strong>(으)로 헌신하며 성실한 땀방울로 순자산 <strong>{formatWealth(citizen.netWorthWon)}</strong>을 일구어냈다.
              {citizen.flags?.has('HOME_OWNER_CHUNGMUGONG') && ' 특히 혁신도시 신축 아파트를 자가로 마련하여 안정된 보금자리를 마련했다.'}
            </p>
            <div className="bg-stone-200/80 p-2 rounded text-[11px] font-mono text-stone-800">
              총자산: {formatWealth(citizen.totalAssetsWon || citizen.netWorthWon)} / 부채: {citizen.totalDebtWon > 0 ? formatWealth(citizen.totalDebtWon) : '완전 상환 (0원)'}
            </div>
          </div>

          {/* 기사 3: 가족과 곁을 지킨 이들 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-stone-950 border-b border-stone-900 pb-1 flex items-center gap-1 font-sans">
              <span>❤️ 함께한 이들과 삶의 결</span>
            </h3>
            <p className="text-stone-800 text-[11px] leading-relaxed">
              {citizen.spouse ? `배우자 '${citizen.spouse.name}'와(과) ${citizen.spouse.yearsTogether}년간 해로하였으며, ` : '비혼의 당당한 자립을 지켰으며, '}
              {citizen.childrenCount > 0 ? `슬하에 ${citizen.childrenCount}명의 자녀를 두었다. ` : ''}
              {citizen.pet ? `또한 반려견 '${citizen.pet.name}'과 깊은 온기를 나누었다.` : ''}
            </p>
            <div className="bg-stone-200/80 p-2 rounded text-[11px] font-sans text-stone-800 leading-snug">
              <strong>"{citizen.lifeArchetype.title}"</strong><br />
              {citizen.lifeArchetype.summary}
            </div>
          </div>

        </div>

        {/* 신문 하단: 남강 유등 추모사 및 시민 서명 */}
        <div className="mt-5 pt-3 border-t-2 border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-600 font-sans gap-2">
          <div>
            남강의 등불 하나가 하늘로 올라갔습니다. 고인의 영면을 삼가 애도합니다.
          </div>
          <div className="font-mono font-bold text-stone-800">
            진주시 남강유등추모위원회 발행 · 시민번호 #{citizen.birthYear}-340000
          </div>
        </div>

      </div>

    </div>
  );
};
