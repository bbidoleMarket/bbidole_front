import axios from "./axiosInstance";

export const useAdminApi = () => {
    const totalSub = async () => {
        try {
            const response = await axios.get("/api/admin/totalSub");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const totalProduct = async () => {
        try {
            const response = await axios.get("/api/admin/totalProduct");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const totalCompleted = async () => {
        try {
            const response = await axios.get("/api/admin/totalCompleted");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const isCompReport = async () => {
        try {
            const response = await axios.get("/api/admin/isCompReport");
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const unCompReport = async () => {
        try {
            const response = await axios.get("/api/admin/UnCompReport");
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const findAllUser = async () => {
        try {
            const response = await axios.get("/api/admin/findAllUser");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const findAllProduct = async () => {
        try {
            const response = await axios.get("/api/admin/findAllProduct");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const controlIsActive = async (id, isActive) => {
        try {
            const response = await axios.post("/api/admin/controlIsActive", {
                id,
                isActive,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await axios.post("/api/admin/deleteProduct", {
                id,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const recentUser = async () => {
        try {
            const response = await axios.get("/api/admin/recentUser");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const recentProduct = async () => {
        try {
            const response = await axios.get("/api/admin/recentProduct");
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    return {
        totalSub,
        totalProduct,
        totalCompleted,
        isCompReport,
        unCompReport,
        findAllUser,
        findAllProduct,
        controlIsActive,
        deleteProduct,
        recentUser,
        recentProduct,
    };
};
