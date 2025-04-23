import React, { useState, useEffect, FC } from 'react';
import styles from './MentorSearchModal.module.scss';
import { MentorSearchCriteria } from '../../types/types';
import SearchModal from '../Company/SearchModal';
import Input from '../Input/Input';
import Button from '../Button/Button';

// --- AddMentorModal과 동일한 예시 데이터 사용 또는 별도 관리 ---
const ALL_TOPICS = ["취업 상담", "기술 심층 학습", "코드 리뷰", "커리어 전환", "포트폴리오 제작", "사이드 프로젝트"];
const ALL_MENTEE_TYPES = ["학생", "신입", "주니어(1~3년차)", "경력자(3년차+)", "전환 희망자"];
const EXPERIENCE_RANGES = ["1년 미만", "1~3년", "3~5년", "5~10년", "10년 이상"]; // 검색 시 최소값 기준으로 사용
// ---------------------------------------------------------

interface MentorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: MentorSearchCriteria) => void;
  initialCriteria?: MentorSearchCriteria;
}

const MentorSearchModal: FC<MentorSearchModalProps> = ({ isOpen, onClose, onSearch, initialCriteria }) => {
  const [techStack, setTechStack] = useState('');
  const [location, setLocation] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  // --- 신규 상태 추가 ---
  const [meetingType, setMeetingType] = useState<'대면' | '비대면' | '둘다가능' | ''>(''); // 전체 포함 위해 '' 추가
  const [mentoringTopic, setMentoringTopic] = useState(''); // 검색 시 우선 단일 주제 선택으로 가정
  const [targetMentee, setTargetMentee] = useState('');
  const [minYearsExperience, setMinYearsExperience] = useState(''); // 최소 경력 연차 선택

  // 모달 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setTechStack(initialCriteria?.techStack || '');
      setLocation(initialCriteria?.location || '');
      setPriceMin(initialCriteria?.price?.min?.toString() || '');
      setPriceMax(initialCriteria?.price?.max?.toString() || '');
      setMeetingType(initialCriteria?.meetingType || '');
      setMentoringTopic(initialCriteria?.mentoringTopic || '');
      setTargetMentee(initialCriteria?.targetMentee || '');
      setMinYearsExperience(initialCriteria?.minYearsExperience?.toString() || ''); // 숫자를 문자열로 변환
    }
  }, [isOpen, initialCriteria]);

  const handleApplySearch = () => {
    // 경력 연차 문자열을 숫자로 변환 (예: "3~5년" -> 3)
    let minExpNum: number | undefined = undefined;
    if (minYearsExperience) {
        // 간단한 숫자 변환 로직 (더 정교하게 구현 가능)
        const match = minYearsExperience.match(/(\d+)/);
        if (match) {
           minExpNum = parseInt(match[0]);
        } else if (minYearsExperience === "1년 미만") {
           minExpNum = 0;
        }
    }

    const criteria: MentorSearchCriteria = {
      techStack: techStack || undefined,
      location: location || undefined,
      price: {
        min: priceMin ? parseInt(priceMin) : undefined,
        max: priceMax ? parseInt(priceMax) : undefined,
      },
      // --- 신규 필터 값 할당 ---
      meetingType: meetingType || undefined, // '' 이면 undefined
      mentoringTopic: mentoringTopic || undefined,
      targetMentee: targetMentee || undefined,
      minYearsExperience: minExpNum,
    };
    onSearch(criteria);
    // onClose(); // 검색 후 모달 자동 닫기 제거 (사용자가 닫도록)
  };

  // 검색 조건 초기화 함수
  const handleReset = () => {
      setTechStack('');
      setLocation('');
      setPriceMin('');
      setPriceMax('');
      setMeetingType('');
      setMentoringTopic('');
      setTargetMentee('');
      setMinYearsExperience('');
      // 초기화 후 바로 검색 적용 또는 사용자가 검색 버튼 누르도록
      // onSearch({}); // 모든 조건 초기화하여 검색
  };


  return (
    <SearchModal isOpen={isOpen} onClose={onClose} title="멘토 검색 조건">
      <div className={styles.searchContainer}>
        {/* --- 기존 필터 --- */}
        <Input label="기술 스택" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="포함될 기술 스택 입력"/>
        <Input label="활동 지역" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 서울 강남구"/>

        {/* --- 신규 필터 --- */}
         <div className={styles.selectGroup}>
           <label htmlFor="meetingType" className={styles.selectLabel}>만남 방식:</label>
           <select id="meetingType" value={meetingType} onChange={(e) => setMeetingType(e.target.value as any)} className={styles.selectBox}>
             <option value="">전체</option>
             <option value="비대면">비대면</option>
             <option value="대면">대면</option>
             <option value="둘다가능">둘 다 가능</option>
           </select>
         </div>

         <div className={styles.selectGroup}>
           <label htmlFor="mentoringTopic" className={styles.selectLabel}>멘토링 주제:</label>
           <select id="mentoringTopic" value={mentoringTopic} onChange={(e) => setMentoringTopic(e.target.value)} className={styles.selectBox}>
             <option value="">전체</option>
             {ALL_TOPICS.map(topic => <option key={topic} value={topic}>{topic}</option>)}
           </select>
         </div>

        <div className={styles.selectGroup}>
            <label htmlFor="targetMentee" className={styles.selectLabel}>주요 대상:</label>
            <select id="targetMentee" value={targetMentee} onChange={(e) => setTargetMentee(e.target.value)} className={styles.selectBox}>
              <option value="">전체</option>
              {ALL_MENTEE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>

        <div className={styles.selectGroup}>
            <label htmlFor="minYearsExperience" className={styles.selectLabel}>최소 경력 연차:</label>
            <select id="minYearsExperience" value={minYearsExperience} onChange={(e) => setMinYearsExperience(e.target.value)} className={styles.selectBox}>
              <option value="">전체</option>
              {EXPERIENCE_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
            </select>
        </div>


        {/* --- 가격 범위 (기존) --- */}
        <div className={styles.priceRange}>
          <Input label="가격 (최소)" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="숫자만 입력 (단위: 원)"/>
          <Input label="가격 (최대)" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="숫자만 입력 (단위: 원)"/>
        </div>

        {/* --- 하단 버튼 그룹 --- */}
        <div className={styles.buttonGroup}>
            <Button onClick={handleReset} className={styles.resetButton}>초기화</Button>
            <Button onClick={handleApplySearch} primary className={styles.applyButton}>검색 적용</Button>
        </div>
      </div>
    </SearchModal>
  );
};

export default MentorSearchModal;