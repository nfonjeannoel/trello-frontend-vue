<script setup>
import { RouterLink } from "vue-router";
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store';
import { ref } from "vue";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
</script>
<template>
    <nav class="bg-white border-gray-200 white:bg-white-900 px-2">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
            <RouterLink to="/" class="flex items-center">
                <img src="@/assets/logo.svg" class="h-8" alt="Flowbite Logo" />
                <!-- <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> -->
            </RouterLink>

            <button data-collapse-toggle="navbar-default" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-default" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15" />
                </svg>
            </button>
            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul
                    class="font-medium flex flex-col items-center justify-center p-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 ">
                    <li v-if="user ? true : false">
                        <!-- a small round photo for user image -->
                        <div class="flex items-center">
                            <img class="w-10 h-10 rounded-full mr-8" src="https://picsum.photos/12/12" alt="user photo" />
                            <button @click="authStore.logout(redirect = true)"
                                class="block py-2 px-10 text-white bg-blue-500 rounded hover:bg-blue-600 md:mx-2 md:my-0"
                                aria-current="page">Logout</Button>
                        </div>
                    </li>
                    <li v-else>
                        <RouterLink to="/login"
                            class="block py-2  px-10 text-white bg-blue-500 rounded hover:bg-blue-600 md:mx-2 md:my-0"
                            aria-current="page">Login</RouterLink>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>



<style scoped></style>