import axios from "axios";

export const URLAPI = process.env.NEXT_PUBLIC_API_URL;
export const token = process.env.NEXT_PUBLIC_COMPANY_TOKEN;

export const api = axios.create({
  baseURL: URLAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  config.headers.Authorization = `Bearer 6679e944-d883-4a9a-971f-997a28cdcf29`;

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});
