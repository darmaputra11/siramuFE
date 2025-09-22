<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon variant="outlined" color="black" class="bg-white mr-3" @click="goBack">
        <v-icon color="black">ri-arrow-left-line</v-icon>
      </v-btn>

      <div>
        <h2 class="text-h5 font-weight-bold mb-1">Edit Data Bayi</h2>
        <div class="text-body-2 text-grey">Perbarui data di bawah untuk menyimpan perubahan</div>
      </div>
    </div>

    <v-card class="pa-6" flat>
      <v-progress-linear v-if="loadingDetail" indeterminate class="mb-4" />

      <v-form v-if="!loadingDetail" @submit.prevent="submitForm" class="space-y-4">
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

        <!-- Nama Bayi -->
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
          type="date"
          outlined dense required
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
          type="date"
          outlined dense required
          :error="!!errors.tgl_lahir_ibu_kandung" :error-messages="errors.tgl_lahir_ibu_kandung"
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
import { getBayiById, updateBayi } from '@/api/bayi'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

// form & snapshot original
const form = ref({
  no_entitas: '',
  nik: '',
  nama: '',
  hub_keluarga: '',
  tgl_lahir_bayi: '',
  nama_ibu_kandung: '',
  tgl_lahir_ibu_kandung: '',
})
const original = ref({ ...form.value })

const loadingDetail = ref(true)
const saving = ref(false)
const errors = ref<Record<string, string[]>>({})

function clearErrors() { errors.value = {} }

function normalizeDate(value?: string | null): string {
  if (!value) return ''
  return value.slice(0, 10)
}

async function loadDetail() {
  loadingDetail.value = true
  clearErrors()
  try {
    const { data } = await getBayiById(id.value)
    form.value = {
      no_entitas: data.no_entitas || '',
      nik: data.nik || '',
      nama: data.nama || '',
      hub_keluarga: data.hub_keluarga || '',
      tgl_lahir_bayi: normalizeDate(data.tgl_lahir_bayi),
      nama_ibu_kandung: data.nama_ibu_kandung || '',
      tgl_lahir_ibu_kandung: normalizeDate(data.tgl_lahir_ibu_kandung),
    }
    original.value = { ...form.value }
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal memuat data.'
    alert(msg)
    router.back()
  } finally {
    loadingDetail.value = false
  }
}

const isDirty = computed(() => JSON.stringify(form.value) !== JSON.stringify(original.value))

function resetToOriginal() { form.value = { ...original.value } }

async function submitForm() {
  clearErrors()
  const missing: string[] = []
  if (!form.value.no_entitas) missing.push('No Entitas')
  if (!form.value.nik) missing.push('NIK')
  if (!form.value.nama) missing.push('Nama Bayi')
  if (!form.value.tgl_lahir_bayi) missing.push('Tanggal Lahir Bayi')
  if (!form.value.nama_ibu_kandung) missing.push('Nama Ibu Kandung')
  if (!form.value.tgl_lahir_ibu_kandung) missing.push('Tanggal Lahir Ibu Kandung')
  if (missing.length) { alert(`Harap isi: ${missing.join(', ')}`); return }

  saving.value = true
  try {
    await updateBayi(id.value, { ...form.value })
    original.value = { ...form.value }
    router.push('/daftarbayi')
  } catch (e: any) {
    if (e?.response?.status === 401) {
      alert('Sesi habis. Silakan login kembali.')
      router.push('/login')
      return
    }
    const ve = e?.response?.data?.errors
    if (ve && typeof ve === 'object') errors.value = ve
    else alert(e?.response?.data?.message || 'Gagal menyimpan perubahan.')
  } finally {
    saving.value = false
  }
}

function goBack() { router.back() }

onMounted(loadDetail)

watch(() => route.params.id, (val) => {
  id.value = Number(val)
  if (!Number.isNaN(id.value)) loadDetail()
})
</script>
