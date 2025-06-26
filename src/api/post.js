import axios from "@/api/axiosInstance";

export const useUserApi = () => {
  /**
   * 판매자의 상세 정보 요청
   * @param {path} sellerId
   * @returns {
   *    long userId;
   *    String nickname;
   *    String imageUrl;
   *    String imageUrl;
   * }
   */
  const getUserDetail = async (sellerId) => {
    return await axios.get(`/api/user/detail/${sellerId}`);
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

  /**
   * 내 상세 정보 요청
   * @returns
   */
  const getMyDetail = async () => {
    // return await axios.get(`/api/user/detail/1`); // Test용
    return await axios.get(`/api/user/detail`); // 실제 API 경로
  };

  return { getUserDetail, getMyDetail };
};

export const usePostApi = () => {
  /**
   * 게시글 상세 정보 요청
   * @param {path} postId
   * @returns {
   *    long postId;
   *    String title;
   *    int price;
   *    String description;
   *    String imageUrl;
   *
   *    long writerId;
   *    String writerNickname;
   *    String writerImageUrl;
   *    Double writerTotalRating;
   * }
   */
  const getPostDetail = async (postId) => {
    return await axios.get(`/api/post/${postId}`);
  };

  /**
   * 게시글 수정 요청
   * @param {body} postId
   * @param {body} title
   * @param {body} description
   * @param {body} price
   * @param {body} userId
   * @param {body} image
   * @returns
   */
  const updatePost = async (
    postId,
    title,
    description,
    price,
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

  /**
   * 판매자가 작성한 게시글 목록 요청(Pagenation)
   * @param {path} userId
   * @param {query} page
   * @param {query} size
   * @returns {
   *    List<T> content;      // 현재 페이지의 데이터 리스트
   *    int pageNumber;       // 현재 페이지 위치
   *    int pageSize;         // 각 페이지 크기
   *    int totalPages;       // 전페 페이지 수
   *    Long totalElements;   // 전체 데이터 수
   *    boolean last;         // 마지막 페이지인지
   * }
   *
   * content: {
   *    long id;
   *    String title;
   *    int price;
   *    String imageUrl;
   * }
   */
  const getPostListByPage = async (userId, page, size) => {
    const params = new URLSearchParams();
    if (page !== undefined) {
      params.append("page", page);
    }
    if (size !== undefined) {
      params.append("size", size);
    }
    if (page === undefined && size === undefined) {
      return await axios.get(`/api/post/seller/${userId}`);
    }
    return await axios.get(`/api/post/seller/${userId}?${params.toString()}`);
  };

  /**
   * 사용자가 작성한 게시글 목록 요청(Pagenation)
   */
  const getMyPostListByPage = async (page, size) => {
    const params = new URLSearchParams();
    if (page !== undefined) {
      params.append("page", page);
    }
    if (size !== undefined) {
      params.append("size", size);
    }

    if (page === undefined && size === undefined) {
      return await axios.get(`/api/post/seller`);
    }
    return await axios.get(`/api/post/seller?${params.toString()}`); // 실제 API 경로
    // return await axios.get(`/api/post/seller/1?${params.toString()}`); // Test용
  };

  return { getPostDetail, updatePost, getPostListByPage, getMyPostListByPage };
};

export const useReviewApi = () => {
  /**
   * 판매자에게 작성된 리뷰 목록 요청(Pagenation)
   * @param {path} userId
   * @param {query} page
   * @param {query} size
   * @returns {
   *    List<T> content;      // 현재 페이지의 데이터 리스트
   *    int pageNumber;       // 현재 페이지 위치
   *    int pageSize;         // 각 페이지 크기
   *    int totalPages;       // 전페 페이지 수
   *    Long totalElements;   // 전체 데이터 수
   *    boolean last;         // 마지막 페이지인지
   * }
   *
   * content: {
   *    String writerNickname;
   *    String content;
   *    int rating;
   * }
   */
  const getReviewListByPage = async (userId, page, size) => {
    const params = new URLSearchParams();
    if (page !== undefined) {
      params.append("page", page);
    }
    if (size !== undefined) {
      params.append("size", size);
    }
    if (page === undefined && size === undefined) {
      return await axios.get(`/api/review/${userId}`);
    }
    return await axios.get(`/api/review/${userId}?${params.toString()}`);
  };

  /**
   * 내에게 작성된 리뷰 목록 요청(Pagenation)
   */
  const getMyReviewListByPage = async (page, size) => {
    const params = new URLSearchParams();
    if (page !== undefined) {
      params.append("page", page);
    }
    if (size !== undefined) {
      params.append("size", size);
    }
    // return await axios.get(`/api/review/1?${params.toString()}`);
    if (page === undefined && size === undefined) {
      return await axios.get(`/api/review`);
    }
    return await axios.get(`/api/review?${params.toString()}`); // 실제 API 경로
  };

  return { getReviewListByPage, getMyReviewListByPage };
};

export const useChatRoomApi = () => {
  /**
   * 채팅방 시작 요청
   * @param {body} productId
   * @param {body} sellerId
   * @param {body} buyerId
   * @returns {
   *   long chatRoomId;
   * }
   */
  const startChat = async (productId) => {
    return await axios.post(`/api/chat/start`, {
      postId: productId,
    });
  };
  return { startChat };
};
