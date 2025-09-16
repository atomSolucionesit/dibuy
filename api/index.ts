import axios from "axios";

export const URLAPI = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: URLAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  //const token = localStorage.getItem("access_token");
  //if (token) {
    config.headers.Authorization = `Bearer 091218`;
  //}

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});