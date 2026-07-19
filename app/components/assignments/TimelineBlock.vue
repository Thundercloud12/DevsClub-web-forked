<script setup lang="ts">
import { computed } from 'vue'
import type { Assignment } from '~/schemas/assignments'

const props = defineProps<{
  assignment: Assignment & {
    id: string
    status: 'upcoming' | 'open' | 'closed'
  }
  index: number
  hasSubmitted?: boolean
}>()

const emit = defineEmits<{
  viewDetails: [
    assignment: Assignment & {
      id: string
      status: 'upcoming' | 'open' | 'closed'
    },
  ]
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
    <div
      class="hidden md:block absolute left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-canvas-soft dark:border-[#0b1120] shadow-sm z-10 transform -translate-x-1/2"
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

        <div class="relative z-10 flex flex-col items-start gap-4 w-full">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-0"
          >
            <span
              class="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-xl self-start"
              :class="statusColors[assignment.status]"
            >
              {{ assignment.status }}
            </span>
            <div
              class="flex flex-col text-xs sm:text-right text-gray-400 dark:text-gray-500 font-medium"
            >
              <span
                >Open:
                {{ formatDate(assignment.timeline.submissionsOpenAt) }}</span
              >
              <span>Due: {{ formatDate(assignment.submissionsCloseAt) }}</span>
            </div>
          </div>

          <template
            v-if="
              assignment.status === 'closed' ||
              assignment.status === 'upcoming' ||
              hasSubmitted
            "
          >
            <button
              type="button"
              @click="emit('viewDetails', assignment)"
              class="group/title block text-left w-full cursor-pointer focus:outline-none"
            >
              <h3
                class="font-zalando text-2xl font-bold text-gray-900 dark:text-white leading-tight hover:text-brand-blue dark:hover:text-brand-cyan transition-colors"
              >
                {{ assignment.title }}
              </h3>
            </button>
          </template>
          <template v-else>
            <NuxtLink
              :to="`/dashboard/assignments/${assignment.id}`"
              class="group/title block"
            >
              <h3
                class="font-zalando text-2xl font-bold text-gray-900 dark:text-white leading-tight hover:text-brand-blue dark:hover:text-brand-cyan transition-colors"
              >
                {{ assignment.title }}
              </h3>
            </NuxtLink>
          </template>

          <p
            class="text-gray-600 dark:text-gray-300 leading-relaxed font-inter"
          >
            {{ assignment.description }}
          </p>

          <button
            v-if="
              assignment.status === 'closed' ||
              assignment.status === 'upcoming' ||
              hasSubmitted
            "
            type="button"
            @click="emit('viewDetails', assignment)"
            class="mt-2 inline-flex items-center justify-center font-medium px-6 py-2.5 rounded-md transition-all duration-200 w-full sm:w-auto text-center cursor-pointer text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-ink-secondary dark:text-slate-200 border border-hairline dark:border-slate-800 focus:outline-none"
          >
            {{
              assignment.status === 'closed' || hasSubmitted
                ? 'View Submission'
                : 'View Details'
            }}
          </button>
          <NuxtLink
            v-else
            :to="`/dashboard/assignments/${assignment.id}`"
            class="mt-2 inline-flex items-center justify-center font-semibold px-6 py-2.5 rounded-md transition-all duration-200 w-full sm:w-auto text-center cursor-pointer text-sm bg-primary text-white hover:bg-primary-deep shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            Submit Assignment
          </NuxtLink>
        </div>
      </Motion>
    </div>

    <div class="hidden md:block w-1/2"></div>
  </div>
</template>
