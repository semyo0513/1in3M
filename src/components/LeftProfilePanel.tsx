import React from 'react';
import { CitizenStatus, YearFocus } from '../types/game';
import { Sparkles, X, HeartHandshake, User, GraduationCap, Briefcase, Landmark, Compass, Heart } from 'lucide-react';

interface LeftProfilePanelProps {
  citizen: CitizenStatus;
  isEduMode?: boolean;
  onCloseMobile?: () => void;
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

function getTopTimeSpent(timeSpent?: Record<YearFocus, number>): string {
  if (!timeSpent) return '가족·친구 0년';
  const map: Record<YearFocus, string> = {
    relationship: '가족·친구',
    work: '일·벌이',
    learning: '배움',
    health: '몸과 마음',
    change: '이사와 변화'
  };
  const entries = Object.entries(timeSpent) as [YearFocus, number][];
  entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const [topKey, topVal] = entries[0] || ['relationship', 0];
  return `${map[topKey] || '가족·친구'} ${topVal || 0}년`;
}

export const LeftProfilePanel: React.FC<LeftProfilePanelProps> = ({
  citizen,
  isEduMode = false,
  onCloseMobile
}) => {
  const spouseText = !citizen.spouse
    ? '없음'
    : citizen.spouse.passedAway
    ? `${citizen.spouse.name} ${citizen.spouse.yearsTogether}년을 함께하다 먼저 떠나보냄`
    : `${citizen.spouse.name} ${citizen.spouse.yearsTogether}년을 함께하는 중`;

  const childrenText = citizen.childrenCount === 0 ? '없음' : `${citizen.childrenCount}명`;
  const companionLabel = !citizen.isAlive ? '마지막 길을 배웅한 사람' : '곁을 지키는 사람';

  return (
    <div className="h-full min-h-0 flex flex-col bg-space-950/80 text-slate-200 border-r border-space-800 font-sans select-text">
      
      {/* 1. 상단 패널 헤더 */}
      <div className="p-3.5 border-b border-space-800/80 flex items-center justify-between bg-space-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-base">🏮</span>
          <div>
            <h2 className="text-xs font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>내 삶의 궤적</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-space-800 text-amber-300/90 border border-amber-500/20">
                {citizen.age}세
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-serif">
              {citizen.name} ({citizen.district.name.split(' ')[0]})
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. 본문 프로필 카드 (80억분의1 스타일 타이포그래피) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed custom-scrollbar">
        
        {/* 학력 & 직업 */}
        <div className="space-y-1.5 pb-3 border-b border-slate-800/80">
          <div className="flex items-start">
            <span className="w-16 text-slate-400 shrink-0 font-medium">학력</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-slate-100 font-medium">{citizen.education || '미취학 (영유아)'}</span>
          </div>
          <div className="flex items-start">
            <span className="w-16 text-slate-400 shrink-0 font-medium">직업</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-amber-300 font-bold">{citizen.jobTitle || citizen.job}</span>
          </div>
        </div>

        {/* 함께한 사람 */}
        <div className="space-y-1.5 pb-3 border-b border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>함께한 사람</span>
          </div>
          <div className="flex items-start pl-1">
            <span className="w-14 text-slate-400 shrink-0">배우자</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-slate-200">{spouseText}</span>
          </div>
          <div className="flex items-start pl-1">
            <span className="w-14 text-slate-400 shrink-0">자녀</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-slate-200">{childrenText}</span>
          </div>
        </div>

        {/* 마지막 길을 배웅한 사람 (또는 곁을 지키는 사람) */}
        <div className="space-y-1 pb-3 border-b border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 mb-0.5">
            {companionLabel}
          </div>
          <p className="text-slate-200 pl-1">
            {citizen.farewellCompanion || '오랜 친구 한 명'}
          </p>
        </div>

        {/* 생애 주요 지표: 가장 행복했던 해, 사는 지역, 취미, 재산, 시간을 쓴 곳 */}
        <div className="space-y-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-start">
            <span className="w-24 text-slate-400 shrink-0">가장 행복했던 해</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-amber-200 font-medium font-mono">
              {citizen.happiestYear ? `${citizen.happiestYear.age}세 (${citizen.happiestYear.year}년)` : `${citizen.age}세 (${citizen.currentYear}년)`}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-24 text-slate-400 shrink-0">사는 지역</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-sky-300 font-medium">
              {citizen.district.name.split(' ')[0]} {citizen.isRelocatedAway && '(출향)'}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-24 text-slate-400 shrink-0">취미</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-emerald-300">{citizen.hobby || '노래·악기 연주'}</span>
          </div>

          <div className="flex items-start">
            <span className="w-24 text-slate-400 shrink-0">재산</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-yellow-300 font-mono font-bold">
              {formatWealth(citizen.netWorthWon)}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-24 text-slate-400 shrink-0">시간을 쓴 곳</span>
            <span className="text-slate-500 mr-2">:</span>
            <span className="text-slate-100 font-medium">
              {getTopTimeSpent(citizen.timeSpent)}
            </span>
          </div>
        </div>

        {/* 이 삶의 결 (원작 1in8b 핵심 서사 영역) */}
        <div className="bg-space-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-slate-300 shadow-md">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>이 삶의 결</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal font-serif">
            결은 한 삶이 어느 쪽으로 기울어 흘러가는지를 네 쌍의 낱말로 나타낸 거예요.
          </p>

          <div className="py-1">
            <h3 className="text-sm font-bold text-white tracking-tight text-amber-200/95 font-serif">
              {citizen.lifeArchetype?.title || '한 우물을 파는 장인'}
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 font-serif">
            네 쌍의 낱말로 보면 이 이름에 가장 가까웠어요.
          </p>

          <p className="text-xs text-slate-200 leading-relaxed font-sans pt-1 border-t border-slate-800/80 break-keep">
            {citizen.lifeArchetype?.summary || `${citizen.district.name.split(' ')[0]}에 뿌리내린 삶이었어요. 성실하게 일하며 보람을 찾는 날이 많았어요.`}
          </p>
        </div>

      </div>

      {/* 3. 패널 하단 푸터 (통계 출처 및 모드 표기) */}
      <div className="p-2.5 bg-space-900/40 border-t border-space-800 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
        <span>📍 진주시 행정동 기반 표본틀</span>
        <span className="font-mono">{isEduMode ? '교육용 안심 모드' : '34만 분의 1'}</span>
      </div>

    </div>
  );
};
