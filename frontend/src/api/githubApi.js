import API from "./axios";

export const syncGithubProfileApi = async (username, repositories) => {
  const response = await API.post("/github/profile", { username, repositories });
  return response.data;
};

export const getGithubProfileApi = async () => {
  const response = await API.get("/github/profile");
  return response.data;
};
