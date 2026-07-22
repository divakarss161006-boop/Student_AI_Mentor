import API from "./axios";

export const analyzePerformanceApi = async (studentData) => {
  const response = await API.post("/ai/performance", { studentData });
  return response.data;
};

export const generateStudyPlanApi = async (studentData) => {
  const response = await API.post("/ai/study-plan", { studentData });
  return response.data;
};

export const mentorChatApi = async (studentData, question) => {
  const response = await API.post("/ai/mentor", { studentData, question });
  return response.data;
};

export const analyzeResumeApi = async (resumeText) => {
  const response = await API.post("/ai/resume", { resumeText });
  return response.data;
};

export const uploadResumePdfApi = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await API.post("/ai/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
