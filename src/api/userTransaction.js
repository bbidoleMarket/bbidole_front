import axios from "./axiosInstance";

export const UseTransactionListAPi = () => {
  //구매 내역
  const purchaseList = async (id, page, pageSize) => {
    return await axios.get(`/api/purchased-list/me/${id}`, {
      params: {
        page,
        pageSize,
      },
    });
  };
  //
  //   const purchaseList = async () => {
  //   return await axios.get("/api/purchased-list/me");
  //   //호출할 때 자동으로 Authorization 헤더에 토큰이 포함
  // };
  // 판매내역 최신순
  const salesListLatest = async (id, page, pageSize) => {
    return await axios.get(`/api/sales-list/me/latest/${id}`, {
      params: {
        page,
        pageSize,
      },
    });
  };
  //구매내역 판매중
  const salesListOnSales = async (id, page, pageSize) => {
    return await axios.get(`/api/sales-list/me/on/${id}`, {
      params: {
        page,
        pageSize,
      },
    });
  };
  //구매내역 판매 완료
  const salesListCompletedSales = async (id, page, pageSize) => {
    return await axios.get(`/api/sales-list/me/completed/${id}`, {
      params: {
        page,
        pageSize,
      },
    });
  };
  return {
    purchaseList,
    salesListLatest,
    salesListOnSales,
    salesListCompletedSales,
  };
};
