<script setup>
import SignupButton from '@/components/SignupButton.vue'
</script>

<template>
  <main
    class="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-6xl mx-auto mt-10 px-4 sm:px-8">
    <div class="md:w-1/2 md:pr-10">
      <h1 class="text-4xl sm:text-4xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">Trello brings all your tasks,
        teammates, and tools together</h1>
      <p class="mt-2 sm:mt-4 text-gray-600 text-lg sm:text-xl">Keep everything in the same place—even if your team isnt.
      </p>
      <div class="mt-6 sm:mt-8 mx-auto text-center md:text-left">
        <RouterLink to="/signup">
          <SignupButton />
        </RouterLink>
      </div>
    </div>

    <div class="md:w-1/2 mt-10 md:mt-0">
      <img src="@/assets/img/home_showcase.png" alt="Placeholder" class="w-full h-auto md:float-right">
    </div>
  </main>
</template>
    
