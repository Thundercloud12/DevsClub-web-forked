<script setup lang="ts">
import type { LeaderboardEntry } from '~/types'

defineProps<{
  first: LeaderboardEntry | null
  second: LeaderboardEntry | null
  third: LeaderboardEntry | null
  getAvatarUrl: (name: string) => string
}>()
</script>

<template>
  <div class="podium-wrapper">
    <div class="podium-desktop">
      <!-- 2nd Place -->
      <div v-if="second" class="podium-col">
        <div class="podium-info">
          <div class="podium-avatar-ring podium-ring-silver">
            <img
              :src="getAvatarUrl(second.name)"
              :alt="second.name"
              class="podium-avatar podium-avatar-md"
            />
            <span class="podium-badge badge-silver">2</span>
          </div>
          <span class="podium-name">{{ second.name }}</span>
          <span class="podium-score text-primary dark:text-primary-soft"
            >{{ second.totalScore }} pts</span
          >
        </div>
        <div class="podium-step step-2">
          <span class="podium-step-label">2nd</span>
        </div>
      </div>
      <div v-else class="podium-col invisible" />

      <!-- 1st Place -->
      <div v-if="first" class="podium-col podium-col-first">
        <div class="podium-info">
          <span class="podium-crown">👑</span>
          <div class="podium-avatar-ring podium-ring-gold">
            <img
              :src="getAvatarUrl(first.name)"
              :alt="first.name"
              class="podium-avatar podium-avatar-lg"
            />
            <span class="podium-badge badge-gold">1</span>
          </div>
          <span class="podium-name podium-name-lg">{{ first.name }}</span>
          <span class="podium-score text-emerald-500"
            >{{ first.totalScore }} pts</span
          >
        </div>
        <div class="podium-step step-1">
          <span class="podium-step-label">1st</span>
        </div>
      </div>
      <div v-else class="podium-col invisible" />

      <!-- 3rd Place -->
      <div v-if="third" class="podium-col">
        <div class="podium-info">
          <div class="podium-avatar-ring podium-ring-bronze">
            <img
              :src="getAvatarUrl(third.name)"
              :alt="third.name"
              class="podium-avatar podium-avatar-md"
            />
            <span class="podium-badge badge-bronze">3</span>
          </div>
          <span class="podium-name">{{ third.name }}</span>
          <span class="podium-score text-primary dark:text-primary-soft"
            >{{ third.totalScore }} pts</span
          >
        </div>
        <div class="podium-step step-3">
          <span class="podium-step-label">3rd</span>
        </div>
      </div>
      <div v-else class="podium-col invisible" />
    </div>
  </div>
</template>

<style scoped>
.podium-wrapper {
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
}

/* ── Layout ── */
.podium-desktop {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.75rem;
}

.podium-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 11rem;
}

.podium-col-first {
  margin-bottom: 0;
}

/* ── Info block ── */
.podium-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  position: relative;
}

/* ── Crown ── */
.podium-crown {
  font-size: 1.5rem;
  line-height: 1;
  margin-bottom: -0.25rem;
  animation: crown-bounce 2s ease-in-out infinite;
}

@keyframes crown-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* ── Avatar ring ── */
.podium-avatar-ring {
  position: relative;
  border-radius: 22%;
  padding: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
}

.podium-ring-gold,
.podium-ring-silver,
.podium-ring-bronze {
  border-color: #94a3b8;
}
.dark .podium-ring-gold,
.dark .podium-ring-silver,
.dark .podium-ring-bronze {
  border-color: #cbd5e1;
}

.podium-avatar {
  display: block;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 20%;
  object-fit: cover;
  background: var(--bg-card);
}

.podium-avatar-md {
  width: 5.5rem;
  height: 5.5rem;
}

.podium-avatar-lg {
  width: 6.5rem;
  height: 6.5rem;
}

/* ── Rank badge ── */
.podium-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  border: 2px solid var(--bg-surface);
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.badge-gold {
  background: #fef3c7;
  color: #d97706;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.7rem;
}

.dark .badge-gold {
  background: #451a03;
  color: #fbbf24;
  border-color: #1e293b;
}

.badge-silver {
  background: #f1f5f9;
  color: #475569;
}

.dark .badge-silver {
  background: #1e293b;
  color: #94a3b8;
  border-color: #0f172a;
}

.badge-bronze {
  background: #fef3c7;
  color: #92400e;
  width: 1.125rem;
  height: 1.125rem;
  font-size: 0.55rem;
}

.dark .badge-bronze {
  background: #1c1008;
  color: #d97706;
  border-color: #0f172a;
}

/* ── Name + score ── */
.podium-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.25rem;
}

.podium-name-lg {
  font-size: 0.9rem;
}

.podium-score {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'SF Mono', ui-monospace, monospace;
}

/* ── Podium steps ── */
.podium-step {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem 0.5rem 0 0;
  position: relative;
}

.step-1 {
  height: 5.5rem;
  background: linear-gradient(
    180deg,
    rgba(234, 179, 8, 0.22) 0%,
    rgba(234, 179, 8, 0.1) 100%
  );
  border: 1px solid rgba(234, 179, 8, 0.4);
  border-bottom: none;
}

.dark .step-1 {
  background: linear-gradient(
    180deg,
    rgba(234, 179, 8, 0.22) 0%,
    rgba(234, 179, 8, 0.09) 100%
  );
  border-color: rgba(234, 179, 8, 0.35);
}

.step-2 {
  height: 3.75rem;
  background: linear-gradient(
    180deg,
    rgba(148, 163, 184, 0.18) 0%,
    rgba(148, 163, 184, 0.08) 100%
  );
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-bottom: none;
}

.dark .step-2 {
  background: linear-gradient(
    180deg,
    rgba(148, 163, 184, 0.2) 0%,
    rgba(148, 163, 184, 0.08) 100%
  );
  border-color: rgba(148, 163, 184, 0.3);
}

.step-3 {
  height: 2.75rem;
  background: linear-gradient(
    180deg,
    rgba(180, 83, 9, 0.16) 0%,
    rgba(180, 83, 9, 0.06) 100%
  );
  border: 1px solid rgba(180, 83, 9, 0.3);
  border-bottom: none;
}

.dark .step-3 {
  background: linear-gradient(
    180deg,
    rgba(180, 83, 9, 0.18) 0%,
    rgba(180, 83, 9, 0.06) 100%
  );
  border-color: rgba(180, 83, 9, 0.28);
}

.podium-step-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.4;
}

.step-1 .podium-step-label {
  color: #d97706;
}
.step-2 .podium-step-label {
  color: #64748b;
}
.step-3 .podium-step-label {
  color: #b45309;
}

.dark .step-1 .podium-step-label {
  color: #fbbf24;
}
.dark .step-2 .podium-step-label {
  color: #94a3b8;
}
.dark .step-3 .podium-step-label {
  color: #d97706;
}
</style>
