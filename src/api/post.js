import axios from "@/api/axiosInstance";

export const useUserApi = () => {
  // 사용자의 상세 정보 요청
  const getUserDetail = async (sellerId) => {
    return await axios.get(`/api/user/seller/${sellerId}}`);
    /*
           try {
                const res = await axios.get(`/api/user/seller/${sellerId}`);
                return res.data;
            } catch (error) {
                console.error("판매자 정보 요청 실패:", error);
                throw error; // 호출부에서 처리할 수 있게 throw
            }
        */
  };

  return { getUserDetail };
};

export const usePostApi = () => {
  // 게시글 상세 정보 요청
  const getPostDetail = async (postId) => {
    return await axios.get(`/api/post/${postId}`);
  };

  // 게시글 수정 요청
  const updatePost = async (
    postId,
    postId,
    title,
    description,
    price,
    userId,
    image // File 객체
  ) => {
    const formData = new FormData();
    if (image.value) {
      formData.append("image", image.value); // 이미지 파일 추가
    }

    const dto = {
      postId: postId,
      title: title,
      description: description,
      price: price,
      userId: userId,
    };
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    // formData.append("dto", JSON.stringify(dto));
    return await axios.put(`/api/post/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const getPostListByPage = async (userId, page, size) => {
    return await axios.get(
      `/api/post/seller/${userId}?page=${page}&size=${size}`
    );
  };

  return { getPostDetail, updatePost, getPostListByPage };
};

export const useReviewApi = () => {
  const getReviewListByPage = async (userId, page, size) => {
    return await axios.get(`/api/review/${userId}?page=${page}&size=${size}`);
  };

  return { getReviewListByPage };
};

export const useChatRoomApi = () => {
  const startChat = async (productId, sellerId, buyerId) => {
    return await axios.post(`/api/chat-room/`, {
      productId: productId,
      sellerId: sellerId,
      buyerId: buyerId,
    });
  };
  return { startChat };
};
