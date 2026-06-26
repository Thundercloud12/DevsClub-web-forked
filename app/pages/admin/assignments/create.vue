<template>
  <div class="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Create Assignment
        </h1>
        <UiButton @click="navigateTo('/admin/dashboard')" variant="outline"
          >Back to Dashboard</UiButton
        >
      </div>

      <UiCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <div>
              <UiLabel for="title">Assignment Title</UiLabel>
              <UiInput
                id="title"
                v-model="form.title"
                placeholder="e.g. Week 1: Introduction to Vue"
                required
              />
            </div>

            <div>
              <UiLabel for="description">Description</UiLabel>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="flex w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                placeholder="Detailed explanation of the assignment..."
                required
              ></textarea>
            </div>

            <div>
              <UiLabel for="rubric">Select Grading Rubric</UiLabel>
              <div v-if="isLoadingRubrics" class="text-sm text-slate-500">
                Loading rubrics...
              </div>
              <select
                v-else
                id="rubric"
                v-model="form.rubricId"
                class="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                required
              >
                <option value="" disabled class="dark:bg-slate-900">
                  Select a rubric...
                </option>
                <option
                  v-for="rubric in rubrics"
                  :key="rubric.id"
                  :value="rubric.id"
                  class="dark:bg-slate-900"
                >
                  {{ rubric.name }}
                </option>
              </select>
            </div>
          </div>

          <hr class="border-slate-200 dark:border-slate-800" />

          <!-- Timeline -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Timeline
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <UiLabel for="publishedAt">Publish Date</UiLabel>
                <UiInput
                  id="publishedAt"
                  type="datetime-local"
                  v-model="form.timeline.publishedAt"
                  required
                />
              </div>
              <div></div>
              <!-- Empty column for spacing -->

              <div>
                <UiLabel for="submissionsOpenAt">Submissions Open</UiLabel>
                <UiInput
                  id="submissionsOpenAt"
                  type="datetime-local"
                  v-model="form.timeline.submissionsOpenAt"
                  required
                />
              </div>

              <div>
                <UiLabel for="submissionsCloseAt"
                  >Submissions Close (Deadline)</UiLabel
                >
                <UiInput
                  id="submissionsCloseAt"
                  type="datetime-local"
                  v-model="form.timeline.submissionsCloseAt"
                  required
                />
              </div>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <UiButton type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Create Assignment' }}
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
import { ref, reactive, onMounted } from 'vue'
import { useAssignments } from '~/composables/useAssignments'
import { useRubrics } from '~/composables/useRubrics'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'

const { createAssignment } = useAssignments()
const { getRubrics } = useRubrics()

const isSubmitting = ref(false)
const isLoadingRubrics = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const rubrics = ref([])

const form = reactive({
  title: '',
  description: '',
  rubricId: '',
  timeline: {
    publishedAt: '',
    submissionsOpenAt: '',
    submissionsCloseAt: '',
  },
})

onMounted(async () => {
  try {
    rubrics.value = await getRubrics()
  } catch (err) {
    console.error('Failed to load rubrics', err)
    errorMessage.value = 'Failed to load rubrics. Please refresh.'
  } finally {
    isLoadingRubrics.value = false
  }
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Parse strings to Dates
    const payload = {
      title: form.title,
      description: form.description,
      rubricId: form.rubricId,
      timeline: {
        publishedAt: new Date(form.timeline.publishedAt),
        submissionsOpenAt: new Date(form.timeline.submissionsOpenAt),
        submissionsCloseAt: new Date(form.timeline.submissionsCloseAt),
      },
      submissionsCloseAt: new Date(form.timeline.submissionsCloseAt),
    }

    await createAssignment(payload)

    successMessage.value = 'Assignment created successfully!'

    setTimeout(() => {
      navigateTo('/admin/dashboard')
    }, 1500)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create assignment.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
