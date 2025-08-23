// src/api/users.ts
import http from "@/api/http"

export interface UserRow {
  id: number
  name: string
  email: string
  role: string
  created_at?: string
  updated_at?: string
}

// Laravel paginator (tanpa "meta")
export interface UsersResponse {
  current_page: number
  data: UserRow[]
  per_page: number | string
  total: number
  last_page: number
}

export const getUsers = (params: { page?: number; per_page?: number; q?: string } = {}) => {
  return http.get<UsersResponse>("/users", { params })
}

export const createUser = (payload: {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: string
}) => {
  return http.post("/users", payload)
}

export const getUserById = (id: number) => {
  return http.get<UserRow>(`/users/${id}`)
}

export const deleteUser = (id: number) => {
  return http.delete(`/users/${id}`)
}
