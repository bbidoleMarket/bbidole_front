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
      params: { chatId: chatId },
    });
  };

  const setReview = async (reviewData) => {
    return await axios.post(`api/chat/review`, reviewData);
  };

  return { getChatList, getChatMessages, setSold, setReview };
};
