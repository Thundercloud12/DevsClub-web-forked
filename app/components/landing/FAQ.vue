<template>
  <section class="py-20">
    <div class="mx-auto max-w-4xl px-6">
      <h2 class="text-center text-4xl font-semibold text-white">
        Frequently Asked Questions
      </h2>

      <p class="text-center mt-3 text-slate-400">
        Quick answers about the Membership Drive and participation.
      </p>

      <div class="mt-10 grid gap-4">
        <div
          v-for="(f, i) in faqs"
          :key="f.q"
          class="faq-card rounded-2xl border border-slate-700/50 bg-slate-900 p-4 pl-4"
        >
          <button
            @click="toggle(i)"
            class="w-full flex items-center justify-between gap-4"
          >
            <span
              :class="[
                'text-left font-medium',
                openIndex === i ? 'text-blue-400' : 'text-white',
              ]"
              >{{ f.q }}</span
            >
            <svg
              v-if="openIndex === i"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 12H4"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <transition name="fade">
            <div
              v-show="openIndex === i"
              class="mt-3 text-slate-300 text-sm leading-6"
            >
              {{ f.a }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type FAQ = { q: string; a: string }

const faqs: FAQ[] = [
  {
    q: 'Do I need experience?',
    a: 'No - the drive is friendly to beginners; mentors help as you learn.',
  },
  {
    q: 'Is this free?',
    a: "Yes - it's a student-run community program, free to join.",
  },
  {
    q: 'How long does it run?',
    a: 'Typically 8-10 weeks with weekly checkpoints and a final showcase.',
  },
  {
    q: 'What are the tracks?',
    a: 'Frontend, Backend, App, and DevOps — pick one and focus on applied projects.',
  },
]

const openIndex = ref<number | null>(null)
const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.faq-card {
  position: relative;
}

.faq-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: rgba(59, 130, 246, 0.6);
  /* blue-500 @ 60% */
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
</style>
