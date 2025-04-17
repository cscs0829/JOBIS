// src/pages/InterviewStart.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InterviewStart = () => {
  const [formData, setFormData] = useState({
    persona: "",
    job: "",
    interviewType: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStart = async () => {
    try {
      const res = await axios.post("/interview/interview", formData);
      navigate("/interview", { state: { question: res.data.question } });
    } catch (err) {
      alert("면접 시작 실패!");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>원하시는 면접을 설정해보세요</h2>
      <input
        name="persona"
        placeholder="면접관 페르소나"
        onChange={handleChange}
      />
      <br />
      <input name="job" placeholder="직무" onChange={handleChange} />
      <br />
      <input
        name="interviewType"
        placeholder="면접 유형"
        onChange={handleChange}
      />
      <br />
      <button onClick={handleStart}>면접 시작</button>
    </div>
  );
};

export default InterviewStart;
