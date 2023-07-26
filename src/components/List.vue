<!-- List.vue -->
<script setup>
import Card from './Card.vue';
import { useBoardStore } from '@/stores/boards.store';
import { toRefs } from 'vue';

const boardStore = useBoardStore();
// define props
const props = defineProps(['list']);

// destructure props
const { list } = toRefs(props);

// watch for changes to the list

const onChangeTitle = (e) => {
  let newTitle = e.target.innerText.trim();

  // validate title 
  if (newTitle.length < 1) {
    console.log('Title must be at least 1 character.');
    e.target.innerText = list.value.name;
    return;
  }
  // if new title is the same as the old title, do nothing
  if (newTitle === list.value.name) {
    console.log('Title is the same.');
    // reset title
    e.target.innerText = list.value.name;
    return;
  }


  boardStore.updateListTitle(list.value.id, boardStore.fullBoard.id, {
    name: newTitle,
    position: list.value.position // update position here?
  });


};

const handleEnterButton = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  }
};

const onDrop = (e) => {
  e.preventDefault();
  const jsonData = e.dataTransfer.getData('text/plain');
  const { cardId, oldListId } = JSON.parse(jsonData);
  const newListId = list.value.id;

  // if (oldListId === newListId) {
  //   return;
  // }

  boardStore.updateCardListId(cardId, newListId, oldListId);
};

const onDragOver = (e) => {
  e.preventDefault();
};


</script>

<template>
  <div class="list-container">
    <div class="list bg-white rounded-lg p-4 shadow h-fit">
      <h2 class="text-xl font-semibold mb-2" contenteditable="true" @dragover="onDragOver" @blur="onChangeTitle"
        @keypress="handleEnterButton">{{
          list.name }}</h2>
      <div class="cards-container" @drop="onDrop" @dragover="onDragOver">
        <div v-if="list.cards.length > 0">
          <Card v-for="card in list.cards" :key="card.id" :card="card" />
        </div>
        <p v-else class="text-gray-500 mt-2">No cards in this list.</p>
      </div>
    </div>
  </div>
</template>
  


  