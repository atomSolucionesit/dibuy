import axios from "axios";

export const URLAPI = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: URLAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  config.headers.Authorization = `Bearer ${process.env.NEXT_COMPANY_TOKEN}`;

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});
