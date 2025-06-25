import axios from "./axiosInstance";

export const UseTransactionList = () => {
  //구매 내역
  const purchaseList = async (id) => {
    return await axios.get(`/api/purchased-list/me/${id}`);
  };
  // 판매내역 최신순
  const salesListLatest = async (id) => {
    return await axios.get(`/api/sales-list/me/latest/${id}`);
  };
  //구매내역 판매중
  const salesListOnSales = async (id) => {
    return await axios.get(`/get/sales-list/me/on/${id}`);
  };
  //구매내역 판매 완료
  const salesListCompletedSales = async (id) => {
    return await axios.get(`/get/sales-list/me/completed/${id}`);
  };
  return {
    purchaseList,
    salesListLatest,
    salesListOnSales,
    salesListCompletedSales,
  };
};
