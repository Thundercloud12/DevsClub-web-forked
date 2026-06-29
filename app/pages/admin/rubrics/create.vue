<template>
  <div
    class="min-h-screen pt-24 pb-12 px-4 sm:px-8 bg-canvas dark:bg-[#0b1120] gradient-mesh"
  >
    <div class="max-w-3xl mx-auto space-y-8 relative z-10">
      <div
        class="flex items-center justify-between pb-4 border-b border-hairline/80 dark:border-slate-800"
      >
        <h1
          class="text-3xl font-light tracking-[-0.64px] text-ink dark:text-slate-50"
        >
          Create Rubric Template
        </h1>
        <UiButton
          @click="navigateTo('/admin/dashboard')"
          variant="outline"
          size="sm"
          >Back to Dashboard</UiButton
        >
      </div>

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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAdminRubrics } from '~/composables/admin/useAdminRubrics'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import UiSelect from '~/components/ui/Select.vue'

const { createRubric } = useAdminRubrics()

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
