import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Create middleware for each request to handle errors and logging
api.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem("token");
    return config;
});

let refreshTokenTask: Promise<unknown> | null = null;


function refreshToken() {
    // Set task sleep 2s
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

api.interceptors.response.use(response => response, error => {
    const originalRequest = error.config;

    if (error.status === 401 && !originalRequest._retry) {
        // handle refresh token
        originalRequest._retry = true;

        if (refreshTokenTask) {
            return refreshTokenTask.then(() => api(originalRequest))
        } else {
            refreshTokenTask = refreshToken()
            return refreshTokenTask.then(() => api(originalRequest))
        }
    } else {
        return Promise.reject(error)
    }
})


export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
};

export default api;
