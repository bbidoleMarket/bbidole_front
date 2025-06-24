import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  //baseURL: import.meta.env.SERVER_URL,
  //withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // UNAUTHORIZED
      alert("로그인이 필요합니다.");
      router.push("/login"); // SPA 방식으로 이동
    } else if (status === 403) {
      // FORBIDDEN
      alert("접근 권한이 없습니다.");
    } else if (status == 404) {
      // NOT FOUND
      alert("요청한 리소스를 찾을 수 없습니다.");
    } else if (status === 500) {
      // INTERNAL SERVER ERROR
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      alert(error.response?.data?.message || "알 수 없는 오류 발생");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
