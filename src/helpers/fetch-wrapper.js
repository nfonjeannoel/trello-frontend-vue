import axios from "axios";
import { useAuthStore } from '@/stores/auth.store';
export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return async (url, body) => {


        let requestOptions = {
            method: method,
            url: url,
            headers: authHeader(url)
        }
        if (body) {
            requestOptions.data = body
        }

        return await axios(requestOptions).then(handleResponse).catch(handleError);

    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.access_token;
    const isApiUrl = url.startsWith("http://127.0.0.1:8000/");
    if (url.includes("users/token")) {
        return {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.access_token}` };
    } else {

        return {};
    }
}

function handleResponse(response) {

    return response.data
}

function handleError(error) {
    const { user, logout } = useAuthStore();
    const { status } = error.response
    if ([401, 403].includes(status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
    }
    return Promise.reject(error);

}