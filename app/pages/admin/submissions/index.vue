<template>
  <AdminPageLayout
    title="Submissions"
    subtitle="Select an assignment to view and grade submissions"
    backUrl="/admin/dashboard"
    backLabel="Back to Dashboard"
  >
    <!-- Error -->
    <div
      v-if="loadError"
      class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
    >
      {{ loadError }}
    </div>

    <!-- No Assignments -->
    <div
      v-else-if="!isLoading && assignments.length === 0"
      class="text-center p-12 border border-dashed border-hairline-input dark:border-slate-800 rounded-xl bg-canvas-soft/30"
    >
      <p class="text-ink-mute dark:text-slate-500">
        No assignments found. Create one first.
      </p>
      <button
        @click="navigateTo('/admin/assignments/create')"
        class="mt-4 text-sm font-semibold text-primary hover:text-primary-deep hover:underline"
      >
        Create an assignment →
      </button>
    </div>

    <!-- Assignment List -->
    <div v-else-if="assignments.length > 0" class="space-y-4">
      <div
        v-for="assignment in assignments"
        :key="assignment.id"
        @click="navigateTo(`/admin/submissions/${assignment.id}`)"
        class="group cursor-pointer bg-surface-card border border-hairline dark:border-slate-800 hover:border-primary-soft hover:shadow-[0_8px_16px_rgba(0,55,112,0.03)] rounded-xl p-6 transition-all duration-200 flex items-center justify-between"
      >
        <div>
          <div class="flex items-center gap-3 mb-1.5">
            <h3
              class="font-medium text-ink dark:text-slate-50 group-hover:text-primary dark:group-hover:text-primary-soft transition-colors"
            >
              {{ assignment.title }}
            </h3>
            <span
              class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              :class="getStatusClass(assignment)"
            >
              {{ getStatus(assignment) }}
            </span>
          </div>
          <p class="text-xs text-ink-mute dark:text-slate-400">
            Closes: {{ formatDate(assignment.submissionsCloseAt) }}
          </p>
        </div>
        <svg
          class="w-5 h-5 text-slate-400 group-hover:text-primary dark:group-hover:text-primary-soft transition-colors shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminAssignments } from '~/composables/admin/useAdminAssignments'
import { useLoading } from '~/composables/useLoading'

const { getAdminAssignments } = useAdminAssignments()
const { startLoading, stopLoading } = useLoading()

const assignments = ref([])
const isLoading = ref(true)
const loadError = ref(null)

onMounted(async () => {
  startLoading('admin-submissions-index')
  try {
    assignments.value = await getAdminAssignments()
  } catch (err) {
    loadError.value = err.message || 'Failed to load assignments.'
  } finally {
    isLoading.value = false
    stopLoading('admin-submissions-index')
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatus = (assignment) => {
  const now = Date.now()
  const close = new Date(assignment.submissionsCloseAt).getTime()
  const open = new Date(assignment.timeline?.submissionsOpenAt).getTime()
  if (now > close) return 'Closed'
  if (now >= open) return 'Open'
  return 'Upcoming'
}

const getStatusClass = (assignment) => {
  const status = getStatus(assignment)
  if (status === 'Open')
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (status === 'Closed')
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
}
</script>
