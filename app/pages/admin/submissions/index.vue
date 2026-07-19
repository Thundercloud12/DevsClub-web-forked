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
          <div class="flex flex-wrap items-center gap-3 mb-1.5">
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
            <span
              class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {{ getTrackNames(assignment) }}
            </span>
          </div>
          <p class="text-xs text-ink-mute dark:text-slate-400">
            Closes: {{ formatDate(assignment.submissionsCloseAt) }}
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <!-- Delete button – visible on row hover -->
          <button
            type="button"
            @click.stop="promptDelete(assignment)"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>

          <svg
            class="w-5 h-5 text-slate-400 group-hover:text-primary dark:group-hover:text-primary-soft transition-colors"
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
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="assignmentToDelete"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="assignmentToDelete = null"
        >
          <div
            class="w-full max-w-md bg-surface-card dark:bg-slate-900 border border-hairline dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <!-- Icon + title -->
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-6 h-6 text-rose-600 dark:text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-ink dark:text-slate-100 text-lg">
                  Delete Assignment?
                </h3>
                <p
                  class="text-sm text-ink-mute dark:text-slate-400 mt-1 leading-relaxed"
                >
                  This will permanently delete
                  <strong class="text-ink dark:text-slate-200">{{
                    assignmentToDelete?.title
                  }}</strong>
                  and
                  <strong class="text-rose-600 dark:text-rose-400"
                    >all associated student submissions</strong
                  >. The leaderboard will update automatically.
                </p>
              </div>
            </div>

            <p
              class="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg px-3 py-2 font-medium"
            >
              ⚠️ This action cannot be undone.
            </p>

            <div class="flex justify-end gap-3 pt-1">
              <button
                type="button"
                @click="assignmentToDelete = null"
                :disabled="isDeleting"
                class="px-4 py-2 border border-hairline dark:border-slate-700 text-ink dark:text-slate-200 rounded-lg text-sm hover:bg-canvas-soft transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="handleDeleteAssignment"
                :disabled="isDeleting"
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <svg
                  v-if="isDeleting"
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {{ isDeleting ? 'Deleting...' : 'Yes, Delete Everything' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AdminPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminAssignments } from '~/composables/admin/useAdminAssignments'
import { useAdminSubmissions } from '~/composables/admin/useAdminSubmissions'
import { useAdminTracks } from '~/composables/admin/useAdminTracks'
import { useLoading } from '~/composables/useLoading'
import { useToastStore } from '~/stores/toast'

const { getAdminAssignments, deleteAssignment } = useAdminAssignments()
const { deleteSubmissionsByAssignmentId } = useAdminSubmissions()
const { getAdminTracks } = useAdminTracks()
const { startLoading, stopLoading } = useLoading()
const toastStore = useToastStore()

const assignments = ref([])
const tracks = ref([])
const isLoading = ref(true)
const loadError = ref(null)
const assignmentToDelete = ref(null)
const isDeleting = ref(false)

onMounted(async () => {
  startLoading('admin-submissions-index')
  try {
    const [fetchedAssignments, fetchedTracks] = await Promise.all([
      getAdminAssignments(),
      getAdminTracks(),
    ])
    assignments.value = fetchedAssignments
    tracks.value = fetchedTracks
  } catch (err) {
    loadError.value = err.message || 'Failed to load assignments.'
  } finally {
    isLoading.value = false
    stopLoading('admin-submissions-index')
  }
})

const promptDelete = (assignment) => {
  assignmentToDelete.value = assignment
}

const handleDeleteAssignment = async () => {
  if (!assignmentToDelete.value) return
  isDeleting.value = true
  const id = assignmentToDelete.value.id
  const title = assignmentToDelete.value.title
  try {
    const deletedCount = await deleteSubmissionsByAssignmentId(id)
    await deleteAssignment(id)
    assignments.value = assignments.value.filter((a) => a.id !== id)
    toastStore.success(`"${title}" and ${deletedCount} submission(s) deleted.`)
    assignmentToDelete.value = null
  } catch (err) {
    toastStore.error(err.message || 'Failed to delete assignment.')
  } finally {
    isDeleting.value = false
  }
}

const getTrackNames = (assignment) => {
  if (!assignment.tracks || !Array.isArray(assignment.tracks)) return 'No Track'
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
