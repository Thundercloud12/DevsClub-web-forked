<template>
  <div class="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div>
        <button
          @click="navigateTo('/admin/submissions')"
          class="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors"
        >
          ← Back to Submissions
        </button>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Evaluate Submission
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-4">
        <div
          class="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"
        />
        <div
          class="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"
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
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
        >
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1"
              >
                Student ID
              </p>
              <p class="font-mono text-sm text-slate-800 dark:text-slate-200">
                {{ submission.studentId }}
              </p>
            </div>
            <span
              class="text-xs px-3 py-1 rounded-full font-semibold"
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
            class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <div>
              <p
                class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1"
              >
                GitHub Repo
              </p>
              <a
                :href="submission.githubLink"
                target="_blank"
                class="text-blue-600 hover:underline text-sm truncate block"
              >
                {{ submission.githubLink }}
              </a>
            </div>
            <div v-if="submission.liveUrl">
              <p
                class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1"
              >
                Live URL
              </p>
              <a
                :href="submission.liveUrl"
                target="_blank"
                class="text-blue-600 hover:underline text-sm truncate block"
              >
                {{ submission.liveUrl }}
              </a>
            </div>
            <div v-if="submission.videoLink">
              <p
                class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1"
              >
                Video Demo
              </p>
              <a
                :href="submission.videoLink"
                target="_blank"
                class="text-blue-600 hover:underline text-sm truncate block"
              >
                {{ submission.videoLink }}
              </a>
            </div>
          </div>

          <div
            v-if="submission.notes"
            class="pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <p
              class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1"
            >
              Student Notes
            </p>
            <p
              class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
            >
              {{ submission.notes }}
            </p>
          </div>
        </div>

        <!-- No Rubric found -->
        <div
          v-if="!rubric && !isLoadingRubric"
          class="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300"
        >
          Could not load the rubric for this assignment. Cannot evaluate without
          it.
        </div>

        <!-- Rubric Loading -->
        <div
          v-else-if="isLoadingRubric"
          class="h-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"
        />

        <!-- ══════════════════════════════════════════════════════════════
             GRADING SECTION — only CP/VCP can see the inputs
             Everyone else sees read-only scores
        ════════════════════════════════════════════════════════════════ -->
        <div
          v-else-if="rubric"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50">
              Grading: <span class="text-blue-600">{{ rubric.name }}</span>
            </h2>
            <div class="text-right">
              <p class="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {{ totalScore }}
              </p>
              <p class="text-xs text-slate-400">
                out of {{ maxPossibleScore }}
              </p>
            </div>
          </div>

          <!-- Criteria Scoring Rows -->
          <div class="space-y-4">
            <div
              v-for="(criterion, index) in scoringForm"
              :key="criterion.id"
              class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="font-semibold text-slate-900 dark:text-slate-50">
                    {{ criterion.label }}
                  </p>
                  <p
                    v-if="criterion.description"
                    class="text-xs text-slate-500 mt-0.5"
                  >
                    {{ criterion.description }}
                  </p>
                  <p class="text-xs text-slate-400 mt-1">
                    Max: {{ criterion.maxScore }} pts | Type:
                    {{ criterion.type }}
                  </p>
                </div>

                <!-- CP/VCP can score — everyone else sees read-only -->
                <div class="text-right shrink-0">
                  <template v-if="canGrade">
                    <input
                      type="number"
                      v-model.number="scoringForm[index].actualScore"
                      :min="criterion.minScore"
                      :max="criterion.maxScore"
                      class="w-20 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <p class="text-xs text-slate-400 mt-1">
                      / {{ criterion.maxScore }}
                    </p>
                  </template>
                  <template v-else>
                    <p
                      class="text-xl font-bold text-slate-900 dark:text-slate-50"
                    >
                      {{ criterion.actualScore ?? '—' }}
                    </p>
                    <p class="text-xs text-slate-400">
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
            class="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
          >
            <p class="text-sm text-slate-500">
              Saving will mark this submission as
              <strong class="text-green-600">Evaluated</strong> and lock the
              scores.
            </p>
            <UiButton @click="saveGrades" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Grades' }}
            </UiButton>
          </div>

          <!-- Read-only notice for non-CP/VCP -->
          <div
            v-else
            class="pt-4 border-t border-slate-200 dark:border-slate-700"
          >
            <p
              class="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg"
            >
              ⚠️ You are viewing this submission in read-only mode. Only
              <strong>CP or VCP</strong> can enter and save scores.
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
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '~/stores/auth'
import UiButton from '~/components/ui/Button.vue'

const route = useRoute()
// The page param is the submission id in format: {assignmentId}_{studentId}
const submissionId = route.params.id

const authStore = useAuthStore()
const db = getFirestore()

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
// Read from authStore.profile.type — the field stored in OfficialLogin collection
// The team uses 'CP' and 'VCP' as the values in Firestore
const canGrade = computed(() => {
  const userType = authStore.profile?.type
  return userType === 'CP' || userType === 'VCP'
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
    const subRef = doc(db, 'submissions', submissionId)
    const subSnap = await getDoc(subRef)

    if (!subSnap.exists()) {
      loadError.value = `Submission "${submissionId}" not found.`
      return
    }

    const subData = subSnap.data()
    // Convert Firestore timestamp to JS Date if needed
    if (subData.submittedAt?.toDate) {
      subData.submittedAt = subData.submittedAt.toDate()
    }
    submission.value = subData

    // 2. Fetch the rubric for the assignment
    isLoadingRubric.value = true
    const assignmentRef = doc(db, 'assignments', subData.assignmentId)
    const assignmentSnap = await getDoc(assignmentRef)

    if (assignmentSnap.exists()) {
      const rubricId = assignmentSnap.data().rubricId
      const rubricRef = doc(db, 'rubrics', rubricId)
      const rubricSnap = await getDoc(rubricRef)
      if (rubricSnap.exists()) {
        rubric.value = rubricSnap.data()

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

    const updatedSubmission = {
      ...submission.value,
      scores: scoringForm.value.map((c) => ({
        id: c.id,
        label: c.label,
        type: c.type,
        maxScore: c.maxScore,
        minScore: c.minScore,
        description: c.description || '',
        actualScore: Number(c.actualScore) || 0,
      })),
      status: 'evaluated',
    }

    const subRef = doc(db, 'submissions', submissionId)
    await setDoc(subRef, updatedSubmission)

    // Update local state to reflect saved state
    submission.value = updatedSubmission
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
