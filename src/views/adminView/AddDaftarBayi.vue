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
        <h2 class="text-h5 font-weight-bold mb-1">Tambah Data Bayi</h2>
        <div class="text-body-2 text-grey">
          Lengkapi data di bawah untuk membuat data bayi baru
        </div>
      </div>
    </div>

    <!-- Card form -->
    <v-card class="pa-6" flat>
      <v-form @submit.prevent="submitForm" class="space-y-4">

        <!-- No Entitas -->
        <v-text-field
          class="mb-4"
          v-model="form.no_entitas"
          label="No Entitas"
          outlined dense required
          :error="!!errors.no_entitas" :error-messages="errors.no_entitas"
        />

        <!-- NIK -->
        <v-text-field
          class="mb-4"
          v-model="form.nik"
          label="NIK"
          outlined dense required
          :error="!!errors.nik" :error-messages="errors.nik"
        />

        <!-- Nama -->
        <v-text-field
          class="mb-4"
          v-model="form.nama"
          label="Nama Bayi"
          outlined dense required
          :error="!!errors.nama" :error-messages="errors.nama"
        />

        <!-- Hubungan Keluarga -->
        <v-text-field
          class="mb-4"
          v-model="form.hub_keluarga"
          label="Hubungan Keluarga"
          outlined dense
          :error="!!errors.hub_keluarga" :error-messages="errors.hub_keluarga"
        />

        <!-- Tanggal Lahir Bayi -->
        <v-text-field
          class="mb-4"
          v-model="form.tgl_lahir_bayi"
          label="Tanggal Lahir Bayi"
          type="date" outlined dense required
          :error="!!errors.tgl_lahir_bayi" :error-messages="errors.tgl_lahir_bayi"
        />

        <!-- Nama Ibu Kandung -->
        <v-text-field
          class="mb-4"
          v-model="form.nama_ibu_kandung"
          label="Nama Ibu Kandung"
          outlined dense required
          :error="!!errors.nama_ibu_kandung" :error-messages="errors.nama_ibu_kandung"
        />

        <!-- Tanggal Lahir Ibu Kandung -->
        <v-text-field
          class="mb-4"
          v-model="form.tgl_lahir_ibu_kandung"
          label="Tanggal Lahir Ibu Kandung"
          type="date" outlined dense required
          :error="!!errors.tgl_lahir_ibu_kandung" :error-messages="errors.tgl_lahir_ibu_kandung"
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
import { createBayi } from '@/api/bayi'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  no_entitas: '',
  nik: '',
  nama: '',
  hub_keluarga: '',
  tgl_lahir_bayi: '',
  nama_ibu_kandung: '',
  tgl_lahir_ibu_kandung: '',
})

const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

function clearErrors() { errors.value = {} }

async function submitForm() {
  clearErrors()

  // Validasi ringan di client
  const missing: string[] = []
  if (!form.value.no_entitas) missing.push('No Entitas')
  if (!form.value.nik) missing.push('NIK')
  if (!form.value.nama) missing.push('Nama Bayi')
  if (!form.value.tgl_lahir_bayi) missing.push('Tanggal Lahir Bayi')
  if (!form.value.nama_ibu_kandung) missing.push('Nama Ibu Kandung')
  if (!form.value.tgl_lahir_ibu_kandung) missing.push('Tanggal Lahir Ibu Kandung')
  if (missing.length) {
    alert(`Harap isi: ${missing.join(', ')}`)
    return
  }

  loading.value = true
  try {
    await createBayi({
      no_entitas: form.value.no_entitas,
      nik: form.value.nik,
      nama: form.value.nama,
      hub_keluarga: form.value.hub_keluarga || null,
      tgl_lahir_bayi: form.value.tgl_lahir_bayi,
      nama_ibu_kandung: form.value.nama_ibu_kandung,
      tgl_lahir_ibu_kandung: form.value.tgl_lahir_ibu_kandung,
    })
    router.push('/daftarbayi') // kembali ke list
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
      alert(e?.response?.data?.message || 'Gagal menyimpan data.')
    }
  } finally {
    loading.value = false
  }
}

function goBack() { router.back() }
</script>
