<template>
  <section class="py-24">
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
        class="mt-10 flex flex-wrap justify-center gap-3 text-sm text-ink-mute"
      >
        <span class="rounded-full border border-hairline px-4 py-2"
          >Frontend</span
        >
        <span class="rounded-full border border-hairline px-4 py-2"
          >Backend</span
        >
        <span class="rounded-full border border-hairline px-4 py-2">App</span>
        <span class="rounded-full border border-hairline px-4 py-2"
          >DevOps</span
        >
      </div>

      <!-- TIMELINE -->
      <div class="mt-20 relative">
        <div
          class="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-hairline"
        ></div>

        <div class="space-y-14">
          <div
            v-for="(event, index) in timeline"
            :key="event.label + index"
            class="relative flex items-start"
          >
            <div
              class="absolute left-1/2 top-6 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-primary bg-surface"
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
