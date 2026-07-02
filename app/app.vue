<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from '#app'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { useTheme } from '~/composables/useTheme'
import { useLoading } from '~/composables/useLoading'

const route = useRoute()
const router = useRouter()
const { loading: globalLoading } = useLoading()

const isAdminPage = computed(() => route.path.startsWith('/admin'))
const { isDark } = useTheme()

// Theme-reactive ShapeGrid colors — subtle blending
const gridBorderColor = computed(() =>
  isDark.value ? 'rgba(255,255,255, 0.04)' : 'rgba(0,0,0,0.05)'
)
const gridHoverFill = computed(() =>
  isDark.value ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.08)'
)

const isUnderMaintenance = ref(false)
const isChecking = ref(true)
let unsubscribe = null

// Show loading state during route transitions
router.beforeEach((to, from, next) => {
  globalLoading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    globalLoading.value = false
  }, 150)
})

onMounted(() => {
  const db = getFirestore()

  const docRef = doc(db, 'Maintainance', 'Web Maintenance')

  unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        isUnderMaintenance.value =
          data.underMaintenance === true || data.underMaintenance === 'true'
      } else {
        isUnderMaintenance.value = false
      }

      isChecking.value = false
    },
    (error) => {
      console.error('Maintenance check failed:', error)
      isChecking.value = false
    }
  )
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div>
    <div
      v-if="isChecking"
      class="h-screen w-screen flex flex-col items-center justify-center relative"
    >
      <div class="relative flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
        ></div>
        <span
          class="font-inter text-sm font-medium tracking-wide text-ink-secondary dark:text-slate-300 animate-pulse"
        >
          Loading...
        </span>
      </div>
    </div>

    <div
      v-else-if="isUnderMaintenance"
      class="h-screen w-screen flex items-center justify-center bg-gray-50"
    >
      <div class="text-center">
        <h1 class="text-4xl font-bold text-red-600 mb-4">Under Maintenance</h1>
        <p class="text-gray-600 text-lg">
          We are currently upgrading our systems. Please check back shortly.
        </p>
      </div>
    </div>

    <div v-else class="relative">
      <!-- Fixed ShapeGrid background — sits behind all page content -->
      <div class="fixed inset-0 z-0 pointer-events-none">
        <UiShapeGrid
          :border-color="gridBorderColor"
          :hover-fill-color="gridHoverFill"
          direction="diagonal"
          :speed="0.3"
          :square-size="48"
          shape="square"
          :hover-trail-amount="4"
          class="pointer-events-auto"
        />
      </div>

      <!-- Premium Glassmorphic Loading Overlay -->
      <div
        v-if="globalLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas/80 dark:bg-[#0b1120]/80 backdrop-blur-md transition-all duration-300"
      >
        <div class="relative flex flex-col items-center gap-4">
          <div
            class="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
          ></div>
          <span
            class="font-inter text-sm font-medium tracking-wide text-ink-secondary dark:text-slate-300 animate-pulse"
          >
            Loading...
          </span>
        </div>
      </div>

      <div class="relative z-10">
        <UiAdminProtectedNavbar v-if="isAdminPage" />
        <UiNavbar v-else />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
        <UiToastContainer />
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zalando+Sans+Expanded:wght@200..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
</style>
