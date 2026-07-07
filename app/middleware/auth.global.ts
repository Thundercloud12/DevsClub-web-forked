import { useAuthStore } from '~/stores/auth'
import { getAuth } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Ensure auth is initialized (fetching user and role from Firestore)
  if (!authStore.isReady) {
    await authStore.initAuth()
  }

  const isLoggedIn = authStore.isLoggedIn

  // 1. If NOT logged in
  if (!isLoggedIn) {
    // Redirect unauthenticated requests for admin/dashboard pages to the signin page
    if (to.path.startsWith('/admin') || to.path.startsWith('/dashboard')) {
      return navigateTo('/auth/signin', { replace: true })
    }
    return
  }

  // 2. Prevent students from accessing admin pages
  // Re-verify the role from the cryptographically signed JWT, ignoring Pinia
  if (to.path.startsWith('/admin')) {
    const auth = getAuth()
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      return navigateTo('/auth/signin', { replace: true })
    }
    const tokenResult = await firebaseUser.getIdTokenResult()
    if (tokenResult.claims.role !== 'admin') {
      return navigateTo('/dashboard', { replace: true })
    }
  }

  const role = authStore.role

  // 3. If logged in
  // Redirect logged-in users away from auth pages to their respective dashboards
  if (to.path === '/' || to.path.startsWith('/auth/')) {
    if (role === 'admin') {
      return navigateTo('/admin/dashboard', { replace: true })
    } else {
      return navigateTo('/dashboard', { replace: true })
    }
  }

  // Prevent admins from accessing student dashboard pages
  if (to.path.startsWith('/dashboard') && role === 'admin') {
    return navigateTo('/admin/dashboard', { replace: true })
  }
})
