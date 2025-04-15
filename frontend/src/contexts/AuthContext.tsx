// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface UserInfoType {
  nickname: string;
  id?: string;
  email?: string;
  username?: string;
}

interface SignupPayload {
  mem_id: string;
  mem_pw: string;
  mem_email: string;
  mem_nick: string;
  mem_gender: string;
  mem_birthdate: string;
  mem_addr: string;
  mem_phone: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (id: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  userInfo: UserInfoType | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  // ✅ 로그인 요청
  const login = async (id: string, password: string) => {
    try {
      const response = await fetch("http://localhost:9000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mem_id: id, mem_pw: password }),
      });

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      setUserInfo({
        nickname: data.mem_nick,
        id: data.mem_id,
        email: data.mem_email,
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    }
  };

  // ✅ 회원가입 요청 (전체 폼 데이터 받도록 수정됨!)
  const signup = async (payload: SignupPayload) => {
    try {
      const response = await fetch("http://localhost:9000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      const data = await response.json();
      setUserInfo({
        nickname: data.mem_nick,
        id: data.mem_id,
        email: data.mem_email,
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, signup, logout, userInfo, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
