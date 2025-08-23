// src/api/auth.ts
import http from "./http";

export function loginApi(email: string, password: string) {
  // remember-me dikelola di komponen (penyimpanan token)
  return http.post("/login", { email, password });
}

export function logoutApi() {
  return http.post("/logout");
}

export function meApi() {
  return http.get("/me"); // kalau ada endpoint me
}
