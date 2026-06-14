<!-- pages/auth/signin.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-slate-50 dark:bg-slate-950"
  >
    <UiCard
      class="w-full max-w-md"
      title="Student Sign In"
      description="Enter your email and password to access your dashboard"
    >
      <div class="space-y-2">
        <UiLabel for="email">Email</UiLabel>
        <UiInput
          id="email"
          v-model="email"
          type="email"
          placeholder="student@example.com"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <UiLabel for="password">Password</UiLabel>
          <a
            href="#"
            class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Forgot password?
          </a>
        </div>
        <UiInput
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <template #footer>
        <UiButton class="w-full" :disabled="loading" @click="handleLogin">
          <template v-if="loading">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </template>
          <template v-else> Sign In </template>
        </UiButton>
      </template>
    </UiCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

import UiCard from '~/components/ui/Card.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import UiButton from '~/components/ui/Button.vue'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please fill in both email and password.')
    return
  }

  try {
    loading.value = true
    await authStore.login(email.value, password.value)
    if (authStore.role === 'admin') {
      navigateTo('/admin/dashboard')
    } else {
      navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error)
    alert('Invalid credentials or you are not a registered student.')
  } finally {
    loading.value = false
  }
}
</script>
