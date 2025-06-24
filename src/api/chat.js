import axios from "./axiosInstance";

export const useChatApi = () => {
  const getChatList = async () => {
    return await axios.get("api/chat/list");
  };

  return { getChatList };
};
