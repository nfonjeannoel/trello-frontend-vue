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
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            // Might need to update this only if content type has not been set above
            // requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = body;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/users/token", {
                username: body.username,
                password: body.password
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },

            })
            return handleResponse(response)

        } catch (error) {
            return handleError(error)
        }


        // return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    const isApiUrl = url.startsWith("http://127.0.0.1:8000/");
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        if (url.includes("users/token")) {
            return {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        return {};
    }
}

function handleResponse(response) {
    // return response.text().then(text => {
    //     const data = text && JSON.parse(text);


    //     return data;
    // });
    return response.data
}

function handleError(error, response) {
    console.log(error)
    // const { user, logout } = useAuthStore();
    // if ([401, 403].includes(error.) && user) {
    //     // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    //     logout();
    // }

    return Promise.reject(error);

}