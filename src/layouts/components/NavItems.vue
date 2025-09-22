<script lang="ts" setup>
import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'

import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

const auth = useAuthStore()

// fallback aman: kalau belum ada user, anggap viewer
const role = computed(() => auth.user?.role ?? 'viewer')
const isAdmin = computed(() => role.value === 'admin')
// const isViewer = computed(() => role.value === 'viewer') // pakai kalau perlu
</script>

<template>
  <!-- 👉 Dashboard (semua role boleh) -->
  <VerticalNavLink
    class="mt-4"
    :item="{ title: 'Dashboard', icon: 'ri-dashboard-line', to: '/dashboard' }"
  />

  <!-- 👉 Users (hanya admin) -->
  <VerticalNavLink
    v-if="isAdmin"
    :item="{ title: 'Users', icon: 'ri-group-line', to: '/users' }"
  />

  <!-- 👉 Data Penduduk (admin & viewer boleh melihat) -->
  <VerticalNavGroup
    :item="{ title: 'Data Penduduk', icon: 'ri-user-community-line' }"
  >
    <VerticalNavLink
      :item="{ title: 'Data Kematian', to: '/aktakematian' }"
    />
    <VerticalNavLink
      :item="{ title: 'Data Pindah', to: '/aktapindah' }"
    />
    <VerticalNavLink
      :item="{ title: 'Data Bayi', to: '/daftarbayi' }"
    />
  </VerticalNavGroup>
</template>
