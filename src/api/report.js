import axios from "@/api/axiosInstance";

export const useReportApi = () => {
  const report = async (reportee, type, content) => {
    console.log(type);
    return await axios.post(`/api/report/`, {
      id: reportee,
      type: type,
      content: content,
    });
  };

  return { report };
};
