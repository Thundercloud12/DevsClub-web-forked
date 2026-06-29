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
          Create Assignment
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
              <UiTextarea
                id="description"
                v-model="form.description"
                rows="4"
                placeholder="Detailed explanation of the assignment..."
                required
              />
            </div>

            <div>
              <UiLabel for="rubric">Select Grading Rubric</UiLabel>
              <UiSelect
                id="rubric"
                v-model="form.rubricId"
                :options="rubricsOptions"
                :isLoading="isLoadingRubrics"
                placeholder="Select a rubric..."
                required
              />
            </div>

            <div>
              <UiLabel>Select Tracks</UiLabel>
              <div v-if="isLoadingTracks" class="text-sm text-slate-500">
                Loading tracks...
              </div>
              <div
                v-else-if="tracks.length === 0"
                class="text-sm text-slate-500"
              >
                No tracks found.
                <NuxtLink
                  to="/admin/tracks/create"
                  class="text-primary hover:underline font-medium"
                  >Create a track first</NuxtLink
                >.
              </div>
              <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                <UiCheckbox
                  v-for="track in tracks"
                  :key="track.id"
                  :value="track.id"
                  v-model="form.tracks"
                  :label="track.name"
                />
              </div>
            </div>
          </div>

          <hr class="border-hairline dark:border-slate-800" />

          <!-- Timeline -->
          <div class="space-y-4">
            <h2
              class="text-xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
            >
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useAdminAssignments } from '~/composables/admin/useAdminAssignments'
import { useAdminRubrics } from '~/composables/admin/useAdminRubrics'
import { useAdminTracks } from '~/composables/admin/useAdminTracks'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import UiSelect from '~/components/ui/Select.vue'
import UiTextarea from '~/components/ui/Textarea.vue'
import UiCheckbox from '~/components/ui/Checkbox.vue'

const { createAssignment } = useAdminAssignments()
const { getAdminRubrics } = useAdminRubrics()
const { getAdminTracks } = useAdminTracks()

const isSubmitting = ref(false)
const isLoadingRubrics = ref(true)
const isLoadingTracks = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const rubrics = ref([])
const tracks = ref([])
const rubricsOptions = computed(() =>
  rubrics.value.map((r) => ({ value: r.id, label: r.name }))
)

const form = reactive({
  title: '',
  description: '',
  rubricId: '',
  tracks: [],
  timeline: {
    publishedAt: '',
    submissionsOpenAt: '',
    submissionsCloseAt: '',
  },
})

onMounted(async () => {
  try {
    rubrics.value = await getAdminRubrics()
  } catch (err) {
    console.error('Failed to load rubrics', err)
    errorMessage.value = 'Failed to load rubrics. Please refresh.'
  } finally {
    isLoadingRubrics.value = false
  }

  try {
    tracks.value = await getAdminTracks()
  } catch (err) {
    console.error('Failed to load tracks', err)
  } finally {
    isLoadingTracks.value = false
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
      tracks: form.tracks,
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
