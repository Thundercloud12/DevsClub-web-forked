<script setup lang="ts">
import { Motion } from 'motion-v'
import { useAuthStore } from '~/stores/auth'
import Terminal from './Info.vue' // adjust path if needed

const authStore = useAuthStore()
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-screen items-center overflow-hidden pt-28"
  >
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
            Membership Drive 2026
          </h1>
        </div>

        <!-- Description -->
        <p
          class="mt-8 max-w-xl text-lg leading-9 text-ink-mute dark:text-slate-400"
        >
          Our structured learning program designed to help students begin their
          software development journey.
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

      <Motion
        :initial="{ opacity: 0, x: 40 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8, delay: 0.2 }"
        class="hidden lg:flex items-center justify-center"
      >
        <div class="relative w-full max-w-2xl">
          <!-- background glow -->
          <div class="absolute inset-0 rounded-3xl bg-primary/10 blur-3xl" />

          <!-- terminal -->
          <div class="relative scale-95 xl:scale-100">
            <Terminal />
          </div>
        </div>
      </Motion>
    </div>
  </section>
</template>
