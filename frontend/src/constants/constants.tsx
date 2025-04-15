import { Key } from "react";

export const Modes: {
  key: Key;
  title: String;
  description: String;
}[] = [
  {
    key: 0,
    title: "AI 면접 서비스",
    description: `면접관을 선택해 맞춤형 질문을 해드립니다.`,
  },
  {
    key: 1,
    title: "AI 자소서 도우미",
    description: `자소서 초안 작성 및 자소서 가이드`,
  },
  {
    key: 2,
    title: "회사 및 멘토 추천",
    description: `회사와 멘토를 추천해드립니다.`,
  },
];

export const mobileQuery = "(max-width:768px)";
