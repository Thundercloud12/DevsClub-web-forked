<template>
  <label
    class="flex items-center gap-2 text-sm text-ink-secondary dark:text-slate-300 cursor-pointer select-none"
  >
    <input
      type="checkbox"
      :checked="isChecked"
      @change="handleChange"
      :value="value"
      :class="[
        'h-4 w-4 rounded border-hairline-input dark:border-slate-700 text-primary focus:ring-primary focus:ring-offset-0 bg-canvas dark:bg-slate-900/50 transition-all duration-150 cursor-pointer dark:checked:bg-primary-soft',
        className,
      ]"
      v-bind="$attrs"
    />
    <span v-if="label" class="leading-none">{{ label }}</span>
    <slot v-else></slot>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Array, Boolean],
    default: false,
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === true
})

const handleChange = (event) => {
  const checked = event.target.checked
  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]
    if (checked) {
      if (!newValue.includes(props.value)) {
        newValue.push(props.value)
      }
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', checked)
  }
}
</script>
