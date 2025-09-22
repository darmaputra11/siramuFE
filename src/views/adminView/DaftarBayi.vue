<script lang="ts" setup>
import type { BayiRow } from '@/api/bayi'
import { deleteBayi, getBayi } from '@/api/bayi'
import { useAuthStore } from '@/store/auth'
import { toDisplay } from '@/utils/date'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from "xlsx"

const router = useRouter()
const auth = useAuthStore()
const isViewer = computed(() => auth.isViewer)

// ===== STATE =====
const rows = ref<BayiRow[]>([])
const safeRows = computed<BayiRow[]>(() => Array.isArray(rows.value) ? rows.value : [])
const loading = ref(false)

const page = ref(1)
const itemsPerPage = ref(20)
const itemsPerPageOptions = [20, 50, 100, 500]
const search = ref('')

const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

const meta = ref({ current_page: 1, per_page: 5, total: 0, last_page: 1 })

// ===== API FETCH =====
async function fetchBayi() {
  loading.value = true
  try {
    const resp = await getBayi({
      page: page.value,
      per_page: itemsPerPage.value,
      q: search.value || undefined,
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined,
    })

    const payload: any = resp.data
    if (Array.isArray(payload)) {
      rows.value = payload
      meta.value = { current_page: 1, per_page: payload.length, total: payload.length, last_page: 1 }
      page.value = 1
    } else {
      rows.value = Array.isArray(payload.data) ? payload.data : []
      meta.value = {
        current_page: payload.current_page ?? 1,
        per_page: Number(payload.per_page ?? rows.value.length ?? itemsPerPage.value),
        total: payload.total ?? rows.value.length ?? 0,
        last_page: payload.last_page ?? 1,
      }
      page.value = meta.value.current_page
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchBayi)

// debounce input
let t: number | undefined
function triggerFetchDebounced() {
  window.clearTimeout(t)
  t = window.setTimeout(() => {
    page.value = 1
    fetchBayi()
  }, 400)
}

watch(itemsPerPage, () => { page.value = 1; fetchBayi() })
watch(page, () => { if (!loading.value) fetchBayi() })

// state dialog delete
const deleteDialog = ref(false)
const itemToDelete = ref<BayiRow | null>(null)
const deletingId = ref<number | null>(null)

function openDeleteDialog(item: BayiRow) {
  itemToDelete.value = item
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  try {
    deletingId.value = itemToDelete.value.id
    await deleteBayi(itemToDelete.value.id)

    deleteDialog.value = false
    const wasLastOnPage = safeRows.value.length === 1 && page.value > 1
    itemToDelete.value = null
    if (wasLastOnPage) page.value = page.value - 1

    await fetchBayi()
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal menghapus data.'
    alert(msg)
  } finally {
    deletingId.value = null
  }
}

// ===== TABLE HELPERS =====
const pageCount = computed(() => meta.value.last_page || 1)
const startNo   = computed(() => (meta.value.current_page - 1) * meta.value.per_page)

// selection
const selectedRows = ref<number[]>([])
const allPageSelected = computed(() => safeRows.value.every(item => selectedRows.value.includes(item.id)))

function toggleSelectAllOnPage() {
  if (allPageSelected.value) {
    selectedRows.value = selectedRows.value.filter(id => !safeRows.value.some(r => r.id === id))
  } else {
    const add = safeRows.value.map(r => r.id).filter(id => !selectedRows.value.includes(id))
    selectedRows.value = [...selectedRows.value, ...add]
  }
}
function toggleSelection(id: number) {
  selectedRows.value = selectedRows.value.includes(id)
    ? selectedRows.value.filter(x => x !== id)
    : [...selectedRows.value, id]
}

// reset filter
function resetFilter() {
  search.value = ''
  startDate.value = null
  endDate.value = null
  page.value = 1
  fetchBayi()
}

// export excel
function exportExcel() {
  const dataToExport = selectedRows.value.length
    ? safeRows.value.filter(r => selectedRows.value.includes(r.id))
    : safeRows.value

  const exportData = dataToExport.map((r, i) => ({
    'No': i + 1,
    'No Entitas': r.no_entitas,
    NIK: r.nik,
    Nama: r.nama,
    'Hubungan Keluarga': r.hub_keluarga,
    'Tanggal Lahir Bayi': toDisplay(r.tgl_lahir_bayi),
    'Nama Ibu Kandung': r.nama_ibu_kandung,
    'Tanggal Lahir Ibu': toDisplay(r.tgl_lahir_ibu_kandung),
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)
  XLSX.utils.book_append_sheet(wb, ws, "Data Bayi")
  XLSX.writeFile(wb, "data_bayi.xlsx")
}

// nav
function goToAddData() {
  router.push('/daftarbayi/create')
}
</script>

<template>
  <div>
    <!-- Title & Add Button -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h3 class="text-h3 font-weight-bold">Data Bayi</h3>
      </div>
      <div class="d-flex align-center">
        <v-btn v-if="!isViewer" @click="goToAddData" color="primary" variant="flat" class="mr-2">
          <v-icon class="ri-add-line mr-1" /> Tambah Data
        </v-btn>
        <v-btn color="success" @click="exportExcel">Export Excel</v-btn>
      </div>
    </div>

    <!-- Card -->
    <v-card elevation="4" class="pa-4">
      <!-- Search & Filter -->
      <div class="mb-4 d-flex gap-4 flex-wrap">
        <v-text-field
          v-model="search"
          label="Cari NIK / Nama / Entitas"
          append-inner-icon="ri-search-line"
          dense
          hide-details
          variant="outlined"
          clearable
          @input="triggerFetchDebounced"
          style="max-width: 250px"
        />
        <v-text-field
          v-model="startDate"
          type="date"
          label="Tanggal Awal Lahir"
          variant="outlined"
          dense
          hide-details
          style="max-width: 200px"
          @update:model-value="triggerFetchDebounced"
        />
        <v-text-field
          v-model="endDate"
          type="date"
          label="Tanggal Akhir Lahir"
          variant="outlined"
          dense
          hide-details
          style="max-width: 200px"
          @update:model-value="triggerFetchDebounced"
        />
        <v-btn color="secondary" variant="text" @click="resetFilter">Reset Filter</v-btn>
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
            <th class="text-center">No Entitas</th>
            <th class="text-center">NIK</th>
            <th class="text-center">Nama</th>
            <th class="text-center">Hubungan Keluarga</th>
            <th class="text-center">Tanggal Lahir Bayi</th>
            <th class="text-center">Nama Ibu Kandung</th>
            <th class="text-center">Tanggal Lahir Ibu</th>
            <th v-if="!isViewer" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in safeRows" :key="item.id">
            <td class="text-center">
              <v-checkbox
                density="compact"
                hide-details
                :model-value="selectedRows.includes(item.id)"
                @click.stop="toggleSelection(item.id)"
              />
            </td>
            <td>{{ startNo + index + 1 }}</td>
            <td class="text-center">{{ item.no_entitas }}</td>
            <td class="text-center">{{ item.nik }}</td>
            <td class="text-center">{{ item.nama }}</td>
            <td class="text-center">{{ item.hub_keluarga }}</td>
            <td class="text-center">{{ toDisplay(item.tgl_lahir_bayi) }}</td>
            <td class="text-center">{{ item.nama_ibu_kandung }}</td>
            <td class="text-center">{{ toDisplay(item.tgl_lahir_ibu_kandung) }}</td>
            <td v-if="!isViewer" class="text-center">
              <v-btn icon size="small" variant="text" color="primary" @click="router.push(`/daftarbayi/${item.id}/edit`)">
                <v-icon class="ri-edit-box-line" />
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                :loading="deletingId === item.id"
                :disabled="deletingId === item.id"
                @click="openDeleteDialog(item)"
              >
                <v-icon class="ri-delete-bin-line" />
              </v-btn>
            </td>
          </tr>
          <tr v-if="!loading && safeRows.length === 0">
            <td :colspan="isViewer ? 9 : 10" class="text-center text-disabled">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </v-table>

      <v-progress-linear v-if="loading" indeterminate class="mt-2" />

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

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="pa-4">
        <v-card-title class="text-h6 font-weight-bold mb-2">Hapus Data</v-card-title>
        <v-card-text class="mb-4">
          Anda yakin ingin menghapus data bayi
          <strong>{{ itemToDelete?.nama }}</strong> (NIK {{ itemToDelete?.nik }})?
        </v-card-text>
        <v-card-actions class="justify-end gap-2">
          <v-btn variant="outlined" class="flex-1" min-width="110" @click="deleteDialog = false">Batal</v-btn>
          <v-btn
            variant="flat"
            color="error"
            class="flex-1"
            min-width="110"
            :loading="deletingId === itemToDelete?.id"
            :disabled="deletingId === itemToDelete?.id"
            @click="confirmDelete"
          >
            Hapus
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
