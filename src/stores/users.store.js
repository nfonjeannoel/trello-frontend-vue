import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';

const baseUrl = `http://127.0.0.1:8000/users`;
export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        user: {}
    }),
    actions: {
        async getCurrentUser(userCache = false) {
            // if user is already in store, return
            if (userCache && Object.keys(this.user).length) return;
            
            // console.log("userCache", userCache);
            // console.log("this.user", this.user);
            // console.log("fetching user");
            await fetchWrapper.get(`${baseUrl}/me`).then(user => {
                this.user = user;
                // console.log("user", user);
            })
                .catch(error => {
                    console.log(error);
                });

        }
    }
});