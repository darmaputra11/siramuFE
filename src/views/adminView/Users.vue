<script lang="ts" setup>
import { computed, ref } from 'vue';

const users = [
  { username: 'Frozen Yogurt', email: 'frozen.yogurt@example.com', role: 'Admin' },
  { username: 'Ice cream sandwich', email: 'ice.cream.sandwich@example.com', role: 'Dinas Sosial' },
  { username: 'Eclair', email: 'eclair@example.com', role: 'User' },
  { username: 'Cupcake', email: 'cupcake@example.com', role: 'User' },
  { username: 'Gingerbread', email: 'gingerbread@example.com', role: 'User' },
  { username: 'Donut', email: 'donut@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'Chocolate Cake', email: 'chocolate.cake@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
  { username: 'KitKat', email: 'kitkat@example.com', role: 'User' },
]

const dialog = ref(false)
const selectedUser = ref<{ username: string; email: string; role: string } | null>(null)

const openDetailDialog = (user: { username: string; email: string; role: string }) => {
  selectedUser.value = user
  dialog.value = true
}


const page = ref(1)
const itemsPerPage = ref(5)

const itemsPerPageOptions = [5, 10, 50, 100]
const search = ref('')
const selectedRows = ref<string[]>([])

const filteredUser = computed(() => {
  return users.filter(item =>
    item.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUser.value.slice(start, end)
})

const pageCount = computed(() => Math.ceil(filteredUser.value.length / itemsPerPage.value))

// ✅ Apakah semua baris yang sedang ditampilkan sudah dipilih?
const allPageSelected = computed(() => {
  return paginatedUsers.value.every(item => selectedRows.value.includes(item.username))
})

// ✅ Toggle select all di halaman aktif
const toggleSelectAllOnPage = () => {
  if (allPageSelected.value) {
    // Hapus semua baris di halaman ini dari selectedRows
    selectedRows.value = selectedRows.value.filter(
      id => !paginatedUsers.value.some(item => item.username === id)
    )
  } else {
    // Tambahkan semua baris di halaman ini
    const toAdd = paginatedUsers.value
      .map(item => item.username)
      .filter(id => !selectedRows.value.includes(id))
    selectedRows.value = [...new Set([...selectedRows.value, ...toAdd])]
  }
}

const toggleSelection = (id: string) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(i => i !== id)
  } else {
    selectedRows.value.push(id)
  }
}

const newPassword = ref('')

const updatePassword = () => {
  if (!newPassword.value) return alert('Password tidak boleh kosong')

  // Lakukan request ke API atau console.log
  console.log('Update password untuk:', selectedUser.value?.username)
  console.log('Password baru:', newPassword.value)

  // Tutup dialog dan reset
  dialog.value = false
  newPassword.value = ''
}


</script>


<template>
  <!-- Title & Add Button -->
  <div class="d-flex justify-space-between align-center mb-4">
    <h3 class="text-h3 font-weight-bold">Daftar User</h3>
    <v-btn color="primary" variant="flat">+ Tambah User</v-btn>
  </div>

  <!-- Card -->
  <v-card elevation="4" class="pa-4">
    <!-- Search Field -->
    <div class="mb-4 d-flex">
      <v-text-field
        v-model="search"
        label="Cari User"
        append-inner-icon="ri-search-line"
        dense
        hide-details
        variant="outlined"
        clearable
        style="max-width: 200px"
      />
      
    </div>

    <!-- Table -->
    <v-table >
      <thead>
        <tr>
          <!-- ✅ Checkbox untuk select all on current page -->
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
        <tr
          v-for="(item, index) in paginatedUsers"
          :key="item.username"
        >
          <!-- Row checkbox -->
          <td>
            <v-checkbox
              density="compact"
              hide-details
              :model-value="selectedRows.includes(item.username)"
              @click.stop="toggleSelection(item.username)"
            />
          </td>
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td class="text-center">{{ item.username }}</td>
          <td class="text-center">{{ item.email }}</td>
            <td class="text-center">{{ item.role }}</td>
          <td class="text-center">
            <v-btn
  icon
  size="small"
  variant="text"
  class="ma-0 pa-0"
  @click="openDetailDialog(item)"
  
>
  <v-icon icon="ri-eye-line" />
</v-btn>


            <v-btn
  icon
  color="error"
  size="small"
  variant="text"
  class="ma-0 pa-0"
  
>
  <v-icon icon="ri-delete-bin-line" />
</v-btn>
          </td>
        </tr>

        <tr v-if="paginatedUsers.length === 0">
          <td colspan="5" class="text-center text-disabled">Tidak ada data ditemukan</td>
        </tr>
      </tbody>
    </v-table>
    

    <!-- Pagination + Rows per page -->
<v-card-actions class="justify-space-between flex-wrap gap-4">
  <!-- Rows per page -->
  <div class="d-flex align-center gap-2">
    <span class="text-caption">Rows per page:</span>
    <v-select
      v-model="itemsPerPage"
      :items="itemsPerPageOptions"
      variant="outlined"
      dense
      hide-details
      style="max-width: 100px"
    />
  </div>

  <!-- Pagination -->
  <v-pagination
    v-model="page"
    :length="pageCount"
    prev-icon="ri-arrow-left-s-line"
    next-icon="ri-arrow-right-s-line"
    total-visible="5"
    rounded
  />
</v-card-actions>
  </v-card>

  <v-dialog v-model="dialog" max-width="500">
  <v-card>
    <v-card-title class="text-h5 my-3 font-weight-bold">
      Detail User
    </v-card-title>

    <v-card-text v-if="selectedUser">
      <div class="mb-3">
        <p><strong>Username:</strong> {{ selectedUser.username }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Role:</strong> {{ selectedUser.role }}</p>
      </div>

      <v-divider class="my-4" />

      <h4 class="text-subtitle-1 font-weight-medium mb-2">Ubah Password</h4>

      <v-text-field
        v-model="newPassword"
        label="Password Baru"
        type="password"
        variant="outlined"
        dense
      />
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn variant="outlined" @click="dialog = false">Tutup</v-btn>
      <v-btn variant="flat" color="primary" @click="updatePassword">Simpan</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>
