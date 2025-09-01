<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon variant="outlined" color="black" class="bg-white mr-3" @click="goBack">
        <v-icon color="black">ri-arrow-left-line</v-icon>
      </v-btn>

      <div>
        <h2 class="text-h5 font-weight-bold mb-1">Edit Akta Kematian</h2>
        <div class="text-body-2 text-grey">Perbarui data akta kematian di bawah ini</div>
      </div>
    </div>

    <v-card class="pa-6" flat>
      <v-progress-linear v-if="loadingDetail" indeterminate class="mb-4" />

      <v-form v-if="!loadingDetail" @submit.prevent="submitForm" class="space-y-4">
        <!-- NIK -->
        <v-text-field
          class="mb-4"
          v-model="form.nik"
          label="NIK"
          placeholder="Masukkan NIK"
          variant="outlined" density="comfortable"
          :error="!!errors.nik" :error-messages="errors.nik" required
        />

        <!-- Nama Lengkap -->
        <v-text-field
          class="mb-4"
          v-model="form.nama_lengkap"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          variant="outlined" density="comfortable"
          :error="!!errors.nama_lengkap" :error-messages="errors.nama_lengkap" required
        />

        <!-- Tanggal Kematian -->
        <v-text-field
          class="mb-4"
          v-model="form.tanggal_kematian"
          label="Tanggal Kematian"
          type="date"
          variant="outlined" density="comfortable"
          :error="!!errors.tanggal_kematian" :error-messages="errors.tanggal_kematian" required
        />

        <!-- Tanggal Akta (WAJIB) -->
        <v-text-field
          class="mb-4"
          v-model="form.tanggal_akta"
          label="Tanggal Akta"
          type="date"
          :min="form.tanggal_kematian || undefined"
          variant="outlined" density="comfortable"
          :error="!!errors.tanggal_akta" :error-messages="errors.tanggal_akta" required
        />

        <!-- Nomor Akta -->
        <v-text-field
          class="mb-4"
          v-model="form.nomor_akta"
          label="Nomor Akta"
          placeholder="Masukkan nomor akta"
          variant="outlined" density="comfortable"
          :error="!!errors.nomor_akta" :error-messages="errors.nomor_akta" required
        />

        <div class="d-flex gap-2 mt-4">
          <v-btn type="submit" color="primary" :loading="saving" :disabled="saving || !isDirty">
            Simpan Perubahan
          </v-btn>
          <v-btn variant="text" @click="resetToOriginal" :disabled="saving || !isDirty">
            Reset ke Data Awal
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { getKematianById, updateKematian } from '@/api/kematian'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// id dari route
const id = ref<number>(Number(route.params.id))

// form & snapshot original
const form = ref({
  nik: '',
  nama_lengkap: '',
  tanggal_kematian: '', // yyyy-mm-dd
  tanggal_akta: '',     // yyyy-mm-dd (wajib)
  nomor_akta: '',
})
const original = ref({ ...form.value })

const loadingDetail = ref(true)
const saving = ref(false)
const errors = ref<Record<string, string[]>>({})

function clearErrors() {
  errors.value = {}
}

function normalizeDate(value?: string | null): string {
  if (!value) return ''
  // pastikan format yyyy-mm-dd
  return value.slice(0, 10)
}

async function loadDetail() {
  loadingDetail.value = true
  clearErrors()
  try {
    const { data } = await getKematianById(id.value)
    form.value = {
      nik: data.nik || '',
      nama_lengkap: data.nama_lengkap || '',
      tanggal_kematian: normalizeDate(data.tanggal_kematian),
      tanggal_akta: normalizeDate((data as any).tanggal_akta), // aman jika null
      nomor_akta: data.nomor_akta || '',
    }
    original.value = { ...form.value }
    console.log('[Edit Kematian] loaded:', { id: id.value, data })
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal memuat data.'
    alert(msg)
    router.back()
  } finally {
    loadingDetail.value = false
  }
}

// dirty check
const isDirty = computed(() => {
  const a = form.value
  const b = original.value
  return (
    a.nik !== b.nik ||
    a.nama_lengkap !== b.nama_lengkap ||
    a.tanggal_kematian !== b.tanggal_kematian ||
    a.tanggal_akta !== b.tanggal_akta ||
    a.nomor_akta !== b.nomor_akta
  )
})

function resetToOriginal() {
  form.value = { ...original.value }
}

async function submitForm() {
  clearErrors()

  // validasi sederhana
  const missing: string[] = []
  if (!form.value.nik) missing.push('NIK')
  if (!form.value.nama_lengkap) missing.push('Nama Lengkap')
  if (!form.value.tanggal_kematian) missing.push('Tanggal Kematian')
  if (!form.value.tanggal_akta) missing.push('Tanggal Akta')
  if (!form.value.nomor_akta) missing.push('Nomor Akta')
  if (missing.length) {
    alert(`Harap isi: ${missing.join(', ')}`)
    return
  }
  if (form.value.tanggal_akta < form.value.tanggal_kematian) {
    alert('Tanggal Akta tidak boleh lebih awal dari Tanggal Kematian.')
    return
  }

  saving.value = true
  try {
    await updateKematian(id.value, {
      nik: form.value.nik,
      nama_lengkap: form.value.nama_lengkap,
      tanggal_kematian: form.value.tanggal_kematian,
      tanggal_akta: form.value.tanggal_akta,   // <-- ikut dikirim
      nomor_akta: form.value.nomor_akta,
    })
    original.value = { ...form.value }
    router.push('/aktakematian')
  } catch (e: any) {
    if (e?.response?.status === 401) {
      alert('Sesi habis. Silakan login kembali.')
      router.push('/login')
      return
    }
    const ve = e?.response?.data?.errors
    if (ve && typeof ve === 'object') {
      errors.value = ve
    } else {
      const msg = e?.response?.data?.message || 'Gagal memperbarui data.'
      alert(msg)
    }
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.back()
}

// load awal
onMounted(loadDetail)
// jika id di route berubah, muat ulang
watch(
  () => route.params.id,
  (val) => {
    id.value = Number(val)
    loadDetail()
  }
)
</script>
