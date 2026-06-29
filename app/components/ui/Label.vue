<template>
  <label
    :class="[
      'text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-400 mb-1.5 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: '',
  },
})
</script>
