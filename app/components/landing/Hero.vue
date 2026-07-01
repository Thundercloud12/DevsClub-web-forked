<script setup lang="ts">
import { Motion } from 'motion-v'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <section class="relative min-h-[92vh] flex items-center overflow-hidden">
    <!-- background glow -->
    <div
      class="absolute right-0 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]"
    />

    <div
      class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-24 px-6 py-18 lg:grid-cols-2"
    >
      <Motion
        :initial="{ opacity: 0, y: 40 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        class="flex flex-col justify-center"
      >
        <!-- Heading -->
        <div>
          <h1
            class="text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink dark:text-white md:text-7xl"
          >
            Learn to ship.
          </h1>
          <h1
            class="text-6xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl"
          >
            <span
              class="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent"
            >
              Build like a dev.
            </span>
          </h1>
        </div>

        <!-- Description -->
        <p
          class="mt-8 max-w-xl text-lg leading-9 text-ink-mute dark:text-slate-400"
        >
          Join TSEC DevsClub's Membership Drive — a hands-on program where
          engineering students learn by building real projects, completing
          weekly mentorship, and collaborating with a community that ships.
        </p>

        <!-- Buttons -->
        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink
            v-if="authStore.isLoggedIn"
            to="/dashboard/assignments"
            class="group inline-flex items-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-primary-deep hover:shadow-xl hover:shadow-primary/25"
          >
            Go to Assignments

            <svg
              class="ml-2 h-4 w-4 transition group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 12h14m-5-5l5 5-5 5"
              />
            </svg>
          </NuxtLink>

          <NuxtLink
            v-else
            to="/auth/signin"
            class="group inline-flex items-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-primary-deep hover:shadow-xl hover:shadow-primary/25"
          >
            Join Membership Drive

            <svg
              class="ml-2 h-4 w-4 transition group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 12h14m-5-5l5 5-5 5"
              />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/leaderboard"
            class="rounded-full border border-hairline bg-surface-card px-7 py-4 text-sm font-semibold text-ink transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 dark:text-white"
          >
            Explore Tracks
          </NuxtLink>
        </div>
      </Motion>

      <div class="relative hidden h-[560px] lg:block">
        <!-- Glow -->
        <div
          class="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
        />

        <!-- Main Terminal -->
        <div class="absolute right-0 top-15 z-20">
          <div
            class="overflow-hidden rounded-md border border-slate-800 bg-[#0F172A]/95 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <!-- Header -->

            <div
              class="flex items-center justify-between border-b border-slate-800 px-5 py-4"
            >
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-red-400"></span>
                <span class="h-3 w-3 rounded-full bg-yellow-400"></span>
                <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
              </div>

              <span class="text-xs font-medium tracking-wide text-slate-500">
                ~tsec-devs-club
              </span>
            </div>

            <!-- Body -->
            <div class="w-[580px] p-8 font-mono text-[14px] leading-8">
              <div class="mb-4 text-slate-600">$ npm run membership-drive</div>

              <div>
                <span class="text-pink-400">const</span>
                <span class="text-cyan-400"> you </span>
                <span class="text-white">=</span>
                <span class="text-emerald-300"> await</span>
                <span class="text-white"> developer.ship() </span>
              </div>

              <br />

              <div>
                <span class="text-violet-400"> ➜ tracks : </span>

                <span class="text-slate-300">
                  ['frontend', 'backend', 'app', 'devops']
                </span>
              </div>

              <div>
                <span class="text-violet-400"> ➜ weeks : </span>

                <span class="text-emerald-400"> 8 </span>
              </div>

              <div>
                <span class="text-violet-400"> ➜ mentors : </span>

                <span class="text-emerald-400"> true </span>
              </div>

              <br />

              <div class="text-slate-500">✓ ready in 2 months</div>

              <div class="text-emerald-400">
                ➜ welcome aboard
                <span class="animate-pulse"> █ </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
