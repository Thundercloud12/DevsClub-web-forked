<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'

definePageMeta({ middleware: ['auth'] })

onMounted(async () => {
  await navigateTo('/dashboard/assignments')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-transparent">
    <div class="animate-pulse text-gray-500 font-inter">
      Loading your dashboard...
    </div>
  </div>
</template>
