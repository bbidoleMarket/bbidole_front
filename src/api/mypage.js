import axios from "./axiosInstance";

export const useMyPageApi = () => {
  const useInfoUpdate = async ({ nickname, password, passwordConfirm }) => {
    return await axios.put("/api/mypage/update", {
      nickname,
      password,
      passwordConfirm,
      email, // 토큰 검증 전 이메일로 사용자 확인
    });
  };
  const profileImageUpdate = async () => {
    return await axios.put("api/mypage/profileimage", {
      profileimage,
      email, // 토큰 검증 전 이메일로 사용자 확인
    });
  };
  const profileName = async () => {
    return await axios.get("api/mypage/name");
  };
  return {
    useInfoUpdate,
    profileImageUpdate,
    profileName,
  };
};
