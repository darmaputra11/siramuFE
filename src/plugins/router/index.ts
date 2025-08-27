// src/plugins/router/index.ts
import { useAuthStore } from '@/store/auth'; // ⬅️ pakai Pinia store
import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔐 GLOBAL ROUTE GUARD
router.beforeEach(async (to, _from) => {
  const auth = useAuthStore()
  const token = auth.token || localStorage.getItem('token') || ''

  // 2) Halaman yang butuh login (requiresAuth)
  if (to.meta?.requiresAuth && !token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 3) Jika sudah punya token tapi user belum di-load, coba fetch /me
  if (token && !auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      // jika gagal fetch user, paksa login ulang
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }

  // 4) Cek role berdasarkan meta.roles (contoh: ['admin'] atau ['admin','viewer'])
  const allowedRoles = (to.meta?.roles as string[] | undefined) || undefined
  if (allowedRoles && auth.user) {
    if (!allowedRoles.includes(auth.user.role)) {
      // redirect aman (bisa diarahkan ke /403 kalau kamu punya halaman 403)
      return { path: '/dashboard' }
    }
  }

  // lanjutkan
  return true
})

export default function (app: App) {
  app.use(router)
}

export { router };

