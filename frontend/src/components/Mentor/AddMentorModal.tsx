import React, { useState, useEffect, FC } from 'react';
import styles from './AddMentorModal.module.scss';
import { Mentor } from '../../types/types';
import SearchModal from '../Company/SearchModal';
import Input from '../Input/Input';
import Button from '../Button/Button';

// --- 예시 데이터 (실제로는 서버에서 가져오거나 상수로 관리) ---
const ALL_TOPICS = ["취업 상담", "기술 심층 학습", "코드 리뷰", "커리어 전환", "포트폴리오 제작", "사이드 프로젝트"];
const ALL_MENTEE_TYPES = ["학생", "신입", "주니어(1~3년차)", "경력자(3년차+)", "전환 희망자"];
const EXPERIENCE_RANGES = ["1년 미만", "1~3년", "3~5년", "5~10년", "10년 이상"];
// ---------------------------------------------------------

interface AddMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mentorData: Omit<Mentor, 'id'>) => void;
}

const AddMentorModal: FC<AddMentorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [nickname, setNickname] = useState('');
  const [techStack, setTechStack] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [meetingType, setMeetingType] = useState<'비대면' | '대면' | '둘다가능'>('비대면');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  // --- 신규 상태 추가 ---
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState<string>(''); // 경력 연차 범위 선택

  // 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setNickname(''); setTechStack(''); setCompany(''); setExperience('');
      setMeetingType('비대면'); setMeetingLocation('');
      setPriceMin(''); setPriceMax('');
      setSelectedTopics([]); setSelectedMentees([]); setYearsExperience('');
    }
  }, [isOpen]);

  // 체크박스 핸들러 (주제, 대상)
  const handleCheckboxChange = (
    value: string,
    currentSelection: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentSelection.includes(value)) {
      setter(currentSelection.filter(item => item !== value));
    } else {
      setter([...currentSelection, value]);
    }
  };

  const handleSave = () => {
    // 필수 항목 유효성 검사 강화
    if (!nickname || !techStack || !priceMin || !priceMax || selectedTopics.length === 0 || selectedMentees.length === 0 || !yearsExperience) {
       alert('필수 항목(*)을 모두 입력 또는 선택해주세요.');
       return;
    }
    if ((meetingType === '대면' || meetingType === '둘다가능') && !meetingLocation) {
       alert('대면 가능한 경우, 지역을 입력해주세요.');
       return;
    }

    const mentorData: Omit<Mentor, 'id'> = {
      nickname,
      techStack: techStack.split(',').map(s => s.trim()).filter(s => s),
      company: company || undefined,
      experience: experience || undefined,
      meetingType,
      meetingLocation: (meetingType === '대면' || meetingType === '둘다가능') ? meetingLocation : undefined,
      location: meetingLocation || '온라인', // 기본 활동 지역 (임시)
      price: {
        min: parseInt(priceMin) || 0,
        max: parseInt(priceMax) || 0,
      },
      // --- 신규 필드 값 할당 ---
      mentoringTopics: selectedTopics,
      targetMentees: selectedMentees,
      yearsExperience: yearsExperience, // 선택된 범위 문자열 또는 숫자
      // availability: [], // 필요 시 추가
    };
    onSave(mentorData);
  };

  return (
    <SearchModal isOpen={isOpen} onClose={onClose} title="새 멘토 추가">
      <div className={styles.formContainer}>
        {/* --- 기존 필드 --- */}
        <Input label="* 멘토 닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" />
        <Input label="* 기술 스택" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="쉼표(,)로 구분 (예: React, Node.js)" />
        <Input label="소속/회사" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="현재 소속 또는 주요 경력 회사" />
        <Input label="경력 상세" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="예: 5년차 백엔드 개발자" isTextArea />

        {/* --- 경력 연차 (Select) --- */}
        <div className={styles.selectGroup}>
           <label htmlFor="yearsExperience" className={styles.selectLabel}>* 경력 연차:</label>
           <select
             id="yearsExperience"
             value={yearsExperience}
             onChange={(e) => setYearsExperience(e.target.value)}
             className={styles.selectBox} // 스타일 적용 위한 클래스
           >
             <option value="" disabled>-- 선택 --</option>
             {EXPERIENCE_RANGES.map(range => (
               <option key={range} value={range}>{range}</option>
             ))}
           </select>
        </div>


        {/* --- 멘토링 주제 (Checkboxes) --- */}
        <div className={styles.checkboxGroup}>
          <span className={styles.checkboxLabel}>* 멘토링 주제 (다중 선택 가능):</span>
          <div className={styles.checkboxOptions}>
            {ALL_TOPICS.map(topic => (
              <label key={topic}>
                <input
                  type="checkbox"
                  value={topic}
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleCheckboxChange(topic, selectedTopics, setSelectedTopics)}
                /> {topic}
              </label>
            ))}
          </div>
        </div>

        {/* --- 주요 대상 (Checkboxes) --- */}
        <div className={styles.checkboxGroup}>
           <span className={styles.checkboxLabel}>* 주요 대상 (다중 선택 가능):</span>
           <div className={styles.checkboxOptions}>
             {ALL_MENTEE_TYPES.map(type => (
               <label key={type}>
                 <input
                   type="checkbox"
                   value={type}
                   checked={selectedMentees.includes(type)}
                   onChange={() => handleCheckboxChange(type, selectedMentees, setSelectedMentees)}
                 /> {type}
               </label>
             ))}
           </div>
        </div>

        {/* --- 만남 방식 (Radio) --- */}
        <div className={styles.radioGroup}>
          <span className={styles.radioLabel}>* 만남 방식:</span>
          {/* 라디오 버튼 옵션들 */}
          <label>
            <input type="radio" value="비대면" checked={meetingType === '비대면'} onChange={(e) => setMeetingType(e.target.value as any)} /> 비대면
          </label>
          <label>
            <input type="radio" value="대면" checked={meetingType === '대면'} onChange={(e) => setMeetingType(e.target.value as any)} /> 대면
          </label>
          <label>
            <input type="radio" value="둘다가능" checked={meetingType === '둘다가능'} onChange={(e) => setMeetingType(e.target.value as any)} /> 둘 다 가능
          </label>
        </div>

        {/* --- 대면 지역 (Conditional Input) --- */}
        {(meetingType === '대면' || meetingType === '둘다가능') && (
           <Input label="* 대면 가능 지역" value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)} placeholder="예: 서울 강남구"/>
        )}

        {/* --- 가격 범위 --- */}
        <div className={styles.priceRange}>
          <Input label="* 희망 가격 (최소)" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="숫자만 입력 (단위: 원)"/>
          <Input label="* 희망 가격 (최대)" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="숫자만 입력 (단위: 원)"/>
        </div>

        <Button onClick={handleSave} primary className={styles.saveButton}>저장하기</Button>
      </div>
    </SearchModal>
  );
};

export default AddMentorModal;