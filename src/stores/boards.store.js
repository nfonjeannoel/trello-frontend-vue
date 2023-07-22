import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';
import router from "@/router";


const baseUrl = `http://127.0.0.1:8000/boards`;

export const useBoardStore = defineStore({
    id: 'board',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        myBoards: [],
        publicBoards: [],
        fullBoard: {},
    }),
    actions: {
        async getMyBoards() {
            const boards = await fetchWrapper.get(`${baseUrl}/me`);
            this.myBoards = boards;
        },

        async getFullBoard(id) {
            const board = await fetchWrapper.get(`${baseUrl}/get_full_board?board_id=${id}`);
            this.fullBoard = board;
        }
        // async login(username, password) {
        //     const user = await fetchWrapper.post(`${baseUrl}/token`, { username, password });

        //     // update pinia state
        //     this.user = user;

        //     // store user details and jwt in local storage to keep user logged in between page refreshes
        //     localStorage.setItem('user', JSON.stringify(user));



        //     // redirect to previous url or default to home page
        //     router.push(this.returnUrl || '/boards');
        // },

    }
});