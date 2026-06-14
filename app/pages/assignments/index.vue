<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Assignments | TSEC DevsClub',
  meta: [
    {
      name: 'description',
      content:
        'Track and submit your TSEC DevsClub membership drive assignments here.',
    },
  ],
})

// Dummy data for visual development
const dummyAssignments = ref([
  {
    id: 'wk1',
    title: 'Week 1: Introduction to Web Basics',
    description:
      'Learn the fundamentals of HTML, CSS, and basic JavaScript. You will build a simple personal portfolio website and deploy it to GitHub pages.',
    publishedAt: new Date('2026-06-01T10:00:00Z'),
    submissionsOpenAt: new Date('2026-06-01T10:00:00Z'),
    submissionsCloseAt: new Date('2026-06-07T23:59:59Z'),
    status: 'closed' as const,
  },
  {
    id: 'wk2',
    title: 'Week 2: Advanced CSS & Vue Concepts',
    description:
      'Dive deeper into layout mechanics like Flexbox and Grid. Build your first Vue 3 components and manage simple reactive state.',
    publishedAt: new Date('2026-06-08T10:00:00Z'),
    submissionsOpenAt: new Date('2026-06-08T10:00:00Z'),
    submissionsCloseAt: new Date('2026-06-14T23:59:59Z'),
    status: 'open' as const,
  },
  {
    id: 'wk3',
    title: 'Week 3: Integrating Backend & Firebase',
    description:
      'Connect your front-end components to Firestore. Manage user authentication and handle reading and writing custom data models safely.',
    publishedAt: new Date('2026-06-15T10:00:00Z'),
    submissionsOpenAt: new Date('2026-06-15T10:00:00Z'),
    submissionsCloseAt: new Date('2026-06-21T23:59:59Z'),
    status: 'upcoming' as const,
  },
  {
    id: 'wk4',
    title: 'Week 4: Final Project Showcase',
    description:
      'Combine everything you have learned to build a full-stack club portal mini-clone. This assignment focuses on UI polish and code quality.',
    publishedAt: new Date('2026-06-22T10:00:00Z'),
    submissionsOpenAt: new Date('2026-06-22T10:00:00Z'),
    submissionsCloseAt: new Date('2026-06-28T23:59:59Z'),
    status: 'upcoming' as const,
  },
])
</script>

<template>
  <div class="min-h-screen bg-transparent pt-32 pb-24 overflow-hidden relative">
    <div
      class="max-w-5xl mx-auto px-6 text-center space-y-6 mb-16 relative z-10"
    >
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :animate="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 80, damping: 15 },
        }"
      >
        <span
          class="text-brand-blue font-semibold tracking-widest uppercase text-sm mb-2 block"
        >
          Membership Drive
        </span>
        <h1
          class="font-zalando text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          Your Assignments
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.6 } }"
        class="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-inter"
      >
        Complete these milestones to progress through the DevsClub recruitment
        pipeline. Keep an eye on the deadlines.
      </Motion>
    </div>

    <AssignmentsTimelineContainer :assignments="dummyAssignments" />
  </div>
</template>
