<template>
  <section id="tracks" class="py-24">
    <div class="mx-auto max-w-5xl px-6">
      <!-- HEADER -->
      <div class="text-center">
        <div
          class="text-xs uppercase tracking-[0.35em] text-primary font-semibold"
        >
          Membership Drive • 4 Tracks
        </div>
        <h2 class="mt-4 text-4xl font-semibold text-ink dark:text-white">
          One shared journey. Four tracks.
        </h2>
        <p class="mt-4 text-ink-mute dark:text-slate-400">
          Frontend, Backend, App, DevOps — the timeline structure is the same,
          but each track has its own assignment path and milestones.
        </p>
      </div>

      <div
        class="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[100px]"
      >
        <!-- Frontend -->
        <div
          class="md:col-span-2 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col justify-end p-5 hover:-translate-y-1 transition-transform duration-300"
        >
          <h3
            class="font-zalando text-xl md:text-2xl text-rose-900 dark:text-rose-200"
          >
            Frontend
          </h3>
          <p
            class="text-rose-700/80 dark:text-rose-300/80 text-xs md:text-sm mt-0.5"
          >
            Craft beautiful and interactive user interfaces.
          </p>
        </div>
        <!-- Backend -->
        <div
          class="md:col-span-1 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex flex-col justify-end p-5 hover:-translate-y-1 transition-transform duration-300"
        >
          <h3
            class="font-zalando text-xl md:text-2xl text-blue-900 dark:text-blue-200"
          >
            Backend
          </h3>
          <p
            class="text-blue-700/80 dark:text-blue-300/80 text-xs md:text-sm mt-0.5"
          >
            Architect robust APIs and server logic.
          </p>
        </div>
        <!-- App -->
        <div
          class="md:col-span-1 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col justify-end p-5 hover:-translate-y-1 transition-transform duration-300"
        >
          <h3
            class="font-zalando text-xl md:text-2xl text-amber-900 dark:text-amber-200"
          >
            App
          </h3>
          <p
            class="text-amber-700/80 dark:text-amber-300/80 text-xs md:text-sm mt-0.5"
          >
            Build native mobile apps.
          </p>
        </div>
        <!-- DevOps -->
        <div
          class="md:col-span-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex flex-col justify-end p-5 hover:-translate-y-1 transition-transform duration-300"
        >
          <h3
            class="font-zalando text-xl md:text-2xl text-emerald-900 dark:text-emerald-200"
          >
            DevOps
          </h3>
          <p
            class="text-emerald-700/80 dark:text-emerald-300/80 text-xs md:text-sm mt-0.5"
          >
            Automate deployments and manage infrastructure.
          </p>
        </div>
      </div>

      <!-- TIMELINE -->
      <div id="timeline" class="mt-20 text-center mb-16 relative z-10">
        <h2 class="font-zalando text-4xl md:text-5xl text-ink dark:text-white">
          Timeline
        </h2>
      </div>

      <div class="relative">
        <div class="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 z-0">
          <svg class="h-full w-full" preserveAspectRatio="none">
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke-width="2"
              stroke-dasharray="8 8"
              class="timeline-line-animated"
            />
          </svg>
        </div>

        <div class="space-y-14">
          <div
            v-for="(event, index) in timeline"
            :key="event.label + index"
            class="relative flex items-start z-10"
          >
            <div
              class="absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-canvas-soft dark:border-[#0b1120] shadow-sm"
            ></div>

            <div class="w-1/2 pr-8" v-if="index % 2 === 0">
              <div
                class="timeline-card ml-auto max-w-xl text-right transition duration-700 ease-out opacity-0 translate-y-8"
              >
                <div
                  class="text-xs font-semibold uppercase tracking-[0.35em] text-primary"
                >
                  {{ event.label }}
                </div>
                <h3
                  class="mt-3 text-2xl font-semibold text-ink dark:text-white"
                >
                  {{ event.title }}
                </h3>
                <p class="mt-3 text-sm leading-7 text-ink-mute">
                  {{ event.desc }}
                </p>
                <p v-if="event.note" class="mt-4 text-xs text-primary">
                  {{ event.note }}
                </p>
                <p v-if="event.footer" class="mt-3 text-sm text-ink-mute">
                  {{ event.footer }}
                </p>
              </div>
            </div>

            <div class="w-1/2" v-if="index % 2 === 0"></div>

            <div class="w-1/2" v-if="index % 2 === 1"></div>
            <div class="w-1/2 pl-8" v-if="index % 2 === 1">
              <div
                class="timeline-card mr-auto max-w-xl text-left transition duration-700 ease-out opacity-0 translate-y-8"
              >
                <div
                  class="text-xs font-semibold uppercase tracking-[0.35em] text-primary"
                >
                  {{ event.label }}
                </div>
                <h3
                  class="mt-3 text-2xl font-semibold text-ink dark:text-white"
                >
                  {{ event.title }}
                </h3>
                <p class="mt-3 text-sm leading-7 text-ink-mute">
                  {{ event.desc }}
                </p>
                <p v-if="event.note" class="mt-4 text-xs text-primary">
                  {{ event.note }}
                </p>
                <p v-if="event.footer" class="mt-3 text-sm text-ink-mute">
                  {{ event.footer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOT NOTE -->
      <p class="mt-16 text-center text-sm text-ink-mute">
        The top 3 performers in each track receive certificates, but the
        membership drive is designed around learning, mentorship, and practical
        growth.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const timeline = [
  {
    type: 'intro',
    label: 'INTRO MEET',
    title: 'Kickoff Orientation',
    desc: 'Launch the drive, meet mentors, and align expectations across every track.',
    note: 'All tracks begin together with the same structured support system.',
  },
  {
    type: 'assignment',
    label: 'TRACK MILESTONE 1',
    title: 'Track milestone 1',
    desc: 'Each track starts with a project tailored to its own skills and goals.',
    footer:
      'After submission, mentors review progress and help set the next milestone.',
  },
  {
    type: 'mentorship',
    label: 'MENTORSHIP',
    title: 'Review Session 1',
    desc: 'Mentors give feedback on your first milestone and help shape the next stage.',
  },
  {
    type: 'assignment',
    label: 'TRACK MILESTONE 2',
    title: 'Track milestone 2',
    desc: 'Work continues with challenges that match your track’s learning path.',
    footer: 'Mentorship helps keep your track goals aligned and growing.',
  },
  {
    type: 'mentorship',
    label: 'MENTORSHIP',
    title: 'Review Session 2',
    desc: 'Get guidance on your current progress and practical improvements.',
  },
  {
    type: 'assignment',
    label: 'TRACK MILESTONE 3',
    title: 'Track milestone 3',
    desc: 'Continue building toward a stronger system or application for your track.',
    footer:
      'Mentors help connect the work to real-world standards and next steps.',
  },
  {
    type: 'mentorship',
    label: 'MENTORSHIP',
    title: 'Review Session 3',
    desc: 'Fine-tune your approach and prepare for the final milestone.',
  },
  {
    type: 'assignment',
    label: 'TRACK MILESTONE 4',
    title: 'Track milestone 4',
    desc: 'Deliver the final track project with polish, reliability, and real-skill outcomes.',
    footer:
      'Your final submission is reviewed and finalized with mentor support.',
  },
  {
    type: 'mentorship',
    label: 'MENTORSHIP',
    title: 'Review Session 4',
    desc: 'Close the loop with mentors and lock in your practical growth.',
  },
  {
    type: 'final',
    label: 'RECOGNITION',
    title: 'Learning Comes First',
    desc: 'Top performers are recognized per track, but the core value is skills and confidence.',
    note: 'This membership drive prioritizes learning over certificates.',
  },
]

onMounted(() => {
  const cards = document.querySelectorAll('.timeline-card')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.25,
    }
  )

  cards.forEach((card) => observer.observe(card))
})
</script>

<style scoped>
.timeline-card {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out;
}

.timeline-card.reveal {
  opacity: 1;
  transform: translateY(0);
}
</style>
