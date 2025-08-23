<template>
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
      <h2 class="text-h5 font-weight-bold mb-1">Tambah Pengguna</h2>
      <div class="text-body-2 text-grey">
        Lengkapi data dibawah untuk membuat data pengguna baru
      </div>
    </div>
  </div>

  <!-- Form Card -->
  <v-card class="pa-6" flat>
    <v-card-text>
      <v-form>
        <v-row dense>
          <!-- Username -->
          <v-col cols="12" md="6" class="mb-6">
            <v-text-field
              label="Name"
              v-model="form.name"
              outlined
              dense
              hide-details="auto"
              prepend-inner-icon="ri-user-line"
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12" md="6" >
            <v-text-field
              label="Email"
              v-model="form.email"
              outlined
              dense
              hide-details="auto"
              prepend-inner-icon="ri-mail-line"
            />
          </v-col>

          <!-- Password -->
          <v-col cols="12" md="6" class="mb-6" >
            <v-text-field
              label="Password"
              v-model="form.password"
              type="password"
              outlined
              dense
              hide-details="auto"
              prepend-inner-icon="ri-lock-line"
            />
          </v-col>

          <!-- Konfirmasi Password -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Konfirmasi Password"
              v-model="form.password_confirmation"
              type="password"
              outlined
              dense
              hide-details="auto"
              prepend-inner-icon="ri-lock-line"
            />
          </v-col>

          <!-- Role -->
          <v-col cols="12" md="6">
            <v-select
              label="Role"
              :items="roles"
              v-model="form.role"
              outlined
              dense
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Tombol Simpan -->
        <div class="mt-6">
         <v-btn color="primary" :loading="loading" :disabled="loading" @click="submitForm">
  Simpan
</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { createUser } from '@/api/users'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '', // label yang ditampilkan di select
})

const roles = ['Admin', 'Viewer']
// mapping label UI -> kode role API
const roleCodeMap: Record<string, string> = {
  'Admin': 'admin',
  'Viewer': 'viewer',
}

const loading = ref(false)

async function submitForm() {
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.password_confirmation || !form.value.role) {
    alert('Lengkapi semua field.')
    return
  }
  if (form.value.password !== form.value.password_confirmation) {
    alert('Password dan konfirmasi tidak sama.')
    return
  }

  loading.value = true
  try {
   await createUser({
  name: form.value.name,
  email: form.value.email,
  password: form.value.password,
  password_confirmation: form.value.password_confirmation,
  role: roleCodeMap[form.value.role] || 'viewer',
})
    // sukses → balik ke daftar user
    router.push('/users')
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ||
      (e?.response?.data && JSON.stringify(e.response.data)) ||
      'Gagal menyimpan user.'
    alert(msg)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}
</script>

