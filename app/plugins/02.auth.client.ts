import { useAuthStore } from '~/stores/auth'
import { navigateTo, useRoute } from '#app'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  await authStore.initAuth()

  const route = useRoute()
  if (authStore.isLoggedIn) {
    if (route.path === '/' || route.path.startsWith('/auth/')) {
      if (authStore.role === 'admin') {
        await navigateTo('/admin/dashboard')
      } else if (authStore.role === 'student') {
        await navigateTo('/dashboard')
      }
    }
  }
})
