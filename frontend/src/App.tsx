// src/App.tsx
import React, { createContext, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

import Interview from "./pages/Interview";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AiJasoseo from "./pages/AiJasoseo";
import AiGuide from "./pages/AiGuide";
import UserEdit from "./pages/UserEdit";
import CompanyRecommendation from "./pages/CompanyRecommendation"; 
import MentorRecommendation from "./pages/MentorRecommendation"; 

import { NameJobContext } from "./types/types";
import { AuthProvider } from "./contexts/AuthContext";

export const nameJobContext = createContext<NameJobContext | undefined>(
  undefined
);

function App() {
  const [name, setName] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [interviewType, setInterviewType] = useState<string>("");

  return (
    <AuthProvider>
      <nameJobContext.Provider
        value={{ name, setName, job, setJob, interviewType, setInterviewType }}
      >
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/ai-jasoseo" element={<AiJasoseo />} />
            <Route path="/ai-guide" element={<AiGuide />} />
            <Route path="/useredit" element={<UserEdit />} />
            <Route path="/company-recommendation" element={<CompanyRecommendation />} />
            <Route path="/mentor-recommendation" element={<MentorRecommendation />} />
          </Routes>
        </HashRouter>
      </nameJobContext.Provider>
    </AuthProvider>
  );
}

export default App;