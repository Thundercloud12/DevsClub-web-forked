<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import {
  useLeaderboard,
  type LeaderboardEntry,
} from '~/composables/useLeaderboard'
import { useTracks } from '~/composables/useTracks'
import { useAssignments } from '~/composables/useAssignments'
import type { Track } from '~/schemas/tracks'
import type { Assignment } from '~/schemas/assignments'

definePageMeta({ middleware: ['auth'] })

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

const {
  getTopStudents,
  isLoading: isLoadingLeaderboard,
  error: leaderboardError,
} = useLeaderboard()
const { getTracks } = useTracks()
const { getAssignments } = useAssignments()

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
  }
})

// Podium Computed Properties
const podiumFirst = computed(() => entries.value[0] || null)
const podiumSecond = computed(() => entries.value[1] || null)
const podiumThird = computed(() => entries.value[2] || null)
const tableEntries = computed(() => entries.value.slice(3))
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
          Rankings
        </span>
        <h1
          class="font-zalando text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          Leaderboard
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.6 } }"
        class="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-inter"
      >
        Explore top performers in each recruitment track. Rankings update in
        real time as evaluations are completed.
      </Motion>
    </div>

    <!-- Main Content State -->
    <div
      v-if="isLoadingData"
      class="max-w-4xl mx-auto px-6 py-12 text-center animate-pulse"
    >
      <div
        class="h-10 w-2/3 bg-gray-200 dark:bg-slate-800 rounded-2xl mx-auto mb-8"
      />
      <div class="h-64 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
    </div>

    <div
      v-else-if="globalError || leaderboardError"
      class="max-w-md mx-auto px-6 text-center py-12"
    >
      <div
        class="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 space-y-3"
      >
        <h2
          class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
        >
          Failed to Load Rankings
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
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
            class="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border"
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
            class="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border"
            :class="[
              selectedTrack === track.id
                ? 'bg-brand-blue text-white border-brand-blue shadow-[0_0_15px_rgba(49,113,219,0.3)]'
                : 'bg-white/45 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/75',
            ]"
          >
            {{ track.name }}
          </button>
        </div>

        <!-- Mode Select Dropdown -->
        <div class="w-full md:w-64 relative">
          <select
            v-model="selectedAssignment"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white dark:bg-[#151f32] text-gray-800 dark:text-gray-200 font-inter font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
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
        class="max-w-4xl mx-auto px-6 py-24 text-center"
      >
        <div
          class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-blue border-t-transparent"
        />
        <p
          class="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium font-inter"
        >
          Recalculating standings...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="entries.length === 0"
        class="max-w-md mx-auto px-6 text-center py-12"
      >
        <div
          class="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#151f32] p-10 space-y-4"
        >
          <div
            class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto"
          >
            🏆
          </div>
          <h2
            class="font-zalando font-bold text-xl text-gray-900 dark:text-white"
          >
            No Scores Yet
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-inter">
            There are no evaluated submissions under this criteria. Check back
            once evaluations begin!
          </p>
        </div>
      </div>

      <!-- Leaderboard Data -->
      <div v-else class="max-w-4xl mx-auto px-6 space-y-12">
        <!-- 3. Elegant Podiums Visual for Top 3 -->
        <div
          class="grid grid-cols-3 items-end gap-3 md:gap-6 max-w-xl mx-auto pt-8 pb-4"
        >
          <!-- 2nd Place (Left) -->
          <div v-if="podiumSecond" class="flex flex-col items-center">
            <span
              class="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 font-inter truncate w-24 text-center"
            >
              {{ podiumSecond.name }}
            </span>
            <span
              class="text-brand-blue font-bold text-xs md:text-sm font-inter mt-0.5"
            >
              {{ podiumSecond.totalScore }} pts
            </span>
            <div
              class="w-full mt-3 h-28 md:h-36 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 border border-gray-200/50 dark:border-slate-700/50 rounded-t-2xl flex flex-col items-center justify-center shadow-sm"
            >
              <span class="text-3xl md:text-4xl">🥈</span>
              <span
                class="text-xs font-semibold text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-wider"
                >2nd</span
              >
            </div>
          </div>
          <div v-else class="invisible" />

          <!-- 1st Place (Center) -->
          <div v-if="podiumFirst" class="flex flex-col items-center">
            <!-- Crown -->
            <span class="text-2xl mb-1 animate-bounce">👑</span>
            <span
              class="text-sm md:text-base font-extrabold text-gray-900 dark:text-white font-inter truncate w-28 text-center"
            >
              {{ podiumFirst.name }}
            </span>
            <span
              class="text-brand-cyan dark:text-brand-blue font-extrabold text-sm md:text-base font-inter mt-0.5"
            >
              {{ podiumFirst.totalScore }} pts
            </span>
            <div
              class="w-full mt-3 h-36 md:h-48 bg-gradient-to-t from-brand-blue/30 to-brand-blue/15 dark:from-brand-blue/35 dark:to-brand-blue/5 border border-brand-blue/30 rounded-t-3xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
            >
              <span class="text-4xl md:text-5xl">🥇</span>
              <span
                class="text-xs font-bold text-brand-blue dark:text-brand-cyan mt-2 uppercase tracking-widest"
                >1st</span
              >
            </div>
          </div>
          <div v-else class="invisible" />

          <!-- 3rd Place (Right) -->
          <div v-if="podiumThird" class="flex flex-col items-center">
            <span
              class="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 font-inter truncate w-24 text-center"
            >
              {{ podiumThird.name }}
            </span>
            <span
              class="text-brand-blue font-bold text-xs md:text-sm font-inter mt-0.5"
            >
              {{ podiumThird.totalScore }} pts
            </span>
            <div
              class="w-full mt-3 h-20 md:h-28 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 border border-gray-200/50 dark:border-slate-700/50 rounded-t-2xl flex flex-col items-center justify-center shadow-sm"
            >
              <span class="text-2xl md:text-3xl">🥉</span>
              <span
                class="text-xs font-semibold text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-wider"
                >3rd</span
              >
            </div>
          </div>
          <div v-else class="invisible" />
        </div>

        <!-- 4. Table Rankings for 4th and onwards -->
        <div
          class="bg-white dark:bg-[#151f32] border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr
                  class="border-b border-gray-100 dark:border-slate-800/70 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-inter"
                >
                  <th class="px-6 py-4">Rank</th>
                  <th class="px-6 py-4">Candidate</th>
                  <th
                    class="px-6 py-4 text-center"
                    v-if="selectedAssignment === 'aggregate'"
                  >
                    Assignments
                  </th>
                  <th class="px-6 py-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-gray-100/60 dark:divide-slate-800/50 text-sm font-inter text-gray-700 dark:text-gray-300"
              >
                <!-- If there are no table entries but we have podium ones -->
                <tr v-if="entries.length <= 3">
                  <td
                    colspan="4"
                    class="px-6 py-8 text-center text-gray-400 dark:text-slate-500"
                  >
                    Remaining ranks will appear here as more evaluations
                    complete.
                  </td>
                </tr>
                <tr
                  v-for="(entry, index) in tableEntries"
                  :key="entry.studentId"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td
                    class="px-6 py-4 font-bold text-gray-500 dark:text-gray-400"
                  >
                    #{{ index + 4 }}
                  </td>
                  <td
                    class="px-6 py-4 font-semibold text-gray-900 dark:text-white"
                  >
                    {{ entry.name }}
                  </td>
                  <td
                    class="px-6 py-4 text-center"
                    v-if="selectedAssignment === 'aggregate'"
                  >
                    <span
                      class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                    >
                      {{ entry.submissionsCount }} completed
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 text-right font-bold text-brand-blue dark:text-brand-cyan"
                  >
                    {{ entry.totalScore }} pts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
