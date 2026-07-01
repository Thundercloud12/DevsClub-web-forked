<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useAssignments } from '~/composables/student/useAssignments'
import { useSubmissions } from '~/composables/student/useSubmissions'
import { useAuthStore } from '~/stores/auth'
import type { Assignment } from '~/schemas/assignments'
import type { Submission } from '~/schemas/submissions'
import { useLoading } from '~/composables/useLoading'

const route = useRoute()
const assignmentId = route.params.id as string

const { getAssignmentById } = useAssignments()
const { getSubmissionByUser } = useSubmissions()
const authStore = useAuthStore()
const { startLoading, stopLoading } = useLoading()

const assignment = ref<Assignment | null>(null)
const existingSubmission = ref<Submission | null>(null)
const isLoading = ref(true)
const loadError = ref<string | null>(null)

// Derived from real Firestore data — not trusting any client-provided value
const isDeadlinePassed = computed(() => {
  if (!assignment.value?.submissionsCloseAt) return true
  return Date.now() >= new Date(assignment.value.submissionsCloseAt).getTime()
})

const isSubmissionsOpen = computed(() => {
  if (!assignment.value) return false
  const now = Date.now()
  const openAt = new Date(assignment.value.timeline.submissionsOpenAt).getTime()
  const closeAt = new Date(assignment.value.submissionsCloseAt).getTime()
  return now >= openAt && now < closeAt
})

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

onMounted(async () => {
  startLoading('assignment-detail')
  try {
    const [fetchedAssignment, fetchedSubmission] = await Promise.all([
      getAssignmentById(assignmentId),
      // Only check for existing submissions when a user is logged in
      authStore.user?.uid
        ? getSubmissionByUser(assignmentId, authStore.user.uid)
        : Promise.resolve(null),
    ])

    if (!fetchedAssignment) {
      loadError.value = 'Assignment not found.'
      return
    }

    assignment.value = fetchedAssignment
    existingSubmission.value = fetchedSubmission
  } catch (err: any) {
    loadError.value = err?.message ?? 'Failed to load assignment.'
  } finally {
    isLoading.value = false
    stopLoading('assignment-detail')
  }
})

function onSubmitted() {
  // Re-fetch the submission after successful submit
  if (authStore.user?.uid) {
    getSubmissionByUser(assignmentId, authStore.user.uid).then((sub) => {
      existingSubmission.value = sub
    })
  }
}

useHead({
  title: computed(() =>
    assignment.value
      ? `Submit: ${assignment.value.title} | DevsClub`
      : 'Submit Assignment | DevsClub'
  ),
})
</script>

<template>
  <div
    class="min-h-screen bg-canvas dark:bg-[#0b1120] pt-32 pb-24 relative gradient-mesh"
  >
    <div class="max-w-2xl mx-auto relative z-10 px-6">
      <!-- Loading skeleton -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div class="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div class="h-5 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div class="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div class="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>

      <!-- Error state -->
      <div
        v-else-if="loadError"
        class="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-3"
      >
        <div
          class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto"
        >
          <svg
            class="w-7 h-7 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <h2 class="font-light text-xl text-ink dark:text-white">
          {{ loadError }}
        </h2>
        <NuxtLink
          to="/dashboard/assignments"
          class="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-deep dark:text-primary-soft transition-colors duration-150"
        >
          ← Back to Assignments
        </NuxtLink>
      </div>

      <template v-else-if="assignment">
        <!-- Back nav -->
        <Motion
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0, transition: { duration: 0.3 } }"
        >
          <NuxtLink
            to="/dashboard/assignments"
            class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-mute hover:text-primary dark:hover:text-primary-soft transition-colors mb-8 group"
          >
            <svg
              class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Assignments
          </NuxtLink>
        </Motion>

        <!-- Assignment header -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 80, damping: 15 },
          }"
          class="mb-8"
        >
          <div class="flex items-center gap-2 mb-3">
            <span
              class="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full"
              :class="[
                isSubmissionsOpen
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : isDeadlinePassed
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              ]"
            >
              {{
                isSubmissionsOpen
                  ? 'Open'
                  : isDeadlinePassed
                    ? 'Closed'
                    : 'Upcoming'
              }}
            </span>
            <span
              class="text-xs text-ink-mute dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              <span
                >Open:
                {{ formatDate(assignment.timeline.submissionsOpenAt) }}</span
              >
              <span class="hidden sm:inline text-slate-300 dark:text-slate-700"
                >•</span
              >
              <span>Due: {{ formatDate(assignment.submissionsCloseAt) }}</span>
            </span>
          </div>

          <h1
            class="text-3xl md:text-4xl font-light tracking-[-0.64px] text-ink dark:text-white leading-tight mb-3"
          >
            {{ assignment.title }}
          </h1>
          <p
            class="text-ink-secondary dark:text-slate-300 leading-relaxed font-light"
          >
            {{ assignment.description }}
          </p>
        </Motion>

        <!-- Form card (open, closed, or upcoming) -->
        <Motion
          :initial="{ opacity: 0, y: 24, filter: 'blur(8px)' }"
          :animate="{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 80, delay: 0.15 },
          }"
        >
          <div
            class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <h2 class="font-light text-xl text-ink dark:text-white mb-6">
              {{ existingSubmission ? 'Your Submission' : 'Submit Your Work' }}
            </h2>

            <AssignmentsSubmissionForm
              :assignment-id="assignmentId"
              :existing-submission="existingSubmission"
              :is-locked="!isSubmissionsOpen"
              :lock-reason="
                isDeadlinePassed
                  ? 'Submissions closed (deadline passed)'
                  : `Submissions not open yet`
              "
              @submitted="onSubmitted"
            />
          </div>
        </Motion>
      </template>
    </div>
  </div>
</template>
