import axiosInstance from "./axiosInstance";

export const useMyPageApi = () => {
  const useInfoUpdate = async (id) => {
    return await async.post(`/api/users/${id}`, {
      nickname,
      password,
      passwordConfirm,
    });
  };
  const profileImageUpdate = async (id) => {
    return await async.post(`/api/users/${id}/profile-image`, {
      profileimage,
    });
  };
  return {
    useInfoUpdate,
    profileImageUpdate,
  };
};
