import { Key, RefObject, ChangeEventHandler, ChangeEvent } from "react"; // 올바른 import 구문

export interface HomeLeftContainerProps {
    selectedMode: Number;
    setSelectedMode: React.Dispatch<React.SetStateAction<Number>>;
    rightContainerWidth: Number | null;
    state: string;
}

export interface HomeRightContainerProps {
    selectedMode: Number;
    rightContainerRef: RefObject<HTMLDivElement>;
}

export interface InputAnsProps {
    ans: String;
    setAns: React.Dispatch<React.SetStateAction<String>>;
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
    selectedMode: Number;
    setSelectedMode: React.Dispatch<React.SetStateAction<Number>>;
}

export interface NameJobContext {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    job: string;
    setJob: React.Dispatch<React.SetStateAction<string>>;
}

export interface NavbarProps {
    navbarToggle: boolean;
    setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMode: Number;
    handleChangeMode: (modeNum: Number) => void;
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
    name: string;
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
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStrengthsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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