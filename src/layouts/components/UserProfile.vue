<script setup lang="ts">
import { logoutApi } from "@/api/auth"
import { useAuthStore } from "@/store/auth"; // ⬅️ ganti ke '@/store/auth' jika itu path-mu
import { clearAuth } from "@/utils/AuthStorage"; // sesuaikan huruf besar/kecil filenya
import avatar1 from '@images/avatars/avatar-1.png'
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const auth = useAuthStore()

const displayName = computed(() => auth.user?.name || auth.user?.email || "User")
const displayRole = computed(() => {
  const r = auth.user?.role || ''
  return r ? r.charAt(0).toUpperCase() + r.slice(1) : ''
})

const handleLogout = async () => {
  try { await logoutApi() } catch (e) { console.warn("Logout API error (ignored):", e) }
  // bersihkan state di store bila ada
  try { await auth.logout?.() } catch {}
  // pastikan storage lokal bersih
  clearAuth()
  router.replace("/login")
}
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <!-- Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- Header: Nama & Role -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ displayName }}
            </VListItemTitle>
            <VListItemSubtitle>{{ displayRole }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- Satu-satunya aksi: Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon class="me-2" icon="ri-logout-box-r-line" size="22" />
            </template>
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
