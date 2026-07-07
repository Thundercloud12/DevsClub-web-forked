<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll, useTransform } from 'motion-v'
import { useRoute } from '#app'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { scrollY } = useScroll()

const isMobileMenuOpen = ref(false)
const isDashboardPage = computed(() => route.path.startsWith('/dashboard'))

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
      class="flex flex-col justify-center px-8 py-4 pointer-events-auto backdrop-blur-xl mx-auto border-gray-200 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden"
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

      <div class="relative z-10 flex flex-col w-full border-none">
        <!-- Header row -->
        <div class="flex items-center justify-between w-full">
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5"
            @click="isMobileMenuOpen = false"
          >
            <img
              src="/devs-light.png"
              alt="TSEC DevsClub Logo"
              class="h-8 w-auto dark:hidden"
            />
            <img
              src="/devs-dark.png"
              alt="TSEC DevsClub Logo"
              class="h-8 w-auto hidden dark:block"
            />
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div
            class="hidden md:flex items-center gap-8 font-inter font-medium text-sm text-ink-secondary dark:text-slate-300"
          >
            <template v-if="authStore.isLoggedIn">
              <NuxtLink
                to="/dashboard/assignments"
                class="hover:text-primary transition-colors duration-200"
                >Assignments
              </NuxtLink>
              <NuxtLink
                to="/dashboard/submissions"
                class="hover:text-primary transition-colors duration-200"
                >My Submissions</NuxtLink
              >
              <NuxtLink
                to="/dashboard/leaderboard"
                class="hover:text-primary transition-colors duration-200"
                >Leaderboard
              </NuxtLink>
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

          <!-- Mobile Toggle Buttons -->
          <div class="md:hidden flex items-center gap-2">
            <UiThemeToggle />
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="text-gray-700 dark:text-gray-300 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              <svg
                v-if="!isMobileMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
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
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Content -->
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden flex flex-col gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-slate-800/60 font-inter font-medium text-sm text-ink-secondary dark:text-slate-300"
        >
          <template v-if="!isDashboardPage">
            <a
              href="/#hero"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >Home</a
            >
            <a
              href="/#info"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >About</a
            >
            <a
              href="/#timeline"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >Timeline</a
            >
            <a
              href="/#testimonials"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >Testimonials</a
            >
            <a
              href="/#faq"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >FAQ</a
            >
            <div
              v-if="authStore.isLoggedIn"
              class="h-px bg-gray-100 dark:bg-slate-800/60 my-1"
            ></div>
          </template>

          <template v-if="authStore.isLoggedIn">
            <NuxtLink
              to="/dashboard/assignments"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >Assignments</NuxtLink
            >
            <NuxtLink
              to="/dashboard/submissions"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >My Submissions</NuxtLink
            >
            <NuxtLink
              to="/dashboard/leaderboard"
              class="hover:text-primary transition-colors duration-200 py-1"
              @click="isMobileMenuOpen = false"
              >Leaderboard</NuxtLink
            >
            <button
              @click="authStore.logout(); isMobileMenuOpen = false"
              class="w-full mt-2 inline-flex items-center justify-center rounded-full text-xs font-medium h-9 px-4 border border-rose-500 text-rose-600 hover:bg-rose-500/5 active:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/50 transition-all duration-200"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/signin"
              class="w-full mt-2 inline-flex items-center justify-center rounded-full text-xs font-medium h-9 px-4 bg-primary text-on-primary hover:bg-primary-deep active:bg-primary-press shadow-sm transition-all duration-200"
              @click="isMobileMenuOpen = false"
            >
              Sign In
            </NuxtLink>
          </template>
        </div>
      </div>
    </Motion>
  </div>
</template>
