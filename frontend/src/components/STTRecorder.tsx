import React, { useState, useRef, useEffect } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";
import API_BASE_URL from "../constants/api";

interface STTRecorderProps {
  onTranscribed: (text: string) => void;
  trigger?: boolean;
}

const STTRecorder: React.FC<STTRecorderProps> = ({
  onTranscribed,
  trigger,
}) => {
  useEffect(() => {
    if (!trigger) return;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          const formData = new FormData();
          formData.append("audio", blob, "recording.wav");

          try {
            const response = await fetch(`${API_BASE_URL}/stt`, {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            console.log("Whisper 응답:", data.text);
            onTranscribed(data.text);
          } catch (error) {
            console.error("STT 요청 실패:", error);
          }
        };

        // 녹음 시작 후 일정 시간 뒤 자동 종료
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 30000); // 30초간 녹음
      } catch (error) {
        console.log("마이크 접근 실패:", error);
      }
    };

    startRecording();
  }, [trigger, onTranscribed]);

  return null; // 버튼 없이 동작하므로 렌더링할 UI 없음
};

export default STTRecorder;
