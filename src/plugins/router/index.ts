// src/plugins/router/index.ts
import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'; // sesuaikan path-nya ya

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔐 GLOBAL ROUTE GUARD
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // butuh login
  if (to.meta?.requiresAuth && !token) {
    console.log('⛔ No token. Redirect -> /login (replace history)')
    return next({ path: '/login', replace: true })
  }

  // sudah login tapi buka halaman tamu (login/register)
  if (token && (to.name === 'login' || to.meta?.guestOnly)) {
    console.log('ℹ️ Already logged in. Redirect -> /dashboard (replace history)')
    return next({ path: '/dashboard', replace: true })
  }

  next()
})

export default function (app: App) {
  app.use(router)
}

export { router }

