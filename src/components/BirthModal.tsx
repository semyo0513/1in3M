import React, { useState } from 'react';
import { CitizenStatus } from '../types/game';
import { Sparkles, MapPin, ArrowRight, RefreshCw, UserCheck, Dices, ShieldCheck, HeartHandshake, GraduationCap } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { PRESET_PROFILES, PresetProfile } from '../utils/simulation';
import { Footer } from './Footer';

interface BirthModalProps {
  citizen: CitizenStatus;
  isEduMode?: boolean;
  onStartLife: () => void;
  onRerollRandom: () => void;
  onSelectPreset: (preset: PresetProfile) => void;
  onToggleEduMode?: () => void;
}

export const BirthModal: React.FC<BirthModalProps> = ({
  citizen,
  isEduMode = false,
  onStartLife,
  onRerollRandom,
  onSelectPreset,
  onToggleEduMode
}) => {
  const [tab, setTab] = useState<'random' | 'presets'>('random');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const temperDesc = (c: CitizenStatus) => {
    const { caution, community, optimism } = c.temperament;
    const traits = [];
    if (caution > 50) traits.push('신중한');
    else traits.push('모험적인');

    if (community > 50) traits.push('공동체 지향의');
    else traits.push('독립적인');

    if (optimism > 50) traits.push('낙관적인');
    else traits.push('현실적인');

    return traits.join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080d]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="max-w-xl w-full my-auto text-center space-y-3.5 sm:space-y-4">
        
        {/* [중요] 모드 선택 세그먼트 (일반 시민 모드 vs 학생 교육용 모드) */}
        <div className="bg-space-950/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-lg max-w-lg mx-auto">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-0.5 mb-1">
            <span className="font-semibold text-slate-300">🎮 모드 선택</span>
            <span className="text-[10px] text-slate-500 font-mono">언제든 상단에서 전환 가능</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (isEduMode && onToggleEduMode) onToggleEduMode();
                audioManager.playClickSound();
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${
                !isEduMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-space-900 border border-transparent'
              }`}
            >
              <span>🏛️ 일반 시민 모드</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isEduMode && onToggleEduMode) onToggleEduMode();
                audioManager.playClickSound();
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${
                isEduMode
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>🎓 학생 교육용 모드</span>
              {isEduMode && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </button>
          </div>
        </div>

        {/* 교육용 모드 안내 vs 일반 모드 안내 카드 */}
        {isEduMode ? (
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 text-left space-y-1.5 text-xs text-emerald-200 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs sm:text-sm">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>[학생 교육용 안심 모드 활성화됨]</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-600 text-emerald-200 font-mono">
                수업 12~15분 완주형
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed font-sans">
              어디서 어떤 환경에서 태어날지는 스스로 선택한 것이 아닌 <strong>'삶의 우연(운)'</strong>입니다.
              타인과의 비교나 낙인 없이 서로 다른 입장을 경청하고 이해하는 수업 활동입니다.
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-emerald-400 pt-1.5 border-t border-emerald-800/60">
              <div>✓ 민감 소재 완전 배제 (자살·음주·흡연 0%)</div>
              <div>✓ 낙인 방지 서술형 환경 표기 (분위 수치 제거)</div>
              <div>✓ 보이텔스바흐 원칙: 반대 입장 필독</div>
              <div>✓ 개인정보 수집 및 외부 전송 0%</div>
            </div>
          </div>
        ) : (
          <div className="bg-space-900/80 border border-slate-800 rounded-xl p-2.5 text-left flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base">💡</span>
              <p className="text-[11px] leading-tight text-slate-400">
                초·중·고 수업 및 학생 활동 시에는 상단의 <strong className="text-emerald-300">🎓 학생 교육용 모드</strong> 버튼을 켜주세요.
              </p>
            </div>
            {onToggleEduMode && (
              <button
                type="button"
                onClick={() => {
                  onToggleEduMode();
                  audioManager.playClickSound();
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] hover:bg-emerald-900 transition flex items-center gap-1 ml-2"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>교육용 켜기</span>
              </button>
            )}
          </div>
        )}

        {/* 상단 엠블럼 & 타이틀 */}
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-2xl shadow-xl shadow-amber-500/10 animate-pulse mb-1.5">
            🏮
          </div>
          <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase block">
            34만 분의 1 : 진주 {isEduMode && '· 학생 수업 모드'}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif tracking-tight mt-0.5">
            어떤 진주시민의 삶으로 들어가보시겠습니까?
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            실제 진주시 공공통계 표본틀(145,452가구)에 맞춰 무작위 추첨하거나 대표 삶을 선택합니다.
          </p>
        </div>

        {/* 탭 전환: 무작위 추첨 vs 대표 인물 5선 */}
        <div className="flex rounded-xl bg-space-900 p-1 border border-slate-800 max-w-sm mx-auto text-xs font-medium">
          <button
            onClick={() => {
              setTab('random');
              setSelectedPresetId(null);
              audioManager.playClickSound();
            }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              tab === 'random'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>무작위 출생 추첨</span>
          </button>
          <button
            onClick={() => {
              setTab('presets');
              audioManager.playClickSound();
            }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              tab === 'presets'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>진주 대표 인물 5선</span>
          </button>
        </div>

        {/* 탭 1: 무작위 출생 뷰 */}
        {tab === 'random' && (
          <div className="bg-space-900 border border-slate-700/80 rounded-2xl p-4 text-left space-y-2.5 shadow-2xl font-sans text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>2026년생 진주시 {citizen.district.name} ({citizen.district.gameRegionName})</span>
              </div>
              <button
                onClick={() => {
                  audioManager.playClickSound();
                  onRerollRandom();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-800 border border-slate-700 hover:border-amber-400 text-[11px] text-amber-300 hover:bg-space-700 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>다시 추첨</span>
              </button>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed font-sans break-keep">
              {citizen.district.description}
            </p>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="bg-space-850 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">가구 생활 환경</span>
                <span className="font-semibold text-slate-200">
                  {isEduMode ? (
                    <span className="text-emerald-300">{citizen.incomeDesc || '성실한 일터의 가정'}</span>
                  ) : (
                    <span>소득 {citizen.incomeDecile}분위 (월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)</span>
                  )}
                </span>
              </div>
              <div className="bg-space-850 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">성향 및 기질</span>
                <span className="font-semibold text-slate-200 truncate">
                  {citizen.gender} · {temperDesc(citizen)}
                </span>
              </div>
            </div>

            <div className="bg-space-850 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed text-center">
              ※ 출처: 2024 진주시 지역사회건강조사(표본틀 가구 수) 및 행정안전부 주민등록 통계
            </div>
          </div>
        )}

        {/* 탭 2: 대표 인물 5선 뷰 */}
        {tab === 'presets' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-left animate-fadeIn">
            {PRESET_PROFILES.map((p) => {
              const isSelected = (selectedPresetId === p.id) || (citizen.district.id === p.districtId && !selectedPresetId);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetId(p.id);
                    audioManager.playClickSound();
                    onSelectPreset(p);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-400 text-white'
                      : 'bg-space-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs sm:text-sm text-amber-300">
                      {p.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-space-800 text-slate-400 border border-slate-700">
                      {p.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-400 mb-0.5 font-medium">
                    📍 {p.headline}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* 시작 버튼 */}
        <div className="pt-1">
          <button
            onClick={() => {
              audioManager.playChimeSound();
              onStartLife();
            }}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isEduMode
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-space-950 hover:from-emerald-400 hover:to-emerald-300 shadow-emerald-500/25 ring-2 ring-emerald-300/40'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-space-950 hover:from-amber-400 hover:to-amber-300 shadow-amber-500/25'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isEduMode ? '🎓 교육용 모드로 진주에서 시작하기' : '🏛️ 이 삶으로 진주에서 시작하기'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>개인정보 수집 0% · 외부 서버 전송 없이 안전하게 브라우저에서 실행됩니다.</span>
          </div>
        </div>

        {/* 하단 라이선스 및 원작 명시 */}
        <Footer className="border-t border-slate-800/80 bg-space-950 mt-2 py-2" />

      </div>
    </div>
  );
};
