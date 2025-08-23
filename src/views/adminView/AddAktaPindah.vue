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
        <h2 class="text-h5 font-weight-bold mb-1">Tambah Data Pindah</h2>
        <div class="text-body-2 text-grey">
          Lengkapi data di bawah untuk membuat data pindah baru
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
  outlined dense required
  :error="!!errors.nik" :error-messages="errors.nik"
/>

<!-- Nama Lengkap -->
<v-text-field
  class="mb-4"
  v-model="form.nama_lengkap"
  label="Nama Lengkap"
  outlined dense required
  :error="!!errors.nama_lengkap" :error-messages="errors.nama_lengkap"
/>

<!-- Nomor KK -->
<v-text-field
  class="mb-4"
  v-model="form.nomor_kk" 
  label="Nomor KK"
  outlined dense required
  :error="!!errors.nomor_kk" :error-messages="errors.nomor_kk"
/>

<!-- Nomor Pindah -->
<v-text-field
  class="mb-4"
  v-model="form.nomor_pindah"
  label="Nomor Pindah"
  outlined dense required
  :error="!!errors.nomor_pindah" :error-messages="errors.nomor_pindah"
/>

<!-- Tanggal Pindah -->
<v-text-field
  class="mb-4"
  v-model="form.tanggal_pindah"
  label="Tanggal Pindah"
  type="date" outlined dense required
  :error="!!errors.tanggal_pindah" :error-messages="errors.tanggal_pindah"
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
import { createPindah } from '@/api/pindah'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = localStorage.getItem('token') || ''

const form = ref({
  nik: '',
  nama_lengkap: '',
  nomor_kk: '',        // <-- ganti no_kk -> nomor_kk
  nomor_pindah: '',
  tanggal_pindah: '',
})

const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

function clearErrors() { errors.value = {} }

async function submitForm() {
  clearErrors()

  // validasi ringan di client
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

  loading.value = true
  try {
    await createPindah(token, {
      nik: form.value.nik,
      nama_lengkap: form.value.nama_lengkap,
      nomor_kk: form.value.nomor_kk,
      nomor_pindah: form.value.nomor_pindah,
      tanggal_pindah: form.value.tanggal_pindah, // yyyy-mm-dd
    })
    router.push('/aktapindah') // kembali ke list
  } catch (e: any) {
    if (e?.response?.status === 401) {
      alert('Sesi habis. Silakan login kembali.')
      router.push('/login')
      return
    }
    const ve = e?.response?.data?.errors
    if (ve && typeof ve === 'object') {
      errors.value = ve               // tampilkan error per-field
    } else {
      alert(e?.response?.data?.message || 'Gagal menyimpan data.')
    }
  } finally {
    loading.value = false
  }
}

function goBack() { router.back() }
</script>

