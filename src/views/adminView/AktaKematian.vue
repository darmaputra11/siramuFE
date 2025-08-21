<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore
import * as XLSX from "xlsx"

const router = useRouter()

// Contoh data kematian
const kematianList = [
  { nik: '3201010101010001', nama: 'Budi Santoso', tanggal_kematian: '2025-01-15', nomor_akta: 'AKM-001' },
  { nik: '3201010101010002', nama: 'Siti Aminah', tanggal_kematian: '2025-02-01', nomor_akta: 'AKM-002' },
  { nik: '3201010101010003', nama: 'Andi Wijaya', tanggal_kematian: '2025-02-10', nomor_akta: 'AKM-003' },
  { nik: '3201010101010004', nama: 'Dewi Lestari', tanggal_kematian: '2025-03-05', nomor_akta: 'AKM-004' },
  { nik: '3201010101010005', nama: 'Agus Prabowo', tanggal_kematian: '2025-03-12', nomor_akta: 'AKM-005' },
]

// Date range filter
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

// Export Excel
const exportExcel = () => {
  let exportData
  if (selectedRows.value.length > 0) {
    exportData = kematianList.filter(item => selectedRows.value.includes(item.nik))
  } else {
    exportData = filteredData.value
  }
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)
  XLSX.utils.book_append_sheet(wb, ws, "Data Kematian")
  XLSX.writeFile(wb, "data_kematian.xlsx")
}

// Pagination & search
const page = ref(1)
const itemsPerPage = ref(5)
const itemsPerPageOptions = [5, 10, 50, 100]
const search = ref('')

// Reset Filter
const resetFilter = () => {
  search.value = ''
  startDate.value = null
  endDate.value = null
}

// Checkbox selection
const selectedRows = ref<string[]>([])

// Filtered data
const filteredData = computed(() => {
  return kematianList.filter(item => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      item.nik.includes(search.value)

    const itemDate = new Date(item.tanggal_kematian)
    const matchDate =
      (!startDate.value || itemDate >= new Date(startDate.value)) &&
      (!endDate.value || itemDate <= new Date(endDate.value))

    return matchSearch && matchDate
  })
})

const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  return filteredData.value.slice(start, start + itemsPerPage.value)
})

const pageCount = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const allPageSelected = computed(() => {
  return paginatedData.value.every(item => selectedRows.value.includes(item.nik))
})

const toggleSelectAllOnPage = () => {
  if (allPageSelected.value) {
    selectedRows.value = selectedRows.value.filter(
      id => !paginatedData.value.some(item => item.nik === id)
    )
  } else {
    const toAdd = paginatedData.value
      .map(item => item.nik)
      .filter(id => !selectedRows.value.includes(id))
    selectedRows.value = [...selectedRows.value, ...toAdd]
  }
}

const toggleSelection = (id: string) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(i => i !== id)
  } else {
    selectedRows.value.push(id)
  }
}

// Action
const goToAddData = () => {
  router.push('/aktakematian/create')
}
</script>

<template>
  <!-- Title & Add Button -->
  <div class="d-flex justify-space-between align-center mb-4">
    <h3 class="text-h3 font-weight-bold">Data Kematian</h3>
    <div class="d-flex align-center">
      <v-btn @click="goToAddData" color="primary" variant="flat" class="mr-2">
        <v-icon class="ri-add-line mr-1" /> Tambah Data
      </v-btn>
      <v-btn color="success" @click="exportExcel">
        Export Excel
      </v-btn>
    </div>
  </div>

  <!-- Card -->
  <v-card elevation="4" class="pa-4">
    <!-- Search & Date Filter -->
    <div class="mb-4 d-flex gap-4 flex-wrap">
      <v-text-field
        v-model="search"
        label="Cari NIK / Nama"
        append-inner-icon="ri-search-line"
        dense
        hide-details
        variant="outlined"
        clearable
        style="max-width: 250px"
      />

      <v-text-field
        v-model="startDate"
        type="date"
        label="Tanggal Awal"
        variant="outlined"
        dense
        hide-details
        style="max-width: 200px"
      />

      <v-text-field
        v-model="endDate"
        type="date"
        label="Tanggal Akhir"
        variant="outlined"
        dense
        hide-details
        style="max-width: 200px"
      />

      <!-- Tombol Reset -->
  <v-btn
  color="secondary"
  variant="text"
  @click="resetFilter"
  class="d-flex align-center"
  style="height: 50px; min-width: 50px;"
>
  Reset Filter
</v-btn>
    </div>

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
          <th>No</th>
          <th class="text-center">NIK</th>
          <th class="text-center">Nama Lengkap</th>
          <th class="text-center">Tanggal Kematian</th>
          <th class="text-center">Nomor Akta</th>
          <th class="text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="item.nik">
          <td>
            <v-checkbox
              density="compact"
              hide-details
              :model-value="selectedRows.includes(item.nik)"
              @click.stop="toggleSelection(item.nik)"
            />
          </td>
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td class="text-center">{{ item.nik }}</td>
          <td class="text-center">{{ item.nama }}</td>
          <td class="text-center">{{ item.tanggal_kematian }}</td>
          <td class="text-center">{{ item.nomor_akta }}</td>
          <td class="text-center">
            <v-btn icon size="small" variant="text" color="primary">
              <v-icon class="ri-edit-box-line" />
            </v-btn>
            <v-btn icon size="small" variant="text" color="error">
              <v-icon class="ri-delete-bin-line" />
            </v-btn>
          </td>
        </tr>

        <tr v-if="paginatedData.length === 0">
          <td colspan="7" class="text-center text-disabled">Tidak ada data ditemukan</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Pagination -->
    <v-card-actions class="justify-space-between flex-wrap gap-4">
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
</template>
