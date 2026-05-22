<script setup>
import { useAuthStore } from '~/stores/auth'
definePageMeta({ middleware: ['auth'] })
const authStore = useAuthStore()
</script>
<template>
  <div v-if="authStore.isReady">
    <h1>Welcome, {{ authStore.profile?.name }}</h1>
    <button @click="authStore.logout()">Logout</button>
  </div>
</template>
