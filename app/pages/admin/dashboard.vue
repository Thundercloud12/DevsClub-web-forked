<template>
  <div class="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Admin Dashboard
        </h1>
        <UiButton @click="handleLogout" variant="outline">Log out</UiButton>
      </div>

      <UiCard
        title="Welcome, Admin!"
        description="This is a placeholder for the admin dashboard."
      >
        <div
          class="p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700"
        >
          <p class="text-slate-700 dark:text-slate-300">
            From here you will be able to manage assignments, rubrics,
            submissions, and other administrative tasks.
          </p>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/auth/admin-login')
}
</script>
