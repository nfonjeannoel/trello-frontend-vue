<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <header v-if="!$route.meta.hideNavbar">
      <NavBar />
  </header>

  <RouterView />
</template>

<style scoped>
</style>
