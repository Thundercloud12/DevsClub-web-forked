<template>
  <div class="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Create Rubric Template
        </h1>
        <UiButton @click="navigateTo('/admin/dashboard')" variant="outline"
          >Back to Dashboard</UiButton
        >
      </div>

      <UiCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Rubric Basic Info -->
          <div class="space-y-4">
            <div>
              <UiLabel for="rubricId">Rubric ID</UiLabel>
              <UiInput
                id="rubricId"
                v-model="rubricForm.id"
                placeholder="e.g. week_1_frontend"
                required
              />
              <p class="text-xs text-slate-500 mt-1">
                Must be lowercase with underscores
              </p>
            </div>

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

          <hr class="border-slate-200 dark:border-slate-800" />

          <!-- Criteria Builder -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2
                class="text-xl font-semibold text-slate-900 dark:text-slate-50"
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
              class="text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
            >
              <p class="text-slate-500">
                No criteria added yet. Add at least one to continue.
              </p>
            </div>

            <div
              v-for="(criterion, index) in rubricForm.criteria"
              :key="index"
              class="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-4 relative"
            >
              <button
                type="button"
                @click="removeCriterion(index)"
                class="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <UiLabel :for="'crit-id-' + index">Criterion ID</UiLabel>
                  <UiInput
                    :id="'crit-id-' + index"
                    v-model="criterion.id"
                    placeholder="e.g. ui_design"
                    required
                  />
                </div>
                <div>
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
                  <select
                    :id="'crit-type-' + index"
                    v-model="criterion.type"
                    class="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  >
                    <option value="number" class="dark:bg-slate-900">
                      Number Score
                    </option>
                    <option value="boolean" class="dark:bg-slate-900">
                      Pass/Fail (Boolean)
                    </option>
                    <option value="scale" class="dark:bg-slate-900">
                      Scale (1-5)
                    </option>
                  </select>
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRubrics } from '~/composables/useRubrics'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'

const { createRubric } = useRubrics()

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const rubricForm = reactive({
  id: '',
  name: '',
  criteria: [],
})

const addCriterion = () => {
  rubricForm.criteria.push({
    id: '',
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

    await createRubric({
      id: rubricForm.id,
      name: rubricForm.name,
      criteria: rubricForm.criteria,
    })

    successMessage.value = 'Rubric created successfully!'

    // Reset form after 1.5 seconds and redirect
    setTimeout(() => {
      navigateTo('/admin/dashboard')
    }, 1500)
  } catch (error) {
    errorMessage.value =
      error.message || 'Failed to create rubric. Check your inputs.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
