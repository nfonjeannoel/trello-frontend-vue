<script setup>
import CardModal from '../components/CardModal.vue';
import { useBoardStore } from '@/stores/boards.store';
import { useUsersStore } from '@/stores/users.store';
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref } from 'vue';
import router from "@/router";
import { useRoute } from 'vue-router';

const boardStore = useBoardStore();
const userStore = useUsersStore();
const route = useRoute();
const comment = ref('');

// ISSUE
// when adding comment, save it as html
const { card } = storeToRefs(boardStore);
const list = computed(() => boardStore.fullBoard?.lists?.find(list => list.id === card.value.list_id));
const boardMembers = computed(() => boardStore.fullBoard?.board_members);
const addingCheckList = ref(false);
const newChecklist = ref('');

// create computed messages property. This property will hold card comments and card activities.
// Parse the date created and sort them by date created. newest first

const messages = computed(() => {
    const comments = boardStore.card.comments;
    const activities = boardStore.card.card_activities;
    if (comments || activities) {
        console.log('comments', comments);
        console.log('activities', activities);
        const combined_messages = [...(comments || []), ...(activities || [])];
        combined_messages.sort((a, b) => new Date(b.created_datetime) - new Date(a.created_datetime));
        return combined_messages;
    }
});


const closeCard = () => {
    // boardStore.setActiveCard(null);
    router.push({ name: 'BoardDetails', params: { id: boardStore.fullBoard.id } });
};

const addComment = async () => {
    if (comment.value.length < 1) {
        console.log('Comment must be at least 1 character.');
        return;
    }
    const newComment = {
        comment: comment.value,
    };
    await boardStore.addComment(newComment);
    comment.value = '';
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

const addCheckList = async () => {
    if (newChecklist.value.length < 1) {
        console.log('Title must be at least 1 character.');
        return;
    }
    const newChecklistObj = {
        title: newChecklist.value,
        position: 0,
        is_checked: false
    };
    await boardStore.addCheckList(newChecklistObj);
    newChecklist.value = '';
    addingCheckList.value = false;
};


const deleteChecklist = async (e, checklistId) => {
    e.preventDefault();
    await boardStore.deleteCheckList(checklistId);
};

const deleteMessage = async (messageId) => {
    await boardStore.deleteMessage(messageId);
};

const toggleEditComment = async (comment) => {
    comment.editingMessage = !comment.editingMessage;
};

const UpdateMessage = async (message) => {
    let newMessage = document.getElementById(`message${message.id}`).innerHTML.trim();
    // if new title is the same as the old title, do nothing
    if (newMessage === message.comment) {
        console.log('Message is the same.');
        // reset title
        document.getElementById(`message${message.id}`).innerText = message.comment;
    } else {

        await boardStore.updateMessage({
            comment: newMessage,
            id: message.id
        });
    }
    toggleEditComment(message);
};

const discardComment = (message) => {
    document.getElementById(`message${message.id}`).innerHTML = message.comment;
    toggleEditComment(message);
};

function validateText(e, text) {
    // validate title 
    if (text.length < 1) {
        console.log('Title must be at least 1 character.');
        e.target.innerText = list.value.name;
        false;
    }

    return true;
}

const showInput = ref(false);
const labelName = ref('');
const labelColor = ref('#000000');
const editingLabel = ref(false);
let currentLabelId = null;
let cardLabelId = null;


const showMembers = ref(false);

const toggleShowMembers = () => {
    showMembers.value = !showMembers.value;
};

const editLabel = (label) => {
    // Set the editingLabel flag to true to indicate that we are editing an existing label
    editingLabel.value = true;
    currentLabelId = label.board_label.id;
    cardLabelId = label.id;

    // Populate the input fields with the label name and color
    labelName.value = label.board_label.name;
    labelColor.value = label.board_label.color;

    // Show the input section
    showInput.value = true;
};

function resetFilds() {
    labelName.value = '';
    labelColor.value = '#000000';
    showInput.value = false;
    editingLabel.value = false;
    currentLabelId = null;
    cardLabelId = null;
}

const addOrUpdateLabel = () => {
    // Assuming you have a method to add the new label to the card.labels array
    if (editingLabel.value) {
        // Update the label if editing an existing one
        boardStore.updateBoardLabel(currentLabelId, {
            name: labelName.value,
            color: labelColor.value
        });
    } else {

        const board_label = {
            name: labelName.value,
            color: labelColor.value
        }

        boardStore.addBoardLabel(board_label);
    }


    // Reset the input fields and hide the input section
    resetFilds();
};


const deleteCardLabel = () => {
    // Assuming you have a method to remove the label from the card.labels array
    boardStore.deleteCardLabel(cardLabelId);

    // Reset the input fields and hide the input section
    resetFilds();
};

const onChangeTitle = (e) => {
    let newTitle = e.target.innerText.trim();
    if (!validateText(e, newTitle)) return;
    if (newTitle === card.value.title) {
        console.log('Title is the same.');
        // reset title
        e.target.innerText = card.value.title;
        return
    }
    boardStore.updateCardTitle({
        title: newTitle,
    });

}


const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
};

