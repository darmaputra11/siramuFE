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
          placeholder="Masukkan NIK"
          outlined
          dense
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
          required
        />

        <!-- Nomor KK -->
        <v-text-field
          class="mb-4"
          v-model="form.no_kk"
          label="Nomor KK"
          placeholder="Masukkan nomor KK"
          outlined
          dense
          required
        />

        <!-- Nomor Pindah -->
        <v-text-field
          class="mb-4"
          v-model="form.nomor_pindah"
          label="Nomor Pindah"
          placeholder="Masukkan nomor pindah"
          outlined
          dense
          required
        />

        <!-- Tanggal Pindah -->
        <v-text-field
          class="mb-4"
          v-model="form.tanggal_pindah"
          label="Tanggal Pindah"
          type="date"
          outlined
          dense
          required
        />

        <!-- Tombol Simpan -->
        <v-btn type="submit" color="primary" class="mt-4">
          Simpan
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  nik: '',
  nama_lengkap: '',
  no_kk: '',
  nomor_pindah: '',
  tanggal_pindah: ''
})

const submitForm = () => {
  console.log('Data form:', form.value)
  // Nanti di sini bisa panggil API Laravel pakai axios
}

const goBack = () => {
  router.back()
}
</script>
