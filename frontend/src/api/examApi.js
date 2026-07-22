import API from "./axios";

export const getExamsApi = async () => {
  const response = await API.get("/exams");
  return response.data;
};

export const createExamApi = async (examData) => {
  const response = await API.post("/exams", examData);
  return response.data;
};

export const updateExamApi = async (id, examData) => {
  const response = await API.put(`/exams/${id}`, examData);
  return response.data;
};

export const deleteExamApi = async (id) => {
  const response = await API.delete(`/exams/${id}`);
  return response.data;
};
