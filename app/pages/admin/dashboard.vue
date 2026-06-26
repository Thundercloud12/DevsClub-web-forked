<template>
  <div class="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Admin Dashboard
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back,
            <span class="font-semibold text-blue-600">{{
              authStore.profile?.name || 'Admin'
            }}</span>
          </p>
        </div>
        <UiButton @click="handleLogout" variant="outline">Log out</UiButton>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Create Rubric -->
        <div
          @click="navigateTo('/admin/rubrics/create')"
          class="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 space-y-3"
        >
          <div
            class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors"
          >
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div>
            <h3
              class="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 transition-colors"
            >
              Create Rubric
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Build a grading template with custom scoring criteria
            </p>
          </div>
        </div>

        <!-- Create Assignment -->
        <div
          @click="navigateTo('/admin/assignments/create')"
          class="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 space-y-3"
        >
          <div
            class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors"
          >
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h3
              class="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-green-600 transition-colors"
            >
              Create Assignment
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Publish a new assignment with a timeline and rubric
            </p>
          </div>
        </div>

        <!-- View Submissions -->
        <div
          @click="navigateTo('/admin/submissions')"
          class="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 space-y-3"
        >
          <div
            class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors"
          >
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3
              class="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-purple-600 transition-colors"
            >
              View Submissions
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse and evaluate student project submissions
            </p>
          </div>
        </div>
      </div>

      <!-- Role Note -->
      <div
        class="p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700"
      >
        <p class="text-sm text-slate-600 dark:text-slate-300">
          <strong>Note:</strong> All Devs members can view submissions.
          <strong class="text-blue-600 dark:text-blue-400"
            >CP and VCP only</strong
          >
          can enter scores and finalize grades.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import UiButton from '~/components/ui/Button.vue'

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/auth/signin')
}
</script>
