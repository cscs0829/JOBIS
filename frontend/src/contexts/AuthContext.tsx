import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API_BASE_URL from "../constants/api";

interface UserInfoType {
  nickname: string;
  id?: string;
  email?: string;
  phone?: string;
  addr?: string;
  gender?: string; // 성별 등 필요시 추가
  birthdate?: string; // 생년월일 등 필요시 추가
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

// ✅ 회원 정보 수정 요청 페이로드 타입 (백엔드 UserUpdateRequest 모델 반영)
interface UserUpdatePayload {
  mem_pw?: string; // 새 비밀번호 (선택적)
  mem_email: string;
  mem_nick: string;
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
  // ✅ updateUserInfo 파라미터 수정: mem_id는 외부에서 받고 payload만 전달
  updateUserInfo: (mem_id: string, payload: UserUpdatePayload) => Promise<void>;
  // ✅ 중복 확인 함수 추가 (선택적 - 컨텍스트에서 관리할 경우)
  checkDuplicate: (type: 'id' | 'email' | 'nickname', value: string) => Promise<{ available: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("세션 스토리지 사용자 정보 파싱 오류:", error);
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("login_id");
      }
    }
  }, []);

  const login = async (id: string, password: string) => {
    // ... (기존 로그인 로직 - API 경로 확인) ...
     try {
       const response = await fetch(`${API_BASE_URL}/user/login`, { // 경로 확인
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ mem_id: id, mem_pw: password }),
       });
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.detail || "로그인 실패");
       }
       const data = await response.json();
       const currentUserInfo: UserInfoType = {
         nickname: data.mem_nick,
         id: data.mem_id,
         email: data.mem_email,
         // 백엔드 응답에 따라 phone, addr 등 추가
       };
       setUserInfo(currentUserInfo);
       sessionStorage.setItem("userInfo", JSON.stringify(currentUserInfo));
       sessionStorage.setItem("login_id", data.mem_id);
       setIsLoggedIn(true);
     } catch (error) {
       console.error("로그인 실패:", error);
       throw error;
     }
  };

  const signup = async (payload: SignupPayload) => {
    // ... (기존 회원가입 로직 - API 경로 확인) ...
     try {
       const response = await fetch(`${API_BASE_URL}/user/signup`, { // 경로 확인
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.detail || "회원가입 실패");
       }
       const data = await response.json();
       const user: UserInfoType = {
         nickname: data.mem_nick,
         id: data.mem_id,
         email: data.mem_email,
       };
       setUserInfo(user);
       setIsLoggedIn(true);
       sessionStorage.setItem("userInfo", JSON.stringify(user));
       sessionStorage.setItem("login_id", data.mem_id);
     } catch (error) {
       console.error("회원가입 실패:", error);
       throw error;
     }
  };

  const logout = () => {
    // ... (기존 로그아웃 로직) ...
     sessionStorage.removeItem("userInfo");
     sessionStorage.removeItem("login_id");
     sessionStorage.removeItem("uploadedFileNames"); // ✅ 파일명도 함께 제거
     setIsLoggedIn(false);
     setUserInfo(null);
  };

  // ✅ 회원 정보 수정 요청 함수 (mem_id 파라미터 추가, API 엔드포인트/메서드 수정)
  const updateUserInfo = async (mem_id: string, payload: UserUpdatePayload) => {
    if (!isLoggedIn) {
       throw new Error("로그인이 필요합니다.");
    }
    // 비밀번호 필드가 비어있으면 payload에서 제거 (백엔드에서 None 처리하지만 명시적 제거도 가능)
    const finalPayload = { ...payload };
    if (!finalPayload.mem_pw) {
      delete finalPayload.mem_pw;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/update/${mem_id}`, { // 경로 및 메서드 수정
        method: "PUT", // PUT 메서드 사용
        headers: {
          "Content-Type": "application/json",
          // 필요시 인증 토큰 추가
        },
        body: JSON.stringify(finalPayload), // 비밀번호 제외 가능성 있는 payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "회원 정보 수정 실패");
      }

      // 수정 성공 시 로컬 상태 및 세션 스토리지 업데이트
      const updatedUserInfo: UserInfoType = {
         ...userInfo!, // 기존 정보 non-null 단언
         id: mem_id, // id는 확실히 있어야 함
         nickname: payload.mem_nick,
         email: payload.mem_email,
         phone: payload.mem_phone,
         addr: payload.mem_addr,
         // 비밀번호는 저장하지 않음
      };
      setUserInfo(updatedUserInfo);
      sessionStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      console.log("회원 정보 수정 성공");
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      throw error;
    }
  };

  // ✅ 중복 확인 API 호출 함수 추가
  const checkDuplicate = async (type: 'id' | 'email' | 'nickname', value: string) => {
      if (!value) {
          return { available: false, message: "값을 입력해주세요." };
      }
      try {
          const encodedValue = encodeURIComponent(value); // URL 인코딩
          const response = await fetch(`${API_BASE_URL}/user/check-${type}/${encodedValue}`);

          if (response.ok) { // 200 OK (사용 가능)
              const data = await response.json();
              return { available: true, message: data.message };
          } else if (response.status === 409) { // 409 Conflict (중복)
              const errorData = await response.json();
              return { available: false, message: errorData.detail };
          } else { // 그 외 오류
              throw new Error(`서버 오류: ${response.status}`);
          }
      } catch (error) {
          console.error(`${type} 중복 확인 실패:`, error);
          return { available: false, message: "중복 확인 중 오류가 발생했습니다." };
      }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        signup,
        logout,
        userInfo,
        setUserInfo,
        updateUserInfo,
        checkDuplicate, // ✅ context value에 추가
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};