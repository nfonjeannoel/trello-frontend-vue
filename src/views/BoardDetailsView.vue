<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-semibold">{{ board.name }}</h1>
          <div v-if="board.is_public" class="text-sm text-green-600">
            <i class="fas fa-globe-americas mr-1"></i> Public Board
          </div>
          <div v-else class="text-sm text-red-600">
            <i class="fas fa-lock mr-1"></i> Private Board
          </div>
        </div>
        <div class="flex items-center">
          <div v-for="(member, index) in displayedMembers" :key="index" class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {{ member[0].toUpperCase() }}
          </div>
          <div v-if="hasMoreMembers" class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            +
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 overflow-x-auto">
        <List v-for="list in board.lists" :key="list.id" :list="list" class="list" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBoardStore } from '@/stores/boards.store';
import List from '@/components/List.vue';

const boardStore = useBoardStore();
const route = useRoute();

onMounted(async () => {
  const boardId = route.params.id;
  await boardStore.getFullBoard(boardId);
});

// get a reference to the board
const board = computed(() => boardStore.fullBoard);

const MAX_DISPLAYED_MEMBERS = 5;
  const uniqueMembers = new Set();
// Display the first letters of the board members' usernames
const displayedMembers = computed(() => {
  

  // Loop through all the cards and collect unique members
  boardStore.fullBoard.lists?.forEach((list) => {
    list.cards?.forEach((card) => {
      card.card_members?.forEach((member) => {
        uniqueMembers.add(member.user.username);
      });
    });
  });

  // Convert the unique members set to an array
  const membersArray = Array.from(uniqueMembers);

  return membersArray.slice(0, MAX_DISPLAYED_MEMBERS);
});

// Check if there are more members beyond the first 5 displayed members
const hasMoreMembers = computed(() => {
  // If the number of unique members is greater than the max displayed members
  if (uniqueMembers.size > MAX_DISPLAYED_MEMBERS) {
    return true;
  }
  return false
});
</script>

<style>
/* ... Your other styles ... */

/* Flex container for the first letters of members */
.flex {
  display: flex;
  align-items: center;
}

/* Font Awesome Icons */
i.fa-globe-americas,
i.fa-lock {
  font-size: 0.75rem;
}
</style>