<!-- Card.vue -->

<template>
  <!-- <CardModal @emitClose="showMore = false" v-if="showMore" /> -->
  <div class="card bg-white rounded-lg p-4 mt-2 shadow-md transition-shadow hover:shadow-xl"
   draggable="true"
  :class="{ 'scaler': isDragging }"
    @dragstart="onDragCard($event, card)" @click="handleShowMore"
    @dragend="onDragEnd">
    
    <h3 class="text-lg font-medium mb-2">{{ truncate(card.title, 50, '...') }}</h3>
    <div class="text-gray-600 mb-2">
      <!-- <p>{{ truncate(card.description, 50, '...') }}</p> -->
      <p v-if="card.due_date" class="mt-2 flex items-center">
        <i class="far fa-calendar-alt mr-1"></i> Due: {{ card.due_date }}
      </p>
    </div>
    <div v-if="card.card_members?.length > 0">
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
let isDragging = ref(false);


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
  router.push({
    name: 'CardDetails', params: {
      id: boardStore.fullBoard.id,
      cardId: card.value.id,
    }
  });
};

const onDragCard = (e, card) => {
  const data = {
    cardId: card.id,
    oldListId: card.list_id,
  }
  e.dataTransfer.setData('text/plain', JSON.stringify(data));
  isDragging.value = true;
};

function onDragEnd() {
      // Remove the class when dragging ends
      isDragging.value = false;
    }

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

/* Add a nice shadow transition for the card */
/* Apply custom styles when dragging */
.scaler:hover {
  transform: scale(1.1) rotate(2deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: grabbing;
  opacity: 0.8; /* Reduce opacity slightly on hover (you can adjust the value as needed) */
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease; /* Add smooth transitions */
}

</style>
  