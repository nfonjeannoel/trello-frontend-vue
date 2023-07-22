<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-semibold mb-4">{{ board.name }}</h1>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="list in board.lists" :key="list.id" class="bg-white rounded-lg p-4 shadow">
          <h2 class="text-xl font-semibold mb-2">{{ list.name }}</h2>
          <div v-if="list.cards.length > 0">
            <div v-for="card in list.cards" :key="card.id" class="bg-gray-200 rounded-lg p-2 mt-2">
              <h3 class="text-lg font-medium mb-1">{{ card.title }}</h3>
              <p class="text-gray-600 mb-2">{{ card.description }}</p>
              <p v-if="card.due_date" class="text-sm text-gray-500">
                Due Date: {{ card.due_date }}
              </p>
              <div v-if="card.card_members.length > 0">
                <div v-for="member in card.card_members" :key="member.id" class="flex items-center mt-1">
                  <img
                    v-if="member.user.email"
                    :src="`https://www.gravatar.com/avatar/${hashCode(member.user.email)}?s=24&d=identicon`"
                    class="w-4 h-4 rounded-full mr-2"
                    alt="Avatar"
                  />
                  <span class="text-sm">{{ member.user.username }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 mt-2">No cards in this list.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBoardStore } from '@/stores/boards.store';

const boardStore = useBoardStore();
const route = useRoute();

onMounted(async () => {
  const boardId = route.params.id;
  await boardStore.getFullBoard(boardId);
  console.log(boardStore.fullBoard);
});

// get a reference to the board
const board = computed(() => boardStore.fullBoard);

// Function to generate hash code for email
const hashCode = (s) =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
</script>

<style>
/* Add any custom styles here if needed */
</style>
