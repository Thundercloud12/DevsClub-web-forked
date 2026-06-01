<template>
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
  >
    <div v-if="title || description" class="p-6 space-y-1 text-center">
      <h3
        v-if="title"
        class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
      >
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-slate-500 dark:text-slate-400">
        {{ description }}
      </p>
    </div>

    <div class="p-6 pt-0 space-y-4">
      <slot />
    </div>

    <div v-if="$slots.footer" class="flex flex-col space-y-4 p-6 pt-0">
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
