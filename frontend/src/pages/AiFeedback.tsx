import React, { useState, useEffect } from 'react';
import AiFeedbackForm from '../components/Home/AiFeedbackForm';
import AiFeedbackResult from '../components/Home/AiFeedbackResult';
import styles from './AiFeedback.module.scss';
import AiFeedbackNavbar from '../components/AiFeedback/AiFeedbackNavbar';
import FeedbackTypeModal from '../components/AiFeedback/FeedbackTypeModal';

const AiFeedbackPage: React.FC = () => {
  const [field, setField] = useState('');
  const [selfIntroText, setSelfIntroText] = useState(''); // ✅ DB에서 불러온 자기소개서 텍스트
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedFeedbackTypes, setSelectedFeedbackTypes] = useState<string[]>([]);
  const [otherFeedbackType, setOtherFeedbackType] = useState<string>('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // ✅ 자기소개서 자동 로딩 (백엔드 /feedback/load-intro 사용)
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("userInfo");
    const mem_id = storedUserInfo ? JSON.parse(storedUserInfo).id : null;
    if (!mem_id) return;

    fetch(`http://localhost:9000/feedback/load?mem_id=${mem_id}`)
      .then(res => res.json())
      .then(data => {
        setSelfIntroText(data.self_intro || '');
        console.log("✅ 불러온 자기소개서:", data.self_intro_text);
      })
      .catch(err => {
        console.error("❌ 자기소개서 불러오기 실패:", err);
      });
  }, []);

  const handleGenerateFeedback = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const storedUserInfo = sessionStorage.getItem("userInfo");
      const mem_id = storedUserInfo ? JSON.parse(storedUserInfo).id : "";

      formData.append("mem_id", mem_id);
      formData.append("field", field);
      formData.append("selected_feedback_types", selectedFeedbackTypes.join(', '));
      formData.append("other_feedback_type", otherFeedbackType);

      const response = await fetch("http://localhost:9000/feedback/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data.feedback);
    } catch (err) {
      console.error("피드백 요청 실패:", err);
      alert(`AI 피드백 요청 실패: ${err instanceof Error ? err.message : String(err)}`);
      setResult("피드백 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedbackModal = () => setIsFeedbackModalOpen(true);
  const handleCloseFeedbackModal = () => setIsFeedbackModalOpen(false);
  const handleSaveFeedbackTypes = (selectedTypes: string[], otherType: string) => {
    setSelectedFeedbackTypes(selectedTypes);
    setOtherFeedbackType(otherType);
    console.log("✅ 피드백 선택:", selectedTypes, "기타:", otherType);
  };

  return (
    <div className={styles.AiGuide}>
      <div className={styles.ai_guide_container}>
        <AiFeedbackNavbar />
        <div className={styles.ai_guide_right}>
          <div className={styles.ai_guide_right_wrapper}>
            <AiFeedbackForm
              field={field}
              onFieldChange={e => setField(e.target.value)}
              selectedFeedbackTypes={selectedFeedbackTypes}
              otherFeedbackType={otherFeedbackType}
              onOpenFeedbackModal={handleOpenFeedbackModal}
              onGenerateFeedback={handleGenerateFeedback}
            />
            <AiFeedbackResult result={result} loading={loading} />
          </div>
        </div>
      </div>

      <FeedbackTypeModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        onSave={handleSaveFeedbackTypes}
        initialSelectedTypes={selectedFeedbackTypes}
        initialOtherType={otherFeedbackType}
      />
    </div>
  );
};

export default AiFeedbackPage;
