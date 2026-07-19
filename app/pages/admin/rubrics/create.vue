<template>
  <AdminPageLayout
    title="Create Rubric Template"
    backUrl="/admin/dashboard"
    backLabel="Back to Dashboard"
    maxWidth="6xl"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Create Rubric Card -->
      <div class="lg:col-span-7">
        <UiCard>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Rubric Basic Info -->
            <div class="space-y-4">
              <div>
                <UiLabel for="rubricName">Rubric Name</UiLabel>
                <UiInput
                  id="rubricName"
                  v-model="rubricForm.name"
                  placeholder="e.g. Frontend Assignment Week 1"
                  required
                />
              </div>
            </div>

            <hr class="border-hairline dark:border-slate-800" />

            <!-- Criteria Builder -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2
                  class="text-xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
                >
                  Evaluation Criteria
                </h2>
                <UiButton
                  type="button"
                  @click="addCriterion"
                  size="sm"
                  variant="outline"
                >
                  + Add Criterion
                </UiButton>
              </div>

              <div
                v-if="rubricForm.criteria.length === 0"
                class="text-center p-8 border-2 border-dashed border-hairline-input dark:border-slate-800 rounded-xl bg-canvas-soft/30"
              >
                <p class="text-ink-mute dark:text-slate-500 text-sm">
                  No criteria added yet. Add at least one to continue.
                </p>
              </div>

              <div
                v-for="(criterion, index) in rubricForm.criteria"
                :key="index"
                class="p-6 bg-canvas-soft/50 dark:bg-slate-900/30 border border-hairline dark:border-slate-800 rounded-xl space-y-4 relative shadow-sm"
              >
                <button
                  type="button"
                  @click="removeCriterion(index)"
                  class="absolute top-6 right-6 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-700 transition-colors duration-150"
                >
                  Remove
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <UiLabel :for="'crit-label-' + index">Label</UiLabel>
                    <UiInput
                      :id="'crit-label-' + index"
                      v-model="criterion.label"
                      placeholder="e.g. UI/UX Design"
                      required
                    />
                  </div>
                  <div>
                    <UiLabel :for="'crit-type-' + index">Type</UiLabel>
                    <UiSelect
                      :id="'crit-type-' + index"
                      v-model="criterion.type"
                      :options="criteriaTypes"
                    />
                  </div>
                  <div>
                    <UiLabel :for="'crit-max-' + index">Max Score</UiLabel>
                    <UiInput
                      :id="'crit-max-' + index"
                      type="number"
                      v-model.number="criterion.maxScore"
                      min="1"
                      required
                    />
                  </div>
                  <div class="md:col-span-2">
                    <UiLabel :for="'crit-desc-' + index"
                      >Description (Optional)</UiLabel
                    >
                    <UiInput
                      :id="'crit-desc-' + index"
                      v-model="criterion.description"
                      placeholder="What are the expectations for this criterion?"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <UiButton
                type="submit"
                :disabled="isSubmitting || rubricForm.criteria.length === 0"
              >
                {{ isSubmitting ? 'Saving...' : 'Save Rubric' }}
              </UiButton>
            </div>

            <p v-if="errorMessage" class="text-red-500 text-sm">
              {{ errorMessage }}
            </p>
            <p v-if="successMessage" class="text-green-500 text-sm">
              {{ successMessage }}
            </p>
          </form>
        </UiCard>
      </div>

      <!-- Existing Rubrics Card -->
      <div class="lg:col-span-5 space-y-6">
        <UiCard>
          <div class="flex items-center justify-between mb-4">
            <h2
              class="text-xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
            >
              Existing Rubrics
            </h2>
            <span class="text-xs text-ink-mute dark:text-slate-500 font-medium">
              {{ existingRubrics.length }} template(s)
            </span>
          </div>

          <div v-if="isLoadingRubrics" class="py-12 flex justify-center">
            <svg
              class="w-8 h-8 animate-spin text-primary"
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
          </div>

          <div
            v-else-if="existingRubrics.length === 0"
            class="text-center p-8 border border-dashed border-hairline-input dark:border-slate-800 rounded-xl bg-canvas-soft/30"
          >
            <p class="text-ink-mute dark:text-slate-500 text-sm">
              No rubrics created yet.
            </p>
          </div>

          <div v-else class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <div
              v-for="rubric in existingRubrics"
              :key="rubric.id"
              class="border border-hairline dark:border-slate-800 rounded-xl p-4 bg-canvas-soft/50 dark:bg-slate-900/30 space-y-3"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-medium text-sm text-ink dark:text-slate-200">
                    {{ rubric.name }}
                  </h3>
                  <p class="text-xs text-ink-mute dark:text-slate-500 mt-0.5">
                    {{ rubric.criteria?.length || 0 }} criteria
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="toggleRubric(rubric.id)"
                    class="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-deep dark:text-primary-soft cursor-pointer transition-colors"
                  >
                    {{ isExpanded(rubric.id) ? 'Collapse' : 'Inspect' }}
                  </button>
                </div>
              </div>

              <!-- Expanded criteria view -->
              <div
                v-if="isExpanded(rubric.id)"
                class="pt-2 border-t border-hairline dark:border-slate-800 space-y-2 text-xs"
              >
                <div
                  v-for="(crit, idx) in rubric.criteria"
                  :key="idx"
                  class="bg-white dark:bg-slate-950/40 p-2.5 rounded-lg border border-hairline/80 dark:border-slate-800/80"
                >
                  <div
                    class="flex items-center justify-between font-medium text-ink dark:text-slate-300"
                  >
                    <span>{{ crit.label }}</span>
                    <span class="text-primary dark:text-primary-soft"
                      >Max Score: {{ crit.maxScore }}</span
                    >
                  </div>
                  <p
                    v-if="crit.description"
                    class="text-ink-mute dark:text-slate-500 mt-1 leading-relaxed"
                  >
                    {{ crit.description }}
                  </p>
                  <div
                    class="mt-1 flex gap-2 text-[10px] uppercase font-mono text-ink-mute"
                  >
                    <span>Type: {{ crit.type }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAdminRubrics } from '~/composables/admin/useAdminRubrics'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import UiSelect from '~/components/ui/Select.vue'
