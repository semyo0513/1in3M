import React, { useState, useEffect } from 'react';
import { X, Flame, MapPin, Calendar, Heart } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { Footer } from './Footer';

export interface MemorialRecord {
  id: string;
  birthYear: number;
  deathYear: number;
  age: number;
  district: string;
  job: string;
  words: string;
  choicesCount: number;
}

interface MemorialHallProps {
  onClose: () => void;
}

export const MemorialHall: React.FC<MemorialHallProps> = ({ onClose }) => {
  const [memorials, setMemorials] = useState<MemorialRecord[]>([]);
  const [selectedMemorial, setSelectedMemorial] = useState<MemorialRecord | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jinju_life_memorials');
      if (saved) {
        setMemorials(JSON.parse(saved));
      } else {
        // 기본 더미 유등 3개 (남강의 정취)
        setMemorials([
          {
            id: 'm_init_1',
            birthYear: 1948,
            deathYear: 2024,
            age: 76,
            district: '중앙동',
            job: '전통시장 비단 상인',
            words: '비단 천을 고르며 남강의 불빛을 바라보던 날들이 참 고마웠습니다.',
            choicesCount: 8
          },
          {
            id: 'm_init_2',
            birthYear: 1982,
            deathYear: 2062,
            age: 80,
            district: '충무공동',
            job: '공공기관 행정관',
            words: '처음 이 도시에 왔을 땐 낯설었지만, 이제는 내 아이들의 고향이 되었습니다.',
            choicesCount: 12
          },
          {
            id: 'm_init_3',
            birthYear: 1995,
            deathYear: 2078,
            age: 83,
            district: '수곡면',
            job: '스마트팜 딸기 농업인',
            words: '새벽 비닐하우스 안 딸기 꽃향기와 남강의 안개가 내 평생의 위로였습니다.',
            choicesCount: 10
          }
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#0b0e14] border border-amber-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-amber-950/60">
        
        {/* 헤더 */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-space-950">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏮</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                남강 유등 추모관 (南江 流燈 追慕館)
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                진주에서 한평생을 살다 간 사람들의 등불이 남강의 밤 물결을 타고 흐릅니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-space-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 남강 수면 연출 (인터랙티브 유등 캔버스 느낌) */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-b from-[#06080e] via-[#0b101d] to-[#04060a] overflow-hidden border-b border-slate-800/80 flex items-center justify-center">
          {/* 강물 물결 라인 */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-[200%] h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent animate-pulse" />
          </div>

          <div className="text-center z-10 px-4">
            <p className="text-xs text-amber-200/90 font-serif italic mb-3">
              "물 위에 띄운 등 하나마다, 그 사람이 진주에서 보낸 고단하고도 눈부신 하루가 담겨 있습니다."
            </p>
            
            {/* 유등 클러스터 */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              {memorials.slice(0, 8).map((m, idx) => (
                <button
                  key={m.id || idx}
                  onClick={() => {
                    audioManager.playChimeSound();
                    setSelectedMemorial(m);
                  }}
                  className={`group relative p-2.5 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    selectedMemorial?.id === m.id
                      ? 'ring-2 ring-amber-400 scale-110'
                      : 'hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce" style={{ animationDuration: `${2.5 + idx * 0.4}s` }}>
                    🏮
                  </span>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300/80 whitespace-nowrap bg-black/60 px-1 rounded opacity-0 group-hover:opacity-100 transition">
                    {m.district} ({m.age}세)
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 유등 상세 보기 or 목록 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {selectedMemorial ? (
            <div className="bg-amber-950/20 border border-amber-600/40 rounded-xl p-4 sm:p-5 relative animate-fadeIn">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[11px] font-mono text-amber-400">
                    {selectedMemorial.birthYear}년 ~ {selectedMemorial.deathYear}년 ({selectedMemorial.age}세)
                  </span>
                  <h3 className="text-base font-bold text-white font-serif">
                    진주시 {selectedMemorial.district}의 삶 · {selectedMemorial.job}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMemorial(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  목록 보기
                </button>
              </div>

              <blockquote className="my-3 text-sm text-amber-100 font-serif italic border-l-2 border-amber-400 pl-3 py-1">
                "{selectedMemorial.words}"
              </blockquote>

              <div className="text-[11px] text-slate-400 flex items-center gap-3">
                <span>지역 현안 참여: {selectedMemorial.choicesCount}건</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>남강에 머무는 기록들 ({memorials.length}개의 삶)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {memorials.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      audioManager.playChimeSound();
                      setSelectedMemorial(m);
                    }}
                    className="p-3 rounded-xl bg-space-850/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition text-xs group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-200 group-hover:text-amber-300 transition">
                        진주시 {m.district}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {m.age}세 영면
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-1.5 truncate">
                      {m.job}
                    </div>
                    <p className="text-[11px] text-amber-200/80 italic line-clamp-2 font-serif">
                      "{m.words}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 닫기 버튼 */}
        <div className="p-3 sm:p-4 bg-space-950 border-t border-slate-800 flex items-center justify-between">
          <Footer className="border-none py-0 px-0 text-left bg-transparent" />
          <button
            onClick={() => {
              audioManager.playClickSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-space-850 border border-slate-700 text-slate-300 hover:bg-space-800 hover:text-white transition shrink-0 ml-4"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
