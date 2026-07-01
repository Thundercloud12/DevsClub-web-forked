<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useLeaderboard } from '~/composables/student/useLeaderboard'
import { useTracks } from '~/composables/student/useTracks'
import { useAssignments } from '~/composables/student/useAssignments'
import type { LeaderboardEntry, Track, Assignment } from '~/types'
useHead({
  title: 'Leaderboard | TSEC DevsClub',
  meta: [
    {
      name: 'description',
      content:
        'View student performance rankings for the DevsClub recruitment drive.',
    },
  ],
})

import { useLoading } from '~/composables/useLoading'

const {
  getTopStudents,
  isLoading: isLoadingLeaderboard,
  error: leaderboardError,
} = useLeaderboard()
const { getTracks } = useTracks()
const { getAssignments } = useAssignments()
const { startLoading, stopLoading } = useLoading()

const tracks = ref<Track[]>([])
const allAssignments = ref<Assignment[]>([])
const entries = ref<LeaderboardEntry[]>([])

const selectedTrack = ref('all')
const selectedAssignment = ref('aggregate')
const isLoadingData = ref(true)
const isLoadingEntries = ref(false)
const globalError = ref<string | null>(null)

// Compute assignments filtered by the selected track
const filteredAssignments = computed(() => {
  if (selectedTrack.value === 'all') return allAssignments.value
  return allAssignments.value.filter((a) =>
    a.tracks?.includes(selectedTrack.value)
  )
})

// Reset assignment filter when track changes
watch(selectedTrack, () => {
  selectedAssignment.value = 'aggregate'
  fetchEntries()
})

watch(selectedAssignment, () => {
  fetchEntries()
})

const fetchEntries = async () => {
  isLoadingEntries.value = true
  try {
    entries.value = await getTopStudents(
      selectedTrack.value,
      selectedAssignment.value
    )
  } catch (err: any) {
    globalError.value = err?.message ?? 'Failed to load rankings.'
  } finally {
    isLoadingEntries.value = false
  }
}

onMounted(async () => {
  startLoading('leaderboard-init')
  try {
    const [fetchedTracks, fetchedAssignments] = await Promise.all([
      getTracks().catch(() => []),
      getAssignments().catch(() => []),
    ])

    // Fallback tracks if collection is empty
    if (fetchedTracks.length === 0) {
      tracks.value = [
        { id: 'web-dev', name: 'Web Development' },
        { id: 'app-dev', name: 'App Development' },
        { id: 'aiml', name: 'AI & ML' },
      ]
    } else {
      tracks.value = fetchedTracks
    }

    allAssignments.value = fetchedAssignments
    await fetchEntries()
  } catch (err: any) {
    globalError.value = err?.message ?? 'Failed to load leaderboard data.'
  } finally {
    isLoadingData.value = false
    stopLoading('leaderboard-init')
  }
})

// Podium Computed Properties
const podiumFirst = computed(() => entries.value[0] || null)
const podiumSecond = computed(() => entries.value[1] || null)
const podiumThird = computed(() => entries.value[2] || null)
const tableEntries = computed(() => entries.value.slice(3))

const getAvatarGradient = (name: string) => {
  const hash = Array.from(name || '').reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  )
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-400 to-blue-600',
    'from-fuchsia-500 to-pink-600',
  ]
  return gradients[hash % gradients.length]
}

