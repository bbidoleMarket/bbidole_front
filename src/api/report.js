import axios from "./axiosInstance";

export const useReportApi = () => {
  const userReportList = async () => {
    return await axios.get("/api/admin/report/userlist");
  };
  const userReportDetail = async (reportId) => {
    return await axios.get(`/api/admin/report/userlist-detail/${reportId}`);
  };
  const updateUserReport = async (reportId, newStatus) => {
    return await axios.put(
      `/api/admin/report/user-status/${reportId}/status`,
      null,
      {
        params: {
          status: newStatus,
        },
      }
    );
  };
  const postReportList = async () => {
    return await axios.get("/api/admin/report/postlist");
  };
  const postReportDetail = async (reportId) => {
    return await axios.get(`/api/admin/report/postlist-detail/${reportId}`);
  };
  const updatePostReport = async (reportId, newStatus) => {
    return await axios.put(
      `/api/admin/report/post-status/${reportId}/status`,
      null,
      {
        params: {
          status: newStatus,
        },
      }
    );
  };
  return {
    userReportList,
    userReportDetail,
    updateUserReport,
    postReportList,
    postReportDetail,
    updatePostReport,
  };
};
