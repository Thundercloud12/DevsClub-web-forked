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
    username: 'aryan-pathak',
    name: 'Aryan Pathak',
    role: 'App Track',
    quote:
      'Membership drive was one of the best things that happened to me, it was the reason I pursued app development and am on the way to make a career in it',
    commits: 'pushed app track solutions',
    commitHash: 'a8c2d91',
    avatarColor: 'bg-indigo-500',
    reactions: { rocket: 0, fire: 0, party: 0 },
  },
  {
    id: 2,
    username: 'manish-rajaranthinam',
    name: 'Manish Rajaranthinam',
    role: 'App Track',
    quote:
      'App is cool, got to interact with lot of capable seniors and learnt many things',
    commits: 'resolved app layout bugs',
    commitHash: 'b4f7e2a',
    avatarColor: 'bg-emerald-500',
    reactions: { rocket: 0, fire: 0, party: 0 },
  },
  {
    id: 3,
    username: 'darryl-mathias',
    name: 'Darryl Mathias',
    role: 'Web Track',
    quote:
      'Personally, the Membership Drive was one of the best things I joined in my first year. What I appreciated the most was that instead of a short, paid workshop, we got an 8-week, free, learning experience completely focused on helping students grow.',
    commits: 'built 8-week core projects',
    commitHash: 'c9d1a8e',
    avatarColor: 'bg-amber-500',
    reactions: { rocket: 0, fire: 0, party: 0 },
  },
  {
    id: 4,
    username: 'richa-sharangdhar',
    name: 'Richa Sharangdhar',
    role: 'Web Track',
    quote:
      'The membership drive was a great learning experience. As a first-year student, it gave me hands-on exposure to web development through practical tasks and regular review sessions. The honest feedback from seniors not only helped me improve my skills but also gave me the opportunity to learn from their experience. It was a rewarding journey of learning, applying, improving, and growing.',
    commits: 'completed web track tasks',
    commitHash: 'f18b2c4',
    avatarColor: 'bg-pink-500',
    reactions: { rocket: 0, fire: 0, party: 0 },
  },
])
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
                >devsclub</span
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
      <div class="relative pl-8 md:pl-12 space-y-12 ml-4">
        <!-- Timeline Line -->
        <div
          class="absolute left-0 top-3 bottom-6 w-0.5 bg-hairline dark:bg-slate-800/60 z-0"
        ></div>

        <!-- Loop over testimonials -->
        <template v-for="test in testimonials" :key="test.id">
          <!-- Commit Event -->
          <div class="relative">
            <!-- Commit Icon on Timeline -->
            <span
              class="absolute -left-[44px] md:-left-[60px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-canvas dark:bg-[#0b1120] border-2 border-hairline dark:border-slate-800 text-ink-mute dark:text-slate-500 shadow-inner"
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
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Final Merge Event -->
        <div class="relative">
          <span
            class="absolute -left-[48px] md:-left-[64px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/40 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
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
