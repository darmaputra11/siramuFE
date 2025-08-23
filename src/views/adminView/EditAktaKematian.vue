<template>
  <div>
    <div class="d-flex align-center mb-4">
      <!-- Back Button -->
      <v-btn
        icon
        variant="outlined"
        color="black"
        class="bg-white mr-3"
        @click="goBack"
      >
        <v-icon color="black">ri-arrow-left-line</v-icon>
      </v-btn>

      <!-- Title & Subtitle -->
      <div>
        <h2 class="text-h5 font-weight-bold mb-1">Edit Akta Kematian</h2>
        <div class="text-body-2 text-grey">
          Perbarui data akta kematian di bawah ini
        </div>
      </div>
    </div>

    <!-- Card form -->
    <v-card class="pa-6" flat>
      <!-- indikator loading detail -->
      <v-progress-linear v-if="loadingDetail" indeterminate class="mb-4" />

      <v-form @submit.prevent="submitForm" class="space-y-4" v-if="!loadingDetail">
        <!-- NIK -->
        <v-text-field
          class="mb-4"
          v-model="form.nik"
          label="NIK"
          placeholder="Masukkan NIK"
          outlined
          dense
          :error="!!errors.nik"
          :error-messages="errors.nik"
          required
        />

        <!-- Nama Lengkap -->
        <v-text-field
          class="mb-4"
          v-model="form.nama_lengkap"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          outlined
          dense
          :error="!!errors.nama_lengkap"
          :error-messages="errors.nama_lengkap"
          required
        />

        <!-- Tanggal Kematian -->
        <v-text-field
          class="mb-4"
          v-model="form.tanggal_kematian"
          label="Tanggal Kematian"
          type="date"
          outlined
          dense
          :error="!!errors.tanggal_kematian"
          :error-messages="errors.tanggal_kematian"
          required
        />

        <!-- Nomor Akta -->
        <v-text-field
          class="mb-4"
          v-model="form.nomor_akta"
          label="Nomor Akta"
          placeholder="Masukkan nomor akta"
          outlined
          dense
          :error="!!errors.nomor_akta"
          :error-messages="errors.nomor_akta"
          required
        />

        <!-- Tombol Simpan -->
        <v-btn type="submit" color="primary" class="mt-4" :loading="saving" :disabled="saving">
          Simpan Perubahan
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { getKematianById, updateKematian } from '@/api/kematian'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const token = localStorage.getItem('token') || ''

const id = Number(route.params.id)

const form = ref({
  nik: '',
  nama_lengkap: '',
  tanggal_kematian: '', // yyyy-mm-dd
  nomor_akta: '',
})

const loadingDetail = ref(true)
const saving = ref(false)
const errors = ref<Record<string, string[]>>({})

function clearErrors() {
  errors.value = {}
}

async function loadDetail() {
  loadingDetail.value = true
  try {
    const { data } = await getKematianById(token, id)
    // isi form dengan nilai dari API
    form.value.nik = data.nik
    form.value.nama_lengkap = data.nama_lengkap
    // pastikan format date yyyy-mm-dd
    form.value.tanggal_kematian = (data.tanggal_kematian || '').slice(0, 10)
    form.value.nomor_akta = data.nomor_akta
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal memuat data.'
    alert(msg)
    router.back()
  } finally {
    loadingDetail.value = false
  }
}

async function submitForm() {
  clearErrors()

  // validasi ringan
  if (!form.value.nik || !form.value.nama_lengkap || !form.value.tanggal_kematian || !form.value.nomor_akta) {
    const missing: string[] = []
    if (!form.value.nik) missing.push('NIK')
    if (!form.value.nama_lengkap) missing.push('Nama Lengkap')
    if (!form.value.tanggal_kematian) missing.push('Tanggal Kematian')
    if (!form.value.nomor_akta) missing.push('Nomor Akta')
    alert(`Harap isi: ${missing.join(', ')}`)
    return
  }

  saving.value = true
  try {
    await updateKematian(token, id, {
      nik: form.value.nik,
      nama_lengkap: form.value.nama_lengkap,
      tanggal_kematian: form.value.tanggal_kematian,
      nomor_akta: form.value.nomor_akta,
    })
    // sukses → kembali ke list
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

onMounted(loadDetail)
</script>
