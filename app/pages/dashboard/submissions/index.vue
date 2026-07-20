<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSubmissions } from '~/composables/student/useSubmissions'
import { useAssignments } from '~/composables/student/useAssignments'
import { useAuthStore } from '~/stores/auth'
import type { Submission } from '~/schemas/submissions'
import type { Evaluation } from '~/schemas/evaluations'
import type { Assignment } from '~/schemas/assignments'
import { useLoading } from '~/composables/useLoading'

useHead({
  title: 'My Submissions | TSEC DevsClub',
  meta: [
    {
      name: 'description',
      content:
        'View your submitted assignments, scores, and evaluation feedback.',
    },
  ],
})

const { getSubmissionsByStudent, getEvaluationsByStudent } = useSubmissions()
const { getAssignments } = useAssignments()
const authStore = useAuthStore()
const { startLoading, stopLoading } = useLoading()

export interface StudentSubmissionItem extends Submission {
  assignment?: Assignment
  evaluation?: Evaluation | null
}

const submissions = ref<StudentSubmissionItem[]>([])
const isLoading = ref(true)
const loadError = ref<string | null>(null)

// Expanded states for feedback details
const expandedSubmissions = ref<Record<string, boolean>>({})

const toggleExpand = (submissionId: string) => {
  expandedSubmissions.value[submissionId] =
    !expandedSubmissions.value[submissionId]
}

const getRubricMaxScore = (evaluation?: Evaluation | null) => {
  if (!evaluation || !evaluation.scores) return 0
  return evaluation.scores.reduce(
    (sum: number, c) => sum + (c.maxScore || 0),
    0
  )
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  const userId = authStore.user?.uid
  if (!userId) {
    loadError.value = 'User session not found.'
    isLoading.value = false
    return
  }

  startLoading('student-submissions')
  try {
    const [fetchedSubmissions, fetchedEvaluations, fetchedAssignments] =
      await Promise.all([
        getSubmissionsByStudent(userId),
        getEvaluationsByStudent(userId),
        getAssignments(),
      ])

    const evalMap = new Map(fetchedEvaluations.map((e) => [e.submissionId, e]))

    submissions.value = fetchedSubmissions.map((sub) => {
      const assignment = fetchedAssignments.find(
        (a) => a.id === sub.assignmentId
      )
      return {
        ...sub,
        assignment,
        evaluation: evalMap.get(sub.id) || null,
      }
    })
  } catch (err: any) {
    loadError.value = err?.message ?? 'Failed to load submissions.'
  } finally {
    isLoading.value = false
    stopLoading('student-submissions')
  }
})
</script>

