import API from "./axios";

export const searchLiveInternshipsApi = async (searchData) => {
  const response = await API.post("/internships/search", searchData);
  return response.data;
};

export const generateInternshipGuidanceApi = async (data) => {
  const response = await API.post("/internships/guidance", data);
  return response.data;
};

export const getInternshipRecordsApi = async () => {
  const response = await API.get("/internships/guidance");
  return response.data;
};
