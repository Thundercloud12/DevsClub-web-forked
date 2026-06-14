<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSubmissions } from '~/composables/useSubmissions'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  assignmentId: string
  existingSubmission?: {
    githubLink: string
    videoLink?: string
    liveUrl?: string
    notes?: string
    submittedAt: Date
  } | null
}>()

const emit = defineEmits<{
  submitted: []
}>()

// Only validate the fields the student actually fills in
const formSchema = z.object({
  githubLink: z
    .string({ message: 'GitHub link is required' })
    .url('Must be a valid URL')
    .includes('github.com', { message: 'Must be a GitHub repository link' }),
  videoLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes must be under 1000 characters').optional(),
})

type FormSchema = z.output<typeof formSchema>

const state = reactive<Partial<FormSchema>>({
  githubLink: '',
  videoLink: '',
  liveUrl: '',
  notes: '',
})

const { createSubmission } = useSubmissions()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const isSuccess = ref(false)

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  isSubmitting.value = true
  submitError.value = null

  try {
    const studentId = authStore.user?.uid
    if (!studentId) {
      throw new Error('You must be logged in to submit.')
    }

    await createSubmission({
      assignmentId: props.assignmentId,
      studentId,
      githubLink: event.data.githubLink,
      videoLink: event.data.videoLink || null,
      liveUrl: event.data.liveUrl || null,
      notes: event.data.notes || null,
      submittedAt: new Date(),
    })

    isSuccess.value = true
    emit('submitted')
  } catch (err: any) {
    submitError.value =
      err?.message ?? 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date: Date) =>
  date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<template>
  <!-- Already submitted state -->
  <div
    v-if="existingSubmission"
    class="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 dark:bg-brand-blue/10 p-6 space-y-4"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center shrink-0"
      >
        <svg
          class="w-5 h-5 text-brand-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-gray-900 dark:text-white font-zalando">
          Already Submitted
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Submitted on {{ formatDate(existingSubmission.submittedAt) }}
        </p>
      </div>
    </div>

    <div class="grid gap-3 pt-2">
      <div class="flex flex-col gap-1">
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >GitHub Repository</span
        >
        <a
          :href="existingSubmission.githubLink"
          target="_blank"
          rel="noopener noreferrer"
          class="text-brand-blue hover:underline text-sm truncate"
        >
          {{ existingSubmission.githubLink }}
        </a>
      </div>
      <div v-if="existingSubmission.videoLink" class="flex flex-col gap-1">
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >Video Demo</span
        >
        <a
          :href="existingSubmission.videoLink"
          target="_blank"
          rel="noopener noreferrer"
          class="text-brand-blue hover:underline text-sm truncate"
        >
          {{ existingSubmission.videoLink }}
        </a>
      </div>
      <div v-if="existingSubmission.liveUrl" class="flex flex-col gap-1">
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >Live URL</span
        >
        <a
          :href="existingSubmission.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-brand-blue hover:underline text-sm truncate"
        >
          {{ existingSubmission.liveUrl }}
        </a>
      </div>
      <div v-if="existingSubmission.notes" class="flex flex-col gap-1">
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >Notes</span
        >
        <p class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {{ existingSubmission.notes }}
        </p>
      </div>
    </div>
  </div>

  <!-- Success state -->
  <div
    v-else-if="isSuccess"
    class="rounded-2xl border border-green-500/30 bg-green-500/5 dark:bg-green-500/10 p-8 text-center space-y-3"
  >
    <div
      class="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto"
    >
      <svg
        class="w-7 h-7 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <h3 class="font-zalando font-bold text-xl text-gray-900 dark:text-white">
      Submission Received!
    </h3>
    <p class="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
      Your assignment has been submitted successfully. You'll be notified once
      it's evaluated.
    </p>
  </div>

  <!-- Form -->
  <div v-else>
    <UForm
      :schema="formSchema"
      :state="state"
      class="space-y-5"
      @submit="onSubmit"
    >
      <!-- GitHub Repository -->
      <UFormField
        label="GitHub Repository"
        name="githubLink"
        required
        class="submission-field"
      >
        <template #label>
          <span
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
              />
            </svg>
            GitHub Repository
          </span>
        </template>
        <UInput
          v-model="state.githubLink"
          placeholder="https://github.com/username/repo"
          size="lg"
          class="w-full mt-3 [&_input]:bg-[#eef2f8] [&_input]:dark:bg-[#0b1120] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:dark:border-slate-700 [&_input]:focus:border-brand-blue [&_input]:dark:focus:border-brand-blue [&_input]:transition-colors [&_input]:outline-none [&_input]:px-4 [&_input]:py-2.5"
        />
      </UFormField>

      <!-- Video Demo -->
      <UFormField label="Video Demo" name="videoLink" class="submission-field">
        <template #label>
          <span
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Video Demo
            <span class="text-xs text-gray-400 font-normal">(optional)</span>
          </span>
        </template>
        <UInput
          v-model="state.videoLink"
          placeholder="https://youtube.com/watch?v=..."
          size="lg"
          class="w-full mt-3 [&_input]:bg-[#eef2f8] [&_input]:dark:bg-[#0b1120] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:dark:border-slate-700 [&_input]:focus:border-brand-blue [&_input]:dark:focus:border-brand-blue [&_input]:transition-colors [&_input]:outline-none [&_input]:px-4 [&_input]:py-2.5"
        />
      </UFormField>

      <!-- Live URL -->
      <UFormField
        label="Live / Deployed URL"
        name="liveUrl"
        class="submission-field"
      >
        <template #label>
          <span
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Live / Deployed URL
            <span class="text-xs text-gray-400 font-normal">(optional)</span>
          </span>
        </template>
        <UInput
          v-model="state.liveUrl"
          placeholder="https://your-project.vercel.app"
          size="lg"
          class="w-full mt-3 [&_input]:bg-[#eef2f8] [&_input]:dark:bg-[#0b1120] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:dark:border-slate-700 [&_input]:focus:border-brand-blue [&_input]:dark:focus:border-brand-blue [&_input]:transition-colors [&_input]:outline-none [&_input]:px-4 [&_input]:py-2.5"
        />
      </UFormField>

      <!-- Notes -->
      <UFormField label="Notes" name="notes" class="submission-field">
        <template #label>
          <span
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Notes
            <span class="text-xs text-gray-400 font-normal"
              >(optional, max 1000 chars)</span
            >
          </span>
        </template>
        <UTextarea
          v-model="state.notes"
          placeholder="Anything you'd like the evaluators to know — challenges faced, design decisions, etc."
          :rows="4"
          class="w-full mt-3 [&_textarea]:bg-[#eef2f8] [&_textarea]:dark:bg-[#0b1120] [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-gray-200 [&_textarea]:dark:border-slate-700 [&_textarea]:focus:border-brand-blue [&_textarea]:dark:focus:border-brand-blue [&_textarea]:transition-colors [&_textarea]:outline-none [&_textarea]:px-4 [&_textarea]:py-2.5 [&_textarea]:resize-none"
        />
      </UFormField>

      <!-- Error -->
      <div
        v-if="submitError"
        class="rounded-xl border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2"
      >
        <svg
          class="w-4 h-4 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        {{ submitError }}
      </div>

      <!-- Submit -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-150 shadow-[0_0_20px_rgba(49,113,219,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            v-if="isSubmitting"
            class="w-4 h-4 animate-spin"
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
          <svg
            v-else
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          {{ isSubmitting ? 'Submitting...' : 'Submit Assignment' }}
        </button>
      </div>
    </UForm>
  </div>
</template>
