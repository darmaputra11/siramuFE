<script lang="ts" setup>
import type { UserRow, UsersResponse } from '@/api/users'
import { deleteUser, getUsers, resetUserPassword } from '@/api/users'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ====== STATE ======
const rows = ref<UserRow[]>([])
const loading = ref(false)
const errorMsg = ref('')

// pagination & filter
const page = ref(1)
const itemsPerPage = ref(5)
const itemsPerPageOptions = [5, 10, 50, 100]
const search = ref('')

// meta paginator sederhana
const meta = ref({
  current_page: 1,
  per_page: 5,
  total: 0,
  last_page: 1,
})

// selection by id
const selectedRows = ref<number[]>([])

// dialog detail
const dialog = ref(false)
const selectedUser = ref<UserRow | null>(null)
const newPassword = ref('')

// dialog delete
const deletingId = ref<number | null>(null)
const deleteDialog = ref(false)
const userToDelete = ref<UserRow | null>(null)

const savingPwd = ref(false)       // ⬅️ state loading tombol simpan
const showPwd = ref(false)         // ⬅️ optional: toggle lihat password

// ====== API LOAD ======
async function fetchUsers() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await getUsers({
      page: page.value,
      per_page: itemsPerPage.value,
      q: search.value,
    })
    // debug ringan
    console.log('[Users] loaded', data as UsersResponse)

    rows.value = data.data
    meta.value = {
      current_page: data.current_page,
      per_page: Number(data.per_page),
      total: data.total,
      last_page: data.last_page,
    }
    page.value = data.current_page
  } catch (e: any) {
    console.error('[Users] fetch error', e?.response || e)
    errorMsg.value = e?.response?.data?.message || e?.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

// debounce search
let t: number | undefined
function onSearchInput() {
  window.clearTimeout(t)
  t = window.setTimeout(() => {
    page.value = 1
    fetchUsers()
  }, 400)
}

onMounted(fetchUsers)

// watcher rapi (hindari double trigger)
watch(itemsPerPage, () => {
  page.value = 1
  fetchUsers()
})
watch(page, (newVal, oldVal) => {
  if (newVal !== oldVal && !loading.value) fetchUsers()
})

// ====== TABLE HELPERS ======
const pageCount = computed(() => meta.value.last_page || 1)
const startNo   = computed(() => (meta.value.current_page - 1) * meta.value.per_page)

const allPageSelected = computed(
  () => rows.value.length > 0 && rows.value.every(item => selectedRows.value.includes(item.id))
)

function toggleSelectAllOnPage() {
  if (allPageSelected.value) {
    selectedRows.value = selectedRows.value.filter(id => !rows.value.some(item => item.id === id))
  } else {
    const toAdd = rows.value.map(item => item.id).filter(id => !selectedRows.value.includes(id))
    selectedRows.value = [...new Set([...selectedRows.value, ...toAdd])]
  }
}

function toggleSelection(id: number) {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(i => i !== id)
  } else {
    selectedRows.value.push(id)
  }
}

// ====== DETAIL DIALOG & ACTIONS ======
function openDetailDialog(user: UserRow) {
  selectedUser.value = user
  newPassword.value = ''
  dialog.value = true
}

async function updatePassword() {
  if (!selectedUser.value) return
  if (!newPassword.value) { alert('Password tidak boleh kosong'); return }
  if (newPassword.value.length < 6) { alert('Minimal 6 karakter'); return }

  try {
    savingPwd.value = true
    await resetUserPassword(selectedUser.value.id, newPassword.value)
    alert('Password berhasil direset.')
    dialog.value = false
    newPassword.value = ''
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal mengubah password.'
    alert(msg)
  } finally {
    savingPwd.value = false
  }
}

function goToAddUser() {
  router.push('/users/add-user')
}

function openDeleteDialog(user: UserRow) {
  userToDelete.value = user
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!userToDelete.value) return
  try {
    deletingId.value = userToDelete.value.id
    await deleteUser(userToDelete.value.id)
    deleteDialog.value = false
    userToDelete.value = null

    const isLastItemOnPage = rows.value.length === 1 && page.value > 1
    if (isLastItemOnPage) page.value = page.value - 1

    await fetchUsers()
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal menghapus user.'
    alert(msg)
  } finally {
    deletingId.value = null
  }
}

const roleLabel = (role: string) => {
  const map: Record<string, string> = {
    admin: 'Admin',
    viewer: 'Viewer',
    dinsos: 'Dinsos',
    dinkes: 'Dinkes',
    bpjs: 'BPJS',
  }
  return map[role?.toLowerCase?.()] || role
}
</script>

