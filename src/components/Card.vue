<!-- Card.vue -->

<template>
  <div class="card mx-2 mb-2 "
  draggable="true"
  :class="{ 'scaler': isDragging }"
    @dragstart="onDragCard($event, card)" @click="handleShowMore"
    @dragend="onDragEnd"
  >
    <div class="mb-2 card-body p-2">
      <h6>{{ truncate(card.title, 50, '...') }}</h6>
      <!-- <p class="mb-0 pb-1">{{ truncate(card.description, 50, '...') }}</p> -->

      <div class="d-flex gap-1 justify-content-end" style="font-size: 12px;"  v-if="card.card_members?.length > 0">
        <span v-for="member in card.card_members" class="rounded-5 border p-1">{{ member.user.username.slice(0, 2).toUpperCase() }}</span>
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
  opacity: 0.8;
  /* Reduce opacity slightly on hover (you can adjust the value as needed) */
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  /* Add smooth transitions */
}
</style>
  