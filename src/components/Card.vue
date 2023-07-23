<!-- Card.vue -->

<template>
  <!-- <CardModal @emitClose="showMore = false" v-if="showMore" /> -->
  <div class="card bg-white rounded-lg p-4 mt-2 shadow-md transition-shadow hover:shadow-xl" @click="handleShowMore">
    <h3 class="text-lg font-medium mb-2">{{ truncate(card.title, 50, '...') }}</h3>
    <div class="text-gray-600 mb-2">
      <p>{{ truncate(card.description, 50, '...') }}</p>
      <p v-if="card.due_date" class="mt-2 flex items-center">
        <i class="far fa-calendar-alt mr-1"></i> Due: {{ card.due_date }}
      </p>
    </div>
    <div v-if="card.card_members.length > 0">
      <div class="flex items-center mt-2">
        <i class="fas fa-user mr-1 text-gray-500"></i>
        <div v-for="member in card.card_members" :key="member.id" class="flex items-center mr-2">
          <img v-if="member.user.email"
            :src="`https://www.gravatar.com/avatar/${hashCode(member.user.email)}?s=24&d=identicon`"
            class="w-4 h-4 rounded-full mr-1" alt="Avatar" />
          <span class="text-sm">{{ member.user.username.slice(0, 2) }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-between mt-4">
      <div v-if="card.is_active" class="flex items-center">
        <i class="fas fa-check text-green-500 mr-2"></i>
        <span class="text-sm text-gray-500">Active</span>
      </div>
      <div v-else class="flex items-center">
        <i class="fas fa-times text-red-500 mr-2"></i>
        <span class="text-sm text-gray-500">Inactive</span>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import CardModal from './CardModal.vue';
import { useBoardStore } from '@/stores/boards.store';
import { ref } from 'vue';
import { toRefs } from 'vue';
import router from '@/router';



const props = defineProps(['card']);
const { card } = toRefs(props);

const boardStore = useBoardStore();
// let showMore = ref(false);

function truncate(text, length, suffix) {
  if (text.length > length) {
    return text.substring(0, length) + suffix;
  } else {
    return text;
  }
}

const handleShowMore = () => {
  // showMore.value = true;
  boardStore.setActiveCard(card.value);
  router.push({ name: 'CardDetails', params: {
    id: boardStore.fullBoard.id,
    cardId: card.value.id,  
   }});
};

// Function to generate hash code for email
const hashCode = (s) =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
</script>
  
<style>
/* Card Styles */
.card {
  border: 2px solid #ccc;
}

/* Font Awesome Icons */
i.fa-calendar-alt,
i.fa-user,
i.fa-check,
i.fa-times {
  font-size: 0.75rem;
}
</style>
  