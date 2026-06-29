<script setup lang="ts">
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <TransitionGroup
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    move-class="transition duration-300"
    tag="div"
    class="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0"
  >
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300"
      :class="{
        'bg-emerald-50/90 border-emerald-250 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-800/60 dark:text-emerald-200':
          toast.type === 'success',
        'bg-rose-50/90 border-rose-250 text-rose-900 dark:bg-rose-950/90 dark:border-rose-800/60 dark:text-rose-200':
          toast.type === 'error',
        'bg-amber-50/90 border-amber-250 text-amber-900 dark:bg-amber-950/90 dark:border-amber-800/60 dark:text-amber-200':
          toast.type === 'warning',
        'bg-blue-50/90 border-blue-250 text-blue-900 dark:bg-blue-950/90 dark:border-blue-800/60 dark:text-blue-200':
          toast.type === 'info',
      }"
    >
      <!-- Icon -->
      <div class="shrink-0 mt-0.5">
        <!-- Success Icon -->
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <!-- Error Icon -->
        <svg
          v-else-if="toast.type === 'error'"
          class="w-5 h-5 text-rose-600 dark:text-rose-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <!-- Warning Icon -->
        <svg
          v-else-if="toast.type === 'warning'"
          class="w-5 h-5 text-amber-600 dark:text-amber-400"
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

        <!-- Info Icon -->
        <svg
          v-else
          class="w-5 h-5 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Message -->
      <div class="flex-1 text-xs font-medium leading-relaxed">
        {{ toast.message }}
      </div>

      <!-- Close Button -->
      <button
        type="button"
        class="shrink-0 p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-ink-mute hover:text-ink transition-colors duration-150"
        @click="toastStore.remove(toast.id)"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>
