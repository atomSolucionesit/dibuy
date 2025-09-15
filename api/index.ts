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
    config.headers.Authorization = `Bearer eyJzdWIiOjIsInVzZXJJZCI6MiwiYnJhbmNoSWQiOjEsInVzZXJuYW1lIjoibmV4dXNzb2Z0d2FyZSIsImNvbXBhbnlJZCI6MiwiY29tcGFueVRva2VuIjoiZWQwYmY0ZDUtNzRlYi00ZTBiLWI1MTMtMzQ5MWU2YWIwMjA3IiwiaXNBZG1pbiI6dHJ1ZSwiY3VycmVuY3lJZCI6MCwicm9sZUlkIjozLCJyb2xlQ29kZSI6IlNVUEVSIiwiaWF0IjoxNzU3Njg3Mzc3LCJleHAiOjE3NTgyOTIxNzd9.4UBBQa8xc0RDWn_X6tmetxoSmJBndV6gbWweK1uJ5N8`;
  //}

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});