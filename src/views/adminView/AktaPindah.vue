<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from "xlsx"

const router = useRouter()

// Contoh data pindah (sementara)
const pindahList = [
  { id: 1, nik: '3201010101010001', nama: 'Budi Santoso', no_kk: '3271010101010001', nomor_pindah: 'P-001', tanggal_pindah: '2025-01-05', created_at: '2025-01-05', updated_at: '2025-01-05' },
  { id: 2, nik: '3201010101010002', nama: 'Siti Aminah', no_kk: '3271010101010002', nomor_pindah: 'P-002', tanggal_pindah: '2025-01-18', created_at: '2025-01-18', updated_at: '2025-01-18' },
  { id: 3, nik: '3201010101010003', nama: 'Andi Wijaya', no_kk: '3271010101010003', nomor_pindah: 'P-003', tanggal_pindah: '2025-02-02', created_at: '2025-02-02', updated_at: '2025-02-02' },
  { id: 4, nik: '3201010101010004', nama: 'Dewi Lestari', no_kk: '3271010101010004', nomor_pindah: 'P-004', tanggal_pindah: '2025-02-12', created_at: '2025-02-12', updated_at: '2025-02-12' },
  { id: 5, nik: '3201010101010005', nama: 'Agus Prabowo', no_kk: '3271010101010005', nomor_pindah: 'P-005', tanggal_pindah: '2025-02-25', created_at: '2025-02-25', updated_at: '2025-02-25' },
  { id: 6, nik: '3201010101010006', nama: 'Wulan Sari', no_kk: '3271010101010006', nomor_pindah: 'P-006', tanggal_pindah: '2025-03-03', created_at: '2025-03-03', updated_at: '2025-03-03' },
  { id: 7, nik: '3201010101010007', nama: 'Rudi Hartono', no_kk: '3271010101010007', nomor_pindah: 'P-007', tanggal_pindah: '2025-03-11', created_at: '2025-03-11', updated_at: '2025-03-11' },
  { id: 8, nik: '3201010101010008', nama: 'Mega Putri', no_kk: '3271010101010008', nomor_pindah: 'P-008', tanggal_pindah: '2025-03-20', created_at: '2025-03-20', updated_at: '2025-03-20' },
  { id: 9, nik: '3201010101010009', nama: 'Ahmad Fauzi', no_kk: '3271010101010009', nomor_pindah: 'P-009', tanggal_pindah: '2025-04-04', created_at: '2025-04-04', updated_at: '2025-04-04' },
  { id: 10, nik: '3201010101010010', nama: 'Lina Marlina', no_kk: '3271010101010010', nomor_pindah: 'P-010', tanggal_pindah: '2025-04-14', created_at: '2025-04-14', updated_at: '2025-04-14' },
  { id: 11, nik: '3201010101010011', nama: 'Fajar Nugraha', no_kk: '3271010101010011', nomor_pindah: 'P-011', tanggal_pindah: '2025-04-27', created_at: '2025-04-27', updated_at: '2025-04-27' },
  { id: 12, nik: '3201010101010012', nama: 'Sri Wahyuni', no_kk: '3271010101010012', nomor_pindah: 'P-012', tanggal_pindah: '2025-05-01', created_at: '2025-05-01', updated_at: '2025-05-01' },
  { id: 13, nik: '3201010101010013', nama: 'Bayu Saputra', no_kk: '3271010101010013', nomor_pindah: 'P-013', tanggal_pindah: '2025-05-10', created_at: '2025-05-10', updated_at: '2025-05-10' },
  { id: 14, nik: '3201010101010014', nama: 'Maya Andini', no_kk: '3271010101010014', nomor_pindah: 'P-014', tanggal_pindah: '2025-05-22', created_at: '2025-05-22', updated_at: '2025-05-22' },
  { id: 15, nik: '3201010101010015', nama: 'Yusuf Maulana', no_kk: '3271010101010015', nomor_pindah: 'P-015', tanggal_pindah: '2025-06-06', created_at: '2025-06-06', updated_at: '2025-06-06' },
  { id: 16, nik: '3201010101010016', nama: 'Dina Puspita', no_kk: '3271010101010016', nomor_pindah: 'P-016', tanggal_pindah: '2025-06-18', created_at: '2025-06-18', updated_at: '2025-06-18' },
  { id: 17, nik: '3201010101010017', nama: 'Hendra Setiawan', no_kk: '3271010101010017', nomor_pindah: 'P-017', tanggal_pindah: '2025-06-29', created_at: '2025-06-29', updated_at: '2025-06-29' },
  { id: 18, nik: '3201010101010018', nama: 'Sari Handayani', no_kk: '3271010101010018', nomor_pindah: 'P-018', tanggal_pindah: '2025-07-03', created_at: '2025-07-03', updated_at: '2025-07-03' },
  { id: 19, nik: '3201010101010019', nama: 'Bambang Wibowo', no_kk: '3271010101010019', nomor_pindah: 'P-019', tanggal_pindah: '2025-07-12', created_at: '2025-07-12', updated_at: '2025-07-12' },
  { id: 20, nik: '3201010101010020', nama: 'Ratna Dewi', no_kk: '3271010101010020', nomor_pindah: 'P-020', tanggal_pindah: '2025-07-25', created_at: '2025-07-25', updated_at: '2025-07-25' },
  { id: 21, nik: '3201010101010021', nama: 'Cahyo Adi', no_kk: '3271010101010021', nomor_pindah: 'P-021', tanggal_pindah: '2025-08-01', created_at: '2025-08-01', updated_at: '2025-08-01' },
  { id: 22, nik: '3201010101010022', nama: 'Rina Astuti', no_kk: '3271010101010022', nomor_pindah: 'P-022', tanggal_pindah: '2025-08-14', created_at: '2025-08-14', updated_at: '2025-08-14' },
  { id: 23, nik: '3201010101010023', nama: 'Dedi Gunawan', no_kk: '3271010101010023', nomor_pindah: 'P-023', tanggal_pindah: '2025-08-21', created_at: '2025-08-21', updated_at: '2025-08-21' },
  { id: 24, nik: '3201010101010024', nama: 'Yuni Kurnia', no_kk: '3271010101010024', nomor_pindah: 'P-024', tanggal_pindah: '2025-09-05', created_at: '2025-09-05', updated_at: '2025-09-05' },
  { id: 25, nik: '3201010101010025', nama: 'Tono Prasetyo', no_kk: '3271010101010025', nomor_pindah: 'P-025', tanggal_pindah: '2025-09-16', created_at: '2025-09-16', updated_at: '2025-09-16' },
  { id: 26, nik: '3201010101010026', nama: 'Ayu Lestari', no_kk: '3271010101010026', nomor_pindah: 'P-026', tanggal_pindah: '2025-09-28', created_at: '2025-09-28', updated_at: '2025-09-28' },
  { id: 27, nik: '3201010101010027', nama: 'Rangga Pratama', no_kk: '3271010101010027', nomor_pindah: 'P-027', tanggal_pindah: '2025-10-04', created_at: '2025-10-04', updated_at: '2025-10-04' },
  { id: 28, nik: '3201010101010028', nama: 'Lestari Wulandari', no_kk: '3271010101010028', nomor_pindah: 'P-028', tanggal_pindah: '2025-10-18', created_at: '2025-10-18', updated_at: '2025-10-18' },
  { id: 29, nik: '3201010101010029', nama: 'Gilang Saputra', no_kk: '3271010101010029', nomor_pindah: 'P-029', tanggal_pindah: '2025-10-27', created_at: '2025-10-27', updated_at: '2025-10-27' },
  { id: 30, nik: '3201010101010030', nama: 'Fitri Handayani', no_kk: '3271010101010030', nomor_pindah: 'P-030', tanggal_pindah: '2025-11-08', created_at: '2025-11-08', updated_at: '2025-11-08' },
  { id: 31, nik: '3201010101010031', nama: 'Irfan Maulana', no_kk: '3271010101010031', nomor_pindah: 'P-031', tanggal_pindah: '2025-11-14', created_at: '2025-11-14', updated_at: '2025-11-14' },
  { id: 32, nik: '3201010101010032', nama: 'Anisa Putri', no_kk: '3271010101010032', nomor_pindah: 'P-032', tanggal_pindah: '2025-11-25', created_at: '2025-11-25', updated_at: '2025-11-25' },
  { id: 33, nik: '3201010101010033', nama: 'Zainal Abidin', no_kk: '3271010101010033', nomor_pindah: 'P-033', tanggal_pindah: '2025-12-05', created_at: '2025-12-05', updated_at: '2025-12-05' },
  { id: 34, nik: '3201010101010034', nama: 'Sulastri', no_kk: '3271010101010034', nomor_pindah: 'P-034', tanggal_pindah: '2025-12-20', created_at: '2025-12-20', updated_at: '2025-12-20' },
]


