<script setup>
import CardModal from '../components/CardModal.vue';
import { useBoardStore } from '@/stores/boards.store';
import { useUsersStore } from '@/stores/users.store';
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref, onBeforeUnmount } from 'vue';
import router from "@/router";
import { useRoute } from 'vue-router';

onMounted(() => {
    document.body.classList.add('modal-open');

    // Apply inline styles
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px';


});

onBeforeUnmount(() => {
    document.body.classList.remove('modal-open');

    // Reset inline styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

});

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
const showActivity = ref(false);

// create computed messages property. This property will hold card comments and card activities.
// Parse the date created and sort them by date created. newest first

const messages = computed(() => {
    const comments = boardStore.card.comments;
    const activities = boardStore.card.card_activities;
    if (comments || activities) {
        // console.log('comments', comments);
        // console.log('activities', activities);
        let combined_messages;
        if (showActivity.value) {
            combined_messages = [...(comments || []), ...(activities || [])];
        } else {
            combined_messages = [...(comments || [])];
        }

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

const onChangeTodoTitle = (e, todo) => {
    let newTitle = e.target.innerText.trim();
    if (!validateText(e, newTitle)) return;

    // console.log("new title", newTitle)
    // console.log("todo", todo)

    // if new title is the same as the old title, do nothing
    if (newTitle === todo.title) {
        console.log('Title is the same.');
        // reset title
        e.target.innerText = todo.title;
        return
    }

    boardStore.updateTodoTitle(newTitle, todo);

}

const toggleEditComment = async (comment) => {
    comment.editingMessage = !comment.editingMessage;
};

const UpdateMessage = async (message) => {
    let newMessage = document.getElementById(`message${message.id}`).value;
    console.log("new message", newMessage)
    // if new title is the same as the old title, do nothing
    if (newMessage === message.comment) {
        console.log('Message is the same.');
        // reset title
        document.getElementById(`message${message.id}`).innerHTML = message.comment;
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

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

const formattedDate = (createdDatetime) => {
    const apiDate = new Date(createdDatetime);
    const currentDate = new Date();
    const timeDifference = currentDate - apiDate;

    if (timeDifference < minute) {
        return "Just now";
    } else if (timeDifference < hour) {
        return `${Math.floor(timeDifference / minute)} minute${timeDifference < 2 * minute ? '' : 's'} ago`;
    } else if (timeDifference < day) {
        return `${Math.floor(timeDifference / hour)} hour${timeDifference < 2 * hour ? '' : 's'} ago`;
    } else if (timeDifference < week) {
        const daysAgo = Math.floor(timeDifference / day);
        return daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;
    } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return apiDate.toLocaleDateString(undefined, options);
    }
};


const formatDateTime = (dateTime) => {
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(dateTime);
    return formattedDateTime;
};


function truncate(text, length, suffix) {
  if (text.length > length) {
    return text.substring(0, length) + suffix;
  } else {
    return text;
  }
}


function ArchiveCard() {
    boardStore.archiveCard();
    closeCard();
}





</script>

<template>
    <div class="modal fade show modal-fullscreen modal-lg d-block" aria-modal="true" role="dialog"
        id="exampleModalCenteredScrollable" tabindex="100" aria-labelledby="exampleModalCenteredScrollableTitle"
        style="backdrop-filter: blur(1px);">

        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content ">
                <!-- <div class="modal-header pb-2 px-3 px-lg-5">
                                
                            </div> -->


                <div class="modal-body align-top ps-3 ps-lg-5" style="min-height: 50vh;">
                    <div class="d-flex justify-content-between flex-grow-1">
                        <div class="w-100">
                            <h1 class=" fs-4 me-1 me-md-2 fw-bold w-100" @blur="onChangeTitle" contenteditable="true"
                                @keypress="handleEnterButton" id="exampleModalCenteredScrollableTitle">{{ card.title }}</h1>
                            <p>in list - <b class="me-3">{{ list?.name }}</b>
                                <i v-if="card.is_active" class="fas fa-eye"></i>
                                <i v-else class="fas fa-eye-slash"></i>
                            </p>
                        </div>

                        <button type="button" class="btn-close" @click="closeCard" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="row">
                        <div class="col col-12 col-lg-9">
                            <!-- top -->
                            <div class="d-flex py-0 py-lg-3 flex-grow-0 flex-wrap gap-3 gap-lg-5">
                                <!-- members -->

                                <div class="me-2">
                                    <span class="fw-bold me-2">Members</span>

                                    <i v-if="showMembers" class="fa fa-close" style="color: green;"
                                        @click="toggleShowMembers"></i>
                                    <i v-else class="fa fa-add" style="color: green;" @click="toggleShowMembers"></i>
                                    <div v-show="showMembers" class="p-2 mb-3" style="max-height: 150px; overflow-y: auto;">
                                        <!-- checkbox for each member of the board. If user is member of card, it shoul dbe checked -->
                                        <div v-for="member in boardMembers" :key="member.id"
                                            class="d-flex gap-2 justify-content-start align-items-center">
                                            <input type="checkbox" :checked="isMemberOfCard(member.user.id)"
                                                @change="toggleMember(member)">
                                            <span class="ml-2">{{ member.user.username }}</span>
                                        </div>
                                    </div>

                                    <div class="d-flex flex-wrap gap-1 " style="font-size: 12px;">
                                        <span v-for="member in card.card_members" :key="member.id"
                                            v-if="card.card_members?.length > 0"
                                            class="rounded-5 border p-1 bg-primary fw-bold">
                                            {{ member.user.username.slice(0, 2).toUpperCase() }}
                                        </span>
                                        <!-- add new member -->
                                        <span @click="toggleShowMembers" class="rounded-5 border p-1 bg-light fw-bold"><i
                                                class="bi bi-plus-lg"></i></span>
                                    </div>


                                </div>
                                <!-- labels -->
                                <div class="me-2">
                                    <span class="fw-bold me-2">Labels</span>

                                    <i v-if="showInput" class="fa fa-close" style="color: green;"
                                        @click="toggleShowInput"></i>
                                    <i v-else class="fa fa-add" style="color: green;" @click="toggleShowInput"></i>
                                    <div v-show="showInput" class="p-2 mb-2">
                                        <div class="d-flex mb-2">
                                            <input v-model="labelName" placeholder="Label Name"
                                                class="form-control form-control-sm d-inline flex-2" />
                                            <input type="color" v-model="labelColor"
                                                class="me-2 form-control form-control-sm d-inline flex-1" />
                                        </div>
                                        <button @click="addOrUpdateLabel" class="fw-bold btn btn-sm btn-light me-2 ">{{
                                            editingLabel ?
                                            'UpdateLabel' : 'Add Label' }}</button>
                                        <button v-if="editingLabel" @click="deleteCardLabel"
                                            class="fw-bold btn btn-sm btn-light">Delete</button>
                                    </div>

                                    <div class="d-flex flex-wrap gap-1" style="font-size: 12px;">
                                        <div v-for="label in card.labels" :key="label.id" v-if="card.labels?.length > 0"
                                            :style="{ backgroundColor: label.board_label.color }" @click="editLabel(label)"
                                            class="btn btn-primary btn-sm">
                                            {{ label.board_label.name }}
                                        </div>

                                        <!-- add label -->
                                        <div class="btn bg-light btn-sm" @click="toggleShowInput"><i
                                                class="bi bi-plus-lg"></i></div>
                                    </div>

                                </div>
                                <!-- due date -->
                                <div class="me-2">
                                    <span class="fw-bold">Due date</span>
                                    <div>
                                        <span>
                                            <input type="checkbox" class="" name="" id="">
                                        </span>
                                        <button type="button"
                                            class="btn btn-light btn-sm d-inline-flex align-items-center">Today at 5pm <span
                                                class="ms-2 badge rounded bg-danger">overdue</span> <i
                                                class="ms-2 bi bi-chevron-down"></i></button>
                                    </div>
                                </div>
                            </div>

                            <!-- checklist -->
                            <div>
                                <span class="text-lg fw-bold mb-2">Check lists <i v-if="addingCheckList"
                                        @click="addingCheckList = false" class="fa fa-close hover:cursor-pointer"
                                        style="color: green; "></i> <i v-else @click="addingCheckList = true"
                                        class="fa fa-add hover:cursor-pointer" style="color: green; "></i>
                                </span>
                                <ul class="px-0">
                                    <!-- Vue loop through checklists -->

                                    <label v-show="addingCheckList" class="flex items-center gap-2">
                                        <div class="d-flex mb-2 ">
                                            <input type="text" id="small-input" v-model="newChecklist"
                                                class="form-control form-control-sm me-2">
                                            <button @click="addCheckList" class="btn btn-sm btn-light px-2"
                                                aria-current="page">Add</Button>
                                        </div>
                                    </label>
                                    <ul class="list-group py-0">

                                        <li v-for="checklist in card.check_lists" :key="checklist.id"
                                            class="list-group-item d-flex py-0 justify-content-between align-items-center py-1 text-wrap">
                                            <div class="d-flex gap-2 flex-grow-1">
                                                <input type="checkbox" @change="onCheckList(checklist)"
                                                    :checked="checklist.is_checked" class="">
                                                <div class="ml-3 flex-grow-1 w-100 px-2 text-wrap"  @blur="onChangeTodoTitle($event, checklist)" contenteditable="true"
                                                    @keypress="handleEnterButton">{{ truncate(checklist.title, 50, '...') }}</div>
                                            </div>


                                            <p class="mb-0"><i @click="deleteChecklist($event, checklist.id)"
                                                    class="fa fa-trash "></i></p>

                                        </li>
                                    </ul>

                                </ul>
                            </div>

                            <!-- description -->
                            <div>
                                <div class=" py-2">
                                    <div class="d-flex flex-grow-1 justify-content-between">
                                        <span class="fw-bold">Description</span>
                                        <button class="btn btn-sm btn-light">Edit</button>
                                    </div>
                                </div>
                                <div>
                                    <p @blur="onChangeDescription" contenteditable="true" v-html="card.description"></p>
                                </div>
                            </div>
                            <!-- attachments -->
                            <div>
                                <div class=" py-3">
                                    <div class="">
                                        <span class="fw-bold">Attachments</span>
                                    </div>
                                </div>
                                <div class="mb-2 mb-lg-3">
                                    <div class="row mx-1 mx-lg-0">
                                        <div
                                            class="col-3 d-flex justify-content-center align-items-center bg-light px-3 py-2 px-lg-5 py-lg-4 ">
                                            <span class="p-0 fw-bold fs-3">py</span>
                                        </div>
                                        <div class="col-9 px-3 py-2  bg-light-subtle">
                                            <span class="fw-bold">new app json.py</span>
                                            <p>uploaded 2 days ago</p>
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <button class="btn btn-light btn-sm mx-1 mx-lg-0">Add
                                        attachment</button>
                                </div>
                            </div>



                            <!-- activity -->
                            <div>
                                <div>
                                    <div class=" py-3 pt-5">
                                        <div class="d-flex flex-grow-1 justify-content-between">
                                            <span class="fw-bold">Activity</span>
                                            <button class="btn btn-sm btn-light" @click="showActivity = !showActivity">{{
                                                showActivity ? 'Hide activity' : 'Show activity ' }}</button>
                                        </div>
                                    </div>
                                    <div>
                                        <!-- Compose New message -->
                                        <div class="mb-3 py-0 py-lg-1">
                                            <!-- message sender image -->
                                            <div class="d-flex">
                                                <span class="rounded-5 border p-1 bg-primary flex-grow-0 flex fw-bold me-2"
                                                    style="height: min-content;">{{ userStore.user.username.slice(0,
                                                        2).toUpperCase() }} </span>
                                                <!-- <input type="text " class="form-control " id="validationServer01"
                                                    placeholder="Write a comment..." required> -->
                                                <textarea class="form-control " type="text" aria-label="With textarea"
                                                    v-model="comment" placeholder="Write a comment"></textarea>
                                                <button class="btn btn-sm btn-primary ms-2 " @click="addComment"
                                                    style="height: min-content;">send</button>
                                            </div>

                                        </div>

                                        <!-- Old message -->
                                        <div class="mb-3 py-0 py-lg-1" v-for="comment in messages"
                                            :key="comment.activity ? `a${comment.id}` : comment.id">
                                            <!-- message sender image -->


                                            <!-- card activity -->
                                            <div v-if="comment.activity">
                                                <div class="d-flex">
                                                    <div>
                                                        <span
                                                            class="rounded-5 border p-1 bg-info flex-grow-0 flex fw-bold me-2"
                                                            style="height: min-content;">{{
                                                                comment.user.username.slice(0, 2).toUpperCase() }}</span>
                                                    </div>
                                                    <div class="d-flex flex-grow-1">
                                                        <div class="d-flex flex-grow-1 flex-column">
                                                            <div class="">
                                                                <!-- <span class="me-2 fw-bold">{{ comment.user.username }}</span> -->
                                                                <span class="fw-bold" style="">{{ comment.activity }}</span>
                                                            </div>
                                                            <p class="mb-0" style="font-size: 12px;">
                                                                {{ formatDateTime(new Date(comment.created_datetime)) }} </p>
                                                        </div>
                                                        <!-- <button class="btn btn-sm btn-primary ms-2"
                                                                    style="height: min-content;">send</button> -->
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- card message -->
                                            <div v-else>
                                                <div class="d-flex">
                                                    <div>
                                                        <span
                                                            class="rounded-5 border p-1 bg-primary flex-grow-0 flex fw-bold me-2"
                                                            style="height: min-content;">{{ comment.user.username.slice(0,
                                                                2).toUpperCase() }}</span>
                                                    </div>
                                                    <div class="d-flex flex-grow-1">
                                                        <div class="d-flex flex-grow-1 flex-column">
                                                            <div class="">
                                                                <span class="me-2 fw-bold">{{ comment.user.username
                                                                }}</span>
                                                                <span style="font-size: 12px;">{{
                                                                    formattedDate(comment.created_datetime) }}</span>
                                                            </div>

                                                            <div v-if="comment.editingMessage">
                                                                <textarea :id="`message${comment.id}`"
                                                                    v-html="comment.comment" class="form-control mb-2"
                                                                    aria-label="With textarea"
                                                                    placeholder="Write a comment"></textarea>
                                                            </div>


                                                            <p v-else :id="`message${comment.id}`"
                                                                class="border p-2 bg-light-subtle rounded mb-0"
                                                                v-html="comment.comment">
                                                            </p>



                                                            <div v-if="userStore.user.id === comment.user_id"
                                                                class="d-flex gap-2" style="font-size: 12px;">
                                                                <div v-if="comment.editingMessage" class="d-flex gap-2">
                                                                    <button class="btn btn-sm btn-primary px-2"
                                                                        @click="UpdateMessage(comment)">Save</button>
                                                                    <button class="btn btn-sm btn-light px-2"
                                                                        @click="discardComment(comment)">Discard
                                                                        changes</button>
                                                                </div>
                                                                <div v-else class="d-flex gap-2">

                                                                    <i class="bi bi-emoji-smile"></i>
                                                                    <span class="fw-bold">.</span>
                                                                    <a @click="toggleEditComment(comment)"
                                                                        class="link-dark link-offset-2 link-underline-dark link-underline-opacity-25 link-underline-opacity-100-hover">Edit</a>
                                                                    <span class="fw-bold">.</span>
                                                                    <a @click="deleteMessage(comment.id)"
                                                                        class="link-dark link-offset-2 link-underline-dark link-underline-opacity-25 link-underline-opacity-100-hover">Delete</a>

                                                                </div>
                                                            </div>
                                                            <div v-else class="d-flex gap-2" style="font-size: 12px;">
                                                                <i class="bi bi-emoji-smile"></i>
                                                                <span class="fw-bold">.</span>
                                                                <a a href="#"
                                                                    class="link-dark link-offset-2 link-underline-dark link-underline-opacity-25 link-underline-opacity-100-hover">Reply</a>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>







                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col col-3 d-none d-lg-block d-flex flex-column px-3 py-3">

                            <p>Add to card</p>
                            <!-- members -->
                            <button @click="toggleShowMembers" class="btn btn-light w-100  text-start  btn-sm mb-2" type="button">
                                <i class="bi bi-people ms-1 me-2"></i>
                                Members
                            </button>


                            <!-- labels -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2" @click="toggleShowInput" type="button">
                                <i class="bi bi-key ms-1 me-2"></i>
                                Labels
                            </button>

                            <!-- Checklist -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2" @click="addingCheckList = true" type="button">
                                <i class="bi bi-check ms-1 me-2"></i>
                                Checklist
                            </button>

                            <!-- Dates -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-calendar ms-1 me-2"></i>
                                Dates
                            </button>

                            <!-- attachments -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-file ms-1 me-2"></i>
                                Attachments
                            </button>

                            <!-- cover -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-image ms-1 me-2"></i>
                                cover
                            </button>

                            <!-- custom fields -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-hammer ms-1 me-2"></i>
                                Custom fields
                            </button>

                            <!-- Power ups -->
                            <p class="mt-4">Power ups</p>
                            <!-- Add Power ups -->
                            <button class="btn bg-light-subtle w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-plus-lg ms-1 me-2"></i>
                                Add Power ups
                            </button>

                            <!-- Automation -->
                            <p class="mt-4">Automation</p>
                            <!-- custom fields -->
                            <button class="btn bg-light-subtle w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-plus-lg ms-1 me-2"></i>
                                Add button
                            </button>

                            <!-- actions -->
                            <p class="mt-4">Actions</p>
                            <!-- Move -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-arrow-right ms-1 me-2"></i>
                                Move
                            </button>
                            <!-- Copy -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2 disabled" type="button">
                                <i class="bi bi-clipboard ms-1 me-2"></i>
                                Copy
                            </button>
                            <!-- Archive -->
                            <button class="btn btn-light w-100 text-start btn-sm mb-2" type="button" @click="ArchiveCard">
                                <i class="bi bi-archive ms-1 me-2"></i>
                                Archive
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped></style>