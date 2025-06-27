import axios from "axios";
import { tokenService } from "../services/tokenService";

const axiosInstance = axios.create({
  baseURL: "https://llinksy.loca.lt",
    headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  //baseURL: import.meta.env.SERVER_URL,
  //withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

    const status = error.response?.status;

    // 여기에 에러 상태 코드에 따른 처리 로직을 추가할 수 있습니다.
    // if (status === 401) {
    //   // UNAUTHORIZED
    //   alert("로그인이 필요합니다.");
    //   router.push("/login"); // SPA 방식으로 이동
    // } else if (status === 403) {
    //   // FORBIDDEN
    //   alert("접근 권한이 없습니다.");
    // } else if (status == 404) {
    //   // NOT FOUND
    //   alert("요청한 리소스를 찾을 수 없습니다.");
    // } else if (status === 500) {
    //   // INTERNAL SERVER ERROR
    //   alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    // } else {
    //   alert(error.response?.data?.message || "알 수 없는 오류 발생");
    // }

    // 다른 에러의 경우 그대로 반환
    return Promise.reject(error);
  }
);

export default axiosInstance;
