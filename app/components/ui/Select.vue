<template>
  <div class="relative w-full">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :class="[
        'flex h-10 w-full rounded-md border border-hairline-input bg-canvas px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-primary-soft dark:focus:ring-primary-soft appearance-none pr-8',
        className,
      ]"
      :disabled="disabled || isLoading"
      v-bind="$attrs"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
        class="dark:bg-slate-900 text-slate-400"
      >
        {{ isLoading ? 'Loading...' : placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="dark:bg-slate-900 text-ink dark:text-slate-200"
      >
        {{ option.label }}
      </option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>
