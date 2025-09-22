
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
        meta: { requiresAuth: true, roles: ['admin','viewer'] },  // 👈 butuh login
      },
      {
        path: 'users',
        component: () => import('@/views/adminView/Users.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'users/add-user',
        component: () => import('@/views/adminView/AddUser.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'aktakematian',
        component: () => import('@/views/adminView/AktaKematian.vue'),
        meta: { requiresAuth: true, roles: ['admin','viewer'] },
      },
      {
        path: 'aktakematian/create',
        component: () => import('@/views/adminView/AddAktaKematian.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'aktapindah',
        component: () => import('@/views/adminView/AktaPindah.vue'),
        meta: { requiresAuth: true, roles: ['admin','viewer'] },
      },
      {
        path: 'aktapindah/create',
        component: () => import('@/views/adminView/AddAktaPindah.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'aktakematian/:id/edit',
        component: () => import('@/views/adminView/EditAktaKematian.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'aktapindah/:id/edit',
        component: () => import('@/views/adminView/EditAktaPindah.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'daftarbayi',
        component: () => import('@/views/adminView/DaftarBayi.vue'),
        meta: { requiresAuth: true, roles: ['admin','viewer'] },
      },
      {
        path: 'daftarbayi/create',
        component: () => import('@/views/adminView/AddDaftarBayi.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'daftarbayi/:id/edit',
        component: () => import('@/views/adminView/EditDaftarBayi.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
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
