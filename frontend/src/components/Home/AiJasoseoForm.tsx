import React from 'react';
import Input from '../Input/Input'; // 재사용 가능한 Input 컴포넌트 (만든다고 가정)
import Button from '../Button/Button'; // 재사용 가능한 Button 컴포넌트 (만든다고 가정)
import { FormData } from '../../types/types'; // 이 타입 정의 필요
import styles from './AiJasoseoForm.module.scss'; // 이 CSS 파일 생성

interface AiJasoseoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof FormData) => void;
  onGenerate: () => void;
}

const AiJasoseoForm: React.FC<AiJasoseoFormProps> = ({ formData, onChange, onGenerate }) => {
  return (
    <div className={styles.formContainer}>
      <h2>AI 자소서 서비스</h2>
      <Input label="지원하는 분야 (선택)" value={formData.field} onChange={(e) => onChange(e, 'field')} />
      <Input label="지원하는 회사 (선택)" value={formData.company} onChange={(e) => onChange(e, 'company')} />
      <Input label="자격증" value={formData.qualifications} onChange={(e) => onChange(e, 'qualifications')} />
      <Input label="프로젝트 경험" value={formData.projects} onChange={(e) => onChange(e, 'projects')} />
      <Input label="특별한 경험" value={formData.experiences} onChange={(e) => onChange(e, 'experiences')} />
      <Input label="전공" value={formData.major} onChange={(e) => onChange(e, 'major')} />
      <Input label="강조 포인트 (선택)" value={formData.emphasisPoints} onChange={(e) => onChange(e, 'emphasisPoints')} />
      <Button onClick={onGenerate}>초안 작성하기</Button>
    </div>
  );
};

export default AiJasoseoForm;