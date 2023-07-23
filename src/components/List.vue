<!-- List.vue -->
<script setup>
import Card from './Card.vue';
import { useBoardStore } from '@/stores/boards.store';
import { defineProps } from 'vue';

const boardStore = useBoardStore();
// define props
const { list } = defineProps(['list']);

// watch for changes to the list

const onChangeTitle = (e) => {
  let newTitle = e.target.innerText.trim();

  // validate title 
  if (newTitle.length < 1) {
    console.log('Title must be at least 1 character.');
    e.target.innerText = list.name;
    return;
  }
  // if new title is the same as the old title, do nothing
  if (newTitle === list.name) {
    console.log('Title is the same.');
    // reset title
    e.target.innerText = list.name;
    return;
  }

  // console.log('New title: ', newTitle);
  // console.log('Old title: ', list.name);
  // update list title
  // FIXME: LIST.NAME IS NOT REACTIVE AND IS NOT UPDATING TO LATTEST VALUE
  boardStore.updateListTitle(list.id, boardStore.fullBoard.id, {
    name: newTitle,
    position: list.position // update position here?
  });


};

const handleEnterButton = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  }
};


</script>

<template>
  <div class="list-container">
    <div class="list bg-white rounded-lg p-4 shadow h-fit">
      <h2 class="text-xl font-semibold mb-2" contenteditable="true" @blur="onChangeTitle" @keypress="handleEnterButton">{{
        list.name }}</h2>
      <div v-if="list.cards.length > 0">
        <Card v-for="card in list.cards" :key="card.id" :card="card" />
      </div>
      <p v-else class="text-gray-500 mt-2">No cards in this list.</p>
    </div>
  </div>
</template>
  


  