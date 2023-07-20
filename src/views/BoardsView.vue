<script setup>
import { ref, onMounted } from 'vue'
import { useBoardStore } from '@/stores/boards.store';
import { useRouter } from 'vue-router'
import { RouterLink } from "vue-router";
const boardStore = useBoardStore();
const router = useRouter()

onMounted(() => {
    boardStore.getMyBoards()
})


</script>

<template>
    <main class="md:mt-16 mt-0 ">
        <div class="flex items-center justify-center">
            <div class="container mx-auto">
                <section class="max-w-md  p-4 bg-gradient-to-r from-gray-200 to-white-100 rounded-lg shadow-lg mx-auto">
                    <!-- No Boards -->
                    <div p-5 v-if="boardStore.myBoards.length == 0">
                        <h2 class="text-2xl font-semibold mb-4 text-center">No Boards</h2>
                    </div>
                    <!-- Display boards -->
                    <div v-else class="p-5 ">
                        <h2 class="text-2xl font-semibold mb-4 text-center">My Boards</h2>
                        <div class="grid gap-4">
                            <!-- Board Card 1 -->
                            <RouterLink :to="`/board/${board.id}`" v-for="board in boardStore.myBoards" :key="board.id"
                                class="board-card bg-white rounded-lg overflow-hidden shadow p-4 transition-transform transform hover:scale-105">
                                <div class="flex items-center">
                                    <img src="https://picsum.photos/12/12" alt="Board Illustration"
                                        class="w-12 h-12 rounded-full mr-4">
                                    <h3 class="text-lg font-semibold">{{ board.name }}</h3>
                                    <span class="ml-auto text-green-500">
                                        <!-- Render a small icon for public boards -->
                                        <!-- You can replace this icon with your preferred public icon or use an SVG -->
                                        <svg v-if="board.is_public" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                                            viewBox="0 0 20 20" fill="green">
                                            <path
                                                d="M9 3a1 1 0 012 0v3.586l3.707-3.707a1 1 0 111.414 1.414L10 9.414l-4.121-4.12a1 1 0 111.415-1.414L9 6.586V3zm9 6a9 9 0 11-18 0 9 9 0 0118 0zm-3.293 3.293a1 1 0 010 1.414L10 17.414l-4.293-4.293a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 0z" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                                            fill="red">
                                            <path
                                                d="M9 3a1 1 0 012 0v3.586l3.707-3.707a1 1 0 111.414 1.414L10 9.414l-4.121-4.12a1 1 0 111.415-1.414L9 6.586V3zm9 6a9 9 0 11-18 0 9 9 0 0118 0zm-3.293 3.293a1 1 0 010 1.414L10 17.414l-4.293-4.293a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </span>
                                </div>
                            </RouterLink>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    </main>
</template>
  
<style scoped>
/* Add custom styles here */
.board-card:hover {
    /* Add styles for the hover effect */
    /* For example, you can change the border color or background color */
    border-color: #4fd1c5;
    background-color: #f0f4f8;


}
</style>
  

