<template>
  <AdminPageLayout
    title="Create Track"
    backUrl="/admin/dashboard"
    backLabel="Back to Dashboard"
    maxWidth="3xl"
  >
    <UiCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <UiLabel for="trackName">Track Name</UiLabel>
            <UiInput
              id="trackName"
              v-model="trackForm.name"
              placeholder="e.g. Web Development"
              required
            />
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <UiButton type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Create Track' }}
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
  </AdminPageLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAdminTracks } from '~/composables/admin/useAdminTracks'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'
import { useToastStore } from '~/stores/toast'
import { formatErrorMessage } from '~/utils/errors'

const { createTrack } = useAdminTracks()
const toastStore = useToastStore()

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const trackForm = reactive({
  name: '',
})

const slugify = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const trackId = slugify(trackForm.name)
    if (!trackId) {
      throw new Error('Please enter a valid track name.')
    }

    await createTrack({
      id: trackId,
      name: trackForm.name,
    })

    toastStore.success('Track created successfully!')
    successMessage.value = 'Track created successfully!'

    setTimeout(() => {
      navigateTo('/admin/dashboard')
    }, 1500)
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
