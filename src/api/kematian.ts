// src/api/kematian.ts
import http from "@/api/http"

export interface KematianRow {
  id: number
  nik: string
  nama_lengkap: string
  tanggal_kematian: string // yyyy-mm-dd
  nomor_akta: string
  created_at?: string
  updated_at?: string
}

// Paginator default Laravel
export interface KematianResponse {
  current_page: number
  data: KematianRow[]
  per_page: number | string
  total: number
  last_page: number
}

export interface KematianQuery {
  page?: number
  per_page?: number
  q?: string
  start_date?: string // yyyy-mm-dd
  end_date?: string   // yyyy-mm-dd
  sort?: "oldest" | "newest"
}

export const getKematian = (params: KematianQuery = {}) => {
  return http.get<KematianResponse>("/kematian", { params })
}

export const getKematianById = (id: number) => {
  return http.get<KematianRow>(`/kematian/${id}`)
}

export const createKematian = (payload: {
  nik: string
  nama_lengkap: string
  tanggal_kematian: string
  nomor_akta: string
}) => {
  return http.post("/kematian", payload)
}

export const updateKematian = (id: number, payload: {
  nik: string
  nama_lengkap: string
  tanggal_kematian: string
  nomor_akta: string
}) => {
  return http.put(`/kematian/${id}`, payload)
}

export const deleteKematian = (id: number) => {
  return http.delete(`/kematian/${id}`)
}
