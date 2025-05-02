import { Key, RefObject, ChangeEventHandler, ChangeEvent, Dispatch, SetStateAction, ReactNode, MouseEventHandler } from "react";

export interface HomeLeftContainerProps {
  selectedMode: number;
  setSelectedMode: React.Dispatch<React.SetStateAction<number>>;
  rightContainerWidth: number | null;
  state: string;
}

export interface JobSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (job: string) => void;
  jobs: string[];
  onInputChange?: (value: string) => void;
  inputValue?: string;
}

export interface PersonaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (persona: string) => void;
  personas: string[];
  onInputChange?: (value: string) => void;
  inputValue?: string;
}

export interface HomeRightContainerProps {
  selectedMode: number;
  rightContainerRef: RefObject<HTMLDivElement>;
  openPersonaModal: () => void;
  selectedPersona: string | null;
  setOpenPersonaModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectPersona: (persona: string) => void;
  openJobModal: () => void;
  selectedJob: string | null;
  setJob: React.Dispatch<React.SetStateAction<string | null>>;
  selectedInterviewType: string | null;
  setInterviewType: React.Dispatch<React.SetStateAction<string | null>>;
  closeJobModal: () => void;
  selectJob: (job: string) => void;
  isJobModalOpen: boolean;
  closePersonaModal: () => void;
  handleJobInputChange?: (value: string) => void;
  jobInputValue?: string;
  isPersonaModalOpen: boolean;
}

export interface InputAnsProps {
  ans: string;
  setAns: React.Dispatch<React.SetStateAction<string>>;
  onClick: (input: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export interface ChatBoxProps {
  text: String;
  role: String;
}

export interface ModeBoxProps {
  id: Key;
  title: String;
  description: String;
  selectedMode: number;
  setSelectedMode: React.Dispatch<React.SetStateAction<number>>;
}

export interface NameJobContext {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  job: string;
  setJob: React.Dispatch<React.SetStateAction<string>>;
  interviewType: string;
  setInterviewType: React.Dispatch<React.SetStateAction<string>>;
  mem_id: string;
  setMemId: React.Dispatch<React.SetStateAction<string>>;
}

export interface NavbarProps {
  navbarToggle: boolean;
  setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeMode: (modeNum: number) => void;
}

export interface FormData {
  field: string;
  company: string;
  skills: string;
  questions: string; 
  portfolioFile?: File | null;
  cvFile: File | null;
  resumeFile?: File | null;
  emphasisPoints: string;
  qualifications?: string;
  projects?: string;
  experiences?: string;
  major?: string;
}

export interface UserEditFormData {
  mem_nick: string;
  mem_email: string;
  mem_phone: string;
  mem_addr: string;
  mem_birthdate: string;
  mem_gender: string;
}

export interface FileEditModalProps { 
  isOpen: boolean;
  onClose: () => void;
}

export interface UserEditNavbarProps {
  selectedTab: number;
  handleTabChange: (tabIndex: number) => void;
  navbarToggle: boolean;
  setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserEditFormProps {
  selectedTab: number;
}

export interface GuideInputProps {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  isTextArea?: boolean;
}

export interface AiGuideFormProps {
  field: string;
  company: string;
  strengths: string;
  experiences: string;
  selfIntro: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStrengthsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExperiencesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelfIntroChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPortfolioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateGuide: () => void;
}

export interface AiGuideResponse {
  guide: string;
  //  Other response data, if any
}

export interface GuideFileInputProps {
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Company {
  id: number;
  name: string;
  techStack: string[];
  salary: string;
  location: string;
  link?: string;
  similarity: number; 
}

export interface CompanySearchCriteria {
  techStack?: string;
  salary?: string;
  location?: string;
}

export interface CompanyCardProps {
  company: Company;
}

export interface Mentor {
  id: number;
  nickname: string;
  techStack: string[]; 
  location: string; 
  company?: string; 
  experience?: string; 
  meetingType: '대면' | '비대면' | '둘다가능'; 
  meetingLocation?: string; 
  price: { 
    min: number;
    max: number;
  };
  mentoringTopics?: string[]; 
  targetMentees?: string[];  
  yearsExperience?: number | string; 
  availability?: string[];   
}

export interface MentorSearchCriteria {
  techStack?: string; 
  location?: string; 
  price?: { 
    min?: number;
    max?: number;
  };
  meetingType?: '대면' | '비대면' | '둘다가능'; 
  mentoringTopic?: string;
  targetMentee?: string;   
  minYearsExperience?: number; 
}

export interface MentorCardProps { // MentorCardProps 인터페이스 정의 확인 (이미 있다면 수정)
  mentor: Mentor;
  // onSelect?: (mentorId: number) => void; // 선택 버튼 콜백 함수 타입 (추후 구현 시)
}

export interface CompanyMentorNavbarProps {
  selectedTab: number;
  handleTabChange: (tabIndex: number) => void;
  navbarToggle?: boolean; // 모바일 대응 위해 추가될 수 있음
  setNavbarToggle?: React.Dispatch<React.SetStateAction<boolean>>; // 모바일 대응 위해 추가될 수 있음
}

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  primary?: boolean;
}

export interface FileInputProps {
  label: string;
  id?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export interface DragAndDropInputProps {
  onFilesChange: (files: File[]) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  onClick?: () => void; // onClick 타입 추가
 }

 export interface DragAndDropProps {
  onFileUpload: (files: File[]) => void;
  label: string; 
  onSave: (files: File[]) => void;
 }

 export interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
  onSaveFiles: (files: File[]) => void;
 }

 export interface AiFeedbackFormProps {
  field: string; // '지원할 직무'로 사용됨
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFeedbackTypes: string[]; // 선택된 피드백 종류 배열
  otherFeedbackType: string; // 기타 피드백 입력값
  onOpenFeedbackModal: () => void; // 피드백 선택 모달 여는 함수
  onGenerateFeedback: () => void; // 피드백 생성 함수는 유지
}

// 인터뷰 피드백 데이터 구조 정의 (백엔드 응답에 맞춰 수정 필요)
export interface InterviewFeedbackData {
  overallScore: number; // 종합 점수
  scores: { // 세부 역량 점수 (오각형 차트용)
    clarity: number; // 명확성
    relevance: number; // 관련성
    professionalism: number; // 전문성
    conciseness: number; // 간결성
    confidence: number; // 자신감
    // 필요에 따라 다른 역량 추가
  };
  questionFeedbacks: QuestionFeedback[]; // 질문별 피드백 배열
  finalFeedback: string; // 최종 종합 코멘트
}

export interface QuestionFeedback {
  question: string; // 질문 내용
  answer: string; // 사용자 답변 내용
  feedback: string; 
  score: number; 
}