import axios from "axios";

export const URLAPI = process.env.NEXT_PUBLIC_CRM_BASE_URL;
export const token = process.env.NEXT_PUBLIC_COMPANY_TOKEN;

// Función para obtener token CRM con sessionStorage
const getCRMToken = async (): Promise<string | null> => {
  // Verificar si hay token en sessionStorage
  if (typeof window !== 'undefined') {
    const storedToken = sessionStorage.getItem('crm_token');
    const tokenExpiry = sessionStorage.getItem('crm_token_expiry');
    if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      return storedToken;
    }
  }

  try {
    
    const response = await fetch(`${URLAPI}/auth/ecommerce/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyToken: token
      })
    });

    
    if (response.ok) {
      const data = await response.json();
      
      // Extraer token de la respuesta (puede estar en diferentes campos)
      const token = data.access_token || data.token || data.info?.token || data.info?.access_token;
      
      if (token) {
        // Guardar en sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('crm_token', token);
          sessionStorage.setItem('crm_token_expiry', (Date.now() + 22 * 60 * 60 * 1000).toString());
        }
        return token;
      } else {
        console.error('No token found in response:', data);
      }
    } else {
      const errorText = await response.text();
      console.error('Auth failed:', response.status, errorText);
    }
  } catch (error) {
    console.error("Error getting CRM token:", error);
  }
  return null;
};

export const api = axios.create({
  baseURL: URLAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const crmToken = await getCRMToken();
  if (crmToken) {
    config.headers.Authorization = `Bearer ${crmToken}`;
  } else {
    console.warn('No token available for request');
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Interceptor para manejar respuestas 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Limpiar token expirado
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('crm_token');
        sessionStorage.removeItem('crm_token_expiry');
      }
      
      try {
        const crmToken = await getCRMToken();
        if (crmToken) {
          originalRequest.headers.Authorization = `Bearer ${crmToken}`;
          return api(originalRequest);
        }
      } catch (authError) {
        console.error("Failed to re-authenticate:", authError);
      }
    }
    return Promise.reject(error);
  }
);
