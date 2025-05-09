import React from "react";
import styles from "./MentorCard.module.scss";
import { MentorCardProps } from "../../types/types";
import Button from "../Button/Button";

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  const handleSelect = () => {
    if (mentor.link) {
      window.open(mentor.link, "_blank");
    } else {
      alert("링크 정보가 없습니다.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3>{mentor.nickname}</h3>
        <div className={styles.infoList}>
          {mentor.techStack && mentor.techStack.length > 0 && (
            <div className={styles.info}>
              <span className={styles.stack}>{mentor.techStack.join(", ")}</span>
            </div>
          )}
          {mentor.experience && (
            <div className={styles.info}>
              <span className={styles.experience}>{mentor.experience}</span>
            </div>
          )}
          {mentor.yearsExperience && (
            <div className={styles.info}>
              <span className={styles.years}>{mentor.yearsExperience}</span>
            </div>
          )}
          {mentor.price?.min != null && mentor.price?.max != null && (
            <div className={styles.info}>
              <span className={styles.price}>
                {mentor.price.min.toLocaleString()}원 ~ {mentor.price.max.toLocaleString()}원
              </span>
            </div>
          )}
        </div>
        <Button className={styles.selectBtn} onClick={handleSelect}>
          선택하기
        </Button>
      </div>
    </div>
  );
};

export default MentorCard;
