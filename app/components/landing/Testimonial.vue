<script setup lang="ts">
import { ref } from 'vue'

interface Testimonial {
  id: number
  username: string
  name: string
  role: string
  quote: string
  commits: string
  commitHash: string
  avatarColor: string
  reactions: {
    rocket: number
    fire: number
    party: number
  }
}

const testimonials = ref<Testimonial[]>([
  {
    id: 1,
    username: 'aarav-mehta',
    name: 'Aarav Mehta',
    role: 'TE Comps',
    quote:
      "I joined as a complete beginner. Eight weeks later I'd shipped four projects and made friends I still build with.",
    commits: 'committed 4 frontend features',
    commitHash: 'a8c2d91',
    avatarColor: 'bg-indigo-500',
    reactions: { rocket: 24, fire: 12, party: 8 },
  },
  {
    id: 2,
    username: 'sanya-kapoor',
    name: 'Sanya Kapoor',
    role: 'SE Comps',
    quote:
      'The community made the difference. Stuck at midnight? Someone was always online to unblock me.',
    commits: 'resolved 12 merge conflicts',
    commitHash: 'b4f7e2a',
    avatarColor: 'bg-emerald-500',
    reactions: { rocket: 19, fire: 15, party: 5 },
  },
  {
    id: 3,
    username: 'vedant-patel',
    name: 'Vedant Patel',
    role: 'FE Comps',
    quote:
      "Real projects, real mentors, real growth. This isn't a course, it's a community of builders.",
    commits: 'pushed 3 production deployments',
    commitHash: 'c9d1a8e',
    avatarColor: 'bg-amber-500',
    reactions: { rocket: 32, fire: 22, party: 14 },
  },
  {
    id: 4,
    username: 'riya-sharma',
    name: 'Riya Sharma',
    role: 'SL IT',
    quote:
      "Mentorship every week kept me honest. The roadmap turned 'I want to learn dev' into actual deployed apps.",
    commits: 'optimized database queries',
    commitHash: 'd7e5f3c',
    avatarColor: 'bg-rose-500',
    reactions: { rocket: 15, fire: 9, party: 7 },
  },
  {
    id: 5,
    username: 'priya-nair',
    name: 'Priya Nair',
    role: 'BE Comps',
    quote:
      'The structure and accountability changed everything. I went from zero to shipping in production.',
    commits: 'implemented custom auth flow',
    commitHash: 'e3b8a1f',
    avatarColor: 'bg-sky-500',
    reactions: { rocket: 27, fire: 18, party: 11 },
  },
])

const activeReactions = ref<Record<string, boolean>>({})

const handleReact = (
  testimonialId: number,
  type: 'rocket' | 'fire' | 'party'
) => {
  const key = `${testimonialId}-${type}`
  const test = testimonials.value.find((t) => t.id === testimonialId)
  if (!test) return

  if (activeReactions.value[key]) {
    test.reactions[type]--
    activeReactions.value[key] = false
  } else {
    test.reactions[type]++
    activeReactions.value[key] = true
  }
}
</script>

