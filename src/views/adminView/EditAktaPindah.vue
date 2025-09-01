<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon variant="outlined" color="black" class="bg-white mr-3" @click="goBack">
        <v-icon color="black">ri-arrow-left-line</v-icon>
      </v-btn>

      <div>
        <h2 class="text-h5 font-weight-bold mb-1">Edit Data Pindah</h2>
        <div class="text-body-2 text-grey">Perbarui data di bawah untuk menyimpan perubahan</div>
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
          outlined dense required
          :error="!!errors.nik" :error-messages="errors.nik"
        />

        <!-- Nama Lengkap -->
        <v-text-field
          class="mb-4"
          v-model="form.nama_lengkap"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          outlined dense required
          :error="!!errors.nama_lengkap" :error-messages="errors.nama_lengkap"
        />

        <!-- Nomor KK -->
        <v-text-field
          class="mb-4"
          v-model="form.nomor_kk"
          label="Nomor KK"
          placeholder="Masukkan nomor KK"
          outlined dense required
          :error="!!errors.nomor_kk" :error-messages="errors.nomor_kk"
        />

        <!-- Nomor Pindah -->
        <v-text-field
          class="mb-4"
          v-model="form.nomor_pindah"
          label="Nomor Pindah"
          placeholder="Masukkan nomor pindah"
          outlined dense required
          :error="!!errors.nomor_pindah" :error-messages="errors.nomor_pindah"
        />

        <!-- Tanggal Pindah -->
        <v-text-field
          class="mb-4"
          v-model="form.tanggal_pindah"
          label="Tanggal"
          type="date"
          outlined dense required
          :error="!!errors.tanggal_pindah" :error-messages="errors.tanggal_pindah"
        />

        <div class="d-flex gap-2 mt-4">
          <v-btn
            type="submit"
            color="primary"
            :loading="saving"
            :disabled="saving || !isDirty"
          >
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
import { getPindahById, updatePindah } from '@/api/pindah'
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
  nomor_kk: '',
  nomor_pindah: '',
  tanggal_pindah: '', // yyyy-mm-dd
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
  return value.slice(0, 10) // yyyy-mm-dd
}

async function loadDetail() {
  loadingDetail.value = true
  clearErrors()
  try {
    const { data } = await getPindahById(id.value)
    form.value = {
      nik: data.nik || '',
      nama_lengkap: data.nama_lengkap || '',
      nomor_kk: data.nomor_kk || '',
      nomor_pindah: data.nomor_pindah || '',
      tanggal_pindah: normalizeDate(data.tanggal_pindah),
    }
    original.value = { ...form.value }
    console.log('[Edit Pindah] loaded:', { id: id.value, data })
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
    a.nomor_kk !== b.nomor_kk ||
    a.nomor_pindah !== b.nomor_pindah ||
    a.tanggal_pindah !== b.tanggal_pindah
  )
})

function resetToOriginal() {
  form.value = { ...original.value }
}

async function submitForm() {
  clearErrors()

  // validasi ringan
  const missing: string[] = []
  if (!form.value.nik) missing.push('NIK')
  if (!form.value.nama_lengkap) missing.push('Nama Lengkap')
  if (!form.value.nomor_kk) missing.push('Nomor KK')
  if (!form.value.nomor_pindah) missing.push('Nomor Pindah')
  if (!form.value.tanggal_pindah) missing.push('Tanggal Pindah')
  if (missing.length) {
    alert(`Harap isi: ${missing.join(', ')}`)
    return
  }

  saving.value = true
  try {
    await updatePindah(id.value, {
      nik: form.value.nik.trim(),
      nama_lengkap: form.value.nama_lengkap.trim(),
      nomor_kk: form.value.nomor_kk.trim(),
      nomor_pindah: form.value.nomor_pindah.trim(),
      tanggal_pindah: form.value.tanggal_pindah, // yyyy-mm-dd
    })
    // update snapshot agar tombol simpan nonaktif lagi
    original.value = { ...form.value }
    router.push('/aktapindah')
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
      alert(e?.response?.data?.message || 'Gagal menyimpan perubahan.')
    }
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(loadDetail)

// jika id di route berubah, muat ulang
watch(
  () => route.params.id,
  (val) => {
    id.value = Number(val)
    if (!Number.isNaN(id.value)) loadDetail()
  }
)
</script>
