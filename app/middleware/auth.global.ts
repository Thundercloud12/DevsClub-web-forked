import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Ensure auth is initialized (fetching user and role from Firestore)
  if (!authStore.isReady) {
    await authStore.initAuth()
  }

  const isLoggedIn = authStore.isLoggedIn
  const role = authStore.role

  // 1. If NOT logged in
  if (!isLoggedIn) {
    // Redirect unauthenticated requests for admin/dashboard pages to the signin page
    if (to.path.startsWith('/admin') || to.path.startsWith('/dashboard')) {
      return navigateTo('/auth/signin', { replace: true })
    }
    return
  }

  // 2. If logged in
  // Redirect logged-in users away from auth pages to their respective dashboards
  if (to.path === '/' || to.path.startsWith('/auth/')) {
    if (role === 'admin') {
      return navigateTo('/admin/dashboard', { replace: true })
    } else {
      return navigateTo('/dashboard', { replace: true })
    }
  }

  // Prevent students from accessing admin pages
  if (to.path.startsWith('/admin') && role !== 'admin') {
    return navigateTo('/dashboard', { replace: true })
  }

  // Prevent admins from accessing student dashboard pages
  if (to.path.startsWith('/dashboard') && role === 'admin') {
    return navigateTo('/admin/dashboard', { replace: true })
  }
})
