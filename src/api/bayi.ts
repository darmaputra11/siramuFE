import http from "@/api/http"

/** Baris data bayi (sesuai response API) */
export interface BayiRow {
  id: number
  no_entitas: string
  nik: string
  nama: string
  hub_keluarga?: string | null
  tgl_lahir_bayi: string              // YYYY-MM-DD
  nama_ibu_kandung: string
  tgl_lahir_ibu_kandung: string       // YYYY-MM-DD
  created_at?: string
  updated_at?: string
}

/** Paginator default Laravel */
export interface BayiResponse {
  current_page: number
  data: BayiRow[]
  per_page: number
  total: number
  last_page: number
}

/** Query untuk list/daftar bayi */
export interface BayiQuery {
  page?: number
  per_page?: number
  q?: string
  start_date?: string        // filter tgl_lahir_bayi >= YYYY-MM-DD
  end_date?: string          // filter tgl_lahir_bayi <= YYYY-MM-DD
  sort_by?: "created_at" | "tgl_lahir_bayi" | "tgl_lahir_ibu_kandung"
  sort_dir?: "asc" | "desc"
}

/** Payload untuk create */
export interface CreateBayiPayload {
  no_entitas: string
  nik: string
  nama: string
  hub_keluarga?: string | null
  tgl_lahir_bayi: string              // YYYY-MM-DD
  nama_ibu_kandung: string
  tgl_lahir_ibu_kandung: string       // YYYY-MM-DD
}

/** Payload untuk update (semua opsional, sesuai validator 'sometimes') */
export type UpdateBayiPayload = Partial<CreateBayiPayload>

// ===== API FUNCTIONS =====
export const getBayi = (params: BayiQuery = {}) => {
  return http.get<BayiResponse>("/bayi", { params })
}

export const getBayiById = (id: number) => {
  return http.get<BayiRow>(`/bayi/${id}`)
}

export const createBayi = (payload: CreateBayiPayload) => {
  return http.post<BayiRow>("/bayi", payload)
}

export const updateBayi = (id: number, payload: UpdateBayiPayload) => {
  return http.put<BayiRow>(`/bayi/${id}`, payload)
}

export const deleteBayi = (id: number) => {
  return http.delete<{ message: string }>(`/bayi/${id}`)
}
