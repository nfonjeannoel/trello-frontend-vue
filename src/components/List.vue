<!-- List.vue -->

<template>
    <div class="list bg-white rounded-lg p-4 shadow">
      <h2 class="text-xl font-semibold mb-2">{{ list.name }}</h2>
      <div v-if="list.cards.length > 0">
        <Card v-for="card in list.cards" :key="card.id" :card="card" />
      </div>
      <p v-else class="text-gray-500 mt-2">No cards in this list.</p>
    </div>
  </template>
  
  <script setup>
  import Card from './Card.vue';
  
  // define props
  const {list} = defineProps(['list']);
  console.log("list")
  console.log(list)
  </script>
  