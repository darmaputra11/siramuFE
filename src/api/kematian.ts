// src/api/kematian.ts
import http from "@/api/http"

/** Baris data kematian (sesuai response API) */
export interface KematianRow {
  id: number
  nik: string
  nama_lengkap: string
  tanggal_kematian: string            // YYYY-MM-DD
  nomor_akta: string
  tanggal_akta?: string | null        // YYYY-MM-DD | null (bisa nullable)
  created_at?: string
  updated_at?: string
}

/** Paginator default Laravel */
export interface KematianResponse {
  current_page: number
  data: KematianRow[]
  per_page: number
  total: number
  last_page: number
}

/** Query untuk list/daftar kematian */
export interface KematianQuery {
  page?: number
  per_page?: number
  q?: string
  start_date?: string       // filter tanggal_kematian >= YYYY-MM-DD
  end_date?: string         // filter tanggal_kematian <= YYYY-MM-DD
  akta_start_date?: string  // filter tanggal_akta     >= YYYY-MM-DD
  akta_end_date?: string    // filter tanggal_akta     <= YYYY-MM-DD
  sort_by?: "created_at" | "tanggal_kematian" | "tanggal_akta"
  sort_dir?: "asc" | "desc"
}

/** Payload untuk create */
export interface CreateKematianPayload {
  nik: string
  nama_lengkap: string
  tanggal_kematian: string  // YYYY-MM-DD
  nomor_akta: string
  tanggal_akta: string
}

/** Payload untuk update (semua opsional, sesuai validator 'sometimes') */
export type UpdateKematianPayload = Partial<CreateKematianPayload>

export const getKematian = (params: KematianQuery = {}) => {
  return http.get<KematianResponse>("/kematian", { params })
}

export const getKematianById = (id: number) => {
  return http.get<KematianRow>(`/kematian/${id}`)
}

export const createKematian = (payload: CreateKematianPayload) => {
  return http.post<KematianRow>("/kematian", payload)
}

export const updateKematian = (id: number, payload: UpdateKematianPayload) => {
  return http.put<KematianRow>(`/kematian/${id}`, payload)
}

export const deleteKematian = (id: number) => {
  return http.delete<{ message: string }>(`/kematian/${id}`)
}
