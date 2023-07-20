<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBoardStore } from '@/stores/boards.store';

const boardStore = useBoardStore();
const route = useRoute();

onMounted(async () => {
    const boardId = route.params.id;
    console.log(boardId);
    // await boardStore.getFullBoard(boardId);
});

// const board = computed(() => boardStore.getBoardById(route.params.id));

</script>
  
<template>
    <div>

        <h2>{{ route.params.id }}</h2>
        <!-- Display other board details as needed -->
    </div>
</template>