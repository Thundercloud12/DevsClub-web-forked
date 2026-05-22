<!-- pages/auth/signin.vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">Student Sign In</h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-4 p-2 border rounded"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-6 p-2 border rounded"
      />

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login(email.value, password.value)
    // The store automatically updates its own state via onAuthStateChanged
    // We just need to redirect them!
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    alert('Invalid credentials or you are not a registered student.')
  } finally {
    loading.value = false
  }
}
</script>