<template>
  <div class="min-h-screen pt-32 pb-24 relative">
    <!-- Header -->
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
          Academic Progress
        </span>
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-light tracking-[-1.2px] text-ink dark:text-white leading-tight"
        >
          My Submissions
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.6 } }"
        class="text-lg md:text-xl text-ink-mute dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
      >
        Track the status of your submitted project milestones, view grading
        scores, and check rubrics feedback from evaluators.
      </Motion>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-pulse relative z-10"
    >
      <div
        class="h-40 bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl"
      />
      <div
        class="h-40 bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="loadError"
      class="max-w-md mx-auto px-6 text-center py-12 relative z-10"
    >
      <div
        class="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-3"
      >
        <h2 class="font-light text-xl text-ink dark:text-white">
          Failed to Load Submissions
        </h2>
        <p class="text-sm text-ink-mute dark:text-slate-400">{{ loadError }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="submissions.length === 0"
      class="max-w-md mx-auto px-6 text-center py-16 relative z-10"
    >
      <div
        class="rounded-3xl border border-hairline dark:border-slate-800 bg-surface-card p-10 space-y-6 shadow-xl"
      >
        <div
          class="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 border border-hairline dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto"
        >
          <svg
            class="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="space-y-2">
          <h2 class="font-light text-2xl text-ink dark:text-white">
            No Submissions Yet
          </h2>
          <p class="text-sm text-ink-mute dark:text-slate-400 leading-relaxed">
            You haven't submitted any assignments yet. Go to your assignments
            list to view instructions and start building!
          </p>
        </div>
        <NuxtLink
          to="/dashboard/assignments"
          class="inline-flex items-center justify-center font-medium px-6 py-2.5 rounded-xl transition-all duration-200 text-sm bg-brand-blue text-white hover:bg-blue-600 shadow-[0_0_15px_rgba(49,113,219,0.2)] focus:outline-none"
        >
          View Assignments
        </NuxtLink>
      </div>
    </div>

    <!-- Submissions List -->
    <div v-else class="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
      <Motion
        v-for="(sub, index) in submissions"
        :key="sub.id"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.1, duration: 0.4 },
        }"
        class="bg-white dark:bg-[#111a2f] border border-hairline dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 relative overflow-hidden"
      >
        <!-- Card Content -->
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div class="space-y-3 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                :class="
                  sub.evaluation
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                "
              >
                {{ sub.evaluation ? '✓ Evaluated' : '⏳ Pending Evaluation' }}
              </span>
              <span
                class="text-xs text-slate-400 dark:text-slate-500 font-medium"
              >
                Submitted {{ formatDate(sub.submittedAt) }}
              </span>
            </div>

            <h2
              class="font-zalando text-2xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              {{ sub.assignment?.title || 'Unknown Assignment' }}
            </h2>

            <p
              class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-inter line-clamp-2"
            >
              {{ sub.assignment?.description }}
            </p>

            <!-- Links list -->
            <div class="flex flex-wrap gap-2 pt-2">
              <a
                :href="sanitizeUrl(sub.githubLink)"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-hairline dark:border-slate-800 text-ink dark:text-slate-300 transition-colors"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                GitHub Link
              </a>
              <a
                v-if="sub.liveUrl"
                :href="sub.liveUrl"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-hairline dark:border-slate-800 text-ink dark:text-slate-300 transition-colors"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </a>
              <a
                v-if="sub.videoLink"
                :href="sub.videoLink"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-hairline dark:border-slate-800 text-ink dark:text-slate-300 transition-colors"
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Video Walkthrough
              </a>
            </div>
          </div>

          <!-- Evaluation Score Panel -->
          <div
            class="flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/40 border border-hairline dark:border-slate-800 rounded-2xl px-8 py-6 text-center min-w-[160px] self-stretch md:self-auto"
          >
            <template v-if="sub.evaluation">
              <span
                class="text-3xl font-light font-mono text-ink dark:text-white tracking-tight"
              >
                {{ sub.evaluation.totalScore }}
              </span>
              <span
                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1"
              >
                out of {{ getRubricMaxScore(sub.evaluation) }}
              </span>
              <button
                type="button"
                @click="toggleExpand(sub.id)"
                class="mt-4 text-xs font-semibold text-primary hover:text-primary-deep dark:text-primary-soft transition-colors cursor-pointer focus:outline-none"
              >
                {{
                  expandedSubmissions[sub.id] ? 'Hide Rubric' : 'View Feedback'
                }}
              </button>
            </template>
            <template v-else>
              <div
                class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2"
              >
                ⏳
              </div>
              <span
                class="text-xs text-ink-mute dark:text-slate-400 font-medium"
              >
                Pending evaluation
              </span>
            </template>
          </div>
        </div>

        <!-- Notes if present -->
        <div
          v-if="sub.notes"
          class="mt-4 pt-4 border-t border-hairline/60 dark:border-slate-800/60"
        >
          <p
            class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1"
          >
            My Submission Notes:
          </p>
          <p
            class="text-xs text-slate-600 dark:text-slate-300 font-inter whitespace-pre-wrap leading-relaxed"
          >
            {{ sub.notes }}
          </p>
        </div>

        <!-- Expanded Rubric / Scoring feedback breakdown -->
        <div
          v-if="sub.evaluation && expandedSubmissions[sub.id]"
          class="mt-6 pt-6 border-t border-hairline/80 dark:border-slate-800/80 space-y-4"
        >
          <!-- Evaluator Feedback -->
          <div
            v-if="sub.evaluation.feedback"
            class="p-5 bg-primary-bg-subdued/30 dark:bg-primary-soft/5 border border-primary-border/40 dark:border-slate-800 rounded-2xl space-y-2"
          >
            <h4
              class="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-soft"
            >
              Evaluator's Feedback
            </h4>
            <p
              class="text-sm text-ink-secondary dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-inter"
            >
              {{ sub.evaluation.feedback }}
            </p>
          </div>

          <h3
            class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            Evaluation Rubric Breakdown
          </h3>

          <div class="space-y-3">
            <div
              v-for="score in sub.evaluation.scores"
              :key="score.id"
              class="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-hairline dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div class="space-y-1">
                <h4 class="text-sm font-semibold text-ink dark:text-white">
                  {{ score.label }}
                </h4>
                <p
                  v-if="score.description"
                  class="text-xs text-ink-mute dark:text-slate-400"
                >
                  {{ score.description }}
                </p>
              </div>
              <div
                class="text-right font-mono font-medium text-sm text-ink dark:text-white shrink-0"
              >
                Score: {{ score.actualScore }} / {{ score.maxScore }}
              </div>
            </div>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>