const onChangeDescription = (e) => {
    let newDescription = e.target.innerHTML.trim();
    if (!validateText(e, newDescription)) return;

    if (newDescription === card.value.description) {
        console.log('description is the same.');
        // reset title
        e.target.innerHTML = card.value.description;
        return
    }

    boardStore.updateCardDescription({
        description: newDescription,
    });
}


const toggleShowInput = () => {
    if (!showInput.value) {
        // Reset the input fields
        resetFilds();
    }
    showInput.value = !showInput.value;
};


const isMemberOfCard = (memberId) => {
    return card.value.card_members.some(member => member.user.id === memberId);
};

const toggleMember = (member) => {
    if (isMemberOfCard(member.user.id)) {
        boardStore.removeMemberFromCard(member.user.email);
    } else {
        boardStore.addMemberToCard(member.user.email);
    }
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
                        <h1 class="text-2xl font-bold" @blur="onChangeTitle" contenteditable="true"
                            @keypress="handleEnterButton">{{ card.title }}</h1>
                        <p>in list - <b class="mr-2">{{ list?.name }}</b>
                            <i v-if="card.is_active" class="fas fa-eye"></i>
                            <i v-else class="fas fa-eye-slash"></i>
                        </p>
                    </div>

                    <!-- members -->

                    <div class="flex justify-start items-center space-x-8">
                        <div>
                            <b>Members </b>
                            <i v-if="showMembers" class="fa fa-close" style="color: green;" @click="toggleShowMembers"></i>
                            <i v-else class="fa fa-add" style="color: green;" @click="toggleShowMembers"></i>
                            <div v-show="showMembers" class="p-2">
                                <!-- checkbox for each member of the board. If user is member of card, it shoul dbe checked -->
                                <div v-for="member in boardMembers" :key="member.id" class="flex items-center">
                                    <input type="checkbox" :checked="isMemberOfCard(member.user.id)"
                                        @change="toggleMember(member)">
                                    <p class="ml-2">{{ member.user.username }}</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mr-10 h-7">

                                <div v-for="member in card.card_members" :key="member.id"
                                    v-if="card.card_members?.length > 0"
                                    class="w-7 h-7 rounded-full bg-blue-500 text-white mr-1 flex items-center justify-center font-semibold">
                                    {{ member.user.username.slice(0, 2).toUpperCase() }}
                                </div>

                            </div>
                        </div>
                        <div>
                            <b>Labels </b>
                            <i v-if="showInput" class="fa fa-close" style="color: green;" @click="toggleShowInput"></i>
                            <i v-else class="fa fa-add" style="color: green;" @click="toggleShowInput"></i>
                            <div v-show="showInput" class="p-2">
                                <input v-model="labelName" placeholder="Label Name" />
                                <input type="color" v-model="labelColor" class="me-2" />
                                <button @click="addOrUpdateLabel" class="font-bold mr-2">{{ editingLabel ? 'Update Label' :
                                    'Add Label' }}</button>
                                <button v-if="editingLabel" @click="deleteCardLabel" class="font-bold">Delete</button>
                            </div>
                            <div class="flex justify-between items-center mr-10 h-7">
                                <div v-for="label in card.labels" :key="label.id" v-if="card.labels?.length > 0"
                                    :style="{ backgroundColor: label.board_label.color }" @click="editLabel(label)"
                                    class="h-7 text-white mr-1 flex items-center justify-center font-semibold mx-1 px-1">
                                    {{ label.board_label.name }}
                                </div>
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
                        <div class="flex items-center space-x-4" v-if="card.reminder_datetime">
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
                        <p class="text-gray-600 mb-4" @blur="onChangeDescription" contenteditable="true"
                            v-html="card.description">
                        </p>
                    </div>


                </div>
            </div>
        </template>
        <template v-slot:body>
            <div class="max-w-md w-full space-y-8">
                <div>
                    <h2 class="text-lg font-bold mb-2">Check lists <i v-if="addingCheckList"
                            @click="addingCheckList = false" class="fa fa-close hover:cursor-pointer"
                            style="color: green; "></i> <i v-else @click="addingCheckList = true"
                            class="fa fa-add hover:cursor-pointer" style="color: green; "></i>
                    </h2>
                    <ul class="list-disc list-inside space-y-2">
                        <!-- Vue loop through checklists -->

                        <label v-show="addingCheckList" class="flex items-center space-x-2">
                            <div class="flex items-center ">
                                <input type="text" id="small-input" v-model="newChecklist"
                                    class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500">
                                <button @click="addCheckList"
                                    class="block py-1 px-2 text-white bg-blue-500 rounded hover:bg-blue-600 md:mx-2 md:my-0"
                                    aria-current="page">Add</Button>
                            </div>
                        </label>
                        <li v-for="checklist in card.check_lists" :key="checklist.id" class="list-none">
                            <label class="flex items-center ">
                                <input type="checkbox" @change="onCheckList(checklist)" :checked="checklist.is_checked"
                                    class="form-checkbox">
                                <div class="flex items-center justify-between space-x-4">
                                    <span class="ml-3 ">{{ checklist.title }}</span>
                                    <p><i @click="deleteChecklist($event, checklist.id)"
                                            class="fa fa-trash hover:cursor-pointer"></i></p>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>

                <!-- Comments -->
                <div>
                    <h2 class="text-lg font-bold mb-2">Comments</h2>
                    <label class="flex items-center space-x-2">
                        <div class="flex items-center ">
                            <textarea type="text" id="small-input" v-model="comment"
                                class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></textarea>
                            <button @click="addComment"
                                class="block py-1 px-2 text-white bg-blue-500 rounded hover:bg-blue-600 md:mx-2 md:my-0"
                                aria-current="page">Send</Button>
                        </div>
                    </label>
                    <ul class="space-y-2 my-2">
                        <!-- Vue loop through comments -->
                        <div v-for="comment in messages" :key="comment.id"
                            class="">
                            <div v-if="comment.activity">
                                <p>{{comment.activity}} -- {{comment.created_datetime}}</p>
                            </div>
                            <div v-else class="mb-3 border p-2 flex justify-between w-[600px]">

                                <li>
                                    <div class="flex space-x-2">
                                        <div class="text-gray-600">
                                            <i class="fas fa-comment"></i>
                                        </div>
                                        <p class="text-gray-600">{{ comment.created_datetime }}</p>
                                    </div>
                                    <div class="flex items-center mb-2">
                                        <div
                                            class="w-7 h-7 rounded-full bg-blue-500 text-white mr-1 flex items-center justify-center font-semibold">
                                            {{ comment.user.username.slice(0, 2).toUpperCase() }}
                                        </div>
                                        <p :id="`message${comment.id}`"
                                            class="text-gray-600 ps-3 whitespace-wrap break-words max-w-[500px]"
                                            :contenteditable="comment.editingMessage" v-html="comment.comment"></p>
                                    </div>
                                    <button v-show="comment.editingMessage" @click="discardComment(comment)"
                                        class="block py-1 px-2 text-white bg-blue-500 rounded hover:bg-blue-600 md:mx-2 md:my-0">Discard
                                        changes</button>

                                </li>
                                <div v-if="userStore.user.id === comment.user_id" class="space-y-2">
                                    <span @click="deleteMessage(comment.id)" class="hover:cursor-pointer"><i
                                            class="fa fa-trash"></i></span>
                                    <div v-if="comment.editingMessage">
                                        <div @click="UpdateMessage(comment)" class="hover:cursor-pointer">
                                            <i class="fa fa-paper-plane"></i>
                                        </div>

                                    </div>
                                    <div v-else>
                                        <div @click="toggleEditComment(comment)" class="hover:cursor-pointer">
                                            <i class="fa fa-edit"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </ul>
                </div>
            </div>
        </template>
        <!-- <template v-slot:footer>
        footer

        </template> -->
    </CardModal>
</template>