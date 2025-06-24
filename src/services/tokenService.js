import axios from 'axios';
import { setTokens, getTokens, clearTokens, isTokenExpired } from '../utils/tokenManager';

class TokenService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
    this.baseURL = 'http://localhost:8080';
  }

  // 대기 중인 요청들을 처리하는 함수
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // 토큰 재발급 (중앙화된 로직)
  async refreshToken() {
    const { refreshToken } = getTokens();
    
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    if (isTokenExpired(refreshToken)) {
      throw new Error('리프레시 토큰이 만료되었습니다.');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/api/auth/refresh`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      // 새로운 토큰들을 저장
      setTokens(accessToken, newRefreshToken);
      
      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      // 토큰 갱신 실패 시 모든 토큰 제거
      clearTokens();
      throw error;
    }
  }

  // 토큰 재발급 with 큐 관리 (axios 인터셉터용)
  async refreshTokenWithQueue() {
    // 이미 토큰 갱신 중인 경우
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const tokens = await this.refreshToken();
      
      // 대기 중인 요청들 처리
      this.processQueue(null, tokens.accessToken);
      
      return tokens;
    } catch (error) {
      // 토큰 갱신 실패 시
      this.processQueue(error, null);
      
      // 로그인 페이지로 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // 토큰 유효성 검사 및 자동 갱신
  async ensureValidToken() {
    const { accessToken, refreshToken } = getTokens();
    
    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다.');
    }

    // 액세스 토큰이 유효한 경우
    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }

    // 액세스 토큰이 만료된 경우 리프레시 토큰으로 갱신
    if (refreshToken && !isTokenExpired(refreshToken)) {
      const tokens = await this.refreshToken();
      return tokens.accessToken;
    }

    // 모든 토큰이 만료된 경우
    throw new Error('모든 토큰이 만료되었습니다.');
  }
}

// 싱글톤 인스턴스 생성
export const tokenService = new TokenService(); 