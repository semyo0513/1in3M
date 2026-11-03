import React, { useState, useMemo } from 'react';
import { KOREA_MAJOR_UNIVERSITIES, UniversityInfo } from '../data/koreaUniversities';
import { GraduationCap, Search, MapPin, Building, Sparkles, CheckCircle2, XCircle, AlertTriangle, ArrowRight, BookOpen, Award } from 'lucide-react';
import { audioManager } from '../utils/audio';

export interface CollegeMajorOption {
  id: string;
  name: string;
  category: string;
  careerTag: string;
  iconEmoji: string;
}

export const COLLEGE_MAJORS: CollegeMajorOption[] = [
  { id: 'major_cs_ai', name: '컴퓨터인공지능학부 / 소프트웨어공학', category: '공학', careerTag: 'IT·소프트웨어 연구원 연계', iconEmoji: '💻' },
  { id: 'major_aero_mech', name: '항공우주기계공학부', category: '공학', careerTag: 'KAI·우주항공청 방산 연구원 연계', iconEmoji: '🚀' },
  { id: 'major_med_nurse', name: '의예과 / 간호보건학부', category: '의약보건', careerTag: '종합병원 의료 전문직 연계', iconEmoji: '🩺' },
  { id: 'major_edu', name: '사범대학(국어·수학교육) / 초등교육과', category: '사범교육', careerTag: '초·중·고 교사 및 교육전문직 연계', iconEmoji: '🏫' },
  { id: 'major_biz_econ', name: '경영학부 / 금융경제학과', category: '상경', careerTag: '금융권 및 기업 경영지원 연계', iconEmoji: '📊' },
  { id: 'major_public_admin', name: '공공행정학과 / 도시계획학', category: '사회과학', careerTag: '혁신도시 공공기관 및 공무원 연계', iconEmoji: '🏛️' },
  { id: 'major_smart_farm', name: '스마트생명농업학부 / 바이오소재', category: '농림생명', careerTag: '스마트팜 농업 및 바이오벤처 연계', iconEmoji: '🌱' },
  { id: 'major_design_media', name: '시각디자인 / 미디어콘텐츠학부', category: '예술디자인', careerTag: '문화콘텐츠 디렉터 및 예술 연계', iconEmoji: '🎨' }
];

export function getAcademicProfile(learning: number) {
  if (learning >= 88) {
    return {
      csatTier: '수능 1등급',
      percentile: '상위 3.8%',
      gpa: '내신 1.2등급',
      color: 'text-emerald-300',
      badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
      tag: '전국 최상위권 (SKY·의치한·과기원 지원권)'
    };
  } else if (learning >= 78) {
    return {
      csatTier: '수능 2등급',
      percentile: '상위 10.5%',
      gpa: '내신 2.1등급',
      color: 'text-sky-300',
      badgeBg: 'bg-sky-950/80 border-sky-500/40 text-sky-300',
      tag: '상위권 우수 (수도권 주요대·지거국 상위과 지원권)'
    };
  } else if (learning >= 66) {
    return {
      csatTier: '수능 3등급',
      percentile: '상위 22.8%',
      gpa: '내신 3.2등급',
      color: 'text-blue-300',
      badgeBg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
      tag: '중상위권 (경상국립대 등 지역거점 국립대 안정권)'
    };
  } else if (learning >= 54) {
    return {
      csatTier: '수능 4등급',
      percentile: '상위 39.5%',
      gpa: '내신 4.3등급',
      color: 'text-amber-300',
      badgeBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      tag: '중위권 보통 (도내 4년제·전문대 인기학과 지원권)'
    };
  } else if (learning >= 42) {
    return {
      csatTier: '수능 5등급',
      percentile: '상위 58.0%',
      gpa: '내신 5.4등급',
      color: 'text-orange-300',
      badgeBg: 'bg-orange-950/80 border-orange-500/40 text-orange-300',
      tag: '중하위권 (지역 사립대 및 실용 전문기술대 지원권)'
    };
  } else {
    return {
      csatTier: '수능 6~9등급',
      percentile: '하위 30%',
      gpa: '내신 6.8등급',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
      tag: '기초 학력 (실기·취업 연계 및 직업기술 진로 권장)'
    };
  }
}

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
    collegeMajor?: string;
    consequenceText: string;
    learningDelta: number;
    happinessDelta: number;
    bondsDelta: number;
    isRelocatedAway: boolean;
    grantFlag: string;
  }) => void;
}

export interface ApplicationHistoryItem {
  univ: UniversityInfo;
  isAccepted: boolean;
  probPercent: number;
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
  const [selectedMajor, setSelectedMajor] = useState<string>(COLLEGE_MAJORS[0].name);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [admissionResult, setAdmissionResult] = useState<{ isAccepted: boolean; evaluated: boolean }>({
    isAccepted: false,
    evaluated: false
  });
  // 지원한 대학들의 합격/불합격 누적 내역
  const [appliedHistory, setAppliedHistory] = useState<ApplicationHistoryItem[]>([]);

  const acadProfile = useMemo(() => getAcademicProfile(citizenLearning), [citizenLearning]);

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

    // 지원 이력 업데이트
    setAppliedHistory(prev => {
      const filtered = prev.filter(item => item.univ.id !== univ.id);
      return [{ univ, isAccepted: passed, probPercent: Math.round(prob * 100) }, ...filtered];
    });

    setAdmissionResult({
      isAccepted: passed,
      evaluated: true
    });

