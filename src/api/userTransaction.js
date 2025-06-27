import axios from "./axiosInstance";

export const UseTransactionListAPi = () => {
    //구매 내역
    const purchaseList = async (page, pageSize) => {
        return await axios.get("/api/purchased-list/me", {
            params: {
                page,
                pageSize,
            },
        });
    };

    // 판매내역 최신순
    const salesListLatest = async (page, pageSize) => {
        return await axios.get("/api/sales-list/me/latest", {
            params: {
                page,
                pageSize,
            },
        });
    };
    //판매내역 판매중
    const salesListOnSales = async (page, pageSize) => {
        return await axios.get("/api/sales-list/me/on", {
            params: {
                page,
                pageSize,
            },
        });
    };
    //판매내역 판매 완료
    const salesListCompletedSales = async (page, pageSize) => {
        return await axios.get("/api/sales-list/me/completed", {
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
