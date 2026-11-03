import React, { useState } from 'react';
import { CitizenStatus } from '../types/game';
import { MapPin, Navigation, Landmark, Building, GraduationCap, Sparkles, Heart, Compass, Trees } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface JinjuVisualMapProps {
  citizen: CitizenStatus;
}

interface LandmarkSpot {
  id: string;
  name: string;
  category: string;
  x: number; // 0 ~ 100 (%)
  y: number; // 0 ~ 100 (%)
  iconEmoji: string;
  desc: string;
  districtId: string;
}

const JINJU_LANDMARKS: LandmarkSpot[] = [
  { id: 'spot_jinjustone', name: '진주성 & 촉석루', category: '역사생태', x: 44, y: 48, iconEmoji: '🏯', desc: '의암과 촉석루가 남강을 굽어보는 진주의 심장이자 영혼', districtId: 'seongbuk' },
  { id: 'spot_gnu', name: '경상국립대학교 (가좌캠퍼스)', category: '학술연구', x: 52, y: 72, iconEmoji: '🎓', desc: '서부경남의 지성을 이끄는 국가거점국립대학교', districtId: 'gaho' },
  { id: 'spot_innovation', name: '경남진주혁신도시 (LH 본사)', category: '신도심·공공', x: 74, y: 55, iconEmoji: '🏢', desc: '11개 공공기관과 첨단 주거단지가 들어선 혁신의 메카', districtId: 'chungmugong' },
  { id: 'spot_pyeonggeo', name: '평거·신안 수변공원', category: '주거생태', x: 28, y: 45, iconEmoji: '🌳', desc: '남강변을 따라 조성된 산책로와 평거 신도심 학원가', districtId: 'pyeonggeo' },
  { id: 'spot_chojeon', name: '초전지구 & 도청서부청사', category: '행정주거', x: 68, y: 32, iconEmoji: '🏛️', desc: '진주의 신흥 주거단지와 경남도청 서부청사', districtId: 'chojang' },
  { id: 'spot_market', name: '진주 중앙논개시장', category: '전통상권', x: 50, y: 44, iconEmoji: '🏮', desc: '100년 역사의 중앙시장과 비빔밥, 꿀빵의 고향', districtId: 'jungang' },
  { id: 'spot_sangpyeong', name: '상평 일반산업단지', category: '제조혁신', x: 58, y: 56, iconEmoji: '⚙️', desc: '기계·항공 부품과 진주 산업의 든든한 일터', districtId: 'sangpyeong' },
  { id: 'spot_aero_kai', name: '정촌 산단 & 우주항공청 권역', category: '미래첨단', x: 38, y: 78, iconEmoji: '🚀', desc: 'KAI 사천과 맞닿은 우주항공 국가산단 배후지', districtId: 'jeongchon' },
  { id: 'spot_geumsan', name: '공군교육사령부 & 금호지', category: '자연국방', x: 80, y: 38, iconEmoji: '✈️', desc: '월아산 아래 고요한 금호지와 보라매의 요람', districtId: 'geumsan' },
  { id: 'spot_sugok', name: '수곡 딸기 스마트팜 밸리', category: '스마트농업', x: 15, y: 32, iconEmoji: '🍓', desc: '지리산 맑은 물과 수출 1위 진주 딸기의 본산', districtId: 'sugok' },
  { id: 'spot_munsan', name: '문산 바이오단지 & 과수', category: '바이오농업', x: 82, y: 68, iconEmoji: '🌱', desc: '진주 배와 바이오산업 진흥원 클러스터', districtId: 'munsan' }
];

