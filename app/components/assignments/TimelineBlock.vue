<script setup lang="ts">
import { computed } from 'vue'
import type { Assignment } from '~/schemas/assignments'

const props = defineProps<{
  assignment: Assignment & { status: 'upcoming' | 'open' | 'closed' }
  index: number
}>()

const isEven = computed(() => props.index % 2 === 0)

// Derived from real timestamp — not from the static `status` field
const isSubmittable = computed(() => {
  const now = Date.now()
  return (
    now >= props.assignment.timeline.submissionsOpenAt.getTime() &&
    now < props.assignment.timeline.submissionsCloseAt.getTime()
  )
})

const statusColors = {
  upcoming: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400',
  open: 'bg-brand-cyan/20 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-cyan',
  closed: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div
    class="relative flex flex-col md:flex-row items-center w-full"
    :class="[isEven ? 'md:flex-row' : 'md:flex-row-reverse']"
  >
    <!-- Visual timeline node (hidden on mobile to prevent layout shift) -->
    <div
      class="hidden md:block absolute left-1/2 w-4 h-4 rounded-full bg-brand-blue border-4 border-white dark:border-[#111a2f] shadow-sm z-10 transform -translate-x-1/2"
    ></div>

    <div
      class="w-full md:w-1/2 py-4 md:py-0"
      :class="[isEven ? 'md:pr-12' : 'md:pl-12']"
    >
      <Motion
        :initial="{ opacity: 0, y: 20, filter: 'blur(10px)' }"
        :animate="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { type: 'spring', stiffness: 100, delay: index * 0.1 },
        }"
        class="bg-white dark:bg-[#151f32] border rounded-3xl p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 relative group overflow-hidden"
        :class="[
          isSubmittable
            ? 'border-brand-blue/30 shadow-md dark:border-brand-blue/50'
            : 'border-gray-100 shadow-sm dark:border-slate-800',
        ]"
      >
        <div
          v-if="isSubmittable"
          class="absolute -top-12 -right-12 w-32 h-32 bg-brand-cyan/20 dark:bg-brand-cyan/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"
        ></div>

        <div class="relative z-10 flex flex-col items-start gap-4">
          <div class="flex items-center justify-between w-full">
            <span
              class="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-xl"
              :class="statusColors[assignment.status]"
            >
              {{ assignment.status }}
            </span>
            <span class="text-sm text-gray-400 dark:text-gray-500 font-medium">
              Due: {{ formatDate(assignment.submissionsCloseAt) }}
            </span>
          </div>

          <h3
            class="font-zalando text-2xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            {{ assignment.title }}
          </h3>

          <p
            class="text-gray-600 dark:text-gray-300 leading-relaxed font-inter"
          >
            {{ assignment.description }}
          </p>

          <NuxtLink
            v-if="isSubmittable"
            :to="`/dashboard/assignments/${assignment.id}`"
            class="mt-2 inline-flex items-center justify-center bg-brand-blue text-white font-medium px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors w-full sm:w-auto shadow-[0_0_15px_rgba(49,113,219,0.2)]"
          >
            Submit Assignment
          </NuxtLink>
        </div>
      </Motion>
    </div>

    <div class="hidden md:block w-1/2"></div>
  </div>
</template>
