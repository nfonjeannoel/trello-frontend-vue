<!-- List.vue -->
<script setup>
import Card from './Card.vue';
import { useBoardStore } from '@/stores/boards.store';
import { toRefs, ref } from 'vue';

const boardStore = useBoardStore();
// define props
const props = defineProps(['list']);

// destructure props
const { list } = toRefs(props);

let creatingCard = ref(false);
let newCardTitle = ref('');

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


function resetNewCard() {
  newCardTitle.value = '';
  creatingCard.value = false;
}

function createCard() {
  if (newCardTitle.value.length < 1) {
    console.log('Title must be at least 1 character.');
    return;
  }

  boardStore.createCard(newCardTitle.value, list.value.id);

  resetNewCard();


}

function discardNewCard() {
  resetNewCard();
}

function deleteList() {
  boardStore.deleteList(list.value.id);
}

</script>

<template>
  <div class="column list-container" @drop="onDrop" @dragover="onDragOver">
    <div class="card">
      <div class="d-flex card-header mb-2">
        <div class=" flex-grow-1" contenteditable="true" @dragover="onDragOver" @blur="onChangeTitle"
          @keypress="handleEnterButton">{{
            list.name }}
        </div>
        <div>
          <button class="btn btn-sm btn-light" @click="deleteList">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>


      <div class="cards-container">
        <div v-if="list.cards.length > 0">
          <Card v-for="card in list.cards" :key="card.id" :card="card" />
        </div>
        <div v-else class="p-5"></div>
      </div>

      <div class="card-footer text-body-secondary m-0 p-0">

        <div v-if="creatingCard" class="py-3 px-2">
          <input type="text" class="input-group input-sm px-2" placeholder="Enter card title" v-model="newCardTitle">
          <div class="d-flex gap-1 my-2">
            <button @click="createCard" class="btn btn-primary btn-sm w-100">Create </button>
            <button @click="discardNewCard" class="btn btn-danger btn-sm w-100">Discard</button>
          </div>
        </div>

        <button v-else @click="creatingCard = true" class="btn btn-sm w-100">+ Add Card</button>
      </div>
    </div>
  </div>
  
</template>
  


  