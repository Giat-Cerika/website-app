// lib/axios.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://service-app-production-a205.up.railway.app/api/v1";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/auth/login";
    }

    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    if (error.response?.status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
