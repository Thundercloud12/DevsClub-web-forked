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
          Create Track
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAdminTracks } from '~/composables/admin/useAdminTracks'
import UiCard from '~/components/ui/Card.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'

const { createTrack } = useAdminTracks()

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

    successMessage.value = 'Track created successfully!'

    setTimeout(() => {
      navigateTo('/admin/dashboard')
    }, 1500)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create track.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
