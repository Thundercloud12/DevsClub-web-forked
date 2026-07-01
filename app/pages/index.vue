<script setup lang="ts">
useHead({
  title: 'TSEC DevsClub | Membership Drive 2026',
  meta: [
    {
      name: 'description',
      content: 'Join TSEC DevsClub membership drive...',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen overflow-hidden">
    <LandingHero />
    <LandingInfo />
    <LandingTimeline />
    <LandingTestimonial />
    <LandingFAQ />
  </div>
  <div class="-mb-16">
    <LandingFooter />
  </div>
</template>
