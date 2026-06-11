<script setup lang="ts">
import { useScroll, useTransform } from 'motion-v'

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
            class="font-zalando font-bold text-xl text-brand-blue tracking-tight"
            >TSEC DevsClub</span
          >
        </NuxtLink>

        <div
          class="hidden md:flex items-center gap-8 font-inter font-medium text-sm text-gray-700 dark:text-gray-300"
        >
          <NuxtLink
            to="/"
            class="hover:text-brand-blue transition-colors duration-200"
            >Home</NuxtLink
          >
          <NuxtLink
            to="/assignments"
            class="hover:text-brand-blue transition-colors duration-200"
            >Assignments</NuxtLink
          >
          <NuxtLink
            to="/dashboard"
            class="hover:text-brand-blue transition-colors duration-200"
            >Dashboard</NuxtLink
          >

          <UiThemeToggle />

          <NuxtLink
            to="/auth/signin"
            class="bg-brand-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-[0_0_15px_rgba(49,113,219,0.3)]"
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
