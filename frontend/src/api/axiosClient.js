import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Do not force a hard window.location.href reload to avoid sudden page flashing or disappearance
      localStorage.removeItem("token");
      console.warn("401 Unauthorized received for request:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
