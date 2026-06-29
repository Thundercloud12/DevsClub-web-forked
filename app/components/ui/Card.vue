<template>
  <div
    class="bg-surface-card border border-hairline dark:border-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,55,112,0.03),0_1px_3px_rgba(0,55,112,0.02)] transition-all duration-300"
  >
    <div v-if="title || description" class="p-6 pb-4 space-y-1.5 text-center">
      <h3
        v-if="title"
        class="text-xl font-light tracking-[-0.22px] text-ink dark:text-slate-50"
      >
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-ink-mute dark:text-slate-400">
        {{ description }}
      </p>
    </div>

    <div class="p-6 space-y-4">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="flex flex-col space-y-4 p-6 pt-0 border-t border-hairline/60 dark:border-slate-800/60"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
