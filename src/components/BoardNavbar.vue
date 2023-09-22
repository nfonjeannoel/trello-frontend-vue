<script setup>
import { RouterLink } from "vue-router";
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store';
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useBoardStore } from '@/stores/boards.store';
import router from "@/router";

const boardStore = useBoardStore();
const route = useRoute();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

const props = defineProps(['fixedTop'])
const fixedTop = computed(() => props.fixedTop ? 'fixed-top' : '')

let isPrivate = ref(false)
let boardName = ref('')

function resetBoardData() {
    boardName.value = ''
    isPrivate.value = false
}

function createBoard() {
    // validate board name
    if (boardName.value.trim().length < 1) {
        console.log('Board name must be at least 1 character.');
        return;
    }

    boardStore.createBoard({
        name: boardName.value.trim(),
        is_public: !isPrivate.value
    })

    // reset board name
    resetBoardData()
    

    
    
}

</script>
<template>
    <div class="modal fade" id="CreateBoardModalDefault" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Create a Board</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Board Name</label>
                            <input type="email" v-model="boardName" class="form-control" id="exampleFormControlInput1" placeholder="Board Name">
                        </div>
                        <!-- <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div> -->
                        <!-- Public or private. checkbox -->

                        <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="privateCheckbox" v-model="isPrivate">
                                <label class="form-check-label" for="privateCheckbox">Private</label>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetBoardData">Cancel</button>
                    <button type="button" data-bs-dismiss="modal" class="btn btn-primary" @click="createBoard">Create Board</button>
                </div>
            </div>
        </div>
    </div>


    <nav class="navbar navbar-expand-lg bg-light border-1 border-bottom px-3 py-lg-0" :class="fixedTop">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">
                <img style="width: 70px; height: 50px;" class="img-fluid "
                    src="https://www.vectorlogo.zone/logos/trello/trello-ar21.svg">

            </RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse py-4 py-lg-0" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0  ">


                    <!-- <button id="showWorkspaces"
                        class="btn btn-sm position-relative mb-4 mb-lg-0 mx-0 mx-lg-3">workspaces
                        <span class="mb-sm-5"></span>
                        <div id="workspaces" style="left: 0"
                            class="d-none position-absolute top-0 mt-3 mt-lg-0  d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
                            <div class=" dropdown-menu d-block position-static pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px"
                                data-bs-theme="light">
                                <form class="p-2 mb-2 bg-body-tertiary border-bottom">
                                    <input type="search" class="form-control" autocomplete="false"
                                        placeholder="Type to filter...">
                                </form>
                                <ul class="list-unstyled mb-0">
                                    <li><a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
                                            <span class="d-inline-block bg-success rounded-circle p-1"></span>
                                            Action
                                        </a></li>
                                </ul>
                            </div>
                        </div>
                    </button> -->

                    <div class="dropdown mb-4 mb-lg-0">
                        <button class="btn btn-sm dropdown-toggle  mx-0 mx-lg-3" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            workspaces
                        </button>
                        <ul class="dropdown-menu shadow">
                            <!-- <li>
                                <h6 class="dropdown-header">Dropdown header</h6>
                            </li> -->
                            <li><RouterLink class="dropdown-item" to="/boards">My boards</RouterLink></li>
                            <li><a class="dropdown-item" href="#">My boards</a></li>
                            <!-- <li><a class="dropdown-item" href="#">Another action</a></li> -->
                            <!-- <li><a class="dropdown-item" href="#">Something else here</a></li> -->
                            <!-- <li> -->
                                <!-- <hr class="dropdown-divider"> -->
                            <!-- </li> -->
                            <!-- <li><a class="dropdown-item" href="#">Separated link</a></li> -->
                        </ul>
                    </div>



                    <button data-bs-toggle="modal" data-bs-target="#CreateBoardModalDefault" type="button"
                        class="btn btn-primary btn-sm mb-4 mb-lg-0 mx-0 mx-lg-3">
                        <i class="bi bi-plus"></i>
                        Create
                    </button>
                    <!-- <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li> -->
                </ul>
                <form class="d-flex me-lg-3 mb-4 mb-lg-0 mx-0 mx-lg-3" role="search">
                    <!-- <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"> -->
                    <div class="input-group input-group-sm">
                        <span class="input-group-text border-end-0" id="basic-addon1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z">
                                </path>
                            </svg>
                        </span>
                        <input type="text" class="form-control input-sm border-start-0" placeholder="Searching for?"
                            aria-label="Searching for?" aria-describedby="basic-addon1">
                    </div>
                </form>


                <div class="d-flex justify-content-between">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                        class="bi bi-bell rounded-circle me-lg-3 mx-3" viewBox="0 0 16 16">
                        <path
                            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                    </svg>



                    <div class="dropstart ">
                        <button class="btn btn-sm dropdown-toggle p-0" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <img style="width: 25px; height: 25px;" class="img-fluid rounded-circle"
                                src="https://picsum.photos/25/25">
                        </button>
                        <ul class="dropdown-menu shadow">
                            <li>
                                <h6 class="dropdown-header">ACCOUNT</h6>
                            </li>
                            <li><a class="dropdown-item" @click="authStore.logout()">Logout</a></li>
                            <li><a class="dropdown-item" href="#">Language</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>



<style scoped></style>