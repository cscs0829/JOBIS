// src/pages/InterviewFeedback.tsx
import React, { useEffect, useState, FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./InterviewFeedback.module.scss";
import API_BASE_URL from "../constants/api";
import { InterviewFeedbackData } from "../types/types"; // 타입 import

// --- Chart.js 관련 import ---
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// --- Chart.js 등록 ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);
// --- Chart.js 설정 끝 ---

const InterviewFeedback: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] =
    useState<InterviewFeedbackData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("잘못된 접근입니다. 세션 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      console.log("sessionId:", sessionId);
      try {
        const response = await fetch(
          `${API_BASE_URL}/interview/${sessionId}/feedback`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: InterviewFeedbackData = await response.json();
        setFeedbackData(data);
      } catch (err) {
        console.error("피드백 데이터 로딩 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "피드백을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  // --- 차트 데이터 및 옵션 설정 ---
  const radarChartData = {
    labels: feedbackData ? Object.keys(feedbackData.scores) : [],
    datasets: [
      {
        label: "역량 점수",
        data: feedbackData ? Object.values(feedbackData.scores) : [],
        backgroundColor: "rgba(255, 149, 0, 0.2)", // 주황색 계열 (투명도)
        borderColor: "rgba(255, 149, 0, 1)", // 주황색 계열
        borderWidth: 1,
        pointBackgroundColor: "rgba(255, 149, 0, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 149, 0, 1)",
      },
    ],
  };

  const radarChartOptions = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { stepSize: 20 }, // 눈금 간격
      },
    },
    plugins: {
      legend: { display: false }, // 범례 숨김
      tooltip: {
        callbacks: {
          // 툴팁 내용 커스텀 (선택 사항)
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r + "점";
            }
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false, // 비율 유지 안 함 (크기 조절 용이)
  };

  const barChartData = {
    labels: feedbackData?.questionFeedbacks.map(
      (qf, index) => `질문 ${index + 1}`
    ),
    datasets: [
      {
        label: "질문별 점수",
        data: feedbackData?.questionFeedbacks.map((qf) => qf.score),
        backgroundColor: "rgba(255, 149, 0, 0.6)", // 주황색 계열
        borderColor: "rgba(255, 149, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    indexAxis: "y" as const, // 가로 막대 차트
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        // 차트 제목 (선택 사항)
        display: true,
        text: "질문별 답변 점수",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x + "점";
            }
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // --- 로딩 및 에러 처리 ---
  if (loading) {
    return <div className={styles.loading}>피드백을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!feedbackData) {
    return <div className={styles.error}>피드백 데이터가 없습니다.</div>;
  }

  return (
    <div className={styles.feedbackContainer}>
      <h1>AI 면접 피드백</h1>

      {/* --- 종합 점수 및 시각화 --- */}
      <section className={styles.overallSection}>
        <h2>종합 평가</h2>
        <div className={styles.chartsGrid}>
          <div className={styles.chartWrapper}>
            <h3>종합 역량 (Radar Chart)</h3>
            <div className={styles.chartArea}>
              <Radar data={radarChartData} options={radarChartOptions} />
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <h3>질문별 점수 (Bar Chart)</h3>
            <div className={styles.chartArea}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>
        <p className={styles.overallScoreText}>
          종합 점수: <strong>{feedbackData.overallScore}점</strong>
        </p>
      </section>

      {/* --- 질문별 피드백 --- */}
      <section className={styles.questionSection}>
        <h2>질문별 상세 피드백</h2>
        {feedbackData.questionFeedbacks.map((qf, index) => (
          <div key={index} className={styles.questionFeedbackItem}>
            <div className={styles.qaPair}>
              <p className={styles.question}>
                <strong>질문 {index + 1}:</strong> {qf.question}
              </p>
              <p className={styles.answer}>
                <strong>답변:</strong> {qf.answer}
              </p>
            </div>
            <div className={styles.feedbackScore}>
              <p className={styles.feedbackText}>{qf.feedback}</p>
              <p className={styles.score}>점수: {qf.score}/100</p>
            </div>
          </div>
        ))}
      </section>

      {/* --- 최종 코멘트 --- */}
      <section className={styles.finalFeedbackSection}>
        <h2>종합 코멘트</h2>
        <p>{feedbackData.finalFeedback}</p>
      </section>

      {/* --- 버튼 --- */}
      <div className={styles.buttonContainer}>
        <button onClick={() => navigate("/")}>홈으로</button>
        {/* 필요시 다른 버튼 추가 (예: 다시하기, 저장하기 등) */}
      </div>
    </div>
  );
};

export default InterviewFeedback;
