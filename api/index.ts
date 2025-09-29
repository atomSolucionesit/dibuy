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

    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcsInVzZXJJZCI6NywiYnJhbmNoSWQiOjMsInVzZXJuYW1lIjoiYWRtaW5fY29tcGFueV81IiwiY29tcGFueUlkIjo1LCJjb21wYW55VG9rZW4iOiIwOTEyMTgiLCJpc0FkbWluIjp0cnVlLCJjdXJyZW5jeUlkIjoxLCJyb2xlSWQiOjYsInJvbGVDb2RlIjoiQURNSU4iLCJpYXQiOjE3NTg2MzUwMjgsImV4cCI6MTc1OTIzOTgyOH0.elc9VUizpPsj92LL6M1AK6QndNOkcqYIOq75ZnJ7w5w`;
  //}

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});