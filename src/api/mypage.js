import axios from "./axiosInstance";

export const useMyPageApi = () => {
  const useInfoUpdate = async (nickname, password, passwordConfirm, email) => {
    return await axios.put("/api/mypage/update", {
      nickname,
      password,
      passwordConfirm,
      email, // 토큰 검증 전 이메일로 사용자 확인
    });
  };
  const profileImageUpdate = async (file, email) => {
    const formData = new FormData();
    formData.append("image", file); // ← 서버 파라미터명과 일치!
    formData.append("email", email);

    return await axios.put("/api/mypage/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const profileInfo = async (email) => {
    console.log("보내는값", email);
    return await axios.get("api/mypage/info-update", {
      params: { email }, // 토큰 검증 전 이메일로 사용자 확인
    });
  };
  return {
    useInfoUpdate,
    profileImageUpdate,
    profileInfo,
  };
};
