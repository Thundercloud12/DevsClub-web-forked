<!-- components/UnderMaintenancePage.vue -->
<template>
  <div class="bg-gray-100 dark:bg-gray-800">
    <div class="min-h-screen flex flex-col justify-center items-center p-4">
      <!-- NuxtImg handles optimizations automatically from the public/ folder -->
      <NuxtImg
        src="/cogs-settings.svg"
        alt="Under Maintenance"
        width="200"
        height="200"
        class="mb-6"
      />

      <h1
        class="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-700 dark:text-white mb-4"
      >
        Site is under maintenance
      </h1>

      <p
        class="text-center text-gray-500 dark:text-gray-300 text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl"
      >
        We're working hard to improve the user experience. Stay tuned!
      </p>
    </div>
  </div>
</template>

<script setup>
// No extra logic needed here; it's a pure presentation component
</script>
