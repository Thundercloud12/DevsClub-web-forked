<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from '#app'
import {
  getFirestore,
  doc,
  onSnapshot,
  connectFirestoreEmulator,
} from 'firebase/firestore'

const route = useRoute()
const isAdminPage = computed(() => route.path.startsWith('/admin'))

const isUnderMaintenance = ref(false)
const isChecking = ref(true)
let unsubscribe = null

onMounted(() => {
  const db = getFirestore()

  if (process.env.NODE_ENV === 'development') {
    if (!db._emulatorConfigured) {
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
      db._emulatorConfigured = true
      console.log('🔥 Connected to Firestore Emulator for Maintenance Check')
    }
  }

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
      class="h-screen w-screen flex items-center justify-center bg-gray-50"
    >
      <div class="text-xl font-semibold animate-pulse text-gray-600">
        Checking system status...
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

    <div v-else-if="!isChecking && !isUnderMaintenance">
      <UiAdminProtectedNavbar v-if="isAdminPage" />
      <UiNavbar v-else />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <UiToastContainer />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zalando+Sans+Expanded:wght@200..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
</style>
