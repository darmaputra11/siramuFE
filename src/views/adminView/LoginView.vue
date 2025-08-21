<script setup lang="ts">
import { loginApi } from "@/api/auth"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const form = ref({
  email: "",
  password: "",
  remember: false,
})

const isPasswordVisible = ref(false)

const login = async () => {
  try {
    const res = await loginApi(form.value.email, form.value.password, form.value.remember)

    // simpan token & user ke localStorage
    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data.user))

    // redirect ke dashboard
    router.push("/dashboard")
  } catch (err: any) {
    console.error(err)
    alert("Login gagal: " + (err.response?.data?.message || err.message))
  }
}
</script>


<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="4">
        <VCard elevation="8" class="pa-6">

          <!-- Logo + Nama -->
          <div class="text-center mb-4 d-flex align-center justify-center">
            <img src="/images/klungkung.png" alt="SIRAMU Logo" height="50" class="mr-2" />
          </div>

          <!-- Judul -->
          <VCardTitle class="text-center text-h5 font-weight-bold">
            Welcome to SIRAMU
          </VCardTitle>

          <!-- Deskripsi -->
          <div class="text-center mb-4" style="font-weight: normal; color: gray;">
            Silakan masuk untuk melanjutkan
          </div>

          <VForm @submit.prevent="login">
            <!-- Email -->
            <VTextField
              class="mb-4"
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              dense
              prepend-inner-icon="ri-mail-line"
            />

            <!-- Password -->
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

            <!-- Remember me -->
            <VCheckbox
              v-model="form.remember"
              label="Remember me"
              class="mt-1 mb-4"
            />

            <!-- Button -->
            <VBtn
              type="submit"
              block
              color="primary"
              class="mt-4"
            >
              Login
            </VBtn>
          </VForm>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
