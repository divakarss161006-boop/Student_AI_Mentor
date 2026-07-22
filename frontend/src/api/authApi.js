import API from "./axios";

export const registerApi = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};
