import React from "react";
import styles from "./MentorCard.module.scss";
import { MentorCardProps } from "../../types/types"; // props 타입 import 확인
import Button from "../Button/Button";

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  const handleSelect = () => {
    alert(`${mentor.nickname} 멘토 선택 (구현 필요)`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3>{mentor.nickname}</h3>
        <div className={styles.infoList}>
          <div className={styles.info}>
            <span className={styles.stack}>{mentor.techStack?.join(", ")}</span>
          </div>
          <div className={styles.info}>
            <span className={styles.experience}>{mentor.experience}</span>
          </div>
          <div className={styles.info}>
            <span className={styles.years}>{mentor.yearsExperience}</span>
          </div>
          <div className={styles.info}>
            <span className={styles.price}>{mentor.price.min.toLocaleString()}원~</span>
          </div>
        </div>
        <Button className={styles.selectBtn} onClick={handleSelect}>
          선택하기
        </Button>
      </div>
    </div>
  );
};

export default MentorCard;