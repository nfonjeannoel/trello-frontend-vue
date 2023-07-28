import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';
import router from "@/router";


const baseUrl = `http://127.0.0.1:8000/boards`;
const listBaseUrl = `http://127.0.0.1:8000/lists`
const cardBaseUrl = `http://127.0.0.1:8000/cards`
const checkListBaseUrl = `http://127.0.0.1:8000/checklists`
const commentBaseUrl = `http://127.0.0.1:8000/comments`

export const useBoardStore = defineStore({
    id: 'board',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        myBoards: [],
        publicBoards: [],
        fullBoard: {},
        card: {},
        // fullCard: {},
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

        // boardStore.getFullCard(cardId);
        async getFullCard(cardId, boardId) {
            const card = await fetchWrapper.get(`${cardBaseUrl}/${boardId}/${cardId}/get_full_card`);
            this.card = card;
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
        },

        async addCheckList(checkList) {
            let newCheckList = await fetchWrapper.post(`${checkListBaseUrl}/${this.fullBoard.id}/${this.card.id}/create_checklist`, checkList);
            this.card.check_lists.push(newCheckList);
        },

        async updateCheckList(checkList) {
            let newCheckList = await fetchWrapper.put(`${checkListBaseUrl}/${this.fullBoard.id}/${this.card.id}/${checkList.id}/update_checklist`, checkList);
            this.card.check_lists.forEach((checkList, index) => {
                if (checkList.id === newCheckList.id) {
                    this.card.check_lists[index] = newCheckList;
                }
            });
        },

        async deleteCheckList(checkListId) {
            await fetchWrapper.delete(`${checkListBaseUrl}/${this.fullBoard.id}/${this.card.id}/${checkListId}/delete_checklist`);
            this.card.check_lists.forEach((checkList, index) => {
                if (checkList.id === checkListId) {
                    this.card.check_lists.splice(index, 1);
                }
            });
        },

        async addComment(comment) {
            let newComment = await fetchWrapper.post(`${commentBaseUrl}/${this.fullBoard.id}/${this.card.list_id}/${this.card.id}/create_comment`, comment);
            this.card.comments.push(newComment);
        },

        async deleteMessage(commentId) {
            await fetchWrapper.delete(`${commentBaseUrl}/${this.fullBoard.id}/${this.card.list_id}/${this.card.id}/${commentId}/delete_comment`);
            this.card.comments.forEach((comment, index) => {
                if (comment.id === commentId) {
                    this.card.comments.splice(index, 1);
                }
            });
        },

        async updateMessage(comment) {
            let newComment = await fetchWrapper.put(`${commentBaseUrl}/${this.fullBoard.id}/${this.card.list_id}/${this.card.id}/${comment.id}/update_comment`, {
                comment: comment.comment
            });
            this.card.comments.forEach((comment, index) => {
                if (comment.id === newComment.id) {
                    this.card.comments[index] = newComment;
                }
            });
        },

        async updateCardTitle(data) {
            let newCard = await fetchWrapper.put(`${cardBaseUrl}/${this.fullBoard.id}/${this.card.list_id}/${this.card.id}/update_card_basics`, data);
            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === this.card.list_id) {
                    this.fullBoard.lists[listIndex].cards.forEach((card, cardIndex) => {
                        if (card.id === this.card.id) {
                            this.fullBoard.lists[listIndex].cards[cardIndex].title = newCard.title;
                        }
                    });
                }
            });

        },

        async updateCardDescription(data) {
            let newCard = await fetchWrapper.put(`${cardBaseUrl}/${this.fullBoard.id}/${this.card.list_id}/${this.card.id}/update_card_basics`, data);
            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === this.card.list_id) {
                    this.fullBoard.lists[listIndex].cards.forEach((card, cardIndex) => {
                        if (card.id === this.card.id) {
                            this.fullBoard.lists[listIndex].cards[cardIndex].description = newCard.description;
                        }
                    });
                }
            });

        }


    },
});