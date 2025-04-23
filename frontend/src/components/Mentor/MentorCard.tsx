import React from "react";
import styles from "./MentorCard.module.scss";
import { MentorCardProps } from "../../types/types"; // props 타입 import 확인
import Button from "../Button/Button";

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {

  const handleSelect = () => {
    alert(`${mentor.nickname} 멘토 선택 (구현 필요)`);
  };

  // 배열 정보를 보기 좋게 표시하는 헬퍼 함수 (선택 사항)
  const formatArray = (arr?: string[]) => arr && arr.length > 0 ? arr.join(', ') : '정보 없음';

  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h3>{mentor.nickname}</h3>
        {/* --- 기존 및 신규 정보 표시 --- */}
        {mentor.company && <p className={styles.subInfo}>소속/경력: {mentor.company}</p>}
        {/* {mentor.experience && <p className={styles.subInfo}>경력 상세: {mentor.experience}</p>} */}
        {mentor.yearsExperience && <p className={styles.subInfo}>경력: {mentor.yearsExperience}</p>} {/* 경력 연차 표시 */}
        <p className={styles.subInfo}>기술 스택: {formatArray(mentor.techStack)}</p>
        <p className={styles.subInfo}>멘토링 주제: {formatArray(mentor.mentoringTopics)}</p> {/* 멘토링 주제 표시 */}
        <p className={styles.subInfo}>주요 대상: {formatArray(mentor.targetMentees)}</p> {/* 주요 대상 표시 */}
        <p className={styles.subInfo}>가격: {mentor.price.min.toLocaleString()}원 ~ {mentor.price.max.toLocaleString()}원</p>
        <p className={styles.subInfo}>만남 방식: {mentor.meetingType}</p>
        {(mentor.meetingType === '대면' || mentor.meetingType === '둘다가능') && mentor.meetingLocation && (
          <p className={styles.subInfo}>대면 지역: {mentor.meetingLocation}</p>
        )}
        {/* {mentor.availability && <p className={styles.subInfo}>가능 시간: {formatArray(mentor.availability)}</p>} */}
      </div>

      <Button className={styles.selectBtn} onClick={handleSelect}>
        선택하기
      </Button>
    </div>
  );
};

export default MentorCard;