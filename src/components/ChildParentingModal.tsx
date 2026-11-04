import React from 'react';
import { Sparkles, Heart, GraduationCap, School, ArrowRight, User } from 'lucide-react';
import { audioManager } from '../utils/audio';

export interface ChildMilestoneDecision {
  childId: string;
  childName: string;
  childAge: number;
  gender: '아들' | '딸';
  stage: 'elem_7' | 'mid_14' | 'univ_19';
}

interface ChildParentingModalProps {
  decision: ChildMilestoneDecision;
  parentAge: number;
  year: number;
  parentNetWorth: number;
  onResolve: (result: {
    consequenceText: string;
    childCollegeName?: string;
    childJob?: string;
    happinessDelta: number;
    bondsDelta: number;
    spendAmount: number;
    parentNote: string;
  }) => void;
}

export const ChildParentingModal: React.FC<ChildParentingModalProps> = ({
  decision,
  parentAge,
  year,
  parentNetWorth,
  onResolve
}) => {
  const { childName, childAge, gender, stage } = decision;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 animate-fadeIn select-none">
      <div className="bg-space-900 border border-slate-700/80 rounded-2xl max-w-xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        
        {/* 상단 헤더 */}
        <div className="bg-gradient-to-r from-pink-950/80 via-purple-950/70 to-space-900 border-b border-pink-500/30 px-4 sm:px-5 py-3 sm:py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 text-lg">
              {gender === '아들' ? '👦' : '👧'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {gender} '{childName}'의 성장 ({childAge}세)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  부모 나이 {parentAge}세 ({year}년)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {stage === 'elem_7' && `초등학교 입학을 앞둔 ${childName}의 교육 방향`}
                {stage === 'mid_14' && `사춘기에 접어든 ${childName}의 진로와 학업`}
                {stage === 'univ_19' && `스무 살 청년이 된 ${childName}의 대학 및 사회 진출`}
              </h2>
            </div>
          </div>
        </div>

        {/* 본문 설명 */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 space-y-3.5 text-xs">
          <p className="text-slate-300 leading-relaxed bg-space-950/60 p-3 rounded-xl border border-slate-800">
            {stage === 'elem_7' && (
              `품 안에 쏙 안기던 '${childName}'이(가) 어느덧 훌쩍 자라 어엿한 책가방을 멜 나이가 되었습니다. 부모로서 아이의 첫 학교생활과 교육에 어떤 마음으로 힘을 실어주시겠습니까?`
            )}
            {stage === 'mid_14' && (
              `중학교에 올라간 '${childName}'이(가) 자신의 꿈과 진로에 대해 고민하기 시작했습니다. 친구들과 어울리며 스스로 길을 찾도록 지켜볼지, 진주 평거동 학원가에 등록하여 대입 수험 기초를 탄탄히 닦아줄지 선택합니다.`
            )}
            {stage === 'univ_19' && (
              `수능을 마친 성인 '${childName}'이(가) 합격증과 진로 계획을 품에 안고 당신 앞에 섰습니다. 자녀가 스스로 빚어낸 성과에 부모로서 어떤 든든한 날개를 달아주시겠습니까?`
            )}
          </p>

          {/* 선택지 목록 */}
          <div className="space-y-2.5">
            {stage === 'elem_7' && (
              <>
                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      consequenceText: `자녀 '${childName}'을(를) 위해 아낌없이 학습지와 방과 후 예체능을 뒷받침했습니다. 초등학교 입학식에서 또랑또랑하게 손을 흔드는 아이를 보며 가슴이 벅차오릅니다.`,
                      happinessDelta: 5,
                      bondsDelta: 8,
                      spendAmount: 3000000,
                      parentNote: '정성 가득한 초등 입학 지원'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-pink-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">📚</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-pink-300 text-xs">
                      학습지와 방과 후 피아노·태권도를 아낌없이 지원한다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      자녀의 기초 학력과 자신감 쑥쑥 (연 300만 원 지출 / 유대 +8)
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      consequenceText: `남강변 둔치에서 함께 자전거를 타고 진주성 역사 숲길을 걸으며 건강하고 씩씩한 아이로 키웠습니다. 가족과의 따뜻한 교감이 아이의 가장 큰 자산이 되었습니다.`,
                      happinessDelta: 8,
                      bondsDelta: 10,
                      spendAmount: 0,
                      parentNote: '남강 자연 속 따뜻한 양육'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-emerald-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">🌳</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-emerald-300 text-xs">
                      사교육 대신 남강 둔치와 자연에서 마음껏 뛰놀게 한다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      가족의 행복과 정서적 유대 극대화 (지출 없음 / 행복 +8, 유대 +10)
                    </div>
                  </div>
                </button>
              </>
            )}

            {stage === 'mid_14' && (
              <>
                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      consequenceText: `평거동 학원가 단과반에 등록해 밤늦게까지 독서실을 지키는 '${childName}'을(를) 따뜻한 야식으로 응원했습니다. 아이가 전교 상위권 성적을 받아들고 환하게 웃었습니다.`,
                      happinessDelta: 4,
                      bondsDelta: 6,
                      spendAmount: 6000000,
                      parentNote: '평거동 학원가 입시 집중 지원'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-blue-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">🏛️</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-blue-300 text-xs">
                      평거동 학원가 집중 심화반에 등록하여 명문대 진학 토대를 닦는다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      학업 성취도 대폭 향상 (연 600만 원 사교육비 / 유대 +6)
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      consequenceText: `'${childName}'이(가) 좋아하는 동아리 활동과 취미를 전폭적으로 지지해주었습니다. 아이는 부모의 신뢰 속에 자존감 높은 사춘기를 보냈습니다.`,
                      happinessDelta: 10,
                      bondsDelta: 10,
                      spendAmount: 1000000,
                      parentNote: '자녀의 개성과 자율성 지지'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-amber-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">🎨</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-amber-300 text-xs">
                      성적 압박 대신 자녀가 좋아하는 적성과 취미를 전폭 지지한다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      깊은 가족적 신뢰와 높은 자존감 형성 (행복 +10, 유대 +10)
                    </div>
                  </div>
                </button>
              </>
            )}

            {stage === 'univ_19' && (
              <>
                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      childCollegeName: '서울권 명문 대학교',
                      childJob: '수도권 유학생',
                      consequenceText: `대견한 '${childName}'이(가) 서울권 대학교에 합격하여 상경을 결심했습니다. 진주역 승강장에서 자녀의 짐가방을 실어보내며 뜨거운 눈물과 든든한 학비를 건넸습니다.`,
                      happinessDelta: 12,
                      bondsDelta: 12,
                      spendAmount: 15000000,
                      parentNote: '서울 상경 명문대 진학 전폭 지원'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-sky-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">🚅</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-sky-300 text-xs">
                      "원하는 곳 어디든 가거라" 서울권 대학 진학과 보증금·등록금을 전폭 지원한다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      자녀 서울 상경 및 가문의 영광 (초기 보증금 및 등록금 1,500만 원 / 행복 +12, 유대 +12)
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      childCollegeName: '경상국립대학교',
                      childJob: '국립대 대학생',
                      consequenceText: `자랑스러운 '${childName}'이(가) 진주 경상국립대학교에 장학생으로 진학했습니다. 온 가족이 모여 남강변 식당에서 축하 잔치를 열고 함께 축배를 들었습니다.`,
                      happinessDelta: 10,
                      bondsDelta: 14,
                      spendAmount: 4000000,
                      parentNote: '진주 경상국립대 지역인재 진학'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-emerald-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">🎓</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-emerald-300 text-xs">
                      "가족 곁에서 든든하게!" 지역 명문 경상국립대학교 진학을 격려하고 장려한다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      가족과 곁에서 안정을 누리며 학업 (등록금 400만 원 / 행복 +10, 유대 +14)
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    audioManager.playClickSound();
                    onResolve({
                      childJob: '산업단지 기술 연구원',
                      consequenceText: `대학 대신 자신의 손기술과 실용적 진로를 택한 '${childName}'의 당당한 조기 자립을 축복했습니다. 아이는 첫 월급으로 당신에게 빨간 내복과 선물을 건넸습니다.`,
                      happinessDelta: 8,
                      bondsDelta: 10,
                      spendAmount: 0,
                      parentNote: '청년 기술직 조기 자립 지지'
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-amber-400 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-lg shrink-0">💼</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100 group-hover:text-amber-300 text-xs">
                      "너의 주도적인 삶을 믿는다" 기술 습득 및 조기 사회 진출을 응원한다
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      빠른 경제적 독립과 효도 (지출 없음 / 행복 +8, 유대 +10)
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
