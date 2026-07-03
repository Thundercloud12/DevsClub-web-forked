<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

type SystemEntry = { type: 'system'; text: string }
type InputEntry = { type: 'input'; text: string }
type ErrorEntry = { type: 'error'; text: string }
type HeadingEntry = { type: 'heading'; text: string }
type BulletEntry = { type: 'bullet'; text: string }
type ParagraphEntry = { type: 'paragraph'; text: string }
type FeatureEntry = { type: 'feature'; title: string; desc: string }
type InsightEntry = {
  type: 'insight'
  num: string
  title: string
  desc: string
}
type SuccessEntry = { type: 'success'; text: string }

type TerminalEntry =
  | SystemEntry
  | InputEntry
  | ErrorEntry
  | HeadingEntry
  | BulletEntry
  | ParagraphEntry
  | FeatureEntry
  | InsightEntry
  | SuccessEntry

const history = ref<TerminalEntry[]>([])

const input = ref('')
const suggestions = ref([
  'help',
  'about',
  'features',
  'why',
  'insights',
  'clear',
])

const displaySuggestions = computed(() => suggestions.value.slice(0, 3))

const commands: Record<
  string,
  { desc: string; execute: () => TerminalEntry[] }
> = {
  help: {
    desc: 'Show all available commands',
    execute: () => [
      { type: 'heading', text: 'Available Commands' },
      { type: 'bullet', text: 'about    : What is the Membership Drive?' },
      { type: 'bullet', text: 'features : Learn about the 4 pillars' },
      { type: 'bullet', text: 'why      : Why we run this drive' },
      {
        type: 'bullet',
        text: 'insights : Key insights about learning & community',
      },
      { type: 'bullet', text: 'clear    : Clear the terminal' },
    ],
  },
  about: {
    desc: 'What is the Membership Drive?',
    execute: () => [
      { type: 'heading', text: 'The Membership Drive' },
      {
        type: 'bullet',
        text: 'Duration: 2 months of intensive learning & building',
      },
      { type: 'bullet', text: 'Tracks: frontend, backend, app, devops' },
      { type: 'bullet', text: 'Projects: 4 real-world assignments to ship' },
      { type: 'bullet', text: 'Mentoring: Guided by experienced developers' },
      { type: 'success', text: '✓ Ready to build' },
    ],
  },
  features: {
    desc: 'The 4 pillars of the drive',
    execute: () => [
      { type: 'heading', text: 'The 4 Pillars' },
      {
        type: 'feature',
        title: 'BUILD',
        desc: 'Curated Assignments — Real-world tasks designed to simulate production development.',
      },
      {
        type: 'feature',
        title: 'LEARN',
        desc: 'Community Resources — Handpicked learning material from seniors and alumni.',
      },
      {
        type: 'feature',
        title: 'MENTOR',
        desc: 'Weekly Guidance — Direct feedback loops with experienced developers.',
      },
      {
        type: 'feature',
        title: 'SHIP',
        desc: 'Deploy & Showcase — Every task ends in something live and shareable.',
      },
      { type: 'success', text: '✓ Ready to ship' },
    ],
  },
  why: {
    desc: 'Why we run the drive',
    execute: () => [
      { type: 'heading', text: 'Why We Run This Drive' },
      {
        type: 'paragraph',
        text: 'Most students try to learn development alone and burn out. We started this club to change that.',
      },
      {
        type: 'bullet',
        text: 'Solo learning is hard without structure and guidance',
      },
      {
        type: 'bullet',
        text: 'Community compounds growth — peers push and debug together',
      },
      {
        type: 'bullet',
        text: 'Mentorship shortcuts mistakes that take years to learn alone',
      },
      {
        type: 'bullet',
        text: "We're building a developer culture at TSEC, not just teaching code",
      },
      { type: 'success', text: '✓ Community first' },
    ],
  },
  insights: {
    desc: 'Key insights about learning',
    execute: () => [
      { type: 'heading', text: 'Key Insights' },
      {
        type: 'insight',
        num: '01',
        title: 'Solo learning is brutal',
        desc: "Watching tutorials isn't building. We give you direction, structure, and deadlines.",
      },
      {
        type: 'insight',
        num: '02',
        title: 'Community compounds',
        desc: 'You grow faster when you build with peers who push and debug with you.',
      },
      {
        type: 'insight',
        num: '03',
        title: 'Mentorship matters',
        desc: 'Seniors and alumni help you avoid the mistakes they already made.',
      },
      {
        type: 'insight',
        num: '04',
        title: 'Culture > content',
        desc: "We're not just teaching code — we're building a developer culture at TSEC.",
      },
      { type: 'success', text: "✓ Let's grow together" },
    ],
  },
  clear: {
    desc: 'Clear terminal',
    execute: () => {
      history.value = []
      return []
    },
  },
}

