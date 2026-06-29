<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
      variant === 'default' &&
        'bg-primary text-on-primary hover:bg-primary-deep active:bg-primary-press shadow-sm hover:shadow-md',
      variant === 'outline' &&
        'border border-primary bg-transparent text-primary hover:bg-primary-bg-subdued-hover/10 active:bg-primary-bg-subdued-hover/20 dark:border-primary-soft dark:text-primary-soft',
      variant === 'ghost' &&
        'text-ink-secondary hover:bg-primary-bg-subdued-hover/10 dark:text-slate-300 dark:hover:bg-slate-800',
      variant === 'link' &&
        'text-primary hover:text-primary-deep underline-offset-4 hover:underline dark:text-primary-soft',
      size === 'default' && 'h-10 px-5 py-2',
      size === 'sm' && 'h-9 px-4 py-1.5 text-xs',
      size === 'lg' && 'h-11 px-7 py-2.5 text-base',
      size === 'icon' && 'h-10 w-10 p-0',
      className,
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'default',
  },
  className: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>
