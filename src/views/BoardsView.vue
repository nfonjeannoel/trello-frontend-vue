<script setup>
import { ref, onMounted } from 'vue'
import { useBoardStore } from '@/stores/boards.store';
import { useRouter } from 'vue-router'
import { RouterLink } from "vue-router";
import BoardNavbar from '@/components/BoardNavbar.vue'


const boardStore = useBoardStore();
const router = useRouter()

onMounted(() => {
    boardStore.getMyBoards()
})


</script>

<template>
    
    <div>
        <BoardNavbar fixedTop=true />

        <main class="container pt-5 mt-5">

            <div class="row text-center ">
                <div class="col-md-4 themed-grid-col d-none d-lg-block my-3">
                    <!-- left -->

                    <div class="d-flex flex-column pt-4 align-items-center justify-content-center">
                        <div class="list-group w-100 px-0 px-lg-2 px-xl-5">
                            <RouterLink to="/boards"
                                class="active opacity-75 list-group-item list-group-item-action d-flex gap-3 py-2 ps-4"
                                aria-current="true">
                                <i class="bi bi-tags"></i>
                                <div class="d-flex gap-2 w-100 justify-content-between">
                                    <div>
                                        <h6 class="mb-0">Boards</h6>
                                    </div>
                                </div>
                            </RouterLink>
                            <RouterLink to="/" class="list-group-item list-group-item-action d-flex gap-3 py-2 ps-4"
                                aria-current="true">
                                <i class="bi bi-house"></i>
                                <div class="d-flex gap-2 w-100 justify-content-between">
                                    <div>
                                        <h6 class="mb-0">Home</h6>
                                    </div>
                                </div>
                            </RouterLink>

                        </div>
                    </div>


                </div>


                <div class="col-12 col-md-8 themed-grid-col pt-4 mx-auto px-5 my-3">
                    <!-- right -->

                    <div class="row g-0">
                        <RouterLink :to="`/board/${board.id}`" v-for="board in boardStore.myBoards" :key="board.id"
                            class="card  text-white col-12 col-lg-5 me-3 mx-auto mx-md-3 mb-5 mx-auto">
                            <img src="https://mdbcdn.b-cdn.net/img/new/slides/017.webp" class="card-img img-fluid"
                                alt="Stony Beach" />
                            <div class="card-img-overlay d-flex flex-column justify-content-between pt-3 ps-3 ">
                                <h5 class="card-title text-start"><strong>{{ board.name }}</strong></h5>
                                <p v-if="board.is_public" class="card-footer pb-0 mb-0  text-end border-0"><i
                                        class="bi bi-activity"></i></p>
                                <p v-else class="card-footer pb-0 mb-0  text-end border-0"><i class="bi bi-circle-fill"></i>
                                </p>
                            </div>
                        </RouterLink>


                        <a data-bs-toggle="modal" data-bs-target="#CreateBoardModalDefault" class="card text-white col-12 bg-dark col-lg-5 me-3 mx-auto mx-md-3 mb-5 mx-auto">
                            <img src="https://mdbcdn.b-cdn.net/img/new/slides/014.webp" class="card-img img-fluid"
                                alt="Stony Beach" />
                            <div class="card-img"></div>
                            <div class="card-img-overlay d-flex align-items-center  justify-content-between pt-3 ps-3 ">
                                <h5 class="card-body text-center"><strong>Create new board</strong></h5>
                            </div>
                        </a>




                    </div>




                </div>
            </div>
        </main>

    </div>
</template>
  
<style scoped>
/* Add custom styles here */
</style>


  