import { useToastStore } from '~/stores/toast'
import { formatErrorMessage } from '~/utils/errors'

const { createRubric, getAdminRubrics, deleteRubric } = useAdminRubrics()
const toastStore = useToastStore()

const criteriaTypes = [
  { value: 'number', label: 'Number Score' },
  { value: 'boolean', label: 'Pass/Fail (Boolean)' },
  { value: 'scale', label: 'Scale (1-5)' },
]

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const rubricForm = reactive({
  name: '',
  criteria: [],
})

const existingRubrics = ref([])
const isLoadingRubrics = ref(false)
const expandedRubricIds = ref(new Set())

const fetchRubrics = async () => {
  isLoadingRubrics.value = true
  try {
    existingRubrics.value = await getAdminRubrics()
  } catch (err) {
    console.error('Failed to load rubrics', err)
  } finally {
    isLoadingRubrics.value = false
  }
}

onMounted(() => {
  fetchRubrics()
})

const toggleRubric = (id) => {
  if (expandedRubricIds.value.has(id)) {
    expandedRubricIds.value.delete(id)
  } else {
    expandedRubricIds.value.add(id)
  }
}

const isExpanded = (id) => expandedRubricIds.value.has(id)

const handleDeleteRubric = async (id) => {
  if (
    !confirm(
      'Are you sure you want to delete this rubric? This action cannot be undone.'
    )
  )
    return
  try {
    await deleteRubric(id)
    toastStore.success('Rubric deleted successfully!')
    await fetchRubrics()
  } catch (err) {
    toastStore.error(formatErrorMessage(err))
  }
}

const slugify = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const addCriterion = () => {
  rubricForm.criteria.push({
    label: '',
    type: 'number',
    maxScore: 10,
    minScore: 0,
    description: '',
  })
}

const removeCriterion = (index) => {
  rubricForm.criteria.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const rubricId = slugify(rubricForm.name)
    const cleanCriteria = rubricForm.criteria.map((c) => ({
      ...c,
      id: slugify(c.label),
    }))

    await createRubric({
      id: rubricId,
      name: rubricForm.name,
      criteria: cleanCriteria,
    })

    toastStore.success('Rubric created successfully!')
    successMessage.value = 'Rubric created successfully!'

    rubricForm.name = ''
    rubricForm.criteria = []
    await fetchRubrics()
  } catch (error) {
    const formatted = formatErrorMessage(error)
    toastStore.error(formatted)
    errorMessage.value = formatted
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
