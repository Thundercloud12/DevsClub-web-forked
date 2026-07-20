<template>
  <AdminPageLayout
    title="Submissions"
    :subtitle="
      assignment ? `Submissions for assignment: ${assignment.title}` : ''
    "
    backUrl="/admin/submissions"
    backLabel="Back to Assignments"
  >
    <!-- Error state -->
    <div
      v-if="loadError"
      class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
    >
      {{ loadError }}
    </div>

    <!-- Submissions Table section -->
    <template v-else-if="assignment">
      <div class="flex items-center justify-between pb-2">
        <div class="flex flex-wrap items-center gap-3">
          <span
            class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            :class="getStatusClass(assignment)"
          >
            {{ getStatus(assignment) }}
          </span>
          <span
            class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            {{ getTrackNames(assignment) }}
          </span>
          <div
            v-if="!isEditingDate"
            class="flex items-center gap-2 text-xs text-ink-mute dark:text-slate-400"
          >
            <span>Closes: {{ formatDate(assignment.submissionsCloseAt) }}</span>
            <button
              type="button"
              @click="startEditingDate"
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-primary dark:text-primary-soft transition-colors text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
              Edit
            </button>
          </div>
          <div
            v-else
            class="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-hairline dark:border-slate-800/80"
          >
            <span class="text-ink-mute dark:text-slate-400 font-medium"
              >Closes:</span
            >
            <input
              type="datetime-local"
              v-model="editCloseDateVal"
              class="bg-white dark:bg-slate-950 border border-hairline dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-ink dark:text-slate-200 outline-none focus:border-brand-blue"
            />
            <button
              type="button"
              @click="handleSaveCloseDate"
              :disabled="isUpdatingDate"
              class="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {{ isUpdatingDate ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              @click="isEditingDate = false"
              class="px-3 py-1.5 border border-hairline dark:border-slate-800 text-ink dark:text-slate-200 rounded-lg text-xs hover:bg-canvas-soft transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
        <span class="text-xs text-ink-mute dark:text-slate-500 font-medium">
          {{ submissions.length }} submission(s)
        </span>
      </div>

      <!-- No submissions yet -->
      <div
        v-if="submissions.length === 0"
        class="text-center p-12 border border-dashed border-hairline-input dark:border-slate-800 rounded-xl bg-canvas-soft/20"
      >
        <p class="text-ink-mute dark:text-slate-500 text-sm">
          No submissions for this assignment yet.
        </p>
      </div>

      <!-- Submissions table -->
      <div
        v-else
        class="bg-surface-card border border-hairline dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_12px_24px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)]"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead
              class="bg-canvas-soft/80 dark:bg-slate-800/50 border-b border-hairline dark:border-slate-800"
            >
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  Student Name
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  Grad Year
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  GitHub
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  Submitted At
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  Score
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-hairline dark:divide-slate-800">
              <tr
                v-for="sub in submissions"
                :key="sub.id"
                class="hover:bg-canvas-soft/40 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td
                  class="px-6 py-4 text-sm text-ink-secondary dark:text-slate-300 font-medium"
                >
                  {{ sub.studentName || sub.studentId }}
                </td>

                <td
                  class="px-6 py-4 text-xs font-mono text-ink-secondary dark:text-slate-300"
                >
                  {{ sub.gradyear || '—' }}
                </td>
                <td class="px-6 py-4">
                  <a
                    :href="sanitizeUrl(sub.githubLink)"
                    target="_blank"
                    class="text-primary hover:text-primary-deep dark:text-primary-soft hover:underline truncate max-w-[200px] block transition-colors duration-150 font-medium"
                  >
                    {{ sub.githubLink.replace('https://github.com/', '') }}
                  </a>
                </td>
                <td class="px-6 py-4 text-xs text-ink-mute dark:text-slate-400">
                  {{ formatDate(sub.submittedAt) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide"
                    :class="
                      sub.evaluation
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    "
                  >
                    {{ sub.evaluation ? '✓ Evaluated' : '⏳ Pending' }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 font-mono font-medium text-ink dark:text-slate-100"
                >
                  {{ sub.evaluation ? sub.evaluation.totalScore : '—' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="navigateTo(`/admin/submissions/${sub.id}/evaluate`)"
                    class="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-deep dark:text-primary-soft transition-colors duration-150"
                  >
                    {{ sub.evaluation ? 'View' : 'Grade →' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </AdminPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useAdminAssignments } from '~/composables/admin/useAdminAssignments'
import { useAdminSubmissions } from '~/composables/admin/useAdminSubmissions'
import { useAdminTracks } from '~/composables/admin/useAdminTracks'
import { useLoading } from '~/composables/useLoading'
import { useToastStore } from '~/stores/toast'

const route = useRoute()
const assignmentId = route.params.id

const { getAssignmentById, updateAssignment } = useAdminAssignments()
const { getAdminSubmissions, getAdminEvaluationsForAssignment } =
  useAdminSubmissions()
const { getAdminTracks } = useAdminTracks()
const { startLoading, stopLoading } = useLoading()
const toastStore = useToastStore()

const assignment = ref(null)
const submissions = ref([])
const tracks = ref([])
const isLoading = ref(true)
const loadError = ref(null)

const isEditingDate = ref(false)
const isUpdatingDate = ref(false)
const editCloseDateVal = ref('')

const toDatetimeLocal = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const pad = (num) => String(num).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const startEditingDate = () => {
  editCloseDateVal.value = toDatetimeLocal(assignment.value.submissionsCloseAt)
  isEditingDate.value = true
}

const handleSaveCloseDate = async () => {
  if (!editCloseDateVal.value) return
  isUpdatingDate.value = true
  try {
    const updatedDate = new Date(editCloseDateVal.value)
    const updatedDetails = {
      ...assignment.value,
      submissionsCloseAt: updatedDate,
      timeline: {
        ...assignment.value.timeline,
        submissionsCloseAt: updatedDate,
      },
    }
    await updateAssignment(assignment.value.id, updatedDetails)
    assignment.value.submissionsCloseAt = updatedDate
    assignment.value.timeline.submissionsCloseAt = updatedDate
    toastStore.success('Submission close date updated successfully!')
    isEditingDate.value = false
  } catch (err) {
    toastStore.error(err.message || 'Failed to update submission close date.')
  } finally {
    isUpdatingDate.value = false
  }
}

onMounted(async () => {
  startLoading('admin-submissions-detail')
  try {
    const [
      fetchedAssignment,
      fetchedSubmissions,
      fetchedEvaluations,
      fetchedTracks,
    ] = await Promise.all([
      getAssignmentById(assignmentId),
      getAdminSubmissions({ assignmentId }),
      getAdminEvaluationsForAssignment(assignmentId),
      getAdminTracks(),
    ])

    if (!fetchedAssignment) {
      loadError.value = 'Assignment not found.'
      return
    }

    const evalMap = new Map(fetchedEvaluations.map((e) => [e.submissionId, e]))

    assignment.value = fetchedAssignment
    submissions.value = fetchedSubmissions.map((sub) => ({
      ...sub,
      evaluation: evalMap.get(sub.id) || null,
    }))
    tracks.value = fetchedTracks
  } catch (err) {
    loadError.value = err.message || 'Failed to load assignment submissions.'
  } finally {
    isLoading.value = false
    stopLoading('admin-submissions-detail')
  }
})

const getTrackNames = (assignment) => {
  if (!assignment || !assignment.tracks || !Array.isArray(assignment.tracks))
    return 'No Track'
  const names = assignment.tracks
    .map((trackId) => {
      const track = tracks.value.find((t) => t.id === trackId)
      return track ? track.name : trackId
    })
    .filter(Boolean)
  return names.length > 0 ? names.join(', ') : 'No Track'
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
