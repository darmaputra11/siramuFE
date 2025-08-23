export const routes = [
  { path: '/', redirect: '/login' },

  // Login tanpa layout default
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/adminView/LoginView.vue'),
    meta: { guestOnly: true },   // 👈 hanya untuk guest
  },

  // Semua yang butuh navbar pakai layout default
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/adminView/Dashboard.vue'),
        meta: { requiresAuth: true },  // 👈 butuh login
      },
      {
        path: 'users',
        component: () => import('@/views/adminView/Users.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users/add-user',
        component: () => import('@/views/adminView/AddUser.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aktakematian',
        component: () => import('@/views/adminView/AktaKematian.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aktakematian/create',
        component: () => import('@/views/adminView/AddAktaKematian.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aktapindah',
        component: () => import('@/views/adminView/AktaPindah.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aktapindah/create',
        component: () => import('@/views/adminView/AddAktaPindah.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aktakematian/:id/edit',
        component: () => import('@/views/adminView/EditAktaKematian.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'aktapindah/:id/edit',
        component: () => import('@/views/adminView/EditAktaPindah.vue'),
        meta: { requiresAuth: true },
      },

      // sisanya kalau memang private juga kasih requiresAuth
      { path: 'account-settings', component: () => import('@/pages/account-settings.vue'), meta: { requiresAuth: true } },
      { path: 'typography', component: () => import('@/pages/typography.vue'), meta: { requiresAuth: true } },
      { path: 'icons', component: () => import('@/pages/icons.vue'), meta: { requiresAuth: true } },
      { path: 'cards', component: () => import('@/pages/cards.vue'), meta: { requiresAuth: true } },
      { path: 'tables', component: () => import('@/pages/tables.vue'), meta: { requiresAuth: true } },
      { path: 'form-layouts', component: () => import('@/pages/form-layouts.vue'), meta: { requiresAuth: true } },
    ],
  },
]
