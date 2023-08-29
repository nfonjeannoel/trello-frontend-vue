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
  <div class="column list-container" @drop="onDrop" @dragover="onDragOver">
    <div class="card">
      <div class="card-header mb-2" contenteditable="true" @dragover="onDragOver" @blur="onChangeTitle"
          @keypress="handleEnterButton">{{
            list.name }}
      </div>


      <div class="cards-container" >
        <div v-if="list.cards.length > 0"  > 
          <Card v-for="card in list.cards" :key="card.id" :card="card" 
            />
        </div>
        <div v-else class="p-5"></div>
      </div>

      <div class="card-footer text-body-secondary m-0 p-0">
        <button class="btn btn-sm w-100">+ Add Card</button>
      </div>
    </div>
  </div>
</template>
  


  