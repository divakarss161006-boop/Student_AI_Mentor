import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token from localStorage
API.interceptors.request.use(
  (config) => {
    const storedToken =
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("user") || "null")?.token;

    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract Error Messages & Handle 401 Expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected server error occurred";

    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid: Clear session & redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        message = "Session expired or unauthorized. Please log in again.";

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          window.location.href = "/login";
        }
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
    } else if (error.message === "Network Error") {
      message = `Network Error: Unable to connect to backend server at ${baseURL}. Please verify server status.`;
    } else if (error.message) {
      message = error.message;
    }

    const customError = new Error(message);
    customError.status = error.response?.status || 500;
    customError.data = error.response?.data || null;

    return Promise.reject(customError);
  }
);

export default API;
