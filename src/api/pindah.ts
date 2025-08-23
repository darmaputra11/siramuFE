// src/api/pindah.ts
import axios from "axios"

const API_URL = "http://127.0.0.1:8000/api"

export interface PindahRow {
  id: number
  nik: string
  nama_lengkap: string
  nomor_kk: string
  nomor_pindah: string
  tanggal_pindah: string
  created_at?: string
  updated_at?: string
}

export interface PindahPaginator {
  current_page: number
  data: PindahRow[]
  per_page: number | string
  total: number
  last_page: number
}

// dukung paginator atau array polos
type PindahListOrPaginator = PindahRow[] | PindahPaginator

export const getPindah = async (
  token: string,
  params: {
    page?: number
    per_page?: number
    q?: string
    start_date?: string
    end_date?: string
    sort?: "oldest" | "newest"
  } = {}
) => {
  return await axios.get<PindahListOrPaginator>(`${API_URL}/pindah`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createPindah = async (token: string, payload: {
  nik: string
  nama_lengkap: string
  nomor_kk: string
  nomor_pindah: string
  tanggal_pindah: string // yyyy-mm-dd
}) => {
  return await axios.post(`${API_URL}/pindah`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getPindahById = async (token: string, id: number) => {
  return await axios.get<PindahRow>(`${API_URL}/pindah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updatePindah = async (
  token: string,
  id: number,
  payload: {
    nik: string
    nama_lengkap: string
    nomor_kk: string
    nomor_pindah: string
    tanggal_pindah: string // yyyy-mm-dd
  }
) => {
  return await axios.put(`${API_URL}/pindah/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deletePindah = async (token: string, id: number) => {
  return await axios.delete(`${API_URL}/pindah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
