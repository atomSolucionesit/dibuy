import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Configuración base de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_CRM_BASE_URL || "http://localhost:3001/api";

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
    const companyToken = process.env.NEXT_PUBLIC_COMPANY_TOKEN;

    // Para rutas de email, usar siempre el token de la empresa
    if (config.url?.includes("/email/")) {
      if (companyToken) {
        config.headers.Authorization = `Bearer ${companyToken}`;
      }
      // Para contacto público, agregar header especial
      if (config.url?.includes("/email/contact")) {
        config.headers["X-Public-Contact"] = "true";
      }
    } else {
      // Para otras rutas, usar token de usuario si existe, sino token de empresa
      if (typeof window !== "undefined") {
        const userToken = localStorage.getItem("authToken");
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
        } else if (companyToken) {
          config.headers.Authorization = `Bearer ${companyToken}`;
        }
      } else if (companyToken) {
        config.headers.Authorization = `Bearer ${companyToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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
  },
);

export default apiClient;
