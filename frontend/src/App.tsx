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

import { NameJobContext } from "./types/types";
import { AuthProvider } from "./contexts/AuthContext";

export const nameJobContext = createContext<NameJobContext | undefined>(
  undefined
);

function App() {
  const [name, setName] = useState<string>("");
  const [job, setJob] = useState<string>("");

  return (
    <AuthProvider>
      <nameJobContext.Provider value={{ name, setName, job, setJob }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/interview/:selectedMode" element={<Interview />} />
            <Route path="/ai-jasoseo" element={<AiJasoseo />} />
            <Route path="/ai-guide" element={<AiGuide />} />
            <Route path="/useredit" element={<UserEdit />} />  {/* UserEdit 라우팅 추가 */}
          </Routes>
        </HashRouter>
      </nameJobContext.Provider>
    </AuthProvider>
  );
}

export default App;