// Pagination & search
const page = ref(1)
const itemsPerPage = ref(5)
const itemsPerPageOptions = [5, 10, 50, 100]
const search = ref('')

// Filter bulan (otomatis dari Intl)
const bulanFilter = ref('')
const bulanOptions = [
  { text: 'Semua', value: '' },
  ...Array.from({ length: 12 }, (_, i) => ({
    text: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2000, i, 1)),
    value: String(i + 1).padStart(2, '0')
  }))
]

// Checkbox selection
const selectedRows = ref<number[]>([])

const filteredData = computed(() => {
  return pindahList.filter(item => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      item.nik.includes(search.value)
    const matchMonth =
      !bulanFilter.value || item.tanggal_pindah.slice(5, 7) === bulanFilter.value
    return matchSearch && matchMonth
  })
})

const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  return filteredData.value.slice(start, start + itemsPerPage.value)
})

const pageCount = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const allPageSelected = computed(() =>
  paginatedData.value.every(item => selectedRows.value.includes(item.id))
)

const toggleSelectAllOnPage = () => {
  if (allPageSelected.value) {
    selectedRows.value = selectedRows.value.filter(
      id => !paginatedData.value.some(item => item.id === id)
    )
  } else {
    const toAdd = paginatedData.value
      .map(item => item.id)
      .filter(id => !selectedRows.value.includes(id))
    selectedRows.value = [...selectedRows.value, ...toAdd]
  }
}