<template>
  <!-- Title & Add Button -->
  <div class="d-flex justify-space-between align-center mb-4">
    <h3 class="text-h3 font-weight-bold">Daftar User</h3>
    <v-btn @click="goToAddUser" color="primary" variant="flat">+ Tambah User</v-btn>
  </div>

  <!-- Card -->
  <v-card elevation="4" class="pa-4">
    <!-- Search Field -->
    <div class="mb-4 d-flex">
      <v-text-field
        v-model="search"
        label="Cari User"
        append-inner-icon="ri-search-line"
        density="comfortable"
        hide-details
        variant="outlined"
        clearable
        style="max-width: 240px"
        @input="onSearchInput"
      />
    </div>

    <!-- Error banner (opsional) -->
    <v-alert
      v-if="errorMsg"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ errorMsg }}
    </v-alert>

    <!-- Table -->
    <v-table>
      <thead>
        <tr>
          <th>
            <v-checkbox
              density="compact"
              hide-details
              :model-value="allPageSelected"
              @click.stop="toggleSelectAllOnPage"
            />
          </th>
          <th class="text-uppercase">No</th>
          <th class="text-uppercase text-center">Username</th>
          <th class="text-uppercase text-center">Email</th>
          <th class="text-uppercase text-center">Role</th>
          <th class="text-uppercase text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in rows" :key="item.id">
          <td>
            <v-checkbox
              density="compact"
              hide-details
              :model-value="selectedRows.includes(item.id)"
              @click.stop="toggleSelection(item.id)"
            />
          </td>
          <td>{{ startNo + index + 1 }}</td>
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.email }}</td>
          <td class="text-center">{{ roleLabel(item.role) }}</td>
          <td class="text-center">
            <v-btn icon size="small" variant="text" class="ma-0 pa-0" @click="openDetailDialog(item)">
              <v-icon icon="ri-eye-line" />
            </v-btn>

            <v-btn
              icon color="error" size="small" variant="text"
              class="ma-0 pa-0"
              :loading="deletingId === item.id"
              :disabled="deletingId === item.id"
              @click="openDeleteDialog(item)"
            >
              <v-icon icon="ri-delete-bin-line" />
            </v-btn>
          </td>
        </tr>

        <tr v-if="!loading && rows.length === 0">
          <td colspan="6" class="text-center text-disabled">Tidak ada data ditemukan</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Loading bar -->
    <v-progress-linear v-if="loading" indeterminate class="mt-2" />

    <!-- Pagination + Rows per page -->
    <v-card-actions class="justify-space-between flex-wrap gap-4">
      <div class="d-flex align-center gap-2">
        <span class="text-caption">Rows per page:</span>
        <v-select
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          variant="outlined"
          density="comfortable"
          hide-details
          style="max-width: 120px"
        />
      </div>

      <v-pagination
        v-model="page"
        :length="pageCount"
        prev-icon="ri-arrow-left-s-line"
        next-icon="ri-arrow-right-s-line"
        :total-visible="5"
        rounded
      />
    </v-card-actions>
  </v-card>

  <!-- Detail Dialog -->
<v-dialog v-model="dialog" max-width="500">
  <v-card>
    <v-card-title class="text-h5 my-3 font-weight-bold">Detail User</v-card-title>

    <v-card-text v-if="selectedUser">
      <div class="mb-3">
        <p><strong>Username:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Role:</strong> {{ roleLabel(selectedUser.role) }}</p>
      </div>

      <v-divider class="my-4" />

      <h4 class="text-subtitle-1 font-weight-medium mb-2">Ubah Password (Admin)</h4>
      <v-text-field
        v-model="newPassword"
        :type="showPwd ? 'text' : 'password'"
        label="Password Baru"
        variant="outlined"
        density="comfortable"
        :append-inner-icon="showPwd ? 'ri-eye-off-line' : 'ri-eye-line'"
        @click:append-inner="showPwd = !showPwd"
        :disabled="savingPwd"
      />
      <div class="text-caption text-medium-emphasis">
        Minimal 6 karakter. User akan login dengan password baru ini.
      </div>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn variant="outlined" @click="dialog = false" :disabled="savingPwd">Tutup</v-btn>
      <v-btn
        variant="flat"
        color="primary"
        @click="updatePassword"
        :loading="savingPwd"
        :disabled="savingPwd || !newPassword || newPassword.length < 6"
      >
        Simpan
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  <!-- Delete Dialog -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card class="pa-4">
      <v-card-title class="text-h4 font-weight-bold mb-2">Delete Akun</v-card-title>
      <v-card-text class="mb-2">
        Anda yakin untuk menghapus akun <strong>{{ userToDelete?.name }}</strong>?
      </v-card-text>
      <v-card-actions class="justify-end gap-2">
        <v-btn variant="outlined" class="flex-1" min-width="100" @click="deleteDialog = false">No</v-btn>
        <v-btn
          variant="flat" color="error" class="flex-1" min-width="100"
          :loading="deletingId === userToDelete?.id"
          :disabled="deletingId === userToDelete?.id"
          @click="confirmDelete"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
