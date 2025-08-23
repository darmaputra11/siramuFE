// src/api/kematian.ts
import axios from "axios"

const API_URL = "http://127.0.0.1:8000/api"

export interface KematianRow {
  id: number
  nik: string
  nama_lengkap: string
  tanggal_kematian: string // yyyy-mm-dd
  nomor_akta: string
  created_at?: string
  updated_at?: string
}

// mengikuti paginator default Laravel
export interface KematianResponse {
  current_page: number
  data: KematianRow[]
  per_page: number | string
  total: number
  last_page: number
}

export const getKematian = async (
  token: string,
  params: {
    page?: number
    per_page?: number
    q?: string
    start_date?: string // yyyy-mm-dd
    end_date?: string   // yyyy-mm-dd
    sort?: "oldest" | "newest"
  } = {}
) => {
  return await axios.get<KematianResponse>(`${API_URL}/kematian`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteKematian = async (token: string, id: number) => {
  return await axios.delete(`${API_URL}/kematian/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createKematian = async (token: string, payload: {
  nik: string
  nama_lengkap: string
  tanggal_kematian: string
  nomor_akta: string
}) => {
  return await axios.post(`${API_URL}/kematian`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getKematianById = async (token: string, id: number) => {
  return await axios.get<KematianRow>(`${API_URL}/kematian/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateKematian = async (token: string, id: number, payload: {
  nik: string
  nama_lengkap: string
  tanggal_kematian: string
  nomor_akta: string
}) => {
  return await axios.put(`${API_URL}/kematian/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
