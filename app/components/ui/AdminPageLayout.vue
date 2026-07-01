<script setup lang="ts">
import { navigateTo } from '#app'

defineProps<{
  title: string
  subtitle?: string
  backUrl?: string
  backLabel?: string
  maxWidth?: '3xl' | '4xl' | '5xl'
}>()
</script>

<template>
  <div
    class="min-h-screen pt-24 pb-12 px-4 sm:px-8 bg-canvas dark:bg-[#0b1120] gradient-mesh"
  >
    <div
      :class="[
        maxWidth === '3xl'
          ? 'max-w-3xl'
          : maxWidth === '4xl'
            ? 'max-w-4xl'
            : 'max-w-5xl',
        'mx-auto space-y-8 relative z-10',
      ]"
    >
      <!-- Header -->
      <div
        class="pb-6 border-b border-hairline/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <button
            v-if="backUrl"
            @click="navigateTo(backUrl)"
            class="text-xs font-semibold uppercase tracking-wider text-ink-mute hover:text-primary flex items-center gap-1.5 mb-3 transition-colors duration-150"
          >
            ← {{ backLabel || 'Back' }}
          </button>
          <h1
            class="text-3xl font-light tracking-[-0.64px] text-ink dark:text-slate-50"
          >
            {{ title }}
          </h1>
          <p
            v-if="subtitle"
            class="text-ink-mute dark:text-slate-400 mt-1.5 text-sm"
          >
            {{ subtitle }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex items-center gap-3 shrink-0">
          <slot name="actions" />
        </div>
      </div>

      <!-- Main Layout Body -->
      <slot />
    </div>
  </div>
</template>
