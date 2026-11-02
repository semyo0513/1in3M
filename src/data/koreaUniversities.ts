// 전국 주요 100개 대학교 데이터 (거점국립대, 수도권 주요대, 이공특성화대, 교육대, 지역중심대 등)
export interface UniversityInfo {
  id: string;
  name: string;
  region: '진주' | '경남/부산/울산' | '대구/경북' | '서울' | '경기/인천' | '대전/충청' | '광주/전라' | '강원/제주';
  category: '국립' | '사립' | '특수' | '교육대';
  minLearningCutoff: number; // 합격 기준 배움 지표 (수능/내신 경쟁률 반영)
  acceptanceRateBase: number; // 기준선 도달 시 기본 합격 확률 (0.0 ~ 1.0)
  tuitionLevel: '저렴' | '보통' | '높음';
  description: string;
}

export const KOREA_MAJOR_UNIVERSITIES: UniversityInfo[] = [
  // [진주 및 경남권 - 지역 우선 대학]
  { id: 'gnu', name: '경상국립대학교', region: '진주', category: '국립', minLearningCutoff: 40, acceptanceRateBase: 0.88, tuitionLevel: '저렴', description: '진주시 가좌·칠암에 위치한 경남 국가거점국립대학교' },
  { id: 'cue', name: '진주교육대학교', region: '진주', category: '교육대', minLearningCutoff: 65, acceptanceRateBase: 0.70, tuitionLevel: '저렴', description: '진주시 신안동 소재 초등교원 양성 특수목적 국립대' },
  { id: 'yonam', name: '연암공과대학교', region: '진주', category: '사립', minLearningCutoff: 35, acceptanceRateBase: 0.90, tuitionLevel: '보통', description: 'LG연암학원 설립 실무 공학 특성화 대학' },
  { id: 'changwon', name: '국립창원대학교', region: '경남/부산/울산', category: '국립', minLearningCutoff: 45, acceptanceRateBase: 0.85, tuitionLevel: '저렴', description: '경남 중부권 국가중심국립대학교' },
  { id: 'pnu', name: '부산대학교', region: '경남/부산/울산', category: '국립', minLearningCutoff: 62, acceptanceRateBase: 0.75, tuitionLevel: '저렴', description: '영남권 대표 국가거점국립대학교' },
  { id: 'pknu', name: '국립부경대학교', region: '경남/부산/울산', category: '국립', minLearningCutoff: 52, acceptanceRateBase: 0.80, tuitionLevel: '저렴', description: '해양·수산 및 첨단 IT 융합 국립대' },
  { id: 'kmou', name: '한국해양대학교', region: '경남/부산/울산', category: '국립', minLearningCutoff: 48, acceptanceRateBase: 0.82, tuitionLevel: '저렴', description: '해양 전문 특성화 국가중심국립대' },
  { id: 'donga', name: '동아대학교', region: '경남/부산/울산', category: '사립', minLearningCutoff: 42, acceptanceRateBase: 0.88, tuitionLevel: '보통', description: '부산권 유서 깊은 전통 사립 종합대학' },
  { id: 'unist', name: 'UNIST (울산과학기술원)', region: '경남/부산/울산', category: '특수', minLearningCutoff: 82, acceptanceRateBase: 0.55, tuitionLevel: '저렴', description: '글로벌 과학기술 특성화 국립 연구대학' },
  { id: 'ulsan', name: '울산대학교', region: '경남/부산/울산', category: '사립', minLearningCutoff: 46, acceptanceRateBase: 0.85, tuitionLevel: '보통', description: '현대중공업 재단 산학협력 중심 사립대' },
  { id: 'inje', name: '인제대학교', region: '경남/부산/울산', category: '사립', minLearningCutoff: 40, acceptanceRateBase: 0.88, tuitionLevel: '보통', description: '백병원 연계 의생명 헬스케어 특성화대' },
  { id: 'kyungnam_u', name: '경남대학교', region: '경남/부산/울산', category: '사립', minLearningCutoff: 38, acceptanceRateBase: 0.90, tuitionLevel: '보통', description: '창원 마산합포구 소재 사립 종합대학' },
  { id: 'bue', name: '부산교육대학교', region: '경남/부산/울산', category: '교육대', minLearningCutoff: 65, acceptanceRateBase: 0.70, tuitionLevel: '저렴', description: '부산 초등교원 양성 국립 교육대학' },

  // [서울 최상위권 (SKY 및 과기특성화)]
  { id: 'snu', name: '서울대학교', region: '서울', category: '국립', minLearningCutoff: 94, acceptanceRateBase: 0.08, tuitionLevel: '저렴', description: '대한민국 최고 권위의 국립 종합대학 (전국 0.5% 극상위 경쟁)' },
  { id: 'yonsei', name: '연세대학교', region: '서울', category: '사립', minLearningCutoff: 90, acceptanceRateBase: 0.14, tuitionLevel: '높음', description: '신촌 소재 대한민국 최상위 명문 사립대' },
  { id: 'korea', name: '고려대학교', region: '서울', category: '사립', minLearningCutoff: 90, acceptanceRateBase: 0.14, tuitionLevel: '높음', description: '안암 소재 민족의 지성 최상위 사립대' },
  { id: 'kaist', name: 'KAIST (한국과학기술원)', region: '대전/충청', category: '특수', minLearningCutoff: 91, acceptanceRateBase: 0.12, tuitionLevel: '저렴', description: '대한민국 이공계 최고 연구 중심 특수대학' },
  { id: 'postech', name: 'POSTECH (포항공과대학교)', region: '대구/경북', category: '사립', minLearningCutoff: 90, acceptanceRateBase: 0.14, tuitionLevel: '저렴', description: '포스코 재단 소수정예 연구중심 공과대학' },
  { id: 'gist', name: 'GIST (광주과학기술원)', region: '광주/전라', category: '특수', minLearningCutoff: 84, acceptanceRateBase: 0.22, tuitionLevel: '저렴', description: '광주 소재 국가 과학기술 특성화 대학' },
  { id: 'dgist', name: 'DGIST (대구경북과학기술원)', region: '대구/경북', category: '특수', minLearningCutoff: 82, acceptanceRateBase: 0.25, tuitionLevel: '저렴', description: '대구 소재 융복합 과학기술 특성화 연구대학' },

  // [서울 주요 상위권]
  { id: 'skku', name: '성균관대학교', region: '서울', category: '사립', minLearningCutoff: 84, acceptanceRateBase: 0.22, tuitionLevel: '높음', description: '삼성 지원 600년 역사의 명문 종합대학' },
  { id: 'sogang', name: '서강대학교', region: '서울', category: '사립', minLearningCutoff: 83, acceptanceRateBase: 0.24, tuitionLevel: '높음', description: '신촌 소재 엄격한 학사관리의 명문 사립대' },
  { id: 'hanyang', name: '한양대학교', region: '서울', category: '사립', minLearningCutoff: 83, acceptanceRateBase: 0.24, tuitionLevel: '높음', description: '엔지니어링 명가 한양 공대 중심 사립대' },
  { id: 'cau', name: '중앙대학교', region: '서울', category: '사립', minLearningCutoff: 78, acceptanceRateBase: 0.32, tuitionLevel: '높음', description: '흑석동 소재 언론·예술·경영 명문 사립대' },
  { id: 'khu', name: '경희대학교', region: '서울', category: '사립', minLearningCutoff: 77, acceptanceRateBase: 0.34, tuitionLevel: '높음', description: '한의학·호텔관광·국제학 특성화 명문대' },
  { id: 'hufs', name: '한국외국어대학교', region: '서울', category: '사립', minLearningCutoff: 75, acceptanceRateBase: 0.38, tuitionLevel: '높음', description: '글로벌 언어·외교·통상 전문 명문 사립대' },
  { id: 'uos', name: '서울시립대학교', region: '서울', category: '국립', minLearningCutoff: 78, acceptanceRateBase: 0.32, tuitionLevel: '저렴', description: '서울시 지원 도시과학·세무 특성화 공립대' },
  { id: 'ewha', name: '이화여자대학교', region: '서울', category: '사립', minLearningCutoff: 78, acceptanceRateBase: 0.32, tuitionLevel: '높음', description: '신촌 소재 역사 깊은 여성 명문 사립대학' },
  { id: 'konkuk', name: '건국대학교', region: '서울', category: '사립', minLearningCutoff: 73, acceptanceRateBase: 0.42, tuitionLevel: '높음', description: '일감호 호수와 바이오·부동산 특성화 명문대' },
  { id: 'dongguk', name: '동국대학교', region: '서울', category: '사립', minLearningCutoff: 71, acceptanceRateBase: 0.45, tuitionLevel: '높음', description: '남산 아래 경찰행정·영상문예 명문 사립대' },
  { id: 'hongik', name: '홍익대학교', region: '서울', category: '사립', minLearningCutoff: 72, acceptanceRateBase: 0.42, tuitionLevel: '높음', description: '미술·디자인·건축 최고 권위의 명문대' },
  { id: 'sookmyung', name: '숙명여자대학교', region: '서울', category: '사립', minLearningCutoff: 70, acceptanceRateBase: 0.48, tuitionLevel: '높음', description: '용산 소재 여성 리더 양성 전통 사립대' },
  { id: 'kookmin', name: '국민대학교', region: '서울', category: '사립', minLearningCutoff: 63, acceptanceRateBase: 0.70, tuitionLevel: '높음', description: '자동차공학 및 조형디자인 특성화 사립대' },
  { id: 'soongsil', name: '숭실대학교', region: '서울', category: '사립', minLearningCutoff: 63, acceptanceRateBase: 0.70, tuitionLevel: '높음', description: '국내 최초 IT·컴퓨터학부 특성화 사립대' },
  { id: 'sejong', name: '세종대학교', region: '서울', category: '사립', minLearningCutoff: 61, acceptanceRateBase: 0.72, tuitionLevel: '높음', description: '호텔경영·만화애니·소프트웨어 특성화대' },
  { id: 'dankook', name: '단국대학교', region: '경기/인천', category: '사립', minLearningCutoff: 58, acceptanceRateBase: 0.75, tuitionLevel: '보통', description: '죽전·천안 캠퍼스 전통의 사립 종합대학' },
  { id: 'kwangwoon', name: '광운대학교', region: '서울', category: '사립', minLearningCutoff: 62, acceptanceRateBase: 0.72, tuitionLevel: '보통', description: '전자·로봇·ICT 공학 특성화 사립대학' },
  { id: 'mju', name: '명지대학교', region: '서울', category: '사립', minLearningCutoff: 56, acceptanceRateBase: 0.78, tuitionLevel: '보통', description: '인문(서울)·자연(용인) 사립 종합대학' },
  { id: 'sangmyung', name: '상명대학교', region: '서울', category: '사립', minLearningCutoff: 55, acceptanceRateBase: 0.78, tuitionLevel: '보통', description: '사범·예술·소프트웨어 특성화 사립대' },
  { id: 'karts', name: '한국예술종합학교', region: '서울', category: '특수', minLearningCutoff: 72, acceptanceRateBase: 0.40, tuitionLevel: '저렴', description: '문화체육관광부 소속 엘리트 국립 예술대학' },
  { id: 'knue', name: '한국교원대학교', region: '대전/충청', category: '교육대', minLearningCutoff: 74, acceptanceRateBase: 0.65, tuitionLevel: '저렴', description: '초·중·고 종합 교원 양성 종합 국립대학교' },
  { id: 'snue', name: '서울교육대학교', region: '서울', category: '교육대', minLearningCutoff: 78, acceptanceRateBase: 0.55, tuitionLevel: '저렴', description: '서초동 소재 초등교원 양성 명문 국립대' },
  { id: 'seoultech', name: '서울과학기술대학교', region: '서울', category: '국립', minLearningCutoff: 65, acceptanceRateBase: 0.72, tuitionLevel: '저렴', description: '노원구 소재 실용 공학 중심 국립종합대' },
  { id: 'catholic', name: '가톨릭대학교', region: '서울', category: '사립', minLearningCutoff: 58, acceptanceRateBase: 0.78, tuitionLevel: '보통', description: '성심(부천)·성의(의학) 명문 종합사립대' },
  { id: 'sungshin', name: '성신여자대학교', region: '서울', category: '사립', minLearningCutoff: 60, acceptanceRateBase: 0.75, tuitionLevel: '보통', description: '사범·뷰티·보건복지 특성화 여자대학' },
  { id: 'sew', name: '서울여자대학교', region: '서울', category: '사립', minLearningCutoff: 56, acceptanceRateBase: 0.78, tuitionLevel: '보통', description: '노원구 소재 정보보호·사회복지 특성화대' },
  { id: 'dongduk', name: '동덕여자대학교', region: '서울', category: '사립', minLearningCutoff: 54, acceptanceRateBase: 0.80, tuitionLevel: '보통', description: '성북구 소재 디자인·공연예술 특성화대' },
  { id: 'swu', name: '서경대학교', region: '서울', category: '사립', minLearningCutoff: 50, acceptanceRateBase: 0.82, tuitionLevel: '보통', description: '미용예술·공연예술 특성화 사립대학' },
  { id: 'hansung', name: '한성대학교', region: '서울', category: '사립', minLearningCutoff: 54, acceptanceRateBase: 0.80, tuitionLevel: '보통', description: '상상력인재학부 트랙제 중심 사립대학' },
  { id: 'samkook', name: '삼육대학교', region: '서울', category: '사립', minLearningCutoff: 52, acceptanceRateBase: 0.82, tuitionLevel: '보통', description: '보건·약학·간호 특성화 사립 종합대' },

  // [경기/인천권]
  { id: 'inha', name: '인하대학교', region: '경기/인천', category: '사립', minLearningCutoff: 66, acceptanceRateBase: 0.70, tuitionLevel: '높음', description: '인천 소재 공학·항공물류 명문 사립대' },
  { id: 'ajou', name: '아주대학교', region: '경기/인천', category: '사립', minLearningCutoff: 67, acceptanceRateBase: 0.70, tuitionLevel: '높음', description: '수원 소재 의학·공학·경영 명문 사립대' },
  { id: 'air', name: '한국항공대학교', region: '경기/인천', category: '사립', minLearningCutoff: 64, acceptanceRateBase: 0.72, tuitionLevel: '보통', description: '고양 소재 항공우주·운항 특성화 명문대' },
  { id: 'inu', name: '인천대학교', region: '경기/인천', category: '국립', minLearningCutoff: 58, acceptanceRateBase: 0.78, tuitionLevel: '저렴', description: '송도국제도시 소재 국가중심 국립대' },
  { id: 'gachon', name: '가천대학교', region: '경기/인천', category: '사립', minLearningCutoff: 60, acceptanceRateBase: 0.75, tuitionLevel: '보통', description: '성남 소재 바이오헬스·소프트웨어 혁신 사립대' },
  { id: 'erica', name: '한양대학교 ERICA', region: '경기/인천', category: '사립', minLearningCutoff: 62, acceptanceRateBase: 0.72, tuitionLevel: '보통', description: '안산 소재 산학연 클러스터 명문 캠퍼스' },
  { id: 'kyonggi', name: '경기대학교', region: '경기/인천', category: '사립', minLearningCutoff: 54, acceptanceRateBase: 0.80, tuitionLevel: '보통', description: '수원 소재 관광·경찰행정 특성화 사립대' },
  { id: 'kpu', name: '한국공학대학교', region: '경기/인천', category: '사립', minLearningCutoff: 48, acceptanceRateBase: 0.85, tuitionLevel: '보통', description: '시흥 소재 산학협력 엔지니어 특성화대' },
  { id: 'gangnam', name: '강남대학교', region: '경기/인천', category: '사립', minLearningCutoff: 46, acceptanceRateBase: 0.88, tuitionLevel: '보통', description: '용인 소재 사회복지학 전통 사립대학' },

  // [대전/충청 거점 및 주요대]
  { id: 'cnu', name: '충남대학교', region: '대전/충청', category: '국립', minLearningCutoff: 58, acceptanceRateBase: 0.80, tuitionLevel: '저렴', description: '대전 대덕특구 연계 국가거점국립대' },
  { id: 'cbnu', name: '충북대학교', region: '대전/충청', category: '국립', minLearningCutoff: 52, acceptanceRateBase: 0.82, tuitionLevel: '저렴', description: '청주 소재 바이오·반도체 국가거점국립대' },
  { id: 'knut', name: '한국교통대학교', region: '대전/충청', category: '국립', minLearningCutoff: 45, acceptanceRateBase: 0.86, tuitionLevel: '저렴', description: '철도·교통·항공 특성화 종합국립대' },
  { id: 'kongju', name: '국립공주대학교', region: '대전/충청', category: '국립', minLearningCutoff: 48, acceptanceRateBase: 0.84, tuitionLevel: '저렴', description: '사범대학 명문 국가중심국립대학교' },
  { id: 'hanbat', name: '국립한밭대학교', region: '대전/충청', category: '국립', minLearningCutoff: 48, acceptanceRateBase: 0.84, tuitionLevel: '저렴', description: '대전 소재 산학일체형 중심 국립대' },
  { id: 'hannam', name: '한남대학교', region: '대전/충청', category: '사립', minLearningCutoff: 42, acceptanceRateBase: 0.88, tuitionLevel: '보통', description: '대전 대덕밸리 소재 사립 종합대학' },
  { id: 'sunmoon', name: '선문대학교', region: '대전/충청', category: '사립', minLearningCutoff: 40, acceptanceRateBase: 0.90, tuitionLevel: '보통', description: '아산 소재 글로벌 다문화 특성화 사립대' },
  { id: 'soonchunhyang', name: '순천향대학교', region: '대전/충청', category: '사립', minLearningCutoff: 48, acceptanceRateBase: 0.84, tuitionLevel: '보통', description: '아산·서울 병원 연계 의생명 특성화대' },
  { id: 'hoseo', name: '호서대학교', region: '대전/충청', category: '사립', minLearningCutoff: 42, acceptanceRateBase: 0.88, tuitionLevel: '보통', description: '아산·천안 소재 벤처 창업 특성화대' },
  { id: 'koreatech', name: '한국기술교육대학교 (코리아텍)', region: '대전/충청', category: '특수', minLearningCutoff: 60, acceptanceRateBase: 0.75, tuitionLevel: '저렴', description: '고용노동부 설립 실무 공학 명문 대학' },

  // [대구/경북 거점 및 주요대]
  { id: 'knu', name: '경북대학교', region: '대구/경북', category: '국립', minLearningCutoff: 64, acceptanceRateBase: 0.75, tuitionLevel: '저렴', description: '대구/경북 대표 국가거점국립대학교' },
  { id: 'yeungnam', name: '영남대학교', region: '대구/경북', category: '사립', minLearningCutoff: 46, acceptanceRateBase: 0.85, tuitionLevel: '보통', description: '경산 소재 매머드급 사립 종합대학' },
  { id: 'keimyung', name: '계명대학교', region: '대구/경북', category: '사립', minLearningCutoff: 44, acceptanceRateBase: 0.86, tuitionLevel: '보통', description: '대구 소재 의료·예술·국제학 사립대' },
  { id: 'handong', name: '한동대학교', region: '대구/경북', category: '사립', minLearningCutoff: 60, acceptanceRateBase: 0.75, tuitionLevel: '보통', description: '포항 소재 전공자유·글로벌 혁신 사립대' },
  { id: 'kit', name: '금오공과대학교', region: '대구/경북', category: '국립', minLearningCutoff: 50, acceptanceRateBase: 0.82, tuitionLevel: '저렴', description: '구미 국가산단 중심 공학 특성화 국립대' },
  { id: 'andong', name: '국립안동대학교', region: '대구/경북', category: '국립', minLearningCutoff: 38, acceptanceRateBase: 0.90, tuitionLevel: '저렴', description: '경북 북부 국가중심국립대학교' },
  { id: 'dgue', name: '대구교육대학교', region: '대구/경북', category: '교육대', minLearningCutoff: 65, acceptanceRateBase: 0.70, tuitionLevel: '저렴', description: '대구 초등교원 양성 국립 교육대학' },

  // [광주/전라 거점 및 주요대]
  { id: 'jnu', name: '전남대학교', region: '광주/전라', category: '국립', minLearningCutoff: 60, acceptanceRateBase: 0.78, tuitionLevel: '저렴', description: '광주/전남 대표 국가거점국립대학교' },
  { id: 'jbnu', name: '전북대학교', region: '광주/전라', category: '국립', minLearningCutoff: 56, acceptanceRateBase: 0.80, tuitionLevel: '저렴', description: '전북 전주 소재 국가거점국립대학교' },
  { id: 'chosun', name: '조선대학교', region: '광주/전라', category: '사립', minLearningCutoff: 44, acceptanceRateBase: 0.86, tuitionLevel: '보통', description: '광주 소재 국내 최초의 민립 사립대학' },
  { id: 'wonkwang', name: '원광대학교', region: '광주/전라', category: '사립', minLearningCutoff: 42, acceptanceRateBase: 0.88, tuitionLevel: '보통', description: '익산 소재 한의학·의생명 특성화 사립대' },
  { id: 'kunsan', name: '국립군산대학교', region: '광주/전라', category: '국립', minLearningCutoff: 38, acceptanceRateBase: 0.90, tuitionLevel: '저렴', description: '새만금 산학협력 중심 국가중심국립대' },
  { id: 'mokpo', name: '국립목포대학교', region: '광주/전라', category: '국립', minLearningCutoff: 40, acceptanceRateBase: 0.88, tuitionLevel: '저렴', description: '전남 서남권 중심 국립 종합대학교' },
  { id: 'suncheon', name: '국립순천대학교', region: '광주/전라', category: '국립', minLearningCutoff: 42, acceptanceRateBase: 0.88, tuitionLevel: '저렴', description: '전남 동부권 글로컬 중심 국립대학교' },
  { id: 'gnue', name: '광주교육대학교', region: '광주/전라', category: '교육대', minLearningCutoff: 65, acceptanceRateBase: 0.70, tuitionLevel: '저렴', description: '광주/전남 초등교원 양성 국립 교육대' },
  { id: 'jnue', name: '전주교육대학교', region: '광주/전라', category: '교육대', minLearningCutoff: 65, acceptanceRateBase: 0.70, tuitionLevel: '저렴', description: '전북 초등교원 양성 국립 교육대학' },
  { id: 'kentech', name: 'KENTECH (한국에너지공과대학교)', region: '광주/전라', category: '특수', minLearningCutoff: 82, acceptanceRateBase: 0.50, tuitionLevel: '저렴', description: '나주 혁신도시 글로벌 에너지 특화 공과대학' },

  // [강원/제주 거점 및 주요대]
  { id: 'kangwon', name: '강원대학교', region: '강원/제주', category: '국립', minLearningCutoff: 52, acceptanceRateBase: 0.82, tuitionLevel: '저렴', description: '춘천/삼척 소재 강원 국가거점국립대' },
  { id: 'gwnu', name: '국립강릉원주대학교', region: '강원/제주', category: '국립', minLearningCutoff: 42, acceptanceRateBase: 0.88, tuitionLevel: '저렴', description: '강릉/원주 소재 치의학·신소재 국립대' },
  { id: 'hallym', name: '한림대학교', region: '강원/제주', category: '사립', minLearningCutoff: 50, acceptanceRateBase: 0.84, tuitionLevel: '보통', description: '춘천 소재 의학·데이터 사이언스 특성화대' },
  { id: 'yonsei_mirae', name: '연세대학교 미래캠퍼스', region: '강원/제주', category: '사립', minLearningCutoff: 54, acceptanceRateBase: 0.80, tuitionLevel: '보통', description: '원주 소재 의공학·디지털헬스케어 명문' },
  { id: 'cje', name: '춘천교육대학교', region: '강원/제주', category: '교육대', minLearningCutoff: 65, acceptanceRateBase: 0.70, tuitionLevel: '저렴', description: '강원 초등교원 양성 국립 교육대학' },
  { id: 'jejunu', name: '제주대학교', region: '강원/제주', category: '국립', minLearningCutoff: 46, acceptanceRateBase: 0.85, tuitionLevel: '저렴', description: '제주도 대표 국가거점국립대학교' }
];
