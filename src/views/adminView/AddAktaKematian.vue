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
      <h2 class="text-h5 font-weight-bold mb-1">Tambah Akta Kematian</h2>
      <div class="text-body-2 text-grey">
        Lengkapi data dibawah untuk membuat data akta kematian baru
      </div>
    </div>
  </div>

    <!-- Card form -->
    <v-card class="pa-6" flat>
      <v-form @submit.prevent="submitForm" class="space-y-4">

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
/>

<!-- Tombol Simpan -->
<v-btn type="submit" color="primary" class="mt-4" :loading="loading" :disabled="loading">
  Simpan
</v-btn>

      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { createKematian } from '@/api/kematian'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = localStorage.getItem('token') || ''

const form = ref({
  nik: '',
  nama_lengkap: '',
  tanggal_kematian: '',
  nomor_akta: '',
})

const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

function clearErrors() {
  errors.value = {}
}

async function submitForm() {
  clearErrors()

  // validasi sederhana di client
  if (!form.value.nik || !form.value.nama_lengkap || !form.value.tanggal_kematian || !form.value.nomor_akta) {
    const missing: string[] = []
    if (!form.value.nik) missing.push('NIK')
    if (!form.value.nama_lengkap) missing.push('Nama Lengkap')
    if (!form.value.tanggal_kematian) missing.push('Tanggal Kematian')
    if (!form.value.nomor_akta) missing.push('Nomor Akta')
    alert(`Harap isi: ${missing.join(', ')}`)
    return
  }

  loading.value = true
  try {
    await createKematian({
      nik: form.value.nik,
      nama_lengkap: form.value.nama_lengkap,
      tanggal_kematian: form.value.tanggal_kematian, // yyyy-mm-dd
      nomor_akta: form.value.nomor_akta,
    })
    // sukses → kembali ke list
    router.push('/aktakematian')
  } catch (e: any) {
    // 401: token invalid → arahkan ke login (opsional)
    if (e?.response?.status === 401) {
      alert('Sesi habis. Silakan login kembali.')
      router.push('/login')
      return
    }
    // 422 validation dari Laravel
    const ve = e?.response?.data?.errors
    if (ve && typeof ve === 'object') {
      errors.value = ve
    } else {
      const msg = e?.response?.data?.message || 'Gagal menyimpan data.'
      alert(msg)
    }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}
</script>
