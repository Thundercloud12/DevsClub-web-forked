<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAssignments } from '~/composables/useAssignments'
import { useTracks } from '~/composables/useTracks'
import type { Assignment } from '~/schemas/assignments'
import type { Track } from '~/schemas/tracks'

definePageMeta({ middleware: ['auth'] })

useHead({
  title: 'Assignments | TSEC DevsClub',
  meta: [
    {
      name: 'description',
      content:
        'Track and submit your TSEC DevsClub recruitment drive assignments here.',
    },
  ],
})

const { getAssignments } = useAssignments()
const { getTracks } = useTracks()

const assignments = ref<
  Array<Assignment & { status: 'upcoming' | 'open' | 'closed' }>
>([])
const tracks = ref<Track[]>([])
const selectedTrack = ref('all')
const isLoading = ref(true)
const loadError = ref<string | null>(null)

const getAssignmentStatus = (
  assignment: Assignment
): 'upcoming' | 'open' | 'closed' => {
  const now = Date.now()
  const openAt = new Date(assignment.timeline.submissionsOpenAt).getTime()
  const closeAt = new Date(assignment.submissionsCloseAt).getTime()
  if (now < openAt) return 'upcoming'
  if (now >= openAt && now < closeAt) return 'open'
  return 'closed'
}

const filteredAssignments = computed(() => {
  if (selectedTrack.value === 'all') return assignments.value
  return assignments.value.filter((a) =>
    a.tracks?.includes(selectedTrack.value)
  )
})

onMounted(async () => {
  try {
    const [fetchedTracks, fetchedAssignments] = await Promise.all([
      getTracks(),
      getAssignments(),
    ])

    tracks.value = fetchedTracks
    assignments.value = fetchedAssignments
      .map((item) => {
        const status = getAssignmentStatus(item)
        return {
          ...item,
          status,
        }
      })
      .sort((a, b) => {
        const dateA = a.timeline?.submissionsOpenAt
        const dateB = b.timeline?.submissionsOpenAt
        const timeA = dateA ? new Date(dateA).getTime() : 0
        const timeB = dateB ? new Date(dateB).getTime() : 0
        return timeA - timeB
      })
  } catch (err: any) {
    loadError.value = err?.message ?? 'Failed to load assignments.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-transparent pt-32 pb-24 overflow-hidden relative">
    <div
      class="max-w-5xl mx-auto px-6 text-center space-y-6 mb-12 relative z-10"
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

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-pulse"
    >
      <div class="flex justify-center gap-3 mb-6">
        <div class="h-10 w-28 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
        <div class="h-10 w-36 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
        <div class="h-10 w-36 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
      </div>
      <div
        class="h-40 bg-white dark:bg-[#151f32] border border-gray-100 dark:border-slate-800 rounded-3xl"
      />
      <div
        class="h-40 bg-white dark:bg-[#151f32] border border-gray-100 dark:border-slate-800 rounded-3xl"
      />
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="max-w-md mx-auto px-6 text-center py-12">
      <div
        class="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 space-y-3"
      >
        <h2
          class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
        >
          Failed to Load Assignments
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ loadError }}
        </p>
      </div>
    </div>

    <template v-else>
      <!-- Premium track filter tab bar -->
      <Motion
        :initial="{ opacity: 0, y: 15 }"
        :animate="{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3, duration: 0.5 },
        }"
        class="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-12 px-6 relative z-25"
      >
        <button
          @click="selectedTrack = 'all'"
          class="px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 pointer-events-auto border"
          :class="[
            selectedTrack === 'all'
              ? 'bg-brand-blue text-white border-brand-blue shadow-[0_0_15px_rgba(49,113,219,0.3)]'
              : 'bg-white/45 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/75',
          ]"
        >
          All Tracks
        </button>
        <button
          v-for="track in tracks"
          :key="track.id"
          @click="selectedTrack = track.id"
          class="px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 pointer-events-auto border"
          :class="[
            selectedTrack === track.id
              ? 'bg-brand-blue text-white border-brand-blue shadow-[0_0_15px_rgba(49,113,219,0.3)]'
              : 'bg-white/45 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/75',
          ]"
        >
          {{ track.name }}
        </button>
      </Motion>

      <!-- Empty state -->
      <div
        v-if="filteredAssignments.length === 0"
        class="max-w-md mx-auto px-6 text-center py-12"
      >
        <div
          class="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#151f32] p-8 space-y-3"
        >
          <h2
            class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
          >
            No Assignments Found
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            There are currently no assignments published under this track. Check
            back later!
          </p>
        </div>
      </div>

      <!-- Timeline -->
      <AssignmentsTimelineContainer v-else :assignments="filteredAssignments" />
    </template>
  </div>
</template>
