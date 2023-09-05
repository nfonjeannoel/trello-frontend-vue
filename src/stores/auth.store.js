import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers/fetch-wrapper';
import router from "@/router";


const baseUrl = `https://trello-clone-fastapi.onrender.com/users`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            const user = await fetchWrapper.post(`${baseUrl}/token`, { username, password });

            // update pinia state
            this.user = user;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));



            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/boards');
        },
        async signup(email, username, password) {
            const user = await fetchWrapper.post(`${baseUrl}/create_user`, { email, username, password });

            // update pinia state
            this.user = user;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/boards');
        }
        ,
        logout(redirect = true, redirectUrl = '/login') {
            // removes user from local storage to logs user out
            // if [redirect] is true, redirect to specified  url [redirectUrl]
            this.user = null;
            localStorage.removeItem('user');
            if (redirect) {
                router.push(redirectUrl);
            }
        }
    }
});