import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';
import router from "@/router";


const baseUrl = `http://127.0.0.1:8000/boards`;
const listBaseUrl = `http://127.0.0.1:8000/lists`

export const useBoardStore = defineStore({
    id: 'board',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        myBoards: [],
        publicBoards: [],
        fullBoard: {},
        card: {},
    }),
    actions: {
        async getMyBoards() {
            const boards = await fetchWrapper.get(`${baseUrl}/me`);
            this.myBoards = boards;
        },

        async getFullBoard(id) {
            const board = await fetchWrapper.get(`${baseUrl}/get_full_board?board_id=${id}`);
            this.fullBoard = board;
        },
        // updateListTitle(list.id, boardStore.fullBoard.id, newTitle);
        async updateListTitle(listId, boardId, newData) {
            let newList = await fetchWrapper.put(`${listBaseUrl}/${listId}/${boardId}`, newData);


            this.fullBoard.lists.forEach((list, index) => {
                if (list.id === listId) {
                    this.fullBoard.lists[index] = newList;
                }
            });

        }


    },
    getters: {},

    setters: {
        setActiveCard(card) {
            this.card = card;
            console.log("card set");
            console.log(this.card);
        }
    },
});