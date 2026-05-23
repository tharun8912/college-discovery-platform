import axios from "axios";
import { getApiBaseUrl } from "@/lib/config";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { Accept: "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
