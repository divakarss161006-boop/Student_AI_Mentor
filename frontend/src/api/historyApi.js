import API from "./axios";

export const saveAnalysisApi = async (type, title, data) => {
  const response = await API.post("/history", { type, title, data });
  return response.data;
};

export const getHistoryApi = async () => {
  const response = await API.get("/history");
  return response.data;
};

export const getLatestByTypeApi = async (type) => {
  const response = await API.get(`/history/latest/${type}`);
  return response.data;
};

export const deleteHistoryItemApi = async (id) => {
  const response = await API.delete(`/history/${id}`);
  return response.data;
};
