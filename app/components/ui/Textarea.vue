<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'flex w-full rounded-md border border-hairline-input bg-canvas px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-primary-soft dark:focus:ring-primary-soft',
      className,
    ]"
    :rows="rows"
    v-bind="$attrs"
  ></textarea>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  rows: {
    type: [Number, String],
    default: 4,
  },
  className: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>
