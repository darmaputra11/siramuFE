<script lang="ts" setup>
import type { KematianResponse, KematianRow } from '@/api/kematian'
import { deleteKematian, getKematian } from '@/api/kematian'
import { useAuthStore } from '@/store/auth'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'

const router = useRouter()
const auth = useAuthStore()
const isViewer = computed(() => auth.isViewer)
// ====== STATE ======
const rows = ref<KematianRow[]>([])
const loading = ref(false)
const errorMsg = ref('')

const page = ref(1)
const itemsPerPage = ref(5)
const itemsPerPageOptions = [5, 10, 50, 100]
const search = ref('')

const startDate = ref<string | null>(null)
const endDate   = ref<string | null>(null)

const meta = ref({
  current_page: 1,
  per_page: 5,
  total: 0,
  last_page: 1,
})

// aman terhadap undefined
const safeRows = computed<KematianRow[]>(() => Array.isArray(rows.value) ? rows.value : [])

// ====== FETCH API ======
async function fetchKematian() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await getKematian({
      page: page.value,
      per_page: itemsPerPage.value,
      q: search.value || undefined,
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined,
      sort: 'oldest',
    })
    console.log('[Kematian] loaded:', data as KematianResponse)

    rows.value = data.data
    meta.value = {
      current_page: data.current_page,
      per_page: Number(data.per_page),
      total: data.total,
      last_page: data.last_page,
    }
    page.value = data.current_page
  } catch (e: any) {
    console.error('[Kematian] fetch error:', e?.response || e)
    errorMsg.value = e?.response?.data?.message || e?.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(fetchKematian)

// debounce input
let t: number | undefined
function triggerFetchDebounced() {
  window.clearTimeout(t)
  t = window.setTimeout(() => {
    page.value = 1
    fetchKematian()
  }, 400)
}

// watchers rapi
watch(itemsPerPage, () => { page.value = 1; fetchKematian() })
watch(page, (nv, ov) => { if (nv !== ov && !loading.value) fetchKematian() })

// ====== SELECTION ======
const selectedRows = ref<string[]>([]) // pakai NIK
const allPageSelected = computed(() =>
  safeRows.value.length > 0 && safeRows.value.every(r => selectedRows.value.includes(r.nik))
)

function toggleSelectAllOnPage() {
  if (allPageSelected.value) {
    selectedRows.value = selectedRows.value.filter(nik => !safeRows.value.some(r => r.nik === nik))
  } else {
    const add = safeRows.value.map(r => r.nik).filter(nik => !selectedRows.value.includes(nik))
    selectedRows.value = [...selectedRows.value, ...add]
  }
}
function toggleSelection(nik: string) {
  selectedRows.value = selectedRows.value.includes(nik)
    ? selectedRows.value.filter(n => n !== nik)
    : [...selectedRows.value, nik]
}

// reset filter
function resetFilter() {
  search.value = ''
  startDate.value = null
  endDate.value = null
  page.value = 1
  fetchKematian()
}

// export excel
function exportExcel() {
  const dataToExport = selectedRows.value.length
    ? rows.value.filter(r => selectedRows.value.includes(r.nik))
    : rows.value

  const exportData = dataToExport.map(r => ({
    NIK: r.nik,
    'Nama Lengkap': r.nama_lengkap,
    'Tanggal Kematian': r.tanggal_kematian,
    'Nomor Akta': r.nomor_akta,
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)
  XLSX.utils.book_append_sheet(wb, ws, 'Data Kematian')
  XLSX.writeFile(wb, 'data_kematian.xlsx')
}

// nav
function goToAddData() {
  router.push('/aktakematian/create')
}

// ====== DELETE DIALOG ======
const deleteDialog = ref(false)
const itemToDelete = ref<KematianRow | null>(null)
const deletingId = ref<number | null>(null)

function openDeleteDialog(item: KematianRow) {
  itemToDelete.value = item
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  try {
    deletingId.value = itemToDelete.value.id
    await deleteKematian(itemToDelete.value.id)

    deleteDialog.value = false
    const isLastItemOnPage = safeRows.value.length === 1 && page.value > 1
    if (isLastItemOnPage) page.value = page.value - 1
    await fetchKematian()
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal menghapus data.'
    alert(msg)
  } finally {
    itemToDelete.value = null
    deletingId.value = null
  }
}

// ====== TABLE HELPERS ======
const pageCount = computed(() => meta.value.last_page || 1)
const startNo   = computed(() => (meta.value.current_page - 1) * meta.value.per_page)
</script>

<template>
  <!-- Title & Add Button -->
  <div class="d-flex justify-space-between align-center mb-4">
    <h3 class="text-h3 font-weight-bold">Data Kematian</h3>
    <div class="d-flex align-center">
      <v-btn v-if="!isViewer" @click="goToAddData" color="primary" variant="flat" class="mr-2">
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
        density="comfortable"
        hide-details
        variant="outlined"
        clearable
        style="max-width: 250px"
        @input="triggerFetchDebounced"
      />

      <v-text-field
        v-model="startDate"
        type="date"
        label="Tanggal Awal"
        variant="outlined"
        density="comfortable"
        hide-details
        style="max-width: 200px"
        @update:model-value="triggerFetchDebounced"
      />

      <v-text-field
        v-model="endDate"
        type="date"
        label="Tanggal Akhir"
        variant="outlined"
        density="comfortable"
        hide-details
        style="max-width: 200px"
        @update:model-value="triggerFetchDebounced"
      />

      <v-btn color="secondary" variant="text" @click="resetFilter" class="d-flex align-center"
             style="height: 50px; min-width: 50px;">
        Reset Filter
      </v-btn>
    </div>

    <!-- Error banner -->
    <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4">
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
          <th>No</th>
          <th class="text-center">NIK</th>
          <th class="text-center">Nama Lengkap</th>
          <th class="text-center">Tanggal Kematian</th>
          <th class="text-center">Nomor Akta</th>
          <th v-if="!isViewer" class="text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in safeRows" :key="item.id ?? item.nik">
          <td>
            <v-checkbox
              density="compact"
              hide-details
              :model-value="selectedRows.includes(item.nik)"
              @click.stop="toggleSelection(item.nik)"
            />
          </td>
          <td>{{ startNo + index + 1 }}</td>
          <td class="text-center">{{ item.nik }}</td>
          <td class="text-center">{{ item.nama_lengkap }}</td>
          <td class="text-center">{{ item.tanggal_kematian }}</td>
          <td class="text-center">{{ item.nomor_akta }}</td>
          <td v-if="!isViewer" class="text-center">
            <v-btn
              icon size="small" variant="text" color="primary"
              @click="router.push(`/aktakematian/${item.id}/edit`)"
            >
              <v-icon class="ri-edit-box-line" />
            </v-btn>
            <v-btn
              icon size="small" variant="text" color="error"
              class="ma-0 pa-0"
              :loading="deletingId === item.id"
              :disabled="deletingId === item.id"
              @click="openDeleteDialog(item)"
            >
              <v-icon class="ri-delete-bin-line" />
            </v-btn>
          </td>
        </tr>

        <tr v-if="!loading && safeRows.length === 0">
          <td :colspan="isViewer ? 6 : 7" class="text-center text-disabled">Tidak ada data ditemukan</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Loading indicator -->
    <v-progress-linear v-if="loading" indeterminate class="mt-2" />

    <!-- Pagination -->
    <v-card-actions class="justify-space-between flex-wrap gap-4">
      <div class="d-flex align-center gap-2">
        <span class="text-caption">Rows per page:</span>
        <v-select
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          variant="outlined"
          density="comfortable"
          hide-details
          style="max-width: 100px"
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

  <!-- Delete Dialog -->
  <v-dialog v-model="deleteDialog" max-width="420">
    <v-card class="pa-4">
      <v-card-title class="text-h6 font-weight-bold mb-2">Delete Data</v-card-title>
      <v-card-text class="mb-4">
        Anda yakin untuk menghapus data akta kematian
        <strong>{{ itemToDelete?.nama_lengkap }}</strong> (NIK {{ itemToDelete?.nik }})?
      </v-card-text>
      <v-card-actions class="justify-end gap-2">
        <v-btn variant="outlined" class="flex-1" min-width="110" @click="deleteDialog = false">No</v-btn>
        <v-btn
          variant="flat" color="error" class="flex-1" min-width="110"
          :loading="deletingId === itemToDelete?.id"
          :disabled="deletingId === itemToDelete?.id"
          @click="confirmDelete"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
