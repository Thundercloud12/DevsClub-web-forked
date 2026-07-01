<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAssignments } from '~/composables/student/useAssignments'
import { useTracks } from '~/composables/student/useTracks'
import { useSubmissions } from '~/composables/student/useSubmissions'
import { useAuthStore } from '~/stores/auth'
import type { Assignment } from '~/schemas/assignments'
import type { Track } from '~/schemas/tracks'
useHead({
  title: 'Assignments | TSEC DevsClub',
  meta: [
    {
      name: 'description',
      content:
        'Track and submit your TSEC DevsClub recruitment drive assignments here.',
    },
  ],
})

import { useLoading } from '~/composables/useLoading'

const { getAssignments } = useAssignments()
const { getTracks } = useTracks()
const { getSubmissionByUser } = useSubmissions()
const authStore = useAuthStore()
const { startLoading, stopLoading } = useLoading()

interface DashboardAssignment extends Assignment {
  id: string
  status: 'upcoming' | 'open' | 'closed'
}

const assignments = ref<DashboardAssignment[]>([])
const tracks = ref<Track[]>([])
const selectedTrack = ref('all')
const isLoading = ref(true)
const loadError = ref<string | null>(null)

// Modal Overlay State
const isModalOpen = ref(false)
const selectedAssignment = ref<DashboardAssignment | null>(null)
const submission = ref<any>(null)
const isFetchingSubmission = ref(false)
const fetchError = ref<string | null>(null)

