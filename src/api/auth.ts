import axios from "axios"

const API_URL = "http://127.0.0.1:8000/api"

export interface LoginResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

export const loginApi = async (
  email: string,
  password: string,
  remember = false
): Promise<{ data: LoginResponse }> => {
  return await axios.post(`${API_URL}/login`, { email, password, remember })
}

// fungsi register
export const register = async (data) => {
  return await axios.post(`${API_URL}/register`, data)
}

// fungsi logout
export const logout = async (token:string) => {
  return await axios.post(`${API_URL}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

// fungsi get user (ambil user yang sedang login)
export const getUser = async (token: string) => {
  return await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