<template>
  <section id="testimonials" class="relative py-24 px-6 bg-transparent">
    <div class="relative mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-16 text-center">
        <h2
          class="text-4xl font-bold text-ink dark:text-white md:text-5xl tracking-tight font-inter"
        >
          Hear from the past participants
        </h2>
        <p class="mt-4 text-lg text-ink-mute dark:text-slate-400">
          Real students. Real builds. Real growth.
        </p>
      </div>

      <!-- Mock Pull Request Top Panel -->
      <div
        class="border border-hairline dark:border-slate-800 bg-surface-card/60 dark:bg-[#0b1120]/60 rounded-xl p-6 backdrop-blur-md mb-12 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      >
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h3
                class="text-xl md:text-2xl font-semibold text-ink dark:text-white font-mono tracking-tight"
              >
                Refactor participant skillset to production-ready
                <span class="text-ink-mute dark:text-slate-500">#42</span>
              </h3>
            </div>
            <div
              class="flex items-center gap-2 mt-4 flex-wrap text-xs md:text-sm text-ink-mute dark:text-slate-400 font-inter"
            >
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >
                <svg
                  class="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V5.372Zm8 .506a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.756a2.251 2.251 0 1 0 1.5 0v-.756ZM11 5.372v.756a3.75 3.75 0 0 1-3.75 3.75H6.25a.75.75 0 0 0 0 1.5h1a5.25 5.25 0 0 0 5.25-5.25v-.756Z"
                  />
                </svg>
                Merged
              </span>
              <span class="font-semibold text-ink dark:text-slate-200"
                >keerthan-poojary</span
              >
              <span>merged 5 approvals from contributors into</span>
              <span
                class="font-mono bg-canvas-soft dark:bg-slate-800 text-ink-secondary dark:text-slate-300 px-2 py-0.5 rounded text-xs"
                >main</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Vertical Git Timeline -->
      <div
        class="relative pl-8 md:pl-12 border-l-2 border-hairline dark:border-slate-800 space-y-12 ml-4"
      >
        <!-- Loop over testimonials -->
        <template v-for="test in testimonials" :key="test.id">
          <!-- Commit Event -->
          <div class="relative">
            <!-- Commit Icon on Timeline -->
            <span
              class="absolute -left-[41px] md:-left-[57px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-canvas dark:bg-[#0b1120] border-2 border-hairline dark:border-slate-800 text-ink-mute dark:text-slate-500 shadow-inner"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm.088.75H14a.75.75 0 0 0 0-1.5h-3.412a2.5 2.5 0 0 1 0 1.5ZM5.412 7H2a.75.75 0 0 0 0 1.5h3.412a2.5 2.5 0 0 1 0-1.5Z"
                />
              </svg>
            </span>
            <div
              class="flex items-center gap-2 text-xs md:text-sm text-ink-mute dark:text-slate-400 font-mono"
            >
              <span class="font-semibold text-ink dark:text-slate-200"
                >@{{ test.username }}</span
              >
              <span>{{ test.commits }}</span>
              <span class="text-ink-mute dark:text-slate-600 font-semibold">{{
                test.commitHash
              }}</span>
            </div>
          </div>

          <!-- Review Event Box -->
          <div class="relative group">
            <!-- Student Avatar on Timeline -->
            <span
              class="absolute -left-[49px] md:-left-[65px] top-2.5 flex items-center justify-center w-10 h-10 rounded-full border border-hairline dark:border-slate-700 overflow-hidden shadow-md font-mono text-sm font-bold text-white transition-all duration-300 group-hover:border-primary-soft dark:group-hover:border-slate-500"
              :class="test.avatarColor"
            >
              {{
                test.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              }}
            </span>

            <!-- PR Review Box Card -->
            <div
              class="border border-hairline dark:border-slate-800/80 bg-surface-card/80 dark:bg-[#0b1120]/45 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-primary-soft dark:hover:border-slate-700/80 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <!-- Box Header -->
              <div
                class="bg-surface-card dark:bg-[#0b1120]/80 px-5 py-3 border-b border-hairline dark:border-slate-800/60 flex items-center justify-between flex-wrap gap-2"
              >
                <div
                  class="flex items-center gap-2 text-xs md:text-sm font-inter"
                >
                  <span class="font-bold text-ink dark:text-slate-200"
                    >@{{ test.username }}</span
                  >
                  <span class="text-ink-mute dark:text-slate-400"
                    >approved these changes</span
                  >
                </div>
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  ✓ Approved
                </span>
              </div>

              <div class="p-6 space-y-4">
                <blockquote
                  class="text-sm md:text-base leading-relaxed text-ink-secondary dark:text-slate-300 italic border-l-2 border-hairline dark:border-slate-700 pl-4 font-inter"
                >
                  "{{ test.quote }}"
                </blockquote>

                <!-- Box Footer -->
                <div
                  class="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-hairline dark:border-slate-800/40"
                >
                  <!-- Student Identification -->
                  <div
                    class="flex items-center gap-2 text-xs text-ink-mute dark:text-slate-500 font-inter"
                  >
                    <svg
                      class="w-4 h-4 text-ink-mute dark:text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <span
                      class="font-semibold text-ink-mute dark:text-slate-400"
                      >{{ test.name }}</span
                    >
                    <span>•</span>
                    <span class="text-ink-mute dark:text-slate-500 font-mono">{{
                      test.role
                    }}</span>
                  </div>

                  <!-- Clickable Reaction Badges -->
                  <div class="flex gap-2">
                    <button
                      @click="handleReact(test.id, 'rocket')"
                      class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all duration-200 active:scale-95"
                      :class="
                        activeReactions[`${test.id}-rocket`]
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.1)]'
                          : 'bg-canvas-soft/30 dark:bg-slate-800/30 border-hairline dark:border-slate-800 text-ink-mute dark:text-slate-400 hover:border-primary-soft dark:hover:border-slate-700 hover:text-ink dark:hover:text-slate-300'
                      "
                    >
                      <span>🚀</span>
                      <span class="font-mono text-[10px] font-semibold">{{
                        test.reactions.rocket
                      }}</span>
                    </button>
                    <button
                      @click="handleReact(test.id, 'fire')"
                      class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all duration-200 active:scale-95"
                      :class="
                        activeReactions[`${test.id}-fire`]
                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 dark:text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.1)]'
                          : 'bg-canvas-soft/30 dark:bg-slate-800/30 border-hairline dark:border-slate-800 text-ink-mute dark:text-slate-400 hover:border-primary-soft dark:hover:border-slate-700 hover:text-ink dark:hover:text-slate-300'
                      "
                    >
                      <span>🔥</span>
                      <span class="font-mono text-[10px] font-semibold">{{
                        test.reactions.fire
                      }}</span>
                    </button>
                    <button
                      @click="handleReact(test.id, 'party')"
                      class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all duration-200 active:scale-95"
                      :class="
                        activeReactions[`${test.id}-party`]
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-500 dark:text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.15)]'
                          : 'bg-canvas-soft/30 dark:bg-slate-800/30 border-hairline dark:border-slate-800 text-ink-mute dark:text-slate-400 hover:border-primary-soft dark:hover:border-slate-700 hover:text-ink dark:hover:text-slate-300'
                      "
                    >
                      <span>🎉</span>
                      <span class="font-mono text-[10px] font-semibold">{{
                        test.reactions.party
                      }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Final Merge Event -->
        <div
          class="relative pl-8 md:pl-12 border-l-2 border-hairline dark:border-slate-800 ml-4 pb-4"
        >
          <span
            class="absolute -left-[45px] md:-left-[61px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/40 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
          >
            <svg
              class="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V5.372Zm8 .506a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.756a2.251 2.251 0 1 0 1.5 0v-.756ZM11 5.372v.756a3.75 3.75 0 0 1-3.75 3.75H6.25a.75.75 0 0 0 0 1.5h1a5.25 5.25 0 0 0 5.25-5.25v-.756Z"
              />
            </svg>
          </span>
          <div
            class="flex items-center gap-2 text-xs md:text-sm text-ink-mute dark:text-slate-400 font-mono flex-wrap"
          >
            <span class="font-semibold text-purple-500 dark:text-purple-400"
              >devsclub-bot</span
            >
            <span>merged commit</span>
            <span
              class="font-mono text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 px-1.5 py-0.5 rounded"
              >cf9d1a8</span
            >
            <span>into</span>
            <span
              class="font-mono bg-canvas-soft dark:bg-slate-800 text-ink-secondary dark:text-slate-300 px-1.5 py-0.5 rounded text-xs"
              >main</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
