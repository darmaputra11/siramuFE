// src/api/pindah.ts
import http from "@/api/http"

export interface PindahRow {
  id: number
  nik: string
  nama_lengkap: string
  nomor_kk: string
  nomor_pindah: string
  tanggal_pindah: string // yyyy-mm-dd
  created_at?: string
  updated_at?: string
}

// Paginator default Laravel
export interface PindahResponse {
  current_page: number
  data: PindahRow[]
  per_page: number | string
  total: number
  last_page: number
}

export interface PindahQuery {
  page?: number
  per_page?: number
  q?: string
  start_date?: string // yyyy-mm-dd
  end_date?: string   // yyyy-mm-dd
  sort?: "oldest" | "newest"
}

export const getPindah = (params: PindahQuery = {}) => {
  return http.get<PindahResponse>("/pindah", { params })
}

export const getPindahById = (id: number) => {
  return http.get<PindahRow>(`/pindah/${id}`)
}

export const createPindah = (payload: {
  nik: string
  nama_lengkap: string
  nomor_kk: string
  nomor_pindah: string
  tanggal_pindah: string // yyyy-mm-dd
}) => {
  return http.post("/pindah", payload)
}

export const updatePindah = (
  id: number,
  payload: {
    nik: string
    nama_lengkap: string
    nomor_kk: string
    nomor_pindah: string
    tanggal_pindah: string // yyyy-mm-dd
  }
) => {
  return http.put(`/pindah/${id}`, payload)
}

export const deletePindah = (id: number) => {
  return http.delete(`/pindah/${id}`)
}
