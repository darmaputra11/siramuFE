// src/api/auth.ts
import http from "./http"

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    name: string
    email: string
    role: "admin" | "viewer"
  }
}

export function loginApi(email: string, password: string) {
  // remember-me dikelola di komponen (penyimpanan token)
  return http.post<LoginResponse>("/login", { email, password })
}

export function logoutApi() {
  return http.post("/logout")
}

export function meApi() {
  // balikin user yang sedang login (kalau backend punya endpoint ini)
  return http.get<LoginResponse["user"]>("/me")
}
