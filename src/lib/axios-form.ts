// lib/axios-form.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://service-app-production-a205.up.railway.app/api/v1";

// Axios khusus form-data
const axiosForm: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Inject token untuk semua request
axiosForm.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[FORM AXIOS REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// Response handler
axiosForm.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("[FORM AXIOS RESPONSE ERROR]", error);

    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosForm;