const getInitials = (name: string) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]
  const second = parts[1]
  if (first && second && first[0] && second[0]) {
    return (first[0] + second[0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}
</script>

<template>
  <div
    class="min-h-screen bg-canvas dark:bg-[#0b1120] pt-32 pb-24 relative gradient-mesh"
  >
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
          class="text-primary dark:text-primary-soft font-semibold tracking-wider uppercase text-xs mb-2 block"
        >
          Rankings
        </span>
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-light tracking-[-1.2px] text-ink dark:text-white leading-tight"
        >
          Leaderboard
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.6 } }"
        class="text-lg md:text-xl text-ink-mute dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
      >
        Explore top performers in each recruitment track. Rankings update in
        real time as evaluations are completed.
      </Motion>
    </div>

    <!-- Main Content State -->
    <div
      v-if="isLoadingData"
      class="max-w-4xl mx-auto px-6 py-12 text-center animate-pulse relative z-10"
    >
      <div
        class="h-10 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8"
      />
      <div
        class="h-64 bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl"
      />
    </div>

    <div
      v-else-if="globalError || leaderboardError"
      class="max-w-md mx-auto px-6 text-center py-12 relative z-10"
    >
      <div
        class="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-3"
      >
        <h2 class="font-light text-xl text-ink dark:text-white">
          Failed to Load Rankings
        </h2>
        <p class="text-sm text-ink-mute dark:text-slate-400">
          {{ globalError || leaderboardError }}
        </p>
      </div>
    </div>

    <template v-else>
      <!-- Filters container -->
      <div
        class="max-w-4xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20"
      >
        <!-- Track Tabs Selector -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="selectedTrack = 'all'"
            class="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border"
            :class="[
              selectedTrack === 'all'
                ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(83,58,253,0.15)] dark:bg-primary-soft dark:border-primary-soft dark:text-slate-950'
                : 'bg-surface-card text-ink-secondary dark:text-slate-300 border-hairline dark:border-slate-800 hover:bg-canvas-soft/80 dark:hover:bg-slate-900/50 hover:border-primary-soft',
            ]"
          >
            All Tracks
          </button>
          <button
            v-for="track in tracks"
            :key="track.id"
            @click="selectedTrack = track.id"
            class="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border"
            :class="[
              selectedTrack === track.id
                ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(83,58,253,0.15)] dark:bg-primary-soft dark:border-primary-soft dark:text-slate-950'
                : 'bg-surface-card text-ink-secondary dark:text-slate-300 border-hairline dark:border-slate-800 hover:bg-canvas-soft/80 dark:hover:bg-slate-900/50 hover:border-primary-soft',
            ]"
          >
            {{ track.name }}
          </button>
        </div>

        <!-- Mode Select Dropdown -->
        <div class="w-full md:w-64 relative">
          <select
            v-model="selectedAssignment"
            class="w-full px-4 py-2.5 rounded-full border border-hairline-input bg-canvas text-ink dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200 font-medium text-xs uppercase tracking-wider focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="aggregate">Aggregate Scores (Total)</option>
            <option
              v-for="assign in filteredAssignments"
              :key="assign.id"
              :value="assign.id"
            >
              {{ assign.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State for Filter Updates -->
      <div
        v-if="isLoadingEntries"
        class="max-w-4xl mx-auto px-6 py-24 text-center relative z-10"
      >
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary dark:border-primary-soft border-t-transparent"
        />
        <p
          class="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-mute"
        >
          Recalculating standings...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="entries.length === 0"
        class="max-w-md mx-auto px-6 text-center py-12 relative z-10"
      >
        <div
          class="rounded-3xl border border-hairline dark:border-slate-800 bg-surface-card p-10 space-y-4"
        >
          <div
            class="w-16 h-16 rounded-2xl bg-canvas-soft/80 dark:bg-slate-800 flex items-center justify-center mx-auto text-2xl"
          >
            🏆
          </div>
          <h2 class="font-light text-xl text-ink dark:text-white">
            No Scores Yet
          </h2>
          <p
            class="text-sm text-ink-mute dark:text-slate-400 font-light leading-relaxed"
          >
            There are no evaluated submissions under this criteria. Check back
            once evaluations begin!
          </p>
        </div>
      </div>

      <!-- Leaderboard Data -->
      <div v-else class="max-w-3xl mx-auto px-6 space-y-12 relative z-10">
        <!-- Podium Visual for Top 3 -->
        <div
          class="grid grid-cols-3 items-end gap-4 md:gap-8 max-w-2xl mx-auto pt-10 pb-6"
        >
          <!-- 2nd Place (Left) -->
          <div v-if="podiumSecond" class="flex flex-col items-center">
            <div class="relative">
              <!-- Silver Badge -->
              <span
                class="absolute -top-1 -right-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-slate-300 dark:border-slate-700 shadow-sm z-20"
                >2</span
              >
              <div
                class="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-300 dark:border-slate-700 bg-gradient-to-tr flex items-center justify-center text-white text-lg md:text-xl font-bold uppercase shadow-md relative z-10"
                :class="getAvatarGradient(podiumSecond.name)"
              >
                {{ getInitials(podiumSecond.name) }}
              </div>
            </div>
            <div
              class="w-full mt-4 bg-surface-card border border-hairline dark:border-slate-800/80 rounded-2xl p-3 text-center shadow-sm"
            >
              <span
                class="text-xs md:text-sm font-semibold text-ink dark:text-slate-300 truncate block w-full"
              >
                {{ podiumSecond.name }}
              </span>
              <span
                class="text-primary dark:text-primary-soft font-bold text-xs md:text-sm font-mono block mt-1"
              >
                {{ podiumSecond.totalScore }} pts
              </span>
            </div>
          </div>
          <div v-else class="invisible" />

          <!-- 1st Place (Center) -->
          <div v-if="podiumFirst" class="flex flex-col items-center">
            <div class="relative">
              <!-- Golden Crown -->
              <span
                class="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl z-20 animate-bounce"
                >👑</span
              >
              <!-- Golden Badge -->
              <span
                class="absolute -top-1 -right-1 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-amber-300 dark:border-amber-700 shadow-sm z-20"
                >1</span
              >
              <div
                class="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-amber-400 dark:border-amber-500 bg-gradient-to-tr flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg relative z-10"
                :class="getAvatarGradient(podiumFirst.name)"
              >
                {{ getInitials(podiumFirst.name) }}
              </div>
            </div>
            <div
              class="w-full mt-4 bg-surface-card border-2 border-primary/20 dark:border-primary-soft/20 rounded-2xl p-4 text-center shadow-md relative overflow-hidden"
            >
              <span
                class="text-sm md:text-base font-bold text-ink dark:text-white truncate block w-full"
              >
                {{ podiumFirst.name }}
              </span>
              <span
                class="text-emerald-500 font-bold text-sm md:text-base font-mono block mt-1"
              >
                {{ podiumFirst.totalScore }} pts
              </span>
            </div>
          </div>
          <div v-else class="invisible" />

          <!-- 3rd Place (Right) -->
          <div v-if="podiumThird" class="flex flex-col items-center">
            <div class="relative">
              <!-- Bronze Badge -->
              <span
                class="absolute -top-1 -right-1 bg-amber-900/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-amber-800/30 dark:border-amber-700/50 shadow-sm z-20"
                >3</span
              >
              <div
                class="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-amber-600/30 dark:border-slate-800 bg-gradient-to-tr flex items-center justify-center text-white text-lg md:text-xl font-bold uppercase shadow-md relative z-10"
                :class="getAvatarGradient(podiumThird.name)"
              >
                {{ getInitials(podiumThird.name) }}
              </div>
            </div>
            <div
              class="w-full mt-4 bg-surface-card border border-hairline dark:border-slate-800/80 rounded-2xl p-3 text-center shadow-sm"
            >
              <span
                class="text-xs md:text-sm font-semibold text-ink dark:text-slate-300 truncate block w-full"
              >
                {{ podiumThird.name }}
              </span>
              <span
                class="text-primary dark:text-primary-soft font-bold text-xs md:text-sm font-mono block mt-1"
              >
                {{ podiumThird.totalScore }} pts
              </span>
            </div>
          </div>
          <div v-else class="invisible" />
        </div>

        <!-- Custom Card-Based Rankings for 4th and onwards -->
        <div class="space-y-3 max-w-2xl mx-auto pt-4">
          <!-- If there are no list entries but we have podium ones -->
          <div
            v-if="entries.length <= 3"
            class="text-center p-8 bg-surface-card border border-hairline dark:border-slate-800 rounded-2xl text-ink-mute dark:text-slate-500 font-light"
          >
            Remaining ranks will appear here as more evaluations complete.
          </div>

          <div
            v-else
            v-for="(entry, index) in tableEntries"
            :key="entry.studentId"
            class="flex items-center justify-between p-4 bg-surface-card border border-hairline dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary-soft hover:shadow-[0_8px_24px_rgba(83,58,253,0.04)] transition-all duration-150"
          >
            <!-- Left: Rank + Avatar + Name -->
            <div class="flex items-center gap-4">
              <!-- Rank badge -->
              <span
                class="w-8 h-8 flex items-center justify-center rounded-full bg-canvas-soft/80 dark:bg-slate-800 text-xs font-bold font-mono text-ink-mute"
              >
                {{ index + 4 }}
              </span>

              <!-- Avatar placeholder with initials and dynamic gradient -->
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-tr flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm shrink-0"
                :class="getAvatarGradient(entry.name)"
              >
                {{ getInitials(entry.name) }}
              </div>

              <!-- Name -->
              <span class="font-medium text-sm text-ink dark:text-white">
                {{ entry.name }}
              </span>
            </div>

            <!-- Right: Score and details -->
            <div class="flex items-center gap-6">
              <div
                v-if="selectedAssignment === 'aggregate'"
                class="hidden sm:block text-right"
              >
                <span
                  class="text-[9px] font-semibold uppercase tracking-wider text-ink-mute block"
                  >Submissions</span
                >
                <p
                  class="text-xs font-medium text-ink-secondary dark:text-slate-300"
                >
                  {{ entry.submissionsCount }} completed
                </p>
              </div>
              <div class="text-right">
                <span
                  class="text-[9px] font-semibold uppercase tracking-wider text-ink-mute block"
                  >Score</span
                >
                <p
                  class="text-sm font-bold text-primary dark:text-primary-soft font-mono tnum"
                >
                  {{ entry.totalScore }} pts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