const toggleSelection = (id: number) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(i => i !== id)
  } else {
    selectedRows.value.push(id)
  }
}

const goToAddData = () => {
  router.push('/aktapindah/create')
}

const exportExcel = () => {
  let exportData

  if (selectedRows.value.length > 0) {
    // Ambil data berdasarkan NIK yang tercentang
    exportData = pindahList.filter(item => selectedRows.value.includes(item.id))
  } else {
    // Kalau tidak ada yang dicentang, ambil hasil filter bulan & search
    exportData = filteredData.value
  }

  // Buat workbook dan worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)

  // Masukkan worksheet ke workbook
  XLSX.utils.book_append_sheet(wb, ws, "Data Pindah")

  // Simpan sebagai file Excel
  XLSX.writeFile(wb, "data_pindah.xlsx")
}

</script>

<template>
  <div>
      <!-- Title & Add Button -->
<div class="d-flex justify-space-between align-center mb-4">
  <!-- Kolom kiri: Title -->
  <div>
    <h3 class="text-h3 font-weight-bold">Data Kematian</h3>
  </div>

  <!-- Kolom kanan: Tombol -->
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
      <!-- Search & Filter -->
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
        <v-select
          v-model="bulanFilter"
          :items="bulanOptions"
          item-title="text"
          item-value="value"
          label="Filter Bulan"
          variant="outlined"
          dense
          hide-details
          style="max-width: 200px"
        />
      </div>

      <!-- Table -->
      <v-table>
        <thead>
          <tr>
            <th class="text-center">
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
            <th class="text-center">No KK</th>
            <th class="text-center">Nomor Pindah</th>
            <th class="text-center">Tanggal Pindah</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id">
            <td class="text-center">
              <v-checkbox
                density="compact"
                hide-details
                :model-value="selectedRows.includes(item.id)"
                @click.stop="toggleSelection(item.id)"
              />
            </td>
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td class="text-center">{{ item.nik }}</td>
            <td class="text-center">{{ item.nama }}</td>
            <td class="text-center">{{ item.no_kk }}</td>
            <td class="text-center">{{ item.nomor_pindah }}</td>
            <td class="text-center">{{ item.tanggal_pindah }}</td>
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
            <td colspan="8" class="text-center text-disabled">Tidak ada data ditemukan</td>
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
  </div>
</template>