const openSubmissionModal = async (assignment: DashboardAssignment) => {
  selectedAssignment.value = assignment
  isModalOpen.value = true
  submission.value = null
  fetchError.value = null

  if (assignment.status === 'upcoming') {
    isFetchingSubmission.value = false
    return
  }

  const userId = authStore.user?.uid
  if (!userId) {
    fetchError.value = 'User session not found.'
    return
  }

  isFetchingSubmission.value = true
  try {
    submission.value = await getSubmissionByUser(assignment.id, userId)
  } catch (err: any) {
    fetchError.value = err?.message ?? 'Failed to load submission details.'
  } finally {
    isFetchingSubmission.value = false
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedAssignment.value = null
  submission.value = null
  fetchError.value = null
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getAssignmentStatus = (
  assignment: Assignment
): 'upcoming' | 'open' | 'closed' => {
  const now = Date.now()
  const openAt = new Date(assignment.timeline.submissionsOpenAt).getTime()
  const closeAt = new Date(assignment.submissionsCloseAt).getTime()
  if (now < openAt) return 'upcoming'
  if (now >= openAt && now < closeAt) return 'open'
  return 'closed'
}

const filteredAssignments = computed(() => {
  if (selectedTrack.value === 'all') return assignments.value
  return assignments.value.filter((a) =>
    a.tracks?.includes(selectedTrack.value)
  )
})

onMounted(async () => {
  startLoading('student-assignments')
  try {
    const [fetchedTracks, fetchedAssignments] = await Promise.all([
      getTracks(),
      getAssignments(),
    ])

    tracks.value = fetchedTracks
    assignments.value = fetchedAssignments
      .filter((item): item is Assignment & { id: string } => !!item.id)
      .map((item) => {
        const status = getAssignmentStatus(item)
        return {
          ...item,
          status,
        }
      })
      .sort((a, b) => {
        const dateA = a.timeline?.submissionsOpenAt
        const dateB = b.timeline?.submissionsOpenAt
        const timeA = dateA ? new Date(dateA).getTime() : 0
        const timeB = dateB ? new Date(dateB).getTime() : 0
        return timeA - timeB
      })
  } catch (err: any) {
    loadError.value = err?.message ?? 'Failed to load assignments.'
  } finally {
    isLoading.value = false
    stopLoading('student-assignments')
  }
})
</script>

<template>
  <div class="min-h-screen pt-32 pb-24 relative">
    <div
      class="max-w-5xl mx-auto px-6 text-center space-y-6 mb-12 relative z-10"
    >
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :animate="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 80, damping: 15 },
        }"
      >
        <span
          class="text-primary dark:text-primary-soft font-semibold tracking-wider uppercase text-xs mb-2 block"
        >
          Membership Drive
        </span>
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-zalando text-ink dark:text-white leading-tight"
        >
          Your Assignments
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.6 } }"
        class="text-lg md:text-xl text-ink-mute dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
      >
        Complete these milestones to progress through the DevsClub recruitment
        pipeline. Keep an eye on the deadlines.
      </Motion>
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-pulse relative z-10"
    >
      <div class="flex justify-center gap-3 mb-6">
        <div class="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div class="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div class="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
      <div
        class="h-36 bg-surface-card border border-hairline dark:border-slate-800 rounded-2xl"
      />
      <div
        class="h-36 bg-surface-card border border-hairline dark:border-slate-800 rounded-2xl"
      />
    </div>

    <!-- Error state -->
    <div
      v-else-if="loadError"
      class="max-w-md mx-auto px-6 text-center py-12 relative z-10"
    >
      <div
        class="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-3"
      >
        <h2 class="font-light text-xl text-ink dark:text-white">
          Failed to Load Assignments
        </h2>
        <p class="text-sm text-ink-mute dark:text-slate-400">
          {{ loadError }}
        </p>
      </div>
    </div>

    <template v-else>
      <!-- Premium track filter tab bar -->
      <Motion
        :initial="{ opacity: 0, y: 15 }"
        :animate="{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3, duration: 0.5 },
        }"
        class="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto mb-12 px-6 relative z-20"
      >
        <button
          @click="selectedTrack = 'all'"
          class="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 pointer-events-auto border"
          :class="[
            selectedTrack === 'all'
              ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(83,58,253,0.15)] dark:bg-primary-soft dark:border-primary-soft dark:text-slate-950'
              : 'bg-surface-card text-ink-secondary dark:text-slate-300 border-hairline dark:border-slate-800 hover:bg-canvas-soft/80 dark:hover:bg-slate-900/50 hover:border-primary-soft',
          ]"
        >
          All Tracks
        </button>
        <button
          v-for="track in tracks"
          :key="track.id"
          @click="selectedTrack = track.id"
          class="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 pointer-events-auto border"
          :class="[
            selectedTrack === track.id
              ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(83,58,253,0.15)] dark:bg-primary-soft dark:border-primary-soft dark:text-slate-950'
              : 'bg-surface-card text-ink-secondary dark:text-slate-300 border-hairline dark:border-slate-800 hover:bg-canvas-soft/80 dark:hover:bg-slate-900/50 hover:border-primary-soft',
          ]"
        >
          {{ track.name }}
        </button>
      </Motion>

      <!-- Empty state -->
      <div
        v-if="filteredAssignments.length === 0"
        class="max-w-md mx-auto px-6 text-center py-12 relative z-10"
      >
        <div
          class="rounded-2xl border border-hairline dark:border-slate-800 bg-surface-card p-8 space-y-3"
        >
          <h2 class="font-light text-xl text-ink dark:text-white">
            No Assignments Found
          </h2>
          <p class="text-sm text-ink-mute dark:text-slate-400">
            There are currently no assignments published under this track. Check
            back later!
          </p>
        </div>
      </div>

      <!-- Timeline -->
      <div v-else class="relative z-10">
        <AssignmentsTimelineContainer
          :assignments="filteredAssignments"
          @view-details="openSubmissionModal"
        />
      </div>
    </template>

    <!-- Overlay Modal for View Submission / Details -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          @click="closeModal"
        >
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 translate-y-8 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in transform"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-8 scale-95"
            appear
          >
            <div
              class="bg-white dark:bg-[#151f32] border border-hairline dark:border-slate-805 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
              @click.stop
            >
              <!-- Close button -->
              <button
                type="button"
                @click="closeModal"
                class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div v-if="selectedAssignment" class="space-y-6">
                <!-- Title & Meta -->
                <div>
                  <h3
                    class="font-zalando text-2xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    {{ selectedAssignment.title }}
                  </h3>
                  <p
                    class="text-xs text-slate-400 dark:text-slate-500 mt-1 capitalize"
                  >
                    {{ selectedAssignment.status }} • Open:
                    {{
                      formatDate(selectedAssignment.timeline.submissionsOpenAt)
                    }}
                    • Due:
                    {{ formatDate(selectedAssignment.submissionsCloseAt) }}
                  </p>
                </div>

                <!-- Description -->
                <p
                  class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-inter bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-hairline dark:border-slate-850"
                >
                  {{ selectedAssignment.description }}
                </p>

                <!-- Loading State inside Modal -->
                <div
                  v-if="isFetchingSubmission"
                  class="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <div
                    class="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"
                  ></div>
                  <span
                    class="text-xs text-slate-400 dark:text-slate-500 font-medium animate-pulse"
                    >Fetching submission details...</span
                  >
                </div>

                <!-- Error State -->
                <div
                  v-else-if="fetchError"
                  class="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs text-center"
                >
                  {{ fetchError }}
                </div>

                <!-- Loaded State -->
                <div v-else class="space-y-4">
                  <h4
                    class="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    Submission Details
                  </h4>

                  <AssignmentsSubmissionForm
                    :assignment-id="selectedAssignment.id"
                    :existing-submission="submission"
                    :is-locked="true"
                    :lock-reason="
                      selectedAssignment.status === 'closed'
                        ? 'Submissions closed (deadline passed)'
                        : 'Submissions not open yet'
                    "
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
