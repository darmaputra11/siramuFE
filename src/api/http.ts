// src/api/http.ts
import { clearAuth, getToken, setToken } from "@/utils/AuthStorage";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const http = axios.create({
  baseURL: "/api",           // ⬅️ lewat proxy Vite
  withCredentials: true,     // ⬅️ biar cookie 'rt' ikut
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

http.interceptors.request.use((config) => {
  const token = getToken();
  config.headers = { ...(config.headers || {}), ...authHeader(token || undefined) };
  return config;
});

let refreshing = false;
let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const resp = await http.post("/refresh");
  const newToken = resp.data?.token as string;
  if (!newToken) throw new Error("No token from /refresh");
  setToken(newToken);
  return newToken;
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const original = error.config as AxiosRequestConfig & { _retried?: boolean };
    const status = error.response?.status;
    const isAuthEndpoint =
      original?.url?.includes("/login") || original?.url?.includes("/refresh");

    if (status === 401 && !original._retried && !isAuthEndpoint) {
      try {
        original._retried = true;
        if (!refreshing) {
          refreshing = true;
          refreshPromise = doRefresh().finally(() => (refreshing = false));
        }
        const newToken = await refreshPromise!;
        original.headers = { ...(original.headers || {}), ...authHeader(newToken) };
        return http(original);
      } catch {
        clearAuth();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
