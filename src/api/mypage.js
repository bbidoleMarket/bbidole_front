import axiosInstance from "./axiosInstance";

export const useMyPageApi = () => {
  const useInfoUpdate = async (id) => {
    return await async.post(`/api/users/${id}`, {
      nickname,
      password,
      passwordConfirm,
    });
  };
  return {
    useInfoUpdate,
  };
};