    if (passed) {
      audioManager.playChimeSound();
    }
  };

  // 결과 화면에서 다시 대학교 검색/목록으로 복귀
  const handleBackToUnivList = () => {
    audioManager.playClickSound();
    setAdmissionResult({ isAccepted: false, evaluated: false });
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
      collegeMajor: selectedMajor,
      consequenceText: `축하합니다! ${selectedUniv.name} ${selectedMajor}에 당당히 합격하여 ${selectedUniv.category} 신입생으로 캠퍼스 라이프를 시작합니다.`,
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
      collegeMajor: undefined,
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
      collegeMajor: undefined,
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
      collegeMajor: undefined,
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
        
        {/* 상단 헤더: 수능 성적표 및 학업 역량 리포트 */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-space-900 border-b border-blue-500/30 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {age}세 ({year}년) · {isRetryYear ? '대입 재도전 (재수)' : '대학 진학의 갈림길'}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    배움: {citizenLearning}점
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${acadProfile.badgeBg}`}>
                    {acadProfile.csatTier} ({acadProfile.percentile}) · {acadProfile.gpa}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
                  <span>{isRetryYear ? '20세 대입 재도전: 전국 100개 대학교 재지원' : '전국 주요 100개 대학교 지망 및 입시 지원'}</span>
                  <span className="text-xs font-normal text-slate-400 hidden sm:inline">[{acadProfile.tag}]</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* 입시 합격/불합격 결과 팝업 오버레이 */}
        {admissionResult.evaluated && selectedUniv && (
          <div className="p-6 bg-space-950/95 border-b border-space-800 flex flex-col items-center text-center space-y-4 animate-fadeIn">
            {admissionResult.isAccepted ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
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

                {/* 전공(학과) 선택 영역 */}
                <div className="w-full max-w-lg bg-space-900 border border-slate-700/80 rounded-xl p-4 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>입학하여 수학할 희망 전공(학과)을 선택해주세요:</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">향후 취업·커리어 직결</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {COLLEGE_MAJORS.map(m => {
                      const isSelected = selectedMajor === m.name;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            audioManager.playClickSound();
                            setSelectedMajor(m.name);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition flex items-start gap-2 ${
                            isSelected
                              ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/30 text-white'
                              : 'bg-space-850 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-space-800'
                          }`}
                        >
                          <span className="text-base shrink-0">{m.iconEmoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold leading-snug line-clamp-1">{m.name}</div>
                            <div className="text-[10px] text-sky-400 mt-0.5">{m.careerTag}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-lg justify-center">
                  <button
                    onClick={handleAcceptCollege}
                    className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>[{selectedMajor.split('/')[0].trim()}] 전공으로 등록하고 진학하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleBackToUnivList}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-space-850 hover:bg-space-800 border border-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <span>← 다른 대학도 둘러보기</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/20">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 font-mono tracking-wider">[불합격 통지 안내]</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    <span className="text-slate-300">{selectedUniv.name}</span> 불합격 (예비 순위 초과)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                    치열한 입시 경쟁 끝에 안타깝게 합격자 명단에 들지 못했습니다. 목록으로 돌아가 다른 대학교에 원서를 넣거나, 1년 더 수능을 준비하여 재도전할 수 있습니다.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-md mt-2">
                  <button
                    onClick={handleBackToUnivList}
                    className="w-full px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📝 다른 대학교 원서 쓰기 (대학 목록으로 돌아가기)</span>
                  </button>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleChooseRetry}
                      className="flex-1 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>📚 1년 더 준비 (재수)</span>
                    </button>
                    <button
                      onClick={handleChooseWork}
                      className="flex-1 px-4 py-2 rounded-xl font-medium text-xs bg-space-850 hover:bg-space-800 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>💼 사회 진출·취업</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 본문: 대학 검색 및 권역 필터 */}
        {!admissionResult.evaluated && (
          <div className="p-4 sm:p-5 flex-1 min-h-0 flex flex-col space-y-3">

            {/* 지원 이력 및 합격 현황 요약 바 */}
            {appliedHistory.length > 0 && (
              <div className="bg-space-950/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-300">📋 나의 지원 현황:</span>
                  <span className="text-emerald-400 font-bold">
                    합격 {appliedHistory.filter(h => h.isAccepted).length}곳
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-rose-400 font-bold">
                    불합격 {appliedHistory.filter(h => !h.isAccepted).length}곳
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {appliedHistory.filter(h => h.isAccepted).map(item => (
                    <button
                      key={item.univ.id}
                      onClick={() => {
                        setSelectedUniv(item.univ);
                        setAdmissionResult({ isAccepted: true, evaluated: true });
                        audioManager.playClickSound();
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <span>🎉 {item.univ.name} 등록하기</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 지역 권역 필터 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar shrink-0">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedRegion === r
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'bg-space-850 text-slate-400 hover:text-white hover:bg-space-800'
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

                const appliedItem = appliedHistory.find(h => h.univ.id === univ.id);

                return (
                  <div
                    key={univ.id}
                    className={`p-3 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group ${
                      appliedItem?.isAccepted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : appliedItem
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-space-850 border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                          {univ.name}
                        </span>
                        {appliedItem && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            appliedItem.isAccepted
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {appliedItem.isAccepted ? '✓ 합격됨' : '✕ 불합격'}
                          </span>
                        )}
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

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                      <div className="text-left sm:text-right">
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow transition flex items-center gap-1 ${
                          appliedItem?.isAccepted
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                            : appliedItem
                            ? 'bg-rose-700 hover:bg-rose-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <span>
                          {appliedItem?.isAccepted ? '🎉 합격 (선택)' : appliedItem ? '재지원' : '원서 접수'}
                        </span>
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