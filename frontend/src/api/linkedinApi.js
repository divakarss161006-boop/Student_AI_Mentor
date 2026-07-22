import API from "./axios";

export const generateLinkedinPostApi = async (postData) => {
  const response = await API.post("/linkedin/generate", postData);
  return response.data;
};

export const getLinkedinPostsApi = async () => {
  const response = await API.get("/linkedin/posts");
  return response.data;
};
