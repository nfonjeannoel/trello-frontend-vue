<script setup>
import CardModal from '../components/CardModal.vue';
import { useBoardStore } from '@/stores/boards.store';
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue';
import router from "@/router";

const boardStore = useBoardStore();

const closeCard = () => {
    boardStore.setActiveCard(null);
    router.push({ name: 'BoardDetails', params: { id: boardStore.fullBoard.id } });

};

</script>

<template>
    <CardModal @close="closeCard" />
</template>