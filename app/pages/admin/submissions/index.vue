<template>
  <div class="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <button
            @click="navigateTo('/admin/dashboard')"
            class="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Submissions
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">
            Select an assignment to view and grade submissions
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"
        />
      </div>

      <!-- Error -->
      <div
        v-else-if="loadError"
        class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
      >
        {{ loadError }}
      </div>

      <!-- No Assignments -->
      <div
        v-else-if="assignments.length === 0"
        class="text-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl"
      >
        <p class="text-slate-500">No assignments found. Create one first.</p>
        <button
          @click="navigateTo('/admin/assignments/create')"
          class="mt-4 text-sm text-blue-600 hover:underline"
        >
          Create an assignment →
        </button>
      </div>

      <!-- Assignment List -->
      <div v-else class="space-y-4">
        <div
          v-for="assignment in assignments"
          :key="assignment.id"
          @click="selectAssignment(assignment)"
          class="group cursor-pointer bg-white dark:bg-slate-900 border rounded-xl p-6 transition-all duration-200 flex items-center justify-between"
          :class="
            selectedAssignment?.id === assignment.id
              ? 'border-blue-500 shadow-md shadow-blue-500/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md'
          "
        >
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h3
                class="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 transition-colors"
              >
                {{ assignment.title }}
              </h3>
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="getStatusClass(assignment)"
              >
                {{ getStatus(assignment) }}
              </span>
            </div>
            <p class="text-sm text-slate-500">
              Closes: {{ formatDate(assignment.submissionsCloseAt) }}
            </p>
          </div>
          <svg
            class="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0"
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

      <!-- Submissions Table (shown when an assignment is selected) -->
      <div v-if="selectedAssignment" class="space-y-4">
        <div
          class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50">
            Submissions for:
            <span class="text-blue-600">{{ selectedAssignment.title }}</span>
          </h2>
          <span class="text-sm text-slate-500"
            >{{ submissions.length }} submission(s)</span
          >
        </div>

        <!-- Loading submissions -->
        <div v-if="isLoadingSubmissions" class="space-y-2">
          <div
            v-for="i in 4"
            :key="i"
            class="h-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          />
        </div>

        <!-- No submissions yet -->
        <div
          v-else-if="submissions.length === 0"
          class="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl"
        >
          <p class="text-slate-500">No submissions for this assignment yet.</p>
        </div>

        <!-- Submissions table -->
        <div
          v-else
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
        >
          <table class="w-full text-sm">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th
                  class="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                >
                  Student ID
                </th>
                <th
                  class="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                >
                  GitHub
                </th>
                <th
                  class="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                >
                  Submitted At
                </th>
                <th
                  class="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                >
                  Status
                </th>
                <th
                  class="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                >
                  Score
                </th>
                <th
                  class="px-5 py-3 text-right font-semibold text-slate-600 dark:text-slate-300"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                v-for="sub in submissions"
                :key="sub.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td
                  class="px-5 py-4 font-mono text-xs text-slate-600 dark:text-slate-300"
                >
                  {{ sub.studentId }}
                </td>
                <td class="px-5 py-4">
                  <a
                    :href="sub.githubLink"
                    target="_blank"
                    class="text-blue-600 hover:underline truncate max-w-[180px] block"
                  >
                    {{ sub.githubLink.replace('https://github.com/', '') }}
                  </a>
                </td>
                <td class="px-5 py-4 text-slate-500">
                  {{ formatDate(sub.submittedAt) }}
                </td>
                <td class="px-5 py-4">
                  <span
                    class="text-xs px-2 py-1 rounded-full font-medium"
                    :class="
                      sub.status === 'evaluated'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    "
                  >
                    {{
                      sub.status === 'evaluated' ? '✓ Evaluated' : '⏳ Pending'
                    }}
                  </span>
                </td>
                <td
                  class="px-5 py-4 font-semibold text-slate-900 dark:text-slate-50"
                >
                  {{
                    sub.scores
                      ? sub.scores.reduce(
                          (sum, s) => sum + (s.actualScore || 0),
                          0
                        )
                      : '—'
                  }}
                </td>
                <td class="px-5 py-4 text-right">
                  <button
                    @click="navigateTo(`/admin/submissions/${sub.id}/evaluate`)"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    {{ sub.status === 'evaluated' ? 'View / Edit' : 'Grade →' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAssignments } from '~/composables/useAssignments'
import { useSubmissions } from '~/composables/useSubmissions'

const { getAssignments } = useAssignments()
const { getSubmissions } = useSubmissions()

const assignments = ref([])
const selectedAssignment = ref(null)
const submissions = ref([])
const isLoading = ref(true)
const isLoadingSubmissions = ref(false)
const loadError = ref(null)

onMounted(async () => {
  try {
    assignments.value = await getAssignments()
  } catch (err) {
    loadError.value = err.message || 'Failed to load assignments.'
  } finally {
    isLoading.value = false
  }
})

const selectAssignment = async (assignment) => {
  // Toggle off if same is clicked again
  if (selectedAssignment.value?.id === assignment.id) {
    selectedAssignment.value = null
    submissions.value = []
    return
  }
  selectedAssignment.value = assignment
  submissions.value = []
  isLoadingSubmissions.value = true
  try {
    submissions.value = await getSubmissions(assignment.id)
  } catch (err) {
    console.error('Failed to fetch submissions:', err)
  } finally {
    isLoadingSubmissions.value = false
  }
}

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
