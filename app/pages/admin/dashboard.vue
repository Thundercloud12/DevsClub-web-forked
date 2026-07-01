<template>
  <AdminPageLayout
    title="Admin Dashboard"
    :subtitle="`Welcome back, ${authStore.profile?.name || 'Admin'}`"
  >
    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Create Rubric -->
      <div
        @click="navigateTo('/admin/rubrics/create')"
        class="group cursor-pointer bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)] hover:border-primary dark:hover:border-primary-soft hover:shadow-[0_12px_24px_rgba(83,58,253,0.06)] active:scale-[0.99] transition-all duration-200 space-y-4"
      >
        <div
          class="w-10 h-10 rounded-full bg-primary-bg-subdued-hover/20 dark:bg-primary-soft/10 flex items-center justify-center text-primary dark:text-primary-soft group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary-soft dark:group-hover:text-[#0b1120] transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div>
          <h3
            class="font-medium text-ink dark:text-slate-50 group-hover:text-primary dark:group-hover:text-primary-soft transition-colors duration-200"
          >
            Create Rubric
          </h3>
          <p
            class="text-xs text-ink-mute dark:text-slate-400 mt-1.5 leading-relaxed"
          >
            Build a grading template with custom scoring criteria
          </p>
        </div>
      </div>

      <!-- Create Assignment -->
      <div
        @click="navigateTo('/admin/assignments/create')"
        class="group cursor-pointer bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)] hover:border-emerald-500 hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] active:scale-[0.99] transition-all duration-200 space-y-4"
      >
        <div
          class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div>
          <h3
            class="font-medium text-ink dark:text-slate-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200"
          >
            Create Assignment
          </h3>
          <p
            class="text-xs text-ink-mute dark:text-slate-400 mt-1.5 leading-relaxed"
          >
            Publish a new assignment with a timeline and rubric
          </p>
        </div>
      </div>

      <!-- View Submissions -->
      <div
        @click="navigateTo('/admin/submissions')"
        class="group cursor-pointer bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)] hover:border-violet-500 hover:shadow-[0_12px_24px_rgba(139,92,246,0.06)] active:scale-[0.99] transition-all duration-200 space-y-4"
      >
        <div
          class="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h3
            class="font-medium text-ink dark:text-slate-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200"
          >
            View Submissions
          </h3>
          <p
            class="text-xs text-ink-mute dark:text-slate-400 mt-1.5 leading-relaxed"
          >
            Browse and evaluate student project submissions
          </p>
        </div>
      </div>

      <!-- Create Track -->
      <div
        @click="navigateTo('/admin/tracks/create')"
        class="group cursor-pointer bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)] hover:border-amber-500 hover:shadow-[0_12px_24px_rgba(245,158,11,0.06)] active:scale-[0.99] transition-all duration-200 space-y-4"
      >
        <div
          class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <div>
          <h3
            class="font-medium text-ink dark:text-slate-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200"
          >
            Create Track
          </h3>
          <p
            class="text-xs text-ink-mute dark:text-slate-400 mt-1.5 leading-relaxed"
          >
            Add a new learning track (e.g. Web Dev, App Dev, ML)
          </p>
        </div>
      </div>
    </div>

    <!-- Role Note -->
    <div
      class="p-4 bg-primary-bg-subdued-hover/10 dark:bg-slate-900/40 rounded-xl border border-primary-bg-subdued-hover/20 dark:border-slate-800"
    >
      <p
        class="text-xs text-ink-mute dark:text-slate-400 flex items-center gap-2"
      >
        <svg
          class="w-4 h-4 text-primary dark:text-primary-soft shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          >All authenticated administrators have access to manage rubrics,
          assignments, learning tracks, and student submissions.</span
        >
      </p>
    </div>
  </AdminPageLayout>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>
