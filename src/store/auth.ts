import { loginApi, logoutApi, meApi } from '@/api/auth'
import { defineStore } from 'pinia'

export type UserRole = 'admin' | 'viewer'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as User | null,
  }),
  getters: {
    role: (s) => s.user?.role || 'viewer',
    isAdmin: (s) => s.user?.role === 'admin',
    isViewer: (s) => s.user?.role === 'viewer',
  },
  actions: {
    async login(email: string, password: string) {
      const { data } = await loginApi(email, password)
      this.token = data.access_token
      this.user = data.user
      localStorage.setItem('token', this.token)
    },
    async fetchUser() {
      if (!this.token) return
      try {
        const { data } = await meApi()
        this.user = data
      } catch (e) {
        this.logout()
      }
    },
    async logout() {
      try { await logoutApi() } catch {}
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
