import axios from "./axiosInstance";

export const useMyPageApi = () => {
    const useInfoUpdate = async (nickname, password, passwordConfirm) => {
        return await axios.put("/api/mypage/update", {
            nickname,
            password,
            passwordConfirm,
        });
    };

    const profileImageUpdate = async (file) => {
        const formData = new FormData();
        formData.append("image", file); // ← 서버 파라미터명과 일치!

        return await axios.put("/api/mypage/profile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    const profileInfo = async () => {
        return await axios.get("api/mypage/info-update");
    };
    return {
        useInfoUpdate,
        profileImageUpdate,
        profileInfo,
    };
};
