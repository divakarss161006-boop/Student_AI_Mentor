import API from "./axios";

export const getTasksApi = async () => {
  const response = await API.get("/tasks");
  return response.data;
};

export const createTaskApi = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

export const updateTaskApi = async (id, taskData) => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTaskApi = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};
