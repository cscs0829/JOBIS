// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

  // ✅ 새로고침 시 sessionStorage에 저장된 로그인 정보 복원
  useEffect(() => {
    const storedUser = sessionStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

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
      sessionStorage.setItem("login_id", data.mem_id); 
      sessionStorage.setItem("userInfo", JSON.stringify(data)); // ✅ 전체 유저 정보 저장
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
      const user: UserInfoType = {
        nickname: data.mem_nick,
        id: data.mem_id,
        email: data.mem_email,
      };

      setUserInfo(user);
      setIsLoggedIn(true);
      sessionStorage.setItem("login_id", data.mem_id);
      sessionStorage.setItem("userInfo", JSON.stringify(user)); // ✅ 저장
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("login_id"); // 세션 스토리지에서 로그인 ID 제거
    sessionStorage.removeItem("userInfo"); // ✅ 유저 정보도 삭제
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
