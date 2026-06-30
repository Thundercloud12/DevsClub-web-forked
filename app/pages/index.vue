<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()

useHead({
  title: 'TSEC DevsClub | Membership Drive 2026',
  meta: [
    {
      name: 'description',
      content:
        'Join TSEC DevsClub membership drive. Learn software engineering, collaborate on real-world projects, solve assignments, and level up.',
    },
  ],
})

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
</script>

<template>
  <div class="min-h-screen pt-24 pb-24 relative overflow-hidden">
    <!-- Hero Section -->
    <section
      class="max-w-6xl mx-auto px-6 pt-12 pb-20 relative z-10 text-center space-y-8"
    >
      <!-- Live Badge Indicator -->
      <Motion
        :initial="{ opacity: 0, y: -20 }"
        :animate="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary-soft/10 dark:border-primary-soft/20 text-xs font-semibold text-primary dark:text-primary-soft uppercase tracking-wider"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        Membership Drive 2026 is Live
      </Motion>

      <!-- Main Heading -->
      <div class="space-y-4 max-w-4xl mx-auto">
        <h1
          class="text-5xl md:text-7xl font-light tracking-[-1.5px] leading-[1.1] text-ink dark:text-white"
        >
          Build Products. <br />
          <span
            class="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent font-medium dark:from-primary-soft dark:to-fuchsia-400"
          >
            Learn Software Engineering.
          </span>
        </h1>
        <p
          class="text-lg md:text-xl text-ink-mute dark:text-slate-400 font-light leading-relaxed max-w-3xl mx-auto pt-2"
        >
          TSEC DevsClub is a student-run engineering lab designed to take you
          from a curious coder to a production-grade developer. We focus on
          hands-on project building, peer code reviews, and structured learning
          tracks.
        </p>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
      >
        <NuxtLink
          v-if="authStore.isLoggedIn"
          to="/dashboard/assignments"
          class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-deep dark:bg-primary-soft dark:text-[#0b1120] dark:hover:bg-primary transition-all duration-200 shadow-md shadow-primary/10 text-center"
        >
          Go to Assignments
        </NuxtLink>
        <NuxtLink
          v-else
          to="/auth/signin"
          class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-deep dark:bg-primary-soft dark:text-[#0b1120] dark:hover:bg-primary transition-all duration-200 shadow-md shadow-primary/10 text-center"
        >
          Enter Recruitment Portal
        </NuxtLink>

        <NuxtLink
          to="/dashboard/leaderboard"
          class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-surface-card border border-hairline dark:border-slate-800 text-ink dark:text-slate-300 font-medium text-sm hover:bg-canvas-soft dark:hover:bg-slate-900/50 transition-all duration-200 text-center"
        >
          View Standings
        </NuxtLink>
      </div>
    </section>

    <!-- Core Pillars / Tracks Section -->
    <section
      class="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-hairline/80 dark:border-slate-800/80"
    >
      <div class="text-center space-y-4 mb-16">
        <span
          class="text-primary dark:text-primary-soft font-semibold uppercase tracking-wider text-xs block"
        >
          Specialization
        </span>
        <h2
          class="text-3xl md:text-4xl font-light tracking-[-0.8px] text-ink dark:text-white"
        >
          Choose Your Engineering Track
        </h2>
        <p
          class="text-ink-mute dark:text-slate-400 font-light max-w-xl mx-auto text-sm leading-relaxed"
        >
          Select a learning path designed by senior students. You can complete
          tasks across any track to earn scores.
        </p>
      </div>

      <!-- Tracks Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Web Dev Card -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-8 space-y-6 hover:shadow-[0_12px_30px_rgba(83,58,253,0.03)] hover:border-primary-soft/50 transition-all duration-200"
        >
          <div
            class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-medium text-lg text-ink dark:text-white">
              Web Development
            </h3>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Master modern frontend and backend architectures. Build highly
              interactive, scalable web apps utilizing the latest reactive
              technologies.
            </p>
          </div>
          <!-- Badges -->
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >React</span
            >
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >Vue</span
            >
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >NodeJS</span
            >
          </div>
        </div>

        <!-- App Dev Card -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-8 space-y-6 hover:shadow-[0_12px_30px_rgba(83,58,253,0.03)] hover:border-primary-soft/50 transition-all duration-200"
        >
          <div
            class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-medium text-lg text-ink dark:text-white">
              App Development
            </h3>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Dive into cross-platform and native mobile software design. Build
              fluid mobile layouts, design offline databases, and handle OS
              notifications.
            </p>
          </div>
          <!-- Badges -->
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >Flutter</span
            >
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >React Native</span
            >
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >Kotlin</span
            >
          </div>
        </div>

        <!-- AI/ML Card -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-8 space-y-6 hover:shadow-[0_12px_30px_rgba(83,58,253,0.03)] hover:border-primary-soft/50 transition-all duration-200"
        >
          <div
            class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l-3 3m3-3l3-3"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-medium text-lg text-ink dark:text-white">
              AI & Machine Learning
            </h3>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Implement intelligent algorithms and models. Process custom
              datasets, train machine learning predictors, and build natural
              language systems.
            </p>
          </div>
          <!-- Badges -->
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >Python</span
            >
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >PyTorch</span
            >
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-canvas-soft dark:bg-slate-900 text-ink-mute dark:text-slate-400 uppercase tracking-wide border border-hairline/50 dark:border-slate-800"
              >Scikit-Learn</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials / Reviews Section -->
    <section
      class="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-hairline/80 dark:border-slate-800/80"
    >
      <div class="text-center space-y-4 mb-16">
        <span
          class="text-primary dark:text-primary-soft font-semibold uppercase tracking-wider text-xs block"
        >
          Endorsements
        </span>
        <h2
          class="text-3xl md:text-4xl font-light tracking-[-0.8px] text-ink dark:text-white"
        >
          What Our Senior Devs Say
        </h2>
        <p
          class="text-ink-mute dark:text-slate-400 font-light max-w-xl mx-auto text-sm leading-relaxed"
        >
          Read reviews from TSEC senior core members and alumni placed at
          leading technology organizations.
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Review 1 -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Stars -->
            <div class="flex items-center gap-1 text-amber-500">
              <span v-for="i in 5" :key="i" class="text-sm">★</span>
            </div>
            <p
              class="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed font-light italic"
            >
              "DevsClub was the turning point in my engineering path. The
              structured tracks and peer review workflow gave me the hands-on
              confidence to clean up code architectures and clear my software
              engineer internship rounds."
            </p>
          </div>
          <div
            class="flex items-center gap-3 pt-6 border-t border-hairline/60 dark:border-slate-800/60"
          >
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-tr flex items-center justify-center text-white text-[11px] font-bold uppercase shrink-0"
              :class="getAvatarGradient('Karan Shah')"
            >
              KS
            </div>
            <div>
              <h4 class="text-xs font-semibold text-ink dark:text-white">
                Karan Shah
              </h4>
              <p class="text-[10px] text-ink-mute dark:text-slate-400">
                Alumni, SWE @ Google
              </p>
            </div>
          </div>
        </div>

        <!-- Review 2 -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Stars -->
            <div class="flex items-center gap-1 text-amber-500">
              <span v-for="i in 5" :key="i" class="text-sm">★</span>
            </div>
            <p
              class="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed font-light italic"
            >
              "Here, it's not about reading slides or completing theoretical
              courses. It's about pulling issues, building features, pushing
              commits, and getting graded on specific criteria. The real-time
              leaderboard drives healthy competition."
            </p>
          </div>
          <div
            class="flex items-center gap-3 pt-6 border-t border-hairline/60 dark:border-slate-800/60"
          >
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-tr flex items-center justify-center text-white text-[11px] font-bold uppercase shrink-0"
              :class="getAvatarGradient('Rohan Mehta')"
            >
              RM
            </div>
            <div>
              <h4 class="text-xs font-semibold text-ink dark:text-white">
                Rohan Mehta
              </h4>
              <p class="text-[10px] text-ink-mute dark:text-slate-400">
                Co-Founder, DevsClub
              </p>
            </div>
          </div>
        </div>

        <!-- Review 3 -->
        <div
          class="bg-surface-card border border-hairline dark:border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Stars -->
            <div class="flex items-center gap-1 text-amber-500">
              <span v-for="i in 5" :key="i" class="text-sm">★</span>
            </div>
            <p
              class="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed font-light italic"
            >
              "Working with real rubric templates taught me how professional
              engineers write clean code and document their design systems. The
              evaluations are rigorous but extremely constructive."
            </p>
          </div>
          <div
            class="flex items-center gap-3 pt-6 border-t border-hairline/60 dark:border-slate-800/60"
          >
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-tr flex items-center justify-center text-white text-[11px] font-bold uppercase shrink-0"
              :class="getAvatarGradient('Nisha Iyer')"
            >
              NI
            </div>
            <div>
              <h4 class="text-xs font-semibold text-ink dark:text-white">
                Nisha Iyer
              </h4>
              <p class="text-[10px] text-ink-mute dark:text-slate-400">
                Fullstack Engineer Intern
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Submission Procedure Timeline -->
    <section
      class="max-w-4xl mx-auto px-6 py-20 relative z-10 border-t border-hairline/80 dark:border-slate-800/80"
    >
      <div class="text-center space-y-4 mb-16">
        <span
          class="text-primary dark:text-primary-soft font-semibold uppercase tracking-wider text-xs block"
        >
          Guide
        </span>
        <h2
          class="text-3xl md:text-4xl font-light tracking-[-0.8px] text-ink dark:text-white"
        >
          Recruitment Workflow
        </h2>
        <p
          class="text-ink-mute dark:text-slate-400 font-light max-w-xl mx-auto text-sm leading-relaxed"
        >
          How to select tracks, build assignments, and submit your entries.
        </p>
      </div>

      <!-- Timeline Steps -->
      <div
        class="relative pl-8 md:pl-0 border-l border-hairline dark:border-slate-850 md:border-none space-y-12"
      >
        <!-- Step 1 -->
        <div class="relative md:flex md:items-start md:gap-8">
          <!-- Step indicator -->
          <div
            class="absolute md:static left-[-41px] md:left-0 top-0 w-8 h-8 rounded-full bg-primary text-white dark:bg-primary-soft dark:text-[#0b1120] flex items-center justify-center text-xs font-bold font-mono shadow-md shadow-primary/10"
          >
            01
          </div>
          <div class="space-y-1 pt-1">
            <h4 class="font-medium text-sm text-ink dark:text-white">
              Sign In & Complete Profile
            </h4>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Create your account on our recruitment portal. Sign in to gain
              access to the student dashboard.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative md:flex md:items-start md:gap-8">
          <div
            class="absolute md:static left-[-41px] md:left-0 top-0 w-8 h-8 rounded-full bg-primary text-white dark:bg-primary-soft dark:text-[#0b1120] flex items-center justify-center text-xs font-bold font-mono shadow-md shadow-primary/10"
          >
            02
          </div>
          <div class="space-y-1 pt-1">
            <h4 class="font-medium text-sm text-ink dark:text-white">
              Explore Assignments Dashboard
            </h4>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Visit the assignments tab, filter by track (Web, App, AI/ML), and
              pick tasks that match your level of engineering interests.
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative md:flex md:items-start md:gap-8">
          <div
            class="absolute md:static left-[-41px] md:left-0 top-0 w-8 h-8 rounded-full bg-primary text-white dark:bg-primary-soft dark:text-[#0b1120] flex items-center justify-center text-xs font-bold font-mono shadow-md shadow-primary/10"
          >
            03
          </div>
          <div class="space-y-1 pt-1">
            <h4 class="font-medium text-sm text-ink dark:text-white">
              Build & Submit Repositories
            </h4>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Build your projects locally, push them to GitHub, and deploy them.
              In the details page, submit your GitHub repository link and
              deployed website link.
            </p>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="relative md:flex md:items-start md:gap-8">
          <div
            class="absolute md:static left-[-41px] md:left-0 top-0 w-8 h-8 rounded-full bg-primary text-white dark:bg-primary-soft dark:text-[#0b1120] flex items-center justify-center text-xs font-bold font-mono shadow-md shadow-primary/10"
          >
            04
          </div>
          <div class="space-y-1 pt-1">
            <h4 class="font-medium text-sm text-ink dark:text-white">
              Get Mentored & Climb Standings
            </h4>
            <p
              class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light"
            >
              Our core mentors will evaluate your project against rubrics. Watch
              your score count change, receive grading insights, and track your
              climb on the leaderboard!
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Banner CTA -->
    <section class="max-w-4xl mx-auto px-6 py-12 relative z-10 text-center">
      <div
        class="bg-surface-card border-2 border-primary/20 dark:border-primary-soft/20 rounded-3xl p-8 md:p-12 space-y-6 shadow-md"
      >
        <h3
          class="text-2xl md:text-3xl font-light tracking-[-0.5px] text-ink dark:text-white"
        >
          Ready to demonstrate your coding skills?
        </h3>
        <p
          class="text-xs text-ink-mute dark:text-slate-400 leading-relaxed font-light max-w-xl mx-auto"
        >
          Start building and push your first assignment commit today.
          Registration is free and open to all departments at TSEC.
        </p>
        <div>
          <NuxtLink
            v-if="authStore.isLoggedIn"
            to="/dashboard/assignments"
            class="inline-block px-8 py-3 rounded-full bg-primary text-white font-medium text-xs uppercase tracking-wider hover:bg-primary-deep dark:bg-primary-soft dark:text-[#0b1120] dark:hover:bg-primary shadow-sm transition-all duration-200"
          >
            Start Submitting
          </NuxtLink>
          <NuxtLink
            v-else
            to="/auth/signin"
            class="inline-block px-8 py-3 rounded-full bg-primary text-white font-medium text-xs uppercase tracking-wider hover:bg-primary-deep dark:bg-primary-soft dark:text-[#0b1120] dark:hover:bg-primary shadow-sm transition-all duration-200"
          >
            Create Your Account
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
