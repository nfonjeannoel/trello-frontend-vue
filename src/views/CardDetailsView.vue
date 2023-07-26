<script setup>
import CardModal from '../components/CardModal.vue';
import { useBoardStore } from '@/stores/boards.store';
import { storeToRefs } from 'pinia'
import { onMounted, computed } from 'vue';
import router from "@/router";
import { useRoute } from 'vue-router';

const boardStore = useBoardStore();
const route = useRoute();

const { card } = storeToRefs(boardStore);
const list = computed(() => boardStore.fullBoard?.lists?.find(list => list.id === card.value.list_id));

const closeCard = () => {
    // boardStore.setActiveCard(null);
    router.push({ name: 'BoardDetails', params: { id: boardStore.fullBoard.id } });
};

onMounted(async () => {
    const cardId = route.params.cardId;
    const boardId = route.params.id;
    await boardStore.getFullCard(cardId, boardId);
});


const onCheckList = async (checklist) => {
    checklist.is_checked = !checklist.is_checked;
    await boardStore.updateCheckList(checklist);
};


</script>

<template>
    <CardModal @close="closeCard">
        <template v-slot:header>
            <div class="w-full ">
                <div class="flex items-center justify-between">
                    <div></div>
                    <button class="text-black" @click="closeCard">
                        <i class="fas fa-close"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <h1 class="text-2xl font-bold">{{ card.title }}</h1>
                        <p>in list - <b class="mr-2">{{ list?.name }}</b>
                            <i v-if="card.is_active" class="fas fa-eye"></i>
                            <i v-else class="fas fa-eye-slash"></i>
                        </p>
                    </div>

                    <!-- members -->

                    <div class="flex justify-start items-center">
                        <div>
                            <b>Members</b>
                            <div class="flex justify-between items-center mr-10 h-7">

                                <div v-for="member in card.card_members" :key="member.id"
                                    v-if="card.card_members?.length > 0"
                                    class="w-7 h-7 rounded-full bg-blue-500 text-white mr-1 flex items-center justify-center font-semibold">
                                    {{ member.user.username.slice(0, 2).toUpperCase() }}
                                </div>
                                <i class="fa fa-add" style="color: green; "></i>
                            </div>
                        </div>
                        <div>
                            <b>Labels</b>
                            <div class="flex justify-between items-center mr-10 h-7">

                                <div v-for="label in card.label" :key="label.id" v-if="card.label?.length > 0"
                                    class="w-7 h-7 rounded-full bg-blue-500 text-white mr-1 flex items-center justify-center font-semibold">
                                    label
                                </div>
                                <i class="fa fa-add" style="color: green; "></i>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-start">
                        <!-- Icons -->
                        <div class="flex items-center space-x-4 mr-10" v-if="card.due_date">
                            <div class="flex items-center">
                                <!-- Due Date Icon -->
                                <div class="text-gray-600 mr-3">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <p class="text-gray-600">{{ card.due_date }}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4" v-if=" card.reminder_datetime">
                            <div>
                                <!-- Reminder Icon -->
                                <div class="text-gray-600 mr-3">
                                    <i class="fas fa-bell"></i>
                                </div>
                                <p class="text-gray-600">{{ card.reminder_datetime }}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <b>Description</b>
                        <p class="text-gray-600 mb-4">{{ card.description }}</p>
                    </div>


                </div>
            </div>
        </template>
        <template v-slot:body>
            <div class="max-w-md w-full space-y-8">
                <div>
                    <h2 class="text-lg font-bold mb-2">Checklists</h2>
                    <ul class="list-disc list-inside space-y-2">
                        <!-- Vue loop through checklists -->
                        <li v-for="checklist in card.check_lists" :key="checklist.id" class="list-none">
                            <label class="flex items-center space-x-2">
                                <input type="checkbox"  @change="onCheckList(checklist)" :checked="checklist.is_checked" class="form-checkbox">
                                <span>{{ checklist.title }}</span>
                            </label>
                        </li>
                    </ul>
                </div>

                <!-- Comments -->
                <div>
                    <h2 class="text-lg font-bold mb-2">Comments</h2>
                    <ul class="space-y-2">
                        <!-- Vue loop through comments -->
                        <li v-for="comment in card.comments" :key="comment.id" class="flex space-x-2">
                            <div class="text-gray-600">
                                <i class="fas fa-comment"></i>
                            </div>
                            <p class="text-gray-600">{{ comment.comment }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
        <!-- <template v-slot:footer>
        footer

        </template> -->
    </CardModal>
</template>