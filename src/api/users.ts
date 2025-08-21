// src/api/users.ts
import axios from "axios"

const API_URL = "http://127.0.0.1:8000/api"

export interface UserRow {
  id: number
  name: string
  email: string
  role: string
  created_at?: string
  updated_at?: string
}

// MATCH dengan paginator default Laravel (tanpa "meta")
export interface UsersResponse {
  current_page: number
  data: UserRow[]
  per_page: number | string
  total: number
  last_page: number
  // properti lain (opsional): first_page_url, next_page_url, links, dll
}

export const getUsers = async (
  token: string,
  params: { page?: number; per_page?: number; q?: string } = {}
) => {
  return await axios.get<UsersResponse>(`${API_URL}/users`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createUser = async (
  token: string,
  payload: { name: string; email: string; password: string; password_confirmation: string; role: string }
) => {
  return await axios.post(`${API_URL}/users`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getUserById = async (token: string, id: number) => {
  return await axios.get<UserRow>(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteUser = async (token: string, id: number) => {
  return await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
