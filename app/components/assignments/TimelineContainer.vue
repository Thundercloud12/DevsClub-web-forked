<script setup lang="ts">
import { computed } from 'vue'
import type { Assignment } from '~/schemas/assignments'

const props = defineProps<{
  assignments: Array<
    Assignment & { id: string; status: 'upcoming' | 'open' | 'closed' }
  >
}>()

const emit = defineEmits<{
  viewDetails: [
    assignment: Assignment & {
      id: string
      status: 'upcoming' | 'open' | 'closed'
    },
  ]
}>()
</script>

<template>
  <div class="relative w-full max-w-4xl mx-auto py-12 px-4 md:px-0">
    <div
      class="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:-ml-px hidden md:block z-0"
    >
      <svg class="h-full w-full" preserveAspectRatio="none">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100%"
          stroke="#9feffe"
          stroke-width="2"
          stroke-dasharray="8 8"
          class="timeline-line-animated"
        />
      </svg>
    </div>

    <div class="space-y-6 md:space-y-24 relative z-10">
      <AssignmentsTimelineBlock
        v-for="(assignment, index) in assignments"
        :key="assignment.id"
        :assignment="assignment"
        :index="index"
        @view-details="emit('viewDetails', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.timeline-line-animated {
  animation: dash-flow 1s linear infinite;
}

@keyframes dash-flow {
  from {
    stroke-dashoffset: 16;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
