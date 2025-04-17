import { Key, RefObject, ChangeEventHandler, ChangeEvent } from "react"; 

export interface HomeLeftContainerProps {
    selectedMode: number;
    setSelectedMode: React.Dispatch<React.SetStateAction<number>>;
    rightContainerWidth: number | null;
    state: string;
}

export interface HomeRightContainerProps {
    selectedMode: number;
    rightContainerRef: RefObject<HTMLDivElement>;
}

export interface InputAnsProps {
  ans: string;
  setAns: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => void;
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
}

export interface NavbarProps {
  navbarToggle: boolean;
  setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeMode: (modeNum: number) => void;
}

export interface FormData {
    field: string;
    company: string;
    qualifications: string;
    projects: string;
    experiences: string;
    major: string;
    emphasisPoints: string;
}

export interface UserEditFormData {
  nickname: string;
  password?: string; 
  passwordConfirm?: string; 
  email: string;
  phone: string;
  address: string;
  desiredJobTitle: string;
  desiredJobCategory: string;
}

export interface UserEditNavbarProps {
    selectedTab: number;
    handleTabChange: (tabIndex: number) => void;
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
  location: string;
  salary: string;
}

export interface CompanySearchCriteria {
  techStack?: string;
  location?: string;
  salary?: string;
}

export interface CompanyCardProps { // ✅ CompanyCardProps export
  company: Company;
}

export interface Mentor {
  id: number;
  nickname: string;
  techStack: string[];
  location: string;
  company?: string;
  price: {
    min: number;
    max: number;
  };
}

export interface MentorSearchCriteria {
  techStack?: string;
  location?: string;
  price?: {
    min?: number;
    max?: number;
  };
}

export interface MentorCardProps { // ✅ MentorCardProps export
  mentor: Mentor;
}

export interface CompanyMentorNavbarProps {
  selectedTab: number;
  handleTabChange: (tabIndex: number) => void;
}