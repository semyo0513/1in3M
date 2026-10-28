import React, { useState } from 'react';
import { CitizenStatus } from '../types/game';
import { Sparkles, MapPin, ArrowRight, RefreshCw, UserCheck, Dices } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { PRESET_PROFILES, PresetProfile } from '../utils/simulation';

interface BirthModalProps {
  citizen: CitizenStatus;
  onStartLife: () => void;
  onRerollRandom: () => void;
  onSelectPreset: (preset: PresetProfile) => void;
}

export const BirthModal: React.FC<BirthModalProps> = ({
  citizen,
  onStartLife,
  onRerollRandom,
  onSelectPreset
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
      <div className="max-w-xl w-full my-auto text-center space-y-4 sm:space-y-5">
        
        {/* 상단 엠블럼 & 타이틀 */}
        <div className="pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-2xl shadow-xl shadow-amber-500/10 animate-pulse mb-2">
            🏮
          </div>
          <span className="text-[11px] font-mono tracking-widest text-amber-400/80 uppercase block">
            34만 분의 1 : 진주
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight mt-0.5">
            어떤 진주시민으로 태어나시겠습니까?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            원하는 인물을 직접 선택하거나, 30개 읍면동 통계대로 무작위 추첨할 수 있습니다.
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
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
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
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
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
          <div className="bg-space-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-2xl font-sans text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>2026년생 진주시 {citizen.district.name}</span>
              </div>
              <button
                onClick={() => {
                  audioManager.playClickSound();
                  onRerollRandom();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-800 border border-slate-700 hover:border-amber-400 text-[11px] text-amber-300 hover:bg-space-700 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>다른 사람 다시 뽑기</span>
              </button>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans break-keep">
              {citizen.district.description}
            </p>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="bg-space-850 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">가구 소득 분위</span>
                <span className="font-semibold text-slate-200">
                  {citizen.incomeDecile}분위 (월 {(citizen.monthlyIncomeWon / 10000).toFixed(0)}만 원)
                </span>
              </div>
              <div className="bg-space-850 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">성별 및 기질</span>
                <span className="font-semibold text-slate-200 truncate">
                  {citizen.gender} · {temperDesc(citizen)}
                </span>
              </div>
            </div>

            <div className="bg-space-850 p-2.5 rounded-xl border border-slate-800 text-[11px] text-amber-200/90 leading-relaxed font-serif italic text-center">
              "30개 읍면동 실제 인구 통계에 따라 결정된 당신의 또 다른 삶입니다."
            </div>
          </div>
        )}

        {/* 탭 2: 대표 인물 5선 뷰 */}
        {tab === 'presets' && (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-left animate-fadeIn">
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
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-400 text-white'
                      : 'bg-space-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                      <span>{p.name}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-space-800 text-slate-400 border border-slate-700">
                      {p.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-400 mb-1 font-medium">
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
        <div className="pt-2">
          <button
            onClick={() => {
              audioManager.playChimeSound();
              onStartLife();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-space-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>이 사람으로 진주에서 살아가기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-[11px] text-slate-500 mt-2.5 font-mono">
            ※ 실시간 1분 = 1년의 시간 진행 (선택 시 자동 일시정지)
          </p>
        </div>

      </div>
    </div>
  );
};
