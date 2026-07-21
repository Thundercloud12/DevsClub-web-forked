<!-- pages/auth/signin.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 relative"
  >
    <UiCard
      class="w-full max-w-md relative z-10 shadow-[0_20px_40px_rgba(0,55,112,0.1),0_1px_3px_rgba(0,55,112,0.05)] border border-hairline/80 dark:border-slate-800"
      title="Sign In"
      description="Enter your email and password to access your dashboard"
    >
      <div class="space-y-2">
        <UiLabel for="email">Email</UiLabel>
        <UiInput
          id="email"
          v-model="email"
          type="email"
          placeholder="user@example.com"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <UiLabel for="password">Password</UiLabel>
          <a
            href="#"
            class="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-deep dark:text-primary-soft transition-colors duration-150"
            @click.prevent="openForgotModal"
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

    <!-- Forgot Password Modal Overlay -->
    <div
      v-if="showForgotModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-[#111a2f] border border-hairline/80 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden transform transition-all duration-300 scale-100"
      >
        <!-- Background gradients for visual appeal -->
        <div
          class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"
        ></div>

        <!-- Close Button (X icon) -->
        <button
          @click="showForgotModal = false"
          class="absolute top-4 right-4 text-ink-mute hover:text-ink dark:text-slate-400 dark:hover:text-white transition-colors duration-150"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- TITLE & DESCRIPTION -->
        <div class="text-center mb-6">
          <h3
            class="text-2xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
          >
            Reset Password
          </h3>
          <p class="text-xs text-ink-mute dark:text-slate-400 mt-2">
            Enter your email to verify your account and receive a reset link.
          </p>
        </div>

        <!-- CONDITIONAL VIEWS -->
        <!-- View 1: Official Login (Error Overlay) -->
        <div v-if="isOfficialUser" class="space-y-6 py-4 text-center">
          <div
            class="mx-auto w-16 h-16 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-medium text-rose-600 dark:text-rose-400">
              Action Not Allowed
            </h4>
            <p
              class="text-sm text-ink-secondary dark:text-slate-350 px-2 leading-relaxed"
            >
              We cannot reset password for team accounts. Please contact TSEC
              Devs Club directly.
            </p>
          </div>
          <button
            class="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 h-10 px-5 py-2 w-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
            @click="showForgotModal = false"
          >
            Close
          </button>
        </div>

        <!-- View 2: Success State -->
        <div v-else-if="forgotSuccess" class="space-y-6 py-4 text-center">
          <div
            class="mx-auto w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.666a2 2 0 012.22 0l8 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h4
              class="text-lg font-medium text-emerald-600 dark:text-emerald-400"
            >
              Email Sent!
            </h4>
            <p
              class="text-sm text-ink-secondary dark:text-slate-350 px-2 leading-relaxed"
            >
              Check your inbox and click on the link in the password reset email
              to set a new password.
            </p>
          </div>
          <button
            class="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 h-10 px-5 py-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
            @click="showForgotModal = false"
          >
            Close
          </button>
        </div>

        <!-- View 3: Default Form State -->
        <div v-else class="space-y-4">
          <div class="space-y-2">
            <UiLabel for="forgot-email">Email Address</UiLabel>
            <UiInput
              id="forgot-email"
              v-model="forgotEmail"
              type="email"
              placeholder="user@example.com"
              @keyup.enter="handleForgotPassword"
            />
          </div>

          <p
            v-if="forgotError"
            class="text-xs text-rose-500 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20"
          >
            {{ forgotError }}
          </p>

          <div
            class="flex gap-3 pt-4 border-t border-hairline/60 dark:border-slate-800/60"
          >
            <UiButton
              variant="outline"
              class="w-1/2"
              :disabled="forgotLoading"
              @click="showForgotModal = false"
            >
              Cancel
            </UiButton>
            <UiButton
              class="w-1/2"
              :disabled="forgotLoading || isInitializing || !forgotEmail"
              @click="handleForgotPassword"
            >
              <template v-if="isInitializing">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Preparing...
              </template>
              <template v-else-if="forgotLoading">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Verifying...
              </template>
              <template v-else> Send Link </template>
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

import UiCard from '~/components/ui/Card.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import UiButton from '~/components/ui/Button.vue'

import { useLoading } from '~/composables/useLoading'

const authStore = useAuthStore()
const toastStore = useToastStore()
const { setLoading } = useLoading()

const email = ref('')
const password = ref('')
const loading = ref(false)

// Forgot Password states
const showForgotModal = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotError = ref('')
const isOfficialUser = ref(false)
const forgotSuccess = ref('')
// 1.5s delay to allow Firebase reCAPTCHA/risk engine to initialize,
// preventing auth/quota-exceeded (429) on the get-oob-code endpoint
const isInitializing = ref(false)

const openForgotModal = () => {
  showForgotModal.value = true
  forgotEmail.value = ''
  forgotError.value = ''
  forgotSuccess.value = ''
  isOfficialUser.value = false
  isInitializing.value = true
  setTimeout(() => {
    isInitializing.value = false
  }, 1500)
}

const handleForgotPassword = async () => {
  const emailVal = forgotEmail.value.trim()
  if (!emailVal) {
    forgotError.value = 'Please enter your email address.'
    return
  }

  forgotLoading.value = true
  forgotError.value = ''
  forgotSuccess.value = ''
  isOfficialUser.value = false

  try {
    const db = getFirestore()

    // Check if the email belongs to OfficialLogin
    const officialQuery = query(
      collection(db, 'OfficialLogin'),
      where('email', '==', emailVal)
    )
    const officialSnap = await getDocs(officialQuery)

    if (!officialSnap.empty) {
      isOfficialUser.value = true
      forgotLoading.value = false
      return
    }

    // Send password reset email
    const auth = getAuth()
    await sendPasswordResetEmail(auth, emailVal)

    forgotSuccess.value =
      'Check your inbox and click on the link in the password reset email.'
    toastStore.success('Password reset email sent!')
  } catch (error) {
    console.error('Forgot password error:', error)
    if (error.code === 'auth/user-not-found') {
      forgotError.value = 'No user found corresponding to that email.'
    } else {
      forgotError.value =
        error.message || 'An error occurred. Please try again.'
    }
  } finally {
    forgotLoading.value = false
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toastStore.warning('Please fill in both email and password.')
    return
  }

  try {
    loading.value = true
    setLoading(true)
    await authStore.login(email.value, password.value)

    if (authStore.role === 'admin') {
      toastStore.success('Signed in successfully as Admin!')
      navigateTo('/admin/dashboard')
    } else if (authStore.role === 'student') {
      toastStore.success('Signed in successfully!')
      navigateTo('/dashboard')
    } else {
      toastStore.error(
        'Your account is not authorized or has no assigned role.'
      )
      setLoading(false)
      await authStore.logout()
    }
  } catch (error) {
    console.error('Login failed:', error)
    toastStore.error('Invalid credentials or unauthorized account.')
    setLoading(false)
  } finally {
    loading.value = false
  }
}
</script>
