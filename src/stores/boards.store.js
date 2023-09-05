import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';
import router from "@/router";

const base = `https://trello-clone-fastapi.onrender.com`

const baseUrl = `${base}/boards`;
const listBaseUrl = `${base}/lists`
const cardBaseUrl = `${base}/cards`
const checkListBaseUrl = `${base}/checklists`
const commentBaseUrl = `${base}/comments`
const cardLabelBaseUrl = `${base}/card_labels`
const cardMemberBaseUrl = `${base}/card_members`

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

        },
        async addCardLabel(label_id) {
            let newLabel = await fetchWrapper.post(`${cardLabelBaseUrl}/${this.fullBoard.id}/${this.card.id}/${label_id}/add_card_label`);
            this.card.labels.push(newLabel);
            // console.log(newLabel);
        },


        async addBoardLabel(label) {
            let newLabel = await fetchWrapper.post(`${baseUrl}/${this.fullBoard.id}/labels`, label);
            this.addCardLabel(newLabel.id);
            // console.log(newLabel);
        },

        async updateBoardLabel(label_id, label) {
            let newLabel = await fetchWrapper.put(`${baseUrl}/${this.fullBoard.id}/labels/${label_id}`, label);
            this.card.labels.forEach((label, index) => {
                if (label.board_label.id === newLabel.id) {
                    // update the name and color of the label
                    this.card.labels[index].board_label.name = newLabel.name;
                    this.card.labels[index].board_label.color = newLabel.color;
                }
            });
        },

        async deleteCardLabel(label_id) {
            await fetchWrapper.delete(`${cardLabelBaseUrl}/${this.fullBoard.id}/${this.card.id}/${label_id}/delete_card_label`);
            this.card.labels.forEach((label, index) => {
                if (label.id === label_id) {
                    this.card.labels.splice(index, 1);
                }
            });


        },

        // async deleteBoardLabel(label_id, cardLabelId) {
        //     await fetchWrapper.delete(`${baseUrl}/${this.fullBoard.id}/labels/${label_id}`);
        //     await this.deleteCardLabel(cardLabelId);
        //     this.card.labels.forEach((label, index) => {
        //         if (label.board_label.id === label_id) {
        //             this.card.labels.splice(index, 1);
        //         }
        //     });
        // },

        async removeMemberFromCard(memberEmail) {
            await fetchWrapper.delete(`${cardMemberBaseUrl}/${this.fullBoard.id}/${this.card.id}/delete_card_member`, {
                email: memberEmail
            });
            this.card.card_members.forEach((member, index) => {
                if (member.user.email === memberEmail) {
                    this.card.card_members.splice(index, 1);
                }
            });

            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === this.card.list_id) {
                    this.fullBoard.lists[listIndex].cards.forEach((card, cardIndex) => {
                        if (card.id === this.card.id) {
                            this.fullBoard.lists[listIndex].cards[cardIndex].card_members.forEach((member, memberIndex) => {
                                if (member.user.email === memberEmail) {
                                    this.fullBoard.lists[listIndex].cards[cardIndex].card_members.splice(memberIndex, 1);
                                }
                            });
                        }
                    });
                }
            });
        },

        async addMemberToCard(memberEmail) {
            let newMember = await fetchWrapper.post(`${cardMemberBaseUrl}/${this.fullBoard.id}/${this.card.id}/add_member`, {
                email: memberEmail
            });
            this.card.card_members.push(newMember);
            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === this.card.list_id) {
                    this.fullBoard.lists[listIndex].cards.forEach((card, cardIndex) => {
                        if (card.id === this.card.id) {
                            this.fullBoard.lists[listIndex].cards[cardIndex].card_members.push(newMember);
                        }
                    });
                }
            });

            
        },

        async updateTodoTitle(title, todo) {
            let newTodo = await fetchWrapper.put(`${checkListBaseUrl}/${this.fullBoard.id}/${this.card.id}/${todo.id}/update_checklist`, {
                    title: title,
                    is_checked: todo.is_checked,
                    position: todo.position
            }

            );

            this.getFullCard(this.card.id, this.fullBoard.id);

            // this.card.check_lists.forEach((checkList, index) => {
            //     if (checkList.id === newTodo.id) {
            //         this.card.check_lists[index] = newTodo;
            //     }
            // });


            
        },

        async archiveCard(){
            await fetchWrapper.delete(`${cardBaseUrl}/${this.fullBoard.id}/${this.card.list_id}/${this.card.id}/delete_card`);
            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === this.card.list_id) {
                    this.fullBoard.lists[listIndex].cards.forEach((card, cardIndex) => {
                        if (card.id === this.card.id) {
                            this.fullBoard.lists[listIndex].cards.splice(cardIndex, 1);
                        }
                    });
                }
            });
        },


        async createCard(cardTitle, listId){
            let newCard = await fetchWrapper.post(`${cardBaseUrl}/${this.fullBoard.id}/${listId}/create_card`, {
                title: cardTitle,
                description:  ""
            });
            // this.fullBoard.lists.forEach((list, listIndex) => {
            //     if (list.id === listId) {
            //         this.fullBoard.lists[listIndex].cards.push(newCard);
            //     }
            // });

            this.getFullBoard(this.fullBoard.id);

        },

        async deleteList(listId){
            await fetchWrapper.delete(`${listBaseUrl}/${listId}/${this.fullBoard.id}`);
            this.fullBoard.lists.forEach((list, listIndex) => {
                if (list.id === listId) {
                    this.fullBoard.lists.splice(listIndex, 1);
                }
            });
        },

        async createList(listTitle){
            let newList = await fetchWrapper.post(`${listBaseUrl}/${this.fullBoard.id}/create_list`, {
                name: listTitle,
                position: 0
            });
            this.fullBoard.lists.push(newList);
        },

        async createBoard(board){
            let newBoard = await fetchWrapper.post(`${baseUrl}/create_board`, board);
            router.push({ name: 'BoardDetails', params: { id: newBoard.id } })
            
            this.fullBoard = newBoard
        },

        async deleteBoard(){
            await fetchWrapper.delete(`${baseUrl}/${this.fullBoard.id}`);
            router.push({ name: 'boards' })
        }



    },
});