import React, { useState } from 'react';
import { Briefcase, Building, Landmark, Stethoscope, Rocket, GraduationCap, DollarSign, Store, Sprout, Palette, ArrowRight, MapPin } from 'lucide-react';
import { JobType } from '../types/game';
import { audioManager } from '../utils/audio';

export interface CareerOption {
  id: string;
  name: string;
  jobCategory: JobType;
  title: string;
  icon: any;
  color: string;
  regionType: '진주' | '서울' | '전국';
  description: string;
  salaryLabel: string;
  workLifeBalance: '높음' | '보통' | '낮음';
  learningBonus: number;
  happinessBonus: number;
}

interface CareerChoiceModalProps {
  age: number;
  year: number;
  education: string;
  collegeName?: string;
  isRelocatedAway: boolean;
  onSelectCareer: (career: CareerOption) => void;
}

export const CAREER_OPTIONS: CareerOption[] = [
  {
    id: 'career_it_tech',
    name: '대기업 및 IT·첨단기술 엔지니어',
    jobCategory: '제조 및 공학 기술직',
    title: 'IT·대기업 연구원',
    icon: Building,
    color: 'from-sky-500 to-blue-600',
    regionType: '서울',
    description: '판교 IT 밸리 또는 수도권 첨단 제조업 연구개발직. 높은 연봉과 스톡옵션 기대.',
    salaryLabel: '높음 (초봉 4,500만~6,000만)',
    workLifeBalance: '낮음',
    learningBonus: 8,
    happinessBonus: 6
  },
  {
    id: 'career_public_corp',
    name: '혁신도시 공공기관 및 공무원',
    jobCategory: '교육 및 행정직',
    title: '공공기관 공채 주임',
    icon: Landmark,
    color: 'from-emerald-500 to-teal-600',
    regionType: '진주',
    description: '진주 충무공동 혁신도시 공공기관(LH, 남동발전 등) 또는 진주시청 지방직 공무원. 정년 보장과 우수한 복지.',
    salaryLabel: '안정적 (초봉 3,800만~4,800만)',
    workLifeBalance: '높음',
    learningBonus: 5,
    happinessBonus: 9
  },
  {
    id: 'career_aerospace_kdefense',
    name: '우주항공 및 K-방산 엔지니어',
    jobCategory: '제조 및 공학 기술직',
    title: '우주항공 복합산단 기술원',
    icon: Rocket,
    color: 'from-indigo-500 to-purple-600',
    regionType: '진주',
    description: '진주·사천 국가우주항공산단 및 방위산업 협력업체 정밀 기술자. 국가 전략기술의 핵심 주역.',
    salaryLabel: '보통 (초봉 4,000만~5,200만)',
    workLifeBalance: '보통',
    learningBonus: 7,
    happinessBonus: 7
  },
  {
    id: 'career_professional_medical',
    name: '전문직 및 보건의료인',
    jobCategory: '전문직 및 연구원',
    title: '전문 연구원 · 의료인',
    icon: Stethoscope,
    color: 'from-rose-500 to-red-600',
    regionType: '전국',
    description: '경상국립대병원 및 권역 의료기관, 또는 법률·회계·국가연구소 전문직. 높은 사회적 존경과 자긍심.',
    salaryLabel: '매우 높음 (초봉 5,000만~7,000만)',
    workLifeBalance: '낮음',
    learningBonus: 10,
    happinessBonus: 5
  },
  {
    id: 'career_education_teacher',
    name: '초·중·고 교원 및 교육전문가',
    jobCategory: '교육 및 행정직',
    title: '공립 초·중등 교사',
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-600',
    regionType: '진주',
    description: '진주교육대학교 및 사범대학 연계 교원 임용. 학생들과 함께 호흡하며 방학을 활용한 자기성장.',
    salaryLabel: '안정적 (호봉제)',
    workLifeBalance: '높음',
    learningBonus: 6,
    happinessBonus: 10
  },
  {
    id: 'career_finance_corp',
    name: '금융 및 기업 경영관리직',
    jobCategory: '서비스 및 자영업',
    title: '금융기관 행원 · 경영지원',
    icon: DollarSign,
    color: 'from-blue-500 to-indigo-600',
    regionType: '전국',
    description: '시중·지방은행 금융 사무원 또는 일반 중견기업 경영기획·재무회계. 체계적인 커리어 로드맵.',
    salaryLabel: '보통 (초봉 3,800만~4,600만)',
    workLifeBalance: '보통',
    learningBonus: 5,
    happinessBonus: 6
  },
  {
    id: 'career_local_business',
    name: '로컬 청년 창업 및 자영업',
    jobCategory: '서비스 및 자영업',
    title: '로컬 브랜드 대표',
    icon: Store,
    color: 'from-yellow-500 to-amber-600',
    regionType: '진주',
    description: '진주 원도심 및 혁신도시 로컬 카페, 외식 브랜드, 스마트 스토어 창업. 내 사업을 일구는 자유와 열정.',
    salaryLabel: '성과 연동 (자율적)',
    workLifeBalance: '보통',
    learningBonus: 6,
    happinessBonus: 8
  },
  {
    id: 'career_smart_farm',
    name: 'ICT 스마트팜 및 영농 후계자',
    jobCategory: '농축산업',
    title: '스마트팜 딸기 청년 농업인',
    icon: Sprout,
    color: 'from-green-500 to-emerald-600',
    regionType: '진주',
    description: '남강 수변 수곡·대곡 비옥한 토양 기반 ICT 첨단 온실 재배. 친환경 수출 농업을 선도하는 미래 농업인.',
    salaryLabel: '성과 연동 (고소득 잠재력)',
    workLifeBalance: '보통',
    learningBonus: 5,
    happinessBonus: 8
  },
  {
    id: 'career_arts_culture',
    name: '문화예술 및 크리에이터',
    jobCategory: '문화예술 및 여가',
    title: '문화콘텐츠 기획자',
    icon: Palette,
    color: 'from-fuchsia-500 to-pink-600',
    regionType: '전국',
    description: '진주 남강유등축제 및 지역 문화예술 기획, 미디어 콘텐츠 제작, 디자이너. 창작의 즐거움과 감성.',
    salaryLabel: '프리랜서형 (자율적)',
    workLifeBalance: '보통',
    learningBonus: 8,
    happinessBonus: 9
  }
];

