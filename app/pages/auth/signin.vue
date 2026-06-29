<!-- pages/auth/signin.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-canvas dark:bg-[#0b1120] gradient-mesh relative"
  >
    <UiCard
      class="w-full max-w-md relative z-10 shadow-[0_20px_40px_rgba(0,55,112,0.1),0_1px_3px_rgba(0,55,112,0.05)] border border-hairline/80 dark:border-slate-800"
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
            class="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-deep dark:text-primary-soft transition-colors duration-150"
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
import { useToastStore } from '~/stores/toast'

import UiCard from '~/components/ui/Card.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import UiButton from '~/components/ui/Button.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toastStore.warning('Please fill in both email and password.')
    return
  }

  try {
    loading.value = true
    await authStore.login(email.value, password.value)
    toastStore.success('Signed in successfully!')
    if (authStore.role === 'admin') {
      navigateTo('/admin/dashboard')
    } else {
      navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error)
    toastStore.error('Invalid credentials or you are not a registered student.')
  } finally {
    loading.value = false
  }
}
</script>
