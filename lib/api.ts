import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Configuración base de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_CRM_BASE_URL || "http://localhost:3000/api";

// Configuración por defecto de axios
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create(defaultConfig);

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (si existe)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Manejo de errores global
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
