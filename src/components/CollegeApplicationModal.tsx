import React, { useState, useMemo } from 'react';
import { KOREA_MAJOR_UNIVERSITIES, UniversityInfo } from '../data/koreaUniversities';
import { GraduationCap, Search, MapPin, Building, Sparkles, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface CollegeApplicationModalProps {
  age: number;
  year: number;
  citizenLearning: number;
  citizenGender: '남성' | '여성';
  highSchool: string;
  isRetryYear?: boolean;
  onResolve: (result: {
    appliedUniv: UniversityInfo | null;
    isAccepted: boolean;
    finalChoice: 'college' | 'work' | 'retry';
    collegeName: string;
    consequenceText: string;
    learningDelta: number;
    happinessDelta: number;
    bondsDelta: number;
    isRelocatedAway: boolean;
    grantFlag: string;
  }) => void;
}

export const CollegeApplicationModal: React.FC<CollegeApplicationModalProps> = ({
  age,
  year,
  citizenLearning,
  citizenGender,
  highSchool,
  isRetryYear = false,
  onResolve
}) => {
  const [selectedUniv, setSelectedUniv] = useState<UniversityInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [admissionResult, setAdmissionResult] = useState<{ isAccepted: boolean; evaluated: boolean }>({
    isAccepted: false,
    evaluated: false
  });

  const regions = ['전체', '진주', '경남/부산/울산', '서울', '경기/인천', '대구/경북', '대전/충청', '광주/전라', '강원/제주'];

  const filteredUnivs = useMemo(() => {
    return KOREA_MAJOR_UNIVERSITIES.filter(u => {
      // 남학생은 여자대학교 지원 불가 (원천 차단)
      if (citizenGender === '남성' && (u.genderRestriction === 'female' || u.name.includes('여자'))) {
        return false;
      }
      const matchRegion = selectedRegion === '전체' || u.region === selectedRegion;
      const matchQuery = !searchQuery || u.name.includes(searchQuery) || u.description.includes(searchQuery);
      return matchRegion && matchQuery;
    });
  }, [selectedRegion, searchQuery, citizenGender]);

  // 합격 확률 계산 공식 (배움 지표 기반 & 현실적 입시 경쟁률 반영)
  const calculatePassProbability = (univ: UniversityInfo) => {
    const diff = citizenLearning - univ.minLearningCutoff;
    const isUltraTier = univ.id === 'snu'; // 서울대학교 (극상위 0.5% 경쟁)
    const isTopSkyTier = ['yonsei', 'korea', 'kaist', 'postech'].includes(univ.id);

    // 1. 기준 컷오프 미달 시:
    if (diff < 0) {
      if (isUltraTier) {
        // 서울대는 컷오프(94점)보다 1점이라도 낮으면 99% 이상 불합격
        return diff < -3 ? 0.005 : 0.01;
      }
      if (isTopSkyTier) {
        return diff < -5 ? 0.01 : 0.03;
      }
      if (diff < -15) return 0.02;
      return Math.max(0.04, univ.acceptanceRateBase + diff * 0.045);
    }

    // 2. 기준 컷오프 도달 및 초과 시:
    if (isUltraTier) {
      // 서울대는 배움 95~100의 최상위권이어도 전국 경쟁으로 합격률 최대 18% (불합격 확률 82% 이상)
      return Math.min(0.18, univ.acceptanceRateBase + diff * 0.015);
    }
    if (isTopSkyTier) {
      // 연고대/카이스트/포스텍 등은 최대 28%
      return Math.min(0.28, univ.acceptanceRateBase + diff * 0.02);
    }
    if (univ.region === '서울') {
      return Math.min(0.50, univ.acceptanceRateBase + diff * 0.025);
    }
    return Math.min(0.88, univ.acceptanceRateBase + diff * 0.025);
  };

  const handleApply = (univ: UniversityInfo) => {
    audioManager.playClickSound();
    setSelectedUniv(univ);

    const prob = calculatePassProbability(univ);
    const passed = Math.random() < prob;

    setAdmissionResult({
      isAccepted: passed,
      evaluated: true
    });

    if (passed) {
      audioManager.playChimeSound();
    }
  };

  const handleAcceptCollege = () => {
    audioManager.playClickSound();
    if (!selectedUniv) return;

    const isSeoulOrMetro = selectedUniv.region === '서울' || selectedUniv.region === '경기/인천';
    const isJinju = selectedUniv.region === '진주';
    
    onResolve({
      appliedUniv: selectedUniv,
      isAccepted: true,
      finalChoice: 'college',
      collegeName: selectedUniv.name,
      consequenceText: `축하합니다! ${selectedUniv.name}에 당당히 합격하여 ${selectedUniv.name} ${selectedUniv.category} 신입생으로 캠퍼스 라이프를 시작합니다.`,
      learningDelta: 8,
      happinessDelta: 10,
      bondsDelta: isJinju ? 6 : -4,
      isRelocatedAway: isSeoulOrMetro,
      grantFlag: isSeoulOrMetro ? 'MIGRATED_SEOUL_COLLEGE' : (isJinju ? 'COLLEGE_LOCAL_GNU' : 'COLLEGE_REGIONAL')
    });
  };

  // 불합격 후: 1년 더 공부하여 내년에 재도전 (재수)
  const handleChooseRetry = () => {
    audioManager.playClickSound();
    if (!selectedUniv) return;

    onResolve({
      appliedUniv: selectedUniv,
      isAccepted: false,
      finalChoice: 'retry',
      collegeName: `${highSchool} 졸업 (대입 재수 준비)`,
      consequenceText: `아쉽게도 ${selectedUniv.name} 입시에서 고배를 마셨지만, 1년간 피나는 노력으로 수능을 다시 준비하여 내년에 재도전하기로 결심했습니다.`,
      learningDelta: 7, // 재수 기간 배움 상승
      happinessDelta: -5,
      bondsDelta: -2,
      isRelocatedAway: false,
      grantFlag: 'COLLEGE_RETRY_PLANNED'
    });
  };

  // 불합격 후: 입시를 매듭짓고 곧바로 사회 진출/취업
  const handleChooseWork = () => {
    audioManager.playClickSound();
    if (!selectedUniv) return;

    onResolve({
      appliedUniv: selectedUniv,
      isAccepted: false,
      finalChoice: 'work',
      collegeName: `${highSchool} 졸업 (사회 진출)`,
      consequenceText: `아쉽게도 ${selectedUniv.name} 입시의 벽을 넘지 못했지만, 미련을 털어내고 사회 진출과 취업 준비에 전념하기로 결정했습니다.`,
      learningDelta: 3,
      happinessDelta: -3,
      bondsDelta: 2,
      isRelocatedAway: false,
      grantFlag: 'COLLEGE_FAILED_CAREER'
    });
  };

  // 대학 진학 대신 곧바로 취업/창업을 선택할 경우
  const handleSkipCollege = () => {
    audioManager.playClickSound();
    onResolve({
      appliedUniv: null,
      isAccepted: false,
      finalChoice: 'work',
      collegeName: `${highSchool} 졸업 (조기 취업)`,
      consequenceText: `대학 진학 대신 상평·정촌 산단 기술직 또는 조기 사회진출을 선택하여 빠르게 경제적 자립을 시작했습니다.`,
      learningDelta: 4,
      happinessDelta: 4,
      bondsDelta: 4,
      isRelocatedAway: false,
      grantFlag: 'EARLY_LOCAL_CAREER'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-space-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* 상단 헤더 */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-space-900 border-b border-blue-500/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {age}세 ({year}년) · {isRetryYear ? '대입 재도전 (재수)' : '대학 진학의 갈림길'}
                </span>
                <span className="text-[11px] text-amber-300 font-medium">
                  나의 배움(수능/내신) 지표: {citizenLearning}점
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {isRetryYear ? '20세 대입 재도전: 전국 100개 대학교 재지원' : '전국 주요 100개 대학교 지망 및 입시 지원'}
              </h2>
            </div>
          </div>
        </div>

        {/* 입시 합격/불합격 결과 팝업 오버레이 */}
        {admissionResult.evaluated && selectedUniv && (
          <div className="p-6 bg-space-950/95 border-b border-space-800 flex flex-col items-center text-center space-y-3 animate-fadeIn">
            {admissionResult.isAccepted ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider">[최종 합격 통지서]</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    축하합니다! <span className="text-amber-300">{selectedUniv.name}</span>에 합격하셨습니다.
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                    {highSchool}을 졸업하고 {selectedUniv.region}의 명문 {selectedUniv.name}에서 찬란한 20대 청춘의 첫 페이지를 열게 되었습니다.
                  </p>
                </div>

                <button
                  onClick={handleAcceptCollege}
                  className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>합격 등록하고 대학 생활 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 font-mono tracking-wider">[불합격 통지 안내]</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    <span className="text-slate-300">{selectedUniv.name}</span> 불합격 (예비 순위 초과)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                    치열한 입시 경쟁 끝에 안타깝게 합격자 명단에 들지 못했습니다. 1년 더 수능을 준비하여 내년에 재도전할 수도 있고, 입시를 매듭짓고 곧바로 사회 진출을 선택할 수도 있습니다.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md mt-2">
                  <button
                    onClick={handleChooseRetry}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📚 1년 더 준비하여 내년에 재도전 (재수)</span>
                  </button>
                  <button
                    onClick={handleChooseWork}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-xs bg-space-850 hover:bg-space-800 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>💼 입시 마무리하고 사회 진출·취업</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 본문: 대학 검색 및 목록 선택 */}
        {!admissionResult.evaluated && (
          <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 space-y-3.5 overflow-hidden">
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              고등학교를 졸업하며 진로를 결정해야 합니다. 고향 진주의 <strong className="text-amber-300">경상국립대·진주교대</strong>에 남아 안정을 택할 수도 있고, 
              서울·수도권 또는 전국 100개 주요 대학에 소신 지원할 수도 있습니다. (배움 지표가 대학 기준선보다 높을수록 합격률 상승)
            </p>

            {/* 권역 필터 탭 */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar shrink-0 text-xs">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition border ${
                    selectedRegion === r
                      ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                      : 'bg-space-850 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* 검색창 */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="대학명 또는 특성화 키워드 검색 (예: 경상국립대, 서울대, 카이스트, 한예종, 의학...)"
                className="w-full bg-space-850 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* 대학 리스트 */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredUnivs.map(univ => {
                const prob = calculatePassProbability(univ);
                const percent = Math.round(prob * 100);
                const isUnderCutoff = citizenLearning < univ.minLearningCutoff;

                return (
                  <div
                    key={univ.id}
                    className="p-3 rounded-xl bg-space-850 border border-slate-700 hover:border-blue-400 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                          {univ.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-space-800 text-slate-400 border border-slate-700 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-sky-400" />
                          <span>{univ.region}</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-space-800 text-slate-400 border border-slate-700">
                          {univ.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          등록금: {univ.tuitionLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {univ.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className={`text-xs font-mono font-bold ${
                          percent >= 75 ? 'text-emerald-400' : percent >= 45 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          합격 예상: {percent}%
                        </div>
                        <div className="text-[10px] text-slate-500">
                          기준 배움: {univ.minLearningCutoff}
                        </div>
                      </div>

                      <button
                        onClick={() => handleApply(univ)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition flex items-center gap-1"
                      >
                        <span>원서 접수</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 하단 취업/자립 대안 버튼 */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                대학에 진학하지 않고 실용적 기술을 익혀 사회에 바로 나갈 수도 있습니다.
              </span>
              <button
                onClick={handleSkipCollege}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-space-800 hover:bg-space-750 border border-slate-700 transition"
              >
                대학 미진학 및 취업·창업 시작
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
