<template>
  <div
    class="min-h-screen pt-24 pb-12 px-4 sm:px-8 bg-canvas dark:bg-[#0b1120] gradient-mesh"
  >
    <div class="max-w-4xl mx-auto space-y-8 relative z-10">
      <!-- Header -->
      <div class="pb-4 border-b border-hairline/80 dark:border-slate-800">
        <button
          @click="
            navigateTo(
              submission?.assignmentId
                ? `/admin/submissions/${submission.assignmentId}`
                : '/admin/submissions'
            )
          "
          class="text-xs font-semibold uppercase tracking-wider text-ink-mute hover:text-primary flex items-center gap-1.5 mb-3 transition-colors duration-150"
        >
          ← Back to Submissions
        </button>
        <h1
          class="text-3xl font-light tracking-[-0.64px] text-ink dark:text-slate-50"
        >
          Evaluate Submission
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-4">
        <div
          class="h-32 bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl"
        />
        <div
          class="h-48 bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl"
        />
      </div>

      <!-- Error -->
      <div
        v-else-if="loadError"
        class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
      >
        {{ loadError }}
      </div>

      <template v-else-if="submission">
        <!-- Submission Info Card -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
              >
                Student ID
              </p>
              <p
                class="font-mono text-sm text-ink-secondary dark:text-slate-200"
              >
                {{ submission.studentId }}
              </p>
            </div>
            <span
              class="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
              :class="
                submission.status === 'evaluated'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
              "
            >
              {{
                submission.status === 'evaluated' ? '✓ Evaluated' : '⏳ Pending'
              }}
            </span>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-hairline/60 dark:border-slate-800/60"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
              >
                GitHub Repo
              </p>
              <a
                :href="submission.githubLink"
                target="_blank"
                class="text-primary hover:text-primary-deep dark:text-primary-soft hover:underline text-sm truncate block transition-colors duration-150 font-medium"
              >
                {{ submission.githubLink.replace('https://github.com/', '') }}
              </a>
            </div>
            <div v-if="submission.liveUrl">
              <p
                class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
              >
                Live URL
              </p>
              <a
                :href="submission.liveUrl"
                target="_blank"
                class="text-primary hover:text-primary-deep dark:text-primary-soft hover:underline text-sm truncate block transition-colors duration-150 font-medium"
              >
                {{ submission.liveUrl.replace(/^https?:\/\//, '') }}
              </a>
            </div>
            <div v-if="submission.videoLink">
              <p
                class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
              >
                Video Demo
              </p>
              <a
                :href="submission.videoLink"
                target="_blank"
                class="text-primary hover:text-primary-deep dark:text-primary-soft hover:underline text-sm truncate block transition-colors duration-150 font-medium"
              >
                Watch Video Demo
              </a>
            </div>
          </div>

          <div
            v-if="submission.notes"
            class="pt-4 border-t border-hairline/60 dark:border-slate-800/60"
          >
            <p
              class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1.5"
            >
              Student Notes
            </p>
            <p
              class="text-sm text-ink-secondary dark:text-slate-300 whitespace-pre-wrap leading-relaxed"
            >
              {{ submission.notes }}
            </p>
          </div>
        </div>

        <!-- No Rubric found -->
        <div
          v-if="!rubric && !isLoadingRubric"
          class="p-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-xl text-sm"
        >
          Could not load the rubric for this assignment. Cannot evaluate without
          it.
        </div>

        <!-- Rubric Loading -->
        <div
          v-else-if="isLoadingRubric"
          class="h-40 bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl"
        />

        <!-- GRADING SECTION -->
        <div
          v-else-if="rubric"
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)]"
        >
          <div
            class="flex items-center justify-between pb-4 border-b border-hairline/60 dark:border-slate-800/60"
          >
            <h2
              class="text-xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
            >
              Grading:
              <span class="text-primary dark:text-primary-soft font-normal">{{
                rubric.name
              }}</span>
            </h2>
            <div class="text-right">
              <p
                class="text-3xl font-light font-mono text-ink dark:text-slate-50 tracking-tight"
              >
                {{ totalScore }}
              </p>
              <p
                class="text-[10px] font-semibold uppercase tracking-wider text-ink-mute"
              >
                out of {{ maxPossibleScore }}
              </p>
            </div>
          </div>

          <!-- Criteria Scoring Rows -->
          <div class="space-y-4">
            <div
              v-for="(criterion, index) in scoringForm"
              :key="criterion.id"
              class="p-6 bg-canvas-soft/50 dark:bg-slate-900/30 rounded-xl border border-hairline dark:border-slate-800"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="font-medium text-ink dark:text-slate-50">
                    {{ criterion.label }}
                  </p>
                  <p
                    v-if="criterion.description"
                    class="text-xs text-ink-mute dark:text-slate-400 mt-1.5 leading-relaxed"
                  >
                    {{ criterion.description }}
                  </p>
                  <p
                    class="text-[10px] font-semibold uppercase tracking-wider text-ink-mute/80 dark:text-slate-500 mt-2"
                  >
                    Max: {{ criterion.maxScore }} pts | Type:
                    {{ criterion.type }}
                  </p>
                </div>

                <div class="text-right shrink-0">
                  <template v-if="canGrade">
                    <input
                      type="number"
                      v-model.number="scoringForm[index].actualScore"
                      :min="criterion.minScore"
                      :max="criterion.maxScore"
                      class="w-20 text-center rounded-lg border border-hairline-input bg-canvas px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/50 dark:text-white transition-all duration-150"
                    />
                    <p
                      class="text-[10px] font-semibold uppercase tracking-wider text-ink-mute mt-1.5"
                    >
                      / {{ criterion.maxScore }}
                    </p>
                  </template>
                  <template v-else>
                    <p
                      class="text-2xl font-light font-mono text-ink dark:text-slate-50"
                    >
                      {{ criterion.actualScore ?? '—' }}
                    </p>
                    <p
                      class="text-[10px] font-semibold uppercase tracking-wider text-ink-mute mt-1"
                    >
                      / {{ criterion.maxScore }}
                    </p>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Grader-Only Save Section -->
          <div
            v-if="canGrade"
            class="pt-6 border-t border-hairline/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <p
              class="text-xs text-ink-mute dark:text-slate-400 flex items-center gap-1.5"
            >
              <svg
                class="w-4 h-4 text-emerald-500 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span
                >Saving grades marks this submission as evaluated and updates
                the leaderboard.</span
              >
            </p>
            <UiButton @click="saveGrades" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Grades' }}
            </UiButton>
          </div>

          <!-- Read-only notice for non-admins -->
          <div
            v-else
            class="pt-4 border-t border-hairline/80 dark:border-slate-800"
          >
            <p
              class="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <span
                >⚠️ You are viewing this submission in read-only mode. Only
                Admins can edit scores.</span
              >
            </p>
          </div>

          <p v-if="saveError" class="text-red-500 text-sm">{{ saveError }}</p>
          <p v-if="saveSuccess" class="text-green-500 text-sm font-medium">
            {{ saveSuccess }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminSubmissions } from '~/composables/admin/useAdminSubmissions'
import { useAdminAssignments } from '~/composables/admin/useAdminAssignments'
import { useAdminRubrics } from '~/composables/admin/useAdminRubrics'
import UiButton from '~/components/ui/Button.vue'

const route = useRoute()
// The page param is the submission id in format: {assignmentId}_{studentId}
const submissionId = route.params.id

const authStore = useAuthStore()
const { getSubmissionById, evaluateSubmission } = useAdminSubmissions()
const { getAssignmentById } = useAdminAssignments()
const { getRubricById } = useAdminRubrics()

const submission = ref(null)
const rubric = ref(null)
const scoringForm = ref([]) // array of { ...criterion, actualScore }

const isLoading = ref(true)
const isLoadingRubric = ref(false)
const isSaving = ref(false)
const loadError = ref(null)
const saveError = ref('')
const saveSuccess = ref('')

// ── Role Guard ─────────────────────────────────────────────────────────────────
const canGrade = computed(() => {
  return authStore.role === 'admin'
})

// ── Scoring Totals ─────────────────────────────────────────────────────────────
const totalScore = computed(() =>
  scoringForm.value.reduce((sum, c) => sum + (Number(c.actualScore) || 0), 0)
)
const maxPossibleScore = computed(() =>
  scoringForm.value.reduce((sum, c) => sum + (c.maxScore || 0), 0)
)

// ── Data Fetching ──────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    // 1. Fetch the submission document
    const subData = await getSubmissionById(submissionId)

    if (!subData) {
      loadError.value = `Submission "${submissionId}" not found.`
      return
    }

    submission.value = subData

    // 2. Fetch the rubric for the assignment
    isLoadingRubric.value = true
    const assignmentData = await getAssignmentById(subData.assignmentId)

    if (assignmentData) {
      const rubricId = assignmentData.rubricId
      const rubricData = await getRubricById(rubricId)
      if (rubricData) {
        rubric.value = rubricData

        // 3. Build the scoring form
        // If scores already exist (re-evaluating), use them as starting values
        const existingScores = subData.scores || []
        scoringForm.value = rubric.value.criteria.map((criterion) => {
          const existing = existingScores.find((s) => s.id === criterion.id)
          return {
            ...criterion,
            actualScore: existing?.actualScore ?? 0,
          }
        })
      }
    }
  } catch (err) {
    loadError.value = err.message || 'Failed to load submission data.'
    console.error(err)
  } finally {
    isLoading.value = false
    isLoadingRubric.value = false
  }
})

// ── Save Grades ────────────────────────────────────────────────────────────────
const saveGrades = async () => {
  if (!canGrade.value) return // Safety: double-check on client
  try {
    isSaving.value = true
    saveError.value = ''
    saveSuccess.value = ''

    const scoresPayload = scoringForm.value.map((c) => ({
      id: c.id,
      label: c.label,
      type: c.type,
      maxScore: c.maxScore,
      minScore: c.minScore,
      description: c.description || '',
      actualScore: Number(c.actualScore) || 0,
    }))

    const res = await evaluateSubmission(submissionId, scoresPayload)

    // Update local state to reflect saved state
    submission.value = {
      ...submission.value,
      scores: res.scores,
      status: res.status,
      totalScore: res.totalScore,
    }

    saveSuccess.value =
      'Grades saved successfully! Submission is now marked as Evaluated.'
  } catch (err) {
    saveError.value = err.message || 'Failed to save grades. Try again.'
    console.error(err)
  } finally {
    isSaving.value = false
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
</script>