// Update suggestions based on input
watch(input, (newInput) => {
  if (newInput.length === 0) {
    suggestions.value = Object.keys(commands)
  } else {
    const matches = Object.keys(commands).filter((cmd) =>
      cmd.startsWith(newInput.toLowerCase())
    )
    suggestions.value = matches.length > 0 ? matches : Object.keys(commands)
  }
})

const handleSubmit = () => {
  if (!input.value.trim()) return

  const cmd = input.value.toLowerCase().trim()
  history.value.push({ type: 'input', text: input.value })

  if (commands[cmd]) {
    const output = commands[cmd].execute()
    if (output.length > 0) {
      history.value.push(...output)
    }
  } else {
    history.value.push({
      type: 'error',
      text: `Command not found: "${cmd}". Type "help" for available commands.`,
    })
  }

  input.value = ''
}

const setInputCommand = (cmd: string) => {
  input.value = cmd
  handleSubmit()
}
onMounted(async () => {
  await nextTick()
  inputRef.value?.focus()
})
</script>

<template>
  <div class="w-full">
    <!-- Terminal Container -->
    <div
      class="mx-auto w-full max-w-full overflow-hidden rounded-lg border border-slate-800 bg-[#0F172A]/95 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <!-- Terminal Header -->
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

      <!-- Terminal Body -->
      <div class="flex h-[440px] flex-col font-mono text-sm leading-7">
        <!-- Output Area -->
        <div class="flex-1 overflow-y-auto px-8 py-6 terminal-scroll">
          <!-- Output Lines -->
          <div v-for="(entry, idx) in history" :key="idx">
            <!-- System message -->
            <div v-if="entry.type === 'system'" class="text-slate-500">
              {{ entry.text }}
            </div>

            <!-- Input command -->
            <div v-else-if="entry.type === 'input'" class="text-slate-300">
              <span class="text-slate-500">$</span> {{ entry.text }}
            </div>

            <!-- Error message -->
            <div v-else-if="entry.type === 'error'" class="text-red-400">
              {{ entry.text }} !!
            </div>

            <!-- Heading -->
            <div
              v-else-if="entry.type === 'heading'"
              class="mb-3 mt-2 border-b border-slate-700 pb-2 text-cyan-400"
            >
              {{ entry.text }}
            </div>

            <!-- Bullet point -->
            <div
              v-else-if="entry.type === 'bullet'"
              class="mb-1 flex gap-2 text-slate-300"
            >
              <span class="shrink-0 text-emerald-400">→</span>
              <span>{{ entry.text }}</span>
            </div>

            <!-- Paragraph -->
            <div
              v-else-if="entry.type === 'paragraph'"
              class="mb-3 italic text-slate-400"
            >
              {{ entry.text }}
            </div>

            <!-- Feature (for pillars) -->
            <div
              v-else-if="entry.type === 'feature'"
              class="mb-2 text-slate-300"
            >
              <span class="text-emerald-400">{{ entry.title }}</span>
              <span class="text-slate-500"> — </span>
              <span>{{ entry.desc }}</span>
            </div>

            <!-- Insight (numbered) -->
            <div v-else-if="entry.type === 'insight'" class="mb-3">
              <div class="text-slate-300">
                <span class="text-pink-200">[{{ entry.num }}]</span>
                <span class="ml-2 text-pink-200">{{ entry.title }}</span>
              </div>
              <div class="ml-6 text-slate-400">{{ entry.desc }}</div>
            </div>

            <!-- Success message -->
            <div v-else-if="entry.type === 'success'" class="text-emerald-400">
              {{ entry.text }}
            </div>
          </div>

          <!-- Inline command input inside terminal output -->
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">$</span>
            <form @submit.prevent="handleSubmit" class="flex-1">
              <input
                ref="inputRef"
                v-model="input"
                type="text"
                placeholder="Type a command..."
                class="w-full bg-transparent font-mono text-slate-300 outline-none placeholder-slate-600"
              />
            </form>
          </div>

          <!-- Suggestions -->
          <div
            v-if="displaySuggestions.length > 0"
            class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500"
          >
            <span>💡 Try:</span>
            <button
              v-for="suggestion in displaySuggestions"
              :key="suggestion"
              @click="setInputCommand(suggestion)"
              class="rounded border border-slate-700 px-2 py-1 transition hover:border-emerald-400 hover:text-emerald-400"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-scroll {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}

.terminal-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
