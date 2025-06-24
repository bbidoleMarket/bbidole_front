import axios from "axios";
import { tokenService } from "../services/tokenService";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 아직 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 중앙화된 토큰 서비스 사용
                const tokens = await tokenService.refreshTokenWithQueue();
                
                // 원래 요청에 새 토큰을 추가하여 재시도
                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                return axiosInstance(originalRequest);
                
            } catch (refreshError) {
                // 토큰 갱신 실패 시 에러 반환
                return Promise.reject(refreshError);
            }
        }

        // 다른 에러의 경우 그대로 반환
        return Promise.reject(error);
    }
);

export default axiosInstance;
