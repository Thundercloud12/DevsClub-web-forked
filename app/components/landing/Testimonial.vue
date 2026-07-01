<script setup lang="ts">
import { ref, computed } from 'vue'

interface Testimonial {
  id: number
  quote: string
  name: string
  role: string
}

const currentIndex = ref(0)

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'The community made the difference. Stuck at midnight? Someone was always online to unblock me.',
    name: 'Sanya Kapoor',
    role: 'SE Comps',
  },
  {
    id: 2,
    quote:
      "I joined as a complete beginner. Eight weeks later I'd shipped four projects and made friends I still build with.",
    name: 'Aarav Mehta',
    role: 'TE Comps',
  },
  {
    id: 3,
    quote:
      "Mentorship every week kept me honest. The roadmap turned 'I want to learn dev' into actual deployed apps.",
    name: 'Riya Sharma',
    role: 'SL IT',
  },
  {
    id: 4,
    quote:
      "Real projects, real mentors, real growth. This isn't a course, it's a community of builders.",
    name: 'Vedant Patel',
    role: 'FE Comps',
  },
  {
    id: 5,
    quote:
      'The structure and accountability changed everything. I went from zero to shipping in production.',
    name: 'Priya Nair',
    role: 'BE Comps',
  },
]

const totalPages = computed(() => testimonials.length)

const getTestimonial = (index: number): Testimonial => {
  const normalizedIndex =
    ((index % testimonials.length) + testimonials.length) % testimonials.length
  return testimonials[normalizedIndex] as Testimonial
}

const mainTestimonial = computed(() => getTestimonial(currentIndex.value))

const sideTestimonials = computed(() => [
  getTestimonial(currentIndex.value + 1),
  getTestimonial(currentIndex.value + 2),
])

const previousSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + testimonials.length) % testimonials.length
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.length
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}
</script>

<template>
  <section class="relative py-24 px-6">
    <div class="relative mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-16 text-center">
        <h2 class="text-5xl font-bold text-white md:text-6xl">
          Hear from the past participants
        </h2>
        <p class="mt-4 text-lg text-slate-400">
          Real students. Real builds. Real growth.
        </p>
      </div>

      <!-- Testimonials Layout: three centered cards (side cards blurred) -->
      <div
        class="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center"
      >
        <!-- Left blurred side card -->
        <div class="hidden lg:flex lg:w-1/5 lg:justify-center">
          <div
            v-if="sideTestimonials[0]"
            class="w-64 rounded-2xl border border-slate-700/20 bg-slate-900/30 p-6 backdrop-blur-xl text-slate-300 transform scale-95 opacity-80"
          >
            <p class="mb-4 text-sm leading-6 text-slate-300">
              "{{ sideTestimonials[0].quote }}"
            </p>
            <div>
              <p class="text-sm font-semibold text-white">
                {{ sideTestimonials[0].name }}
              </p>
              <p class="text-xs text-slate-400">
                {{ sideTestimonials[0].role }}
              </p>
            </div>
          </div>
        </div>

        <!-- Center spotlight (reduced length) -->
        <div
          class="w-full lg:w-2/5 rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md max-h-[320px] overflow-hidden text-center"
        >
          <p class="mb-6 text-xl leading-relaxed text-white md:text-2xl">
            "{{ mainTestimonial.quote }}"
          </p>

          <div>
            <p class="font-semibold text-white text-lg">
              {{ mainTestimonial.name }}
            </p>
            <p class="mt-1 text-sm text-slate-400">
              {{ mainTestimonial.role }}
            </p>
          </div>
        </div>

        <!-- Right blurred side card -->
        <div class="hidden lg:flex lg:w-1/5 lg:justify-center">
          <div
            v-if="sideTestimonials[1]"
            class="w-64 rounded-2xl border border-slate-700/20 bg-slate-900/30 p-6 backdrop-blur-xl text-slate-300 transform scale-95 opacity-80"
          >
            <p class="mb-4 text-sm leading-6 text-slate-300">
              "{{ sideTestimonials[1].quote }}"
            </p>
            <div>
              <p class="text-sm font-semibold text-white">
                {{ sideTestimonials[1].name }}
              </p>
              <p class="text-xs text-slate-400">
                {{ sideTestimonials[1].role }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="mt-12 flex items-center justify-center gap-6">
        <!-- Left Arrow -->
        <button
          @click="previousSlide"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:text-slate-300"
          aria-label="Previous testimonials"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Dots -->
        <div class="flex gap-2">
          <button
            v-for="(_, index) in totalPages"
            :key="index"
            @click="goToSlide(index)"
            :class="[
              'h-2 rounded-full transition-all',
              index === currentIndex
                ? 'w-8 bg-blue-500'
                : 'w-2 bg-slate-600 hover:bg-slate-500',
            ]"
            :aria-label="`Go to testimonial ${index + 1}`"
          />
        </div>

        <!-- Right Arrow -->
        <button
          @click="nextSlide"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:text-slate-300"
          aria-label="Next testimonials"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
