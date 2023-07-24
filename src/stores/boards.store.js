import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';
import router from "@/router";


const baseUrl = `http://127.0.0.1:8000/boards`;
const listBaseUrl = `http://127.0.0.1:8000/lists`
const cardBaseUrl = `http://127.0.0.1:8000/cards`

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

        },

        async setActiveCard(card) {
            this.card = card;
        },

        // updateCardListId(cardToMove.id, list.value.id)
        async updateCardListId(cardId, newListId, oldListId) {
            let newCard = await fetchWrapper.put(`${cardBaseUrl}/${this.fullBoard.id}/${cardId}/${newListId}`);

            let oldCard;

            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === oldListId) {
                    oldCard = this.fullBoard.lists[listIndex].cards.find(card => card.id === cardId);
                    this.fullBoard.lists[listIndex]?.cards?.forEach((card, cardIndex) => {
                        if (card.id === cardId) {
                            this.fullBoard.lists[listIndex].cards.splice(cardIndex, 1);
                        }
                    });
                }
            });


            this.fullBoard.lists.forEach((list, index) => {
                if (list.id === newListId) {
                    // update the list id of old card and push it to the new list
                    oldCard.list_id = newCard.list_id;
                    this.fullBoard.lists[index].cards.push(oldCard);
                }
            });
        }


    },
});