export const CareerChoiceModal: React.FC<CareerChoiceModalProps> = ({
  age,
  year,
  education,
  collegeName,
  isRelocatedAway,
  onSelectCareer
}) => {
  const [selectedCareer, setSelectedCareer] = useState<CareerOption>(CAREER_OPTIONS[0]);

  // 서울 상경 출향민의 경우 농업은 비추천/경고 표시
  const availableCareers = CAREER_OPTIONS.filter(c => {
    if (isRelocatedAway && c.id === 'career_smart_farm') {
      return false; // 서울 거주자는 농축산업 기본 목록에서 배제 (아이러니 차단)
    }
    return true;
  });

  const handleConfirm = () => {
    audioManager.playChimeSound();
    onSelectCareer(selectedCareer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#0b0e17] border border-blue-500/40 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-blue-950/60">
        
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-space-900 border-b border-blue-500/30 p-4 sm:p-5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {year}년 ({age}세) · 생애 커리어 선택
            </span>
            <span className="text-xs text-amber-300 font-semibold">
              학력: {collegeName || education}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span>나의 평생 직업군과 진로 방향을 선택하세요</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {isRelocatedAway
              ? '수도권(서울) 생활권에 맞춘 첨단 IT·대기업·전문직 진로가 열려 있습니다.'
              : '진주 혁신도시 공공기관, 우주항공 국가산단, 교육·로컬 비즈니스 등 다양한 선택지가 있습니다.'}
          </p>
        </div>

        {/* 본문: 직업군 카드 그리드 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-2.5 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableCareers.map(career => {
              const Icon = career.icon;
              const isSelected = selectedCareer.id === career.id;

              return (
                <button
                  key={career.id}
                  type="button"
                  onClick={() => {
                    audioManager.playClickSound();
                    setSelectedCareer(career);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-400 shadow-md shadow-blue-500/10'
                      : 'bg-space-850 border-slate-700/80 hover:border-slate-500 hover:bg-space-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${career.color} flex items-center justify-center text-white shadow`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {career.name}
                        </h4>
                        <span className="text-[10px] text-amber-300 font-medium">
                          {career.title}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-800 text-slate-400 border border-slate-700 flex items-center gap-0.5 shrink-0">
                      <MapPin className="w-2.5 h-2.5 text-sky-400" />
                      <span>{career.regionType}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2">
                    {career.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                    <span>급여: <strong className="text-slate-300">{career.salaryLabel}</strong></span>
                    <span>워라밸: <strong className="text-emerald-400">{career.workLifeBalance}</strong></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 bg-space-950 border-t border-slate-800 shrink-0 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            선택된 직업: <strong className="text-blue-300 font-bold">{selectedCareer.name} ({selectedCareer.title})</strong>
          </div>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5 shrink-0"
          >
            <span>이 진로로 첫발 내딛기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
