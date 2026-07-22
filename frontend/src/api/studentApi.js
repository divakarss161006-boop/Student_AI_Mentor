import API from "./axios";

export const getStudentProfileApi = async () => {
  const response = await API.get("/students/profile");
  return response.data;
};

export const upsertStudentProfileApi = async (profileData) => {
  const response = await API.post("/students/profile", profileData);
  return response.data;
};

export const updateStudentProfileApi = async (profileData) => {
  const response = await API.put("/students/profile", profileData);
  return response.data;
};

export const deleteStudentProfileApi = async () => {
  const response = await API.delete("/students/profile");
  return response.data;
};

export const getAllStudentsApi = async () => {
  const response = await API.get("/students");
  return response.data;
};
