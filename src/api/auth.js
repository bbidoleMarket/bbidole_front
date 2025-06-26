import axios from "./axiosInstance";
import { useAuthStore } from "../stores/auth";
import { tokenService } from "../services/tokenService";
import { clearTokens } from "../utils/tokenManager";

export const useAuthApi = () => {
  const authStore = useAuthStore();

  const signup = async ({ email, password, name, nickname }) => {
    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        name,
        nickname,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data.data;

      // 토큰들을 스토어에 저장
      authStore.login({
        accessToken,
        refreshToken,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = async () => {
    try {
      // 로그아웃 요청 시 리프레시 토큰도 함께 전송
      const refreshToken = authStore.refreshToken;
      const headers = {};

      if (refreshToken) {
        headers["Refresh-Token"] = refreshToken;
      }

      // 서버에 로그아웃 요청
      await axios.post("/api/auth/logout", {}, { headers });
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    } finally {
      // 로컬 토큰 정리 (직접 처리하여 순환 참조 방지)
      authStore.accessToken = null;
      authStore.refreshToken = null;
      clearTokens();
    }
  };

  // 토큰 재발급은 이제 중앙화된 서비스에서 처리
  const refreshTokens = async () => {
    try {
      return await tokenService.refreshToken();
    } catch (error) {
      authStore.logout();
      throw error;
    }
  };

  const checkEmailAvailable = async (email) => {
    try {
      const response = await axios.get(`/api/auth/check-email?email=${email}`);
      return response.data.result;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  return {
    signup,
    login,
    logout,
    refreshTokens,
    checkEmailAvailable,
  };
};

// useAuthApi만 export하여 순환 참조 방지
