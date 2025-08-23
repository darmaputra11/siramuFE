<script setup lang="ts">
import { loginApi } from "@/api/auth"
import { setAuth, setRemember } from "@/utils/authStorage"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const form = ref({
  email: "",
  password: "",
  remember: false,
})

const isPasswordVisible = ref(false)
const loading = ref(false)

const login = async () => {
  loading.value = true
  try {
    // simpan preferensi remember sebelum login
    setRemember(form.value.remember)

    const res = await loginApi(form.value.email, form.value.password)

    // 👉 log respons lengkap dari backend
    console.log("✅ Login berhasil:", res.data)

    // simpan token & user
    const token = res.data?.token as string
    const user = res.data?.user
    if (!token) throw new Error("Token tidak ditemukan di response")

    setAuth(token, user)

    // redirect (kalau ada query redirect)
    const redirect = (route.query.redirect as string) || "/dashboard"
    router.push(redirect)
  } catch (err: any) {
    alert("Login gagal: " + (err.response?.data?.message || err.message))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="4">
        <VCard elevation="8" class="pa-6">
          <div class="text-center mb-4 d-flex align-center justify-center">
            <img src="/images/klungkung.png" alt="SIRAMU Logo" height="50" class="mr-2" />
          </div>

          <VCardTitle class="text-center text-h5 font-weight-bold">
            Welcome to SIRAMU
          </VCardTitle>

          <div class="text-center mb-4" style="font-weight: normal; color: gray;">
            Silakan masuk untuk melanjutkan
          </div>

          <VForm @submit.prevent="login">
            <VTextField
              class="mb-4"
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              dense
              prepend-inner-icon="ri-mail-line"
            />

            <VTextField
              class="mb-4"
              v-model="form.password"
              label="Password"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              dense
              prepend-inner-icon="ri-lock-line"
              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />

            <VCheckbox
              v-model="form.remember"
              label="Remember me"
              class="mt-1 mb-4"
            />

            <VBtn type="submit" block color="primary" class="mt-4" :loading="loading">
              Login
            </VBtn>
          </VForm>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
