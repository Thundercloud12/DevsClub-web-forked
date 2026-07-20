<template>
  <AdminPageLayout
    title="Evaluate Submission"
    :backUrl="
      submission?.assignmentId
        ? `/admin/submissions/${submission.assignmentId}`
        : '/admin/submissions'
    "
    backLabel="Back to Submissions"
    maxWidth="4xl"
  >
    <!-- Error -->
    <div
      v-if="loadError"
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
          <div class="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              <p
                class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
              >
                Student Name
              </p>
              <p
                class="text-sm text-ink-secondary dark:text-slate-200 font-medium"
              >
                {{ submission.studentName || submission.studentId }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
              >
                Grad Year
              </p>
              <p
                class="font-mono text-sm text-ink-secondary dark:text-slate-200"
              >
                {{ submission.gradyear || '—' }}
              </p>
            </div>
          </div>
          <span
            class="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
            :class="
              evaluation
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
            "
          >
            {{ evaluation ? '✓ Evaluated' : '⏳ Pending' }}
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
              :href="sanitizeUrl(submission.githubLink)"
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
              :href="sanitizeUrl(submission.liveUrl)"
              target="_blank"
              class="text-primary hover:text-primary-deep dark:text-primary-soft hover:underline text-sm truncate block transition-colors duration-150 font-medium"
            >
              {{ submission.liveUrl }}
            </a>
          </div>
          <div v-if="submission.videoLink">
            <p
              class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
            >
              Video Link
            </p>
            <a
              :href="sanitizeUrl(submission.videoLink)"
              target="_blank"
              class="text-primary hover:text-primary-deep dark:text-primary-soft hover:underline text-sm truncate block transition-colors duration-150 font-medium"
            >
              {{ submission.videoLink }}
            </a>
          </div>
        </div>

        <div
          v-if="submission.notes"
          class="pt-4 border-t border-hairline/60 dark:border-slate-800/60"
        >
          <p
            class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold mb-1"
          >
            Student Notes
          </p>
          <p
            class="text-sm text-ink-secondary dark:text-slate-350 leading-relaxed"
          >
            {{ submission.notes }}
          </p>
        </div>
      </div>

      <!-- Grading Section -->
      <div
        class="bg-surface-card border border-hairline dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-[0_4px_12px_rgba(0,55,112,0.02),0_1px_3px_rgba(0,55,112,0.01)]"
      >
        <div class="flex items-center justify-between">
          <h2
            class="text-xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
          >
            Criteria Grading
          </h2>
          <div class="text-right">
            <p
              class="text-[10px] uppercase tracking-wider text-ink-mute dark:text-slate-500 font-semibold"
            >
              Total Score
            </p>
            <p
              class="text-2xl font-light font-mono text-primary dark:text-primary-soft"
            >
              {{ totalScore }} / {{ maxPossibleScore }}
            </p>
          </div>
        </div>

        <!-- Rubric Criteria Forms -->
        <div class="space-y-6">
          <div v-if="isLoadingRubric" class="text-center py-6">
            <p class="text-sm text-slate-500 animate-pulse">
              Loading rubric schema...
            </p>
          </div>
          <div
            v-else-if="scoringForm.length === 0"
            class="text-sm text-slate-500 italic"
          >
            No criteria loaded for this rubric.
          </div>
          <div
            v-for="(criterion, index) in scoringForm"
            :key="criterion.id"
            class="p-5 bg-canvas-soft/40 dark:bg-slate-900/20 border border-hairline dark:border-slate-800 rounded-xl space-y-3"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
            >
              <div>
                <h4 class="font-medium text-ink dark:text-slate-100">
                  {{ criterion.label }}
                </h4>
                <p
                  v-if="criterion.description"
                  class="text-xs text-ink-mute dark:text-slate-400 mt-0.5"
                >
                  {{ criterion.description }}
                </p>
              </div>
              <span
                class="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-mono shrink-0 self-start"
              >
                {{ criterion.type }}
              </span>
            </div>

            <!-- Score input based on type -->
            <div class="flex items-center gap-4 pt-1 max-w-xs">
              <!-- Number input -->
              <template v-if="criterion.type === 'number'">
                <div class="flex items-center gap-2 w-full">
                  <UiInput
                    type="number"
                    v-model.number="criterion.actualScore"
                    min="0"
                    :max="criterion.maxScore"
                    class="w-24 text-center font-mono font-bold"
                    :disabled="!canGrade"
                  />
                  <span class="text-xs text-ink-mute"
                    >/ {{ criterion.maxScore }} max</span
                  >
                </div>
              </template>

              <!-- Boolean (Pass / Fail) -->
              <template v-else-if="criterion.type === 'boolean'">
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="criterion.actualScore = criterion.maxScore"
                    :disabled="!canGrade"
                    class="px-4 py-1.5 rounded-lg border text-xs font-semibold tracking-wider transition-all"
                    :class="
                      criterion.actualScore === criterion.maxScore
                        ? 'bg-green-500/10 text-green-600 border-green-500/30'
                        : 'border-hairline bg-surface hover:bg-canvas-soft'
                    "
                  >
                    PASS ({{ criterion.maxScore }})
                  </button>
                  <button
                    type="button"
                    @click="criterion.actualScore = 0"
                    :disabled="!canGrade"
                    class="px-4 py-1.5 rounded-lg border text-xs font-semibold tracking-wider transition-all"
                    :class="
                      criterion.actualScore === 0
                        ? 'bg-red-500/10 text-red-600 border-red-500/30'
                        : 'border-hairline bg-surface hover:bg-canvas-soft'
                    "
                  >
                    FAIL (0)
                  </button>
                </div>
              </template>

              <!-- Scale 1-5 -->
              <template v-else-if="criterion.type === 'scale'">
                <div class="flex gap-1.5">
                  <button
                    v-for="val in [1, 2, 3, 4, 5]"
                    :key="val"
                    type="button"
                    @click="
                      criterion.actualScore = Math.round(
                        (val / 5) * criterion.maxScore
                      )
                    "
                    :disabled="!canGrade"
                    class="w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-mono font-bold transition-all"
                    :class="
                      criterion.actualScore ===
                      Math.round((val / 5) * criterion.maxScore)
                        ? 'bg-primary text-white border-primary'
                        : 'border-hairline bg-surface hover:bg-canvas-soft'
                    "
                  >
                    {{ val }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Feedback Section -->
        <div class="pt-6 border-t border-hairline/60 dark:border-slate-800/60">
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-ink-mute dark:text-slate-400 mb-3"
          >
            Evaluator Feedback
          </h3>
          <template v-if="canGrade">
            <textarea
              id="feedback"
              v-model="feedback"
              rows="4"
              maxlength="1000"
              placeholder="Add constructive feedback for this submission..."
              class="w-full rounded-lg border border-hairline-input bg-canvas px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/50 dark:text-white transition-all duration-150"
            />
            <p class="text-[10px] text-ink-mute text-right mt-1">
              {{ feedback.length }} / 1000 characters
            </p>
          </template>
          <template v-else>
            <div
              v-if="evaluation?.feedback"
              class="p-4 bg-canvas-soft/50 dark:bg-slate-900/30 rounded-xl border border-hairline dark:border-slate-800"
            >
              <p
                class="text-sm text-ink-secondary dark:text-slate-300 whitespace-pre-wrap leading-relaxed"
              >
                {{ evaluation.feedback }}
              </p>
            </div>
            <p v-else class="text-sm text-ink-mute italic">
              No feedback provided for this evaluation.
            </p>
          </template>
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
              >Saving grades marks this submission as evaluated and updates the
              leaderboard.</span
            >
          </p>
          <UiButton @click="saveGrades" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Grades' }}
          </UiButton>
        </div>

        <!-- Read-only notice -->
        <div
          v-else
          class="pt-4 border-t border-hairline/80 dark:border-slate-800"
        >
          <p
            class="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <span v-if="evaluation">
              ✓ This submission has already been evaluated. Scores cannot be
              modified.
            </span>
            <span v-else>
              ⚠️ You are viewing this submission in read-only mode. Only Admins
              can edit scores.
            </span>
          </p>
        </div>

        <p v-if="saveError" class="text-red-500 text-sm">{{ saveError }}</p>
        <p v-if="saveSuccess" class="text-green-500 text-sm font-medium">
          {{ saveSuccess }}
        </p>
      </div>
    </template>
  </AdminPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminSubmissions } from '~/composables/admin/useAdminSubmissions'
import { useAdminAssignments } from '~/composables/admin/useAdminAssignments'
import { useAdminRubrics } from '~/composables/admin/useAdminRubrics'
import { useLoading } from '~/composables/useLoading'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import { useToastStore } from '~/stores/toast'
import { formatErrorMessage } from '~/utils/errors'

const route = useRoute()
const submissionId = route.params.id

const authStore = useAuthStore()
const { getSubmissionById, getEvaluationBySubmissionId, evaluateSubmission } =
  useAdminSubmissions()
const { getAssignmentById } = useAdminAssignments()
const { getRubricById } = useAdminRubrics()
const toastStore = useToastStore()
const { startLoading, stopLoading } = useLoading()

const submission = ref(null)
const evaluation = ref(null) // from Evaluations collection
const rubric = ref(null)
const scoringForm = ref([])
const feedback = ref('')

const isLoading = ref(true)
const isLoadingRubric = ref(false)
const isSaving = ref(false)
const loadError = ref(null)
const saveError = ref('')
const saveSuccess = ref('')

// Admin can grade only if no evaluation exists yet
const canGrade = computed(() => authStore.role === 'admin' && !evaluation.value)

const totalScore = computed(() =>
  scoringForm.value.reduce((sum, c) => sum + (Number(c.actualScore) || 0), 0)
)
const maxPossibleScore = computed(() =>
  scoringForm.value.reduce((sum, c) => sum + (c.maxScore || 0), 0)
)

onMounted(async () => {
  startLoading('admin-evaluate-submission')
  try {
    const [subData, evalData] = await Promise.all([
      getSubmissionById(submissionId),
      getEvaluationBySubmissionId(submissionId),
    ])

    if (!subData) {
      loadError.value = `Submission "${submissionId}" not found.`
      return
    }

    submission.value = subData
    evaluation.value = evalData
    feedback.value = evalData?.feedback || ''

    isLoadingRubric.value = true
    const assignmentData = await getAssignmentById(subData.assignmentId)

    if (assignmentData) {
      const rubricData = await getRubricById(assignmentData.rubricId)
      if (rubricData) {
        rubric.value = rubricData
        const existingScores = evalData?.scores || []
        scoringForm.value = rubric.value.criteria.map((criterion) => {
          const existing = existingScores.find((s) => s.id === criterion.id)
          return { ...criterion, actualScore: existing?.actualScore ?? 0 }
        })
      }
    }
  } catch (err) {
    loadError.value = err.message || 'Failed to load submission data.'
    console.error(err)
  } finally {
    isLoading.value = false
    isLoadingRubric.value = false
    stopLoading('admin-evaluate-submission')
  }
})

const saveGrades = async () => {
  if (!canGrade.value) return
  try {
    isSaving.value = true
    saveError.value = ''
    saveSuccess.value = ''

    for (const c of scoringForm.value) {
      const score = Number(c.actualScore) || 0
      if (score < 0)
        throw new Error(`Score for "${c.label}" cannot be negative.`)
      if (score > c.maxScore)
        throw new Error(`Score for "${c.label}" cannot exceed ${c.maxScore}.`)
    }

    const scoresPayload = scoringForm.value.map((c) => ({
      id: c.id,
      label: c.label,
      type: c.type,
      maxScore: c.maxScore,
      minScore: c.minScore,
      description: c.description || '',
      actualScore: Number(c.actualScore) || 0,
    }))

    // Writes ONLY to Evaluations — never touches Submissions
    const savedEval = await evaluateSubmission(
      submissionId,
      submission.value.assignmentId,
      submission.value.studentId,
      scoresPayload,
      feedback.value
    )

    evaluation.value = savedEval
    toastStore.success('Grades saved successfully!')
    saveSuccess.value =
      'Grades saved successfully! Submission is now marked as Evaluated.'
  } catch (err) {
    const formatted = formatErrorMessage(err)
    toastStore.error(formatted)
    saveError.value = formatted
    console.error(err)
  } finally {
    isSaving.value = false
  }
}
</script>
