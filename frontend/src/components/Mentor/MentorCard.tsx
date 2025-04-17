import React, { FC } from "react";
import styles from "./MentorCard.module.scss";
import { MentorCardProps } from "../../types/types";

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <div className={styles.card}>
      <h3>{mentor.nickname}</h3>
      <p>기술 스택: {mentor.techStack.join(", ")}</p>
      <p>위치: {mentor.location}</p>
      {mentor.company && <p>회사: {mentor.company}</p>}
      <p>가격: {mentor.price.min}원 ~ {mentor.price.max}원</p>
    </div>
  );
};

export default MentorCard;