import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// ConfiguraciÃ³n base de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_CRM_BASE_URL || "http://localhost:3003/api";

// ConfiguraciÃ³n por defecto de axios
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create(defaultConfig);

const ECOMMERCE_TOKEN_KEY = "ecommerce_token";
const ECOMMERCE_TOKEN_EXP_KEY = "ecommerce_token_expiry";
const ECOMMERCE_COMPANY_ID_KEY = "ecommerce_company_id";

const getEcommerceToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = sessionStorage.getItem(ECOMMERCE_TOKEN_KEY);
  const tokenExpiry = sessionStorage.getItem(ECOMMERCE_TOKEN_EXP_KEY);
  if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10)) {
    return storedToken;
  }

  const companyToken = process.env.NEXT_PUBLIC_COMPANY_TOKEN;
  if (!companyToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/ecommerce/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Auth ecommerce failed:", response.status, errorText);
    return null;
  }

  const data = await response.json();
  const token =
    data?.info?.access_token ||
    data?.info?.user?.access_token ||
    data?.access_token ||
    data?.token ||
    null;
  const companyId =
    data?.info?.user?.companyId ??
    data?.info?.companyId ??
    null;

  if (token) {
    sessionStorage.setItem(ECOMMERCE_TOKEN_KEY, token);
    sessionStorage.setItem(
      ECOMMERCE_TOKEN_EXP_KEY,
      (Date.now() + 22 * 60 * 60 * 1000).toString()
    );
  }
  if (companyId != null) {
    sessionStorage.setItem(ECOMMERCE_COMPANY_ID_KEY, String(companyId));
  }

  return token;
};

// Interceptor para requests
apiClient.interceptors.request.use(
  async (config) => {
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
      return config;
    }

    // Para otras rutas, usar token de usuario si existe, sino token ecommerce
    if (typeof window !== "undefined") {
      const userToken = localStorage.getItem("authToken");
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
        return config;
      }

      const ecommerceToken = await getEcommerceToken();
      if (ecommerceToken) {
        config.headers.Authorization = `Bearer ${ecommerceToken}`;
        return config;
      }
    }

    // Fallback (SSR u otros casos)
    if (companyToken) {
      config.headers.Authorization = `Bearer ${companyToken}`;
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
      // Token expirado o invÃ¡lido
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
