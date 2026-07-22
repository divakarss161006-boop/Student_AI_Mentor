import API from "./axios";

export const analyzeLmsDataApi = async (fileName, subjects) => {
  const response = await API.post("/lms/analyze", { fileName, subjects });
  return response.data;
};

export const getLmsRecordsApi = async () => {
  const response = await API.get("/lms/records");
  return response.data;
};
