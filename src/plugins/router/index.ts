// src/plugins/router/index.ts
import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes'; // sesuaikan path-nya ya

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔐 GLOBAL ROUTE GUARD
// contoh di router.beforeEach
router.beforeEach((to, _from, next) => {
  const token = sessionStorage.getItem("token")
  if (to.meta.requiresAuth && !token) {
    return next({ path: "/login" })
  }
  if (to.meta.guestOnly && token) {
    return next({ path: "/dashboard" })
  }
  next()
})

export default function (app: App) {
  app.use(router)
}

export { router };

