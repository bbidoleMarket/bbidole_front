import axios from "./axiosInstance";

export const useChatApi = () => {
  const getChatList = async () => {
    return await axios.get("api/chat/list");
  };

  const getChatMessages = async (chatId) => {
    return await axios.get(`api/chat/${chatId}`);
  };

  const setSold = async (chatId) => {
    return await axios.patch(`api/chat/sold`, null, {
      params: { id: chatId },
    });
  };

  return { getChatList, getChatMessages, setSold };
};