export const JinjuVisualMap: React.FC<JinjuVisualMapProps> = ({ citizen }) => {
  const [selectedSpot, setSelectedSpot] = useState<LandmarkSpot | null>(null);

  // 현재 거주 행정동의 위치 찾기
  const currentDistrictSpot = JINJU_LANDMARKS.find(s => s.districtId === citizen.district.id) || JINJU_LANDMARKS[0];
  const isOctober = true; // 유등 시즌 시각 연출 상시 지원

  return (
    <div className="w-full h-full flex flex-col bg-space-950 text-slate-100 min-h-0 select-none overflow-hidden">
      
      {/* 상단 헤더 리포트 */}
      <div className="px-3 py-2 bg-space-900 border-b border-space-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-slate-200">진주 로컬 공간 지도</span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({citizen.district.name.split(' ')[0]})
          </span>
        </div>
        {citizen.isRelocatedAway ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 border border-sky-500/40 text-sky-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>수도권 서울 상경 (출향)</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>남강 생활권 거주</span>
          </span>
        )}
      </div>

      {/* 메인 인터랙티브 SVG 지도 영역 */}
      <div className="flex-1 relative min-h-0 overflow-hidden bg-gradient-to-b from-[#090d16] via-[#070a12] to-[#04060a]">
        
        {/* 남강 물결 시각화 SVG 배경 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 남강 S자 물길 (서부 대동 → 진주성 → 상평 → 혁신도시 남강) */}
          <path
            d="M 10 25 Q 30 55 45 50 T 65 52 T 95 75"
            fill="none"
            stroke="url(#riverGradient)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* 유등 시즌 떠다니는 등불 불빛 효과 */}
          <circle cx="43" cy="50" r="1.2" fill="#fbbf24" opacity="0.8" filter="url(#glow)" className="animate-pulse" />
          <circle cx="50" cy="51" r="1.0" fill="#f59e0b" opacity="0.7" filter="url(#glow)" />
          <circle cx="58" cy="52" r="1.3" fill="#fb923c" opacity="0.85" filter="url(#glow)" className="animate-pulse" />
          <circle cx="68" cy="56" r="1.1" fill="#f43f5e" opacity="0.7" filter="url(#glow)" />
        </svg>

        {/* 상경 출향민 특별 노선 (진주 → 서울 KTX 경로 시각화) */}
        {citizen.isRelocatedAway && (
          <div className="absolute top-2 left-2 right-2 bg-sky-950/90 border border-sky-500/50 rounded-xl p-2.5 z-20 backdrop-blur-md shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚅</span>
              <div>
                <div className="text-xs font-bold text-sky-200">고향 진주 ↔ 서울 수도권 생활</div>
                <div className="text-[10px] text-slate-300">
                  {citizen.collegeName ? `${citizen.collegeName} 유학 중` : '서울 직장 근무 중'} (명절마다 진주역 귀향)
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
              경부·남부내륙선
            </span>
          </div>
        )}

        {/* 랜드마크 스팟 핀들 */}
        {JINJU_LANDMARKS.map(spot => {
          const isMyHome = spot.districtId === citizen.district.id;
          const isSelected = selectedSpot?.id === spot.id;

          return (
            <button
              key={spot.id}
              onClick={() => {
                setSelectedSpot(spot);
                audioManager.playClickSound();
              }}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all transform z-10 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
            >
              {/* 내 집 펄스 링 */}
              {isMyHome && (
                <span className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
              )}

              <div className={`flex items-center gap-1 px-1.5 py-1 rounded-full border shadow-lg backdrop-blur-md text-[10px] transition ${
                isMyHome
                  ? 'bg-amber-500/90 border-amber-300 text-space-950 font-bold ring-2 ring-amber-400/50'
                  : isSelected
                  ? 'bg-blue-600 border-white text-white font-bold ring-2 ring-blue-400/50'
                  : 'bg-space-900/85 border-slate-700 text-slate-300 hover:border-slate-400 hover:text-white'
              }`}>
                <span className="text-xs shrink-0">{spot.iconEmoji}</span>
                <span className="max-w-[75px] truncate font-sans">
                  {isMyHome ? `내 고향(${spot.name.split(' ')[0]})` : spot.name.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}

        {/* 하단 남강 워터마크 안내 */}
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 flex items-center gap-1 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-sky-500/40 inline-block" />
          <span>푸른 남강(南江) 물줄기와 10월 남강유등축제 거점</span>
        </div>

      </div>

      {/* 하단 스팟 상세 정보 카드 */}
      <div className="p-3 bg-space-900 border-t border-space-800 shrink-0">
        {selectedSpot ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>{selectedSpot.iconEmoji}</span>
                <span>{selectedSpot.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-space-800 text-slate-400 font-normal">
                  {selectedSpot.category}
                </span>
              </span>
              {selectedSpot.districtId === citizen.district.id && (
                <span className="text-[10px] font-bold text-amber-400 font-mono">
                  ★ 나의 출생·연고지
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {selectedSpot.desc}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>나의 생활 반경: {citizen.district.name}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                핀 클릭 시 세부 탐색
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {citizen.district.description}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
