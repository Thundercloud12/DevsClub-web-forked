<script setup lang="ts">
import { useScroll, useTransform } from 'motion-v'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { scrollY } = useScroll()

const navWidth = useTransform(scrollY, [0, 50], ['90%', '100%'])
const navBorderRadius = useTransform(scrollY, [0, 50], ['32px', '0px'])
const navTop = useTransform(scrollY, [0, 50], ['20px', '0px'])
const navBgOpacity = useTransform(scrollY, [0, 50], [0.85, 1])
const navShadow = useTransform(
  scrollY,
  [0, 50],
  [
    '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  ]
)
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none"
  >
    <Motion
      as="nav"
      class="flex items-center justify-between px-8 py-4 pointer-events-auto backdrop-blur-xl max-w-7xl mx-auto border-gray-200 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden"
      :style="{
        width: navWidth,
        borderRadius: navBorderRadius,
        marginTop: navTop,
        borderWidth: '1px',
        boxShadow: navShadow,
      }"
    >
      <Motion
        class="absolute inset-0 bg-white dark:bg-[#111a2f] z-0 transition-colors duration-300"
        :style="{ opacity: navBgOpacity }"
      ></Motion>

      <div
        class="relative z-10 flex items-center justify-between w-full border-none"
      >
        <NuxtLink to="/" class="flex items-center gap-2">
          <span
            class="font-zalando font-medium text-xl tracking-tight text-primary"
            >TSEC DevsClub</span
          >
        </NuxtLink>

        <div
          class="hidden md:flex items-center gap-8 font-inter font-medium text-sm text-ink-secondary dark:text-slate-300"
        >
          <NuxtLink
            v-if="!authStore.isLoggedIn"
            to="/"
            class="hover:text-primary transition-colors duration-200"
            >Home</NuxtLink
          >
          <template v-if="authStore.isLoggedIn">
            <NuxtLink
              to="/dashboard/assignments"
              class="hover:text-primary transition-colors duration-200"
              >Assignments</NuxtLink
            >
            <NuxtLink
              to="/dashboard/submissions"
              class="hover:text-primary transition-colors duration-200"
              >My Submissions</NuxtLink
            >
            <NuxtLink
              to="/dashboard/leaderboard"
              class="hover:text-primary transition-colors duration-200"
              >Leaderboard</NuxtLink
            >
          </template>

          <UiThemeToggle />

          <button
            v-if="authStore.isLoggedIn"
            @click="authStore.logout()"
            class="inline-flex items-center justify-center rounded-full text-xs font-medium h-9 px-4 border border-rose-500 text-rose-600 hover:bg-rose-500/5 active:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/50 transition-all duration-200"
          >
            Sign Out
          </button>
          <NuxtLink
            v-else
            to="/auth/signin"
            class="inline-flex items-center justify-center rounded-full text-xs font-medium h-9 px-4 bg-primary text-on-primary hover:bg-primary-deep active:bg-primary-press shadow-sm transition-all duration-200"
          >
            Sign In
          </NuxtLink>
        </div>

        <div class="md:hidden flex items-center gap-2">
          <UiThemeToggle />
          <button class="text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/O/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </Motion>
  </div>
</template>
