// src/App.tsx
import React, { createContext, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

import Interview from "./pages/Interview";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AiJasoseo from "./pages/AiJasoseo";
import AiFeedback from './pages/AiFeedback';
import CompanyRecommendation from "./pages/CompanyRecommendation"; 
import MentorRecommendation from "./pages/MentorRecommendation"; 
import UserInfoEdit from './pages/UserInfoEdit';
import UserFileEdit from './pages/UserFileEdit';
import { NameJobContext } from "./types/types";
import { AuthProvider } from "./contexts/AuthContext";

export const nameJobContext = createContext<NameJobContext | undefined>(
  undefined
);

function App() {
  const [name, setName] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [interviewType, setInterviewType] = useState<string>("");
  const [mem_id, setMemId] = useState<string>(() => {
    return localStorage.getItem("mem_id") || "";
  });

  return (
    <AuthProvider>
      <nameJobContext.Provider
        value={{
          name,
          setName,
          job,
          setJob,
          interviewType,
          setInterviewType,
          mem_id,
          setMemId,
        }}
      >
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/ai-jasoseo" element={<AiJasoseo />} />
            <Route path="/ai-feedback" element={<AiFeedback />} />
            <Route
              path="/company-recommendation"
              element={<CompanyRecommendation />}
            />
            <Route
              path="/mentor-recommendation"
              element={<MentorRecommendation />}
            />
            <Route path="/user-info-edit" element={<UserInfoEdit />} />
            <Route path="/user-file-edit" element={<UserFileEdit />} />
          </Routes>
        </HashRouter>
      </nameJobContext.Provider>
    </AuthProvider>
  );
}

export default App;