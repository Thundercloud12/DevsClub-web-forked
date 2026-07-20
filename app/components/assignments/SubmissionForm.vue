<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSubmissions } from '~/composables/student/useSubmissions'
import { useAuthStore } from '~/stores/auth'
import type { Submission } from '~/schemas/submissions'

const props = defineProps<{
  assignmentId: string
  existingSubmission?: Submission | null
  isLocked?: boolean
  lockReason?: string
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

watch(
  () => props.existingSubmission,
  (newVal) => {
    state.githubLink = newVal?.githubLink || ''
    state.videoLink = newVal?.videoLink || ''
    state.liveUrl = newVal?.liveUrl || ''
    state.notes = newVal?.notes || ''
  },
  { immediate: true }
)

const showConfirmation = ref(false)
const pendingEvent = ref<FormSubmitEvent<FormSchema> | null>(null)

const { createSubmission } = useSubmissions()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const isSuccess = ref(false)

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  pendingEvent.value = event
  showConfirmation.value = true
}

async function confirmAndSubmit() {
  if (!pendingEvent.value) return

  showConfirmation.value = false
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
      studentName:
        authStore.profile?.Name ||
        authStore.profile?.name ||
        authStore.user?.displayName ||
        'Unknown Student',
      gradyear: authStore.profile?.gradyear || null,
      githubLink: pendingEvent.value.data.githubLink,
      videoLink: pendingEvent.value.data.videoLink || null,
      liveUrl: pendingEvent.value.data.liveUrl || null,
      notes: pendingEvent.value.data.notes || null,
      submittedAt: new Date(),
    })

    isSuccess.value = true
    emit('submitted')
  } catch (err: any) {
    submitError.value =
      err?.message ?? 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
    pendingEvent.value = null
  }
}

const formatDate = (date: Date) =>
  new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<template>
  <div class="relative">
    <UForm :schema="formSchema" :state="state" @submit="onSubmit">
      <UiFormLayout
        :is-read-only="!!existingSubmission"
        read-only-title="Already Submitted"
        :is-success="isSuccess"
        success-title="Submission Received!"
        success-message="Your assignment has been submitted successfully. You'll be notified once it's evaluated."
        :submit-error="submitError"
        :is-submitting="isSubmitting"
        submit-text="Submit Assignment"
        submitting-text="Submitting..."
      >
        <!-- Read-only state slots -->
        <template #read-only v-if="existingSubmission">
          <div class="flex flex-col gap-1">
            <span
              class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >GitHub Repository</span
            >
            <a
              :href="sanitizeUrl(existingSubmission.githubLink)"
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
              :href="sanitizeUrl(existingSubmission.videoLink)"
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
              :href="sanitizeUrl(existingSubmission.liveUrl)"
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
            <p
              class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
            >
              {{ existingSubmission.notes }}
            </p>
          </div>
        </template>

        <!-- Lock Warning Banner -->
        <div
          v-if="isLocked && !existingSubmission"
          class="mb-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5"
        >
          <svg
            class="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p class="font-semibold">
              {{ lockReason || 'Submissions Locked' }}
            </p>
            <p class="font-light mt-0.5">
              You can view the requirements, but editing and submissions are
              disabled.
            </p>
          </div>
        </div>

        <!-- Form Fields -->
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
            :disabled="isLocked"
            class="w-full mt-3 [&_input]:bg-[#eef2f8] [&_input]:dark:bg-[#0b1120] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:dark:border-slate-700 [&_input]:focus:border-brand-blue [&_input]:dark:focus:border-brand-blue [&_input]:transition-colors [&_input]:outline-none [&_input]:px-4 [&_input]:py-2.5"
          />
          <template #error="{ error }">
            <span
              v-if="error"
              class="text-rose-600 dark:text-rose-400 text-xs font-semibold mt-2.5 flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/20 w-fit"
            >
              <svg
                class="w-4 h-4 shrink-0 text-rose-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {{ error }}
            </span>
          </template>
        </UFormField>

        <!-- Video Demo -->
        <UFormField
          label="Video Demo"
          name="videoLink"
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
            :disabled="isLocked"
            class="w-full mt-3 [&_input]:bg-[#eef2f8] [&_input]:dark:bg-[#0b1120] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:dark:border-slate-700 [&_input]:focus:border-brand-blue [&_input]:dark:focus:border-brand-blue [&_input]:transition-colors [&_input]:outline-none [&_input]:px-4 [&_input]:py-2.5"
          />
          <template #error="{ error }">
            <span
              v-if="error"
              class="text-rose-600 dark:text-rose-400 text-xs font-semibold mt-2.5 flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/20 w-fit"
            >
              <svg
                class="w-4 h-4 shrink-0 text-rose-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {{ error }}
            </span>
          </template>
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
            :disabled="isLocked"
            class="w-full mt-3 [&_input]:bg-[#eef2f8] [&_input]:dark:bg-[#0b1120] [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:dark:border-slate-700 [&_input]:focus:border-brand-blue [&_input]:dark:focus:border-brand-blue [&_input]:transition-colors [&_input]:outline-none [&_input]:px-4 [&_input]:py-2.5"
          />
          <template #error="{ error }">
            <span
              v-if="error"
              class="text-rose-600 dark:text-rose-400 text-xs font-semibold mt-2.5 flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/20 w-fit"
            >
              <svg
                class="w-4 h-4 shrink-0 text-rose-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {{ error }}
            </span>
          </template>
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
            :disabled="isLocked"
            class="w-full mt-3 [&_textarea]:bg-[#eef2f8] [&_textarea]:dark:bg-[#0b1120] [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-gray-200 [&_textarea]:dark:border-slate-700 [&_textarea]:focus:border-brand-blue [&_textarea]:dark:focus:border-brand-blue [&_textarea]:transition-colors [&_textarea]:outline-none [&_textarea]:px-4 [&_textarea]:py-2.5 [&_textarea]:resize-none"
          />
          <template #error="{ error }">
            <span
              v-if="error"
              class="text-rose-600 dark:text-rose-400 text-xs font-semibold mt-2.5 flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/20 w-fit"
            >
              <svg
                class="w-4 h-4 shrink-0 text-rose-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {{ error }}
            </span>
          </template>
        </UFormField>

        <!-- Submit Button Override for Locked/Open/Edit States -->
        <template #submit-button>
          <button
            v-if="isLocked && !existingSubmission"
            type="button"
            disabled
            class="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed border border-hairline dark:border-slate-700/50"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Submissions Locked
          </button>
          <button
            v-else
            type="submit"
            :disabled="isSubmitting"
            class="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-150 shadow-[0_0_20px_rgba(49,113,219,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
            Submit Assignment
          </button>
        </template>
      </UiFormLayout>
    </UForm>

    <!-- Confirmation Dialog Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showConfirmation"
        class="absolute inset-0 bg-canvas/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-3xl flex items-center justify-center p-6 z-50 animate-fade-in"
      >
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl"
        >
          <div
            class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500 text-xl font-bold"
          >
            ⚠️
          </div>
          <h3 class="font-bold text-lg text-ink dark:text-white">
            Confirm Submission
          </h3>
          <p class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed">
            Are you sure? You cannot edit your submission once it is submitted.
          </p>
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="showConfirmation = false"
              class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmAndSubmit"
              class="flex-1 px-4 py-2.5 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all text-xs uppercase tracking-wider shadow-md cursor-pointer"
            >
              Yes, Submit
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
