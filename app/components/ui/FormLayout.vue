<script setup lang="ts">
defineProps<{
  isSuccess?: boolean
  successTitle?: string
  successMessage?: string

  isReadOnly?: boolean
  readOnlyTitle?: string
  readOnlySubtitle?: string

  submitError?: string | null
  isSubmitting?: boolean
  submitText?: string
  submittingText?: string
}>()
</script>

<template>
  <!-- Already submitted / Read-Only state -->
  <div
    v-if="isReadOnly"
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
          {{ readOnlyTitle || 'Read Only' }}
        </p>
        <p
          v-if="readOnlySubtitle"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          {{ readOnlySubtitle }}
        </p>
      </div>
    </div>

    <div class="grid gap-3 pt-2">
      <slot name="read-only"></slot>
    </div>
  </div>

  <!-- Success state -->
  <div
    v-else-if="isSuccess"
    class="rounded-2xl border border-green-500/30 bg-green-500/5 dark:bg-green-500/10 p-8 text-center space-y-3"
  >
    <slot name="success">
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
        {{ successTitle || 'Success!' }}
      </h3>
      <p
        v-if="successMessage"
        class="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto"
      >
        {{ successMessage }}
      </p>
    </slot>
  </div>

  <!-- Form -->
  <div v-else>
    <div class="space-y-5">
      <slot></slot>

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
        <slot name="submit-button">
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
            {{
              isSubmitting
                ? submittingText || 'Submitting...'
                : submitText || 'Submit'
            }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
