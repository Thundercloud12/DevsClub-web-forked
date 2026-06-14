<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useAssignments } from '~/composables/useAssignments'
import { useSubmissions } from '~/composables/useSubmissions'
import { useAuthStore } from '~/stores/auth'
import type { Assignment } from '~/schemas/assignments'
import type { Submission } from '~/schemas/submissions'

// Auth middleware removed temporarily for UI testing
// Re-add once user schema is finalized: definePageMeta({ middleware: 'auth' })

// definePageMeta({ middleware: 'auth' })

const route = useRoute()
const assignmentId = route.params.id as string

const { getAssignmentById } = useAssignments()
const { getSubmissionByUser } = useSubmissions()
const authStore = useAuthStore()

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
  try {
    const [fetchedAssignment, fetchedSubmission] = await Promise.all([
      getAssignmentById(assignmentId),
      // Only check for existing submissions when a user is logged in
      authStore.user?.uid
        ? getSubmissionByUser(assignmentId, authStore.user.uid)
        : Promise.resolve(null),
    ])

    if (!fetchedAssignment) {
      // Dev fallback: inject a mock so the form is visible without a real Firestore record
      assignment.value = {
        id: assignmentId,
        title: `[Preview] Assignment ${assignmentId}`,
        description:
          'This is a preview assignment for UI testing. No real Firestore record found.',
        rubricId: 'preview',
        submissionsCloseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        timeline: {
          publishedAt: new Date(),
          submissionsOpenAt: new Date(),
          submissionsCloseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }
      isLoading.value = false
      return
    }

    assignment.value = fetchedAssignment
    existingSubmission.value = fetchedSubmission
  } catch (err: any) {
    loadError.value = err?.message ?? 'Failed to load assignment.'
  } finally {
    isLoading.value = false
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
  <div class="min-h-screen bg-transparent pt-32 pb-24 px-6">
    <div class="max-w-2xl mx-auto">
      <!-- Loading skeleton -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded-lg" />
        <div class="h-12 w-3/4 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
        <div class="h-5 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
        <div class="h-5 w-2/3 bg-gray-200 dark:bg-slate-800 rounded-lg" />
        <div class="h-64 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
      </div>

      <!-- Error state -->
      <div
        v-else-if="loadError"
        class="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center space-y-3"
      >
        <div
          class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto"
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
        <h2
          class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
        >
          {{ loadError }}
        </h2>
        <NuxtLink
          to="/assignments"
          class="inline-flex items-center text-brand-blue hover:underline text-sm font-medium"
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
            to="/assignments"
            class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors mb-8 group"
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
              class="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-xl"
              :class="[
                isSubmissionsOpen
                  ? 'bg-brand-cyan/20 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-cyan'
                  : isDeadlinePassed
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400',
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
            <span class="text-sm text-gray-400 dark:text-gray-500">
              Due {{ formatDate(assignment.submissionsCloseAt) }}
            </span>
          </div>

          <h1
            class="font-zalando text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3"
          >
            {{ assignment.title }}
          </h1>
          <p
            class="text-gray-600 dark:text-gray-300 leading-relaxed font-inter"
          >
            {{ assignment.description }}
          </p>
        </Motion>

        <!-- Deadline passed — hard block (no form rendered at all) -->
        <Motion
          v-if="isDeadlinePassed && !existingSubmission"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0, transition: { delay: 0.15 } }"
        >
          <div
            class="rounded-2xl border border-red-500/30 bg-red-500/5 dark:bg-red-900/10 p-8 text-center space-y-3"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2
              class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
            >
              Submissions Closed
            </h2>
            <p
              class="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto"
            >
              The deadline for this assignment passed on
              <strong>{{ formatDate(assignment.submissionsCloseAt) }}</strong
              >. No further submissions are accepted.
            </p>
          </div>
        </Motion>

        <!-- Not yet open -->
        <Motion
          v-else-if="!isSubmissionsOpen && !existingSubmission"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0, transition: { delay: 0.15 } }"
        >
          <div
            class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#151f32] p-8 text-center space-y-3"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto"
            >
              <svg
                class="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2
              class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
            >
              Not Yet Open
            </h2>
            <p
              class="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto"
            >
              Submissions open on
              <strong>{{
                formatDate(assignment.timeline.submissionsOpenAt)
              }}</strong
              >. Come back then!
            </p>
          </div>
        </Motion>

        <!-- Form card (open OR already submitted) -->
        <Motion
          v-else
          :initial="{ opacity: 0, y: 24, filter: 'blur(8px)' }"
          :animate="{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 80, delay: 0.15 },
          }"
        >
          <div
            class="bg-white dark:bg-[#151f32] border border-gray-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <h2
              class="font-zalando font-bold text-xl text-gray-900 dark:text-white mb-6"
            >
              {{ existingSubmission ? 'Your Submission' : 'Submit Your Work' }}
            </h2>

            <AssignmentsSubmissionForm
              :assignment-id="assignmentId"
              :existing-submission="existingSubmission"
              @submitted="onSubmitted"
            />
          </div>
        </Motion>
      </template>
    </div>
  </div>
</template>
