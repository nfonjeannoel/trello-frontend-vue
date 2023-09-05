

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBoardStore } from '@/stores/boards.store';
import List from '@/components/List.vue';
import { storeToRefs } from 'pinia'
import BoardNavbar from '@/components/BoardNavbar.vue'
import { RouterLink } from "vue-router";
import { useUsersStore } from '@/stores/users.store';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

const boardStore = useBoardStore();
const route = useRoute();
const userStore = useUsersStore();

onMounted(async () => {
  const boardId = route.params.id;
  await boardStore.getFullBoard(boardId);
});

//watch fullBoard, if its id changes, get the new board
watch(() => boardStore.fullBoard.id, async (newBoardId) => {
  // console.log('watching board id', newBoardId);
    await boardStore.getFullBoard(newBoardId);
});


let creatingList = ref(false);
let newListTitle = ref('');
// get a reference to the board
// const board = computed(() => boardStore.fullBoard);
const { fullBoard: board } = storeToRefs(boardStore);
const MAX_DISPLAYED_MEMBERS = 5;
// let uniqueMembers = ref(new Set());
// Display the first letters of the board members' usernames
const displayedMembers = computed(() => {


  // Loop through all the cards and collect unique members
  // boardStore.fullBoard.board_members?.forEach((member) => {
  //   uniqueMembers.value.add(member.user.username);
  // });

  // Convert the unique members set to an array
  // const membersArray = Array.from(uniqueMembers.value);

  // return membersArray.slice(0, MAX_DISPLAYED_MEMBERS);

  return boardStore.fullBoard.board_members?.map((member) => member.user.username).slice(0, MAX_DISPLAYED_MEMBERS);
});

// Check if there are more members beyond the first 5 displayed members
const hasMoreMembers = computed(() => {
  return true
  // If the number of unique members is greater than the max displayed members
  // if (uniqueMembers.value.size > MAX_DISPLAYED_MEMBERS) {
  //   return true;
  // }
  // return false
});



function resetNewList() {
  newListTitle.value = '';
  creatingList.value = false;
}

function createList() {
  if (newListTitle.value.length < 1) {
    console.log('Title must be at least 1 character.');
    return;
  }

  boardStore.createList(newListTitle.value);

  resetNewList();


}

function discardList() {
  resetNewList();
}


function deleteBoard() {
  boardStore.deleteBoard();
}


</script>


<template>
  <div>
    <router-view />

    <BoardNavbar />

    <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
      <symbol id="check2" viewBox="0 0 16 16">
        <path
          d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </symbol>
      <symbol id="circle-half" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
      </symbol>
      <symbol id="moon-stars-fill" viewBox="0 0 16 16">
        <path
          d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
        <path
          d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
      </symbol>
      <symbol id="sun-fill" viewBox="0 0 16 16">
        <path
          d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
      </symbol>
    </svg>

    <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
      <symbol id="bootstrap" viewBox="0 0 118 94">
        <title>Bootstrap</title>
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z">
        </path>
      </symbol>
      <symbol id="home" viewBox="0 0 16 16">
        <path
          d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
      </symbol>
      <symbol id="speedometer2" viewBox="0 0 16 16">
        <path
          d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z" />
        <path fill-rule="evenodd"
          d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z" />
      </symbol>
      <symbol id="table" viewBox="0 0 16 16">
        <path
          d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
      </symbol>
      <symbol id="people-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path fill-rule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
      </symbol>
      <symbol id="grid" viewBox="0 0 16 16">
        <path
          d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
      </symbol>
    </svg>


    <main class="d-flex flex-nowrap ">

      <div class="d-none d-lg-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style="width: 280px; ">
        <!-- <a href="/"
    class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
    <svg class="bi pe-none me-2" width="40" height="32">
        <use xlink:href="#bootstrap" />
    </svg>
    <span class="fs-4">Board 1</span>
</a>
<hr> -->
        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link active" aria-current="page">
              <svg class="bi pe-none me-2" width="16" height="16">
                <use xlink:href="#home" />
              </svg>
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/boards" class="nav-link link-body-emphasis">
              <svg class="bi pe-none me-2" width="16" height="16">
                <use xlink:href="#speedometer2" />
              </svg>
              Boards
            </RouterLink>
          </li>
          <li>
            <a href="#" class="nav-link link-body-emphasis">
              <svg class="bi pe-none me-2" width="16" height="16">
                <use xlink:href="#table" />
              </svg>
              Members
            </a>
          </li>
          <li>
            <a href="#" class="nav-link link-body-emphasis">
              <svg class="bi pe-none me-2" width="16" height="16">
                <use xlink:href="#grid" />
              </svg>
              Workspace Settings
            </a>
          </li>
          <li>
            <a  @click="deleteBoard"  class="nav-link link-body-emphasis" style="cursor: pointer;">
              <!-- <svg class="bi pe-none me-2" width="16" height="16">
                <use xlink:href="#people-circle" />
              </svg> -->
              <i class="fas fa-trash me-2 "></i>
              Delete Board
            </a>
          </li>
        </ul>
        <hr>
        <div class="dropdown">
          <a href="#" class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
            <strong>{{ userStore.user.email }}</strong>
          </a>
          <ul class="dropdown-menu text-small shadow">
            <li><a class="dropdown-item" href="#">New project...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#" @click="authStore.logout()">Sign out</a></li>
          </ul>
        </div>
      </div>
      <div class="w-100 " style="overflow-x: auto; overflow-y: hidden;">

        <nav class="navbar bg-light border-1 border-bottom px-3  py-lg-1">
          <div id="members-nav"
            class="container-fluid d-flex justify-content-between align-items-center align-content-center">
            <a class="navbar-brand d-inline" href="#">
              {{ board.name }}
            </a>
            <span v-if="board.is_public" class="text-sm text-green-600">
              <i class="fas fa-globe-americas mr-1"></i>
            </span>
            <span v-else class="text-sm text-red-600">
              <i class="fas fa-lock mr-1"></i>
            </span>
            <div class="d-flex gap-1">
              <button v-for="(member, index) in displayedMembers" :key="index" class="btn-sm">{{ member.slice(0,
                2).toUpperCase() }}</button>
              <div v-if="hasMoreMembers" class="font-bold" style="font-size: larger;">
                +
              </div>

            </div>



          </div>
        </nav>



        <div class="scrollable-container flex-shrink-0 ">

          <List v-for="list in board.lists" :key="list.id" :list="list" class="flex-shrink-0" />
          <div class="column list-container">
            <div class="bg-light">


           
              <div class="card-footer text-body-secondary m-0 p-0">

                <div v-if="creatingList" class="py-3 px-2">
                  <input type="text" class="input-group input-sm px-2" placeholder="Enter List title"
                    v-model="newListTitle">
                  <div class="d-flex gap-1 my-2">
                    <button @click="createList" class="btn btn-primary btn-sm w-100">Create </button>
                    <button @click="discardList" class="btn btn-danger btn-sm w-100">Discard</button>
                  </div>
                </div>

                <button v-else @click="creatingList = true" class="btn btn-sm w-100">+ Create List</button>
              </div>
            </div>
          </div>


        </div>

      </div>
    </main>
  </div>
</template>

<style>
/* Font Awesome Icons */
i.fa-globe-americas,
i.fa-lock {
  font-size: 0.75rem;
}
</style>
