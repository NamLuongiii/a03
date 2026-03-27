import {client} from './generated/client.gen.ts';
import {toast} from "@heroui/react";

// Cấu hình Base URL
client.setConfig({
    baseURL: import.meta.env.VITE_API_URL,
});

client.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

// Handle 401
client.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
        } else {
            console.error('Error:', error);
            toast.danger(error.message);
        }
        return Promise.reject(error);
    }
);

// Export
export * from './generated';
export * from './generated/@tanstack/react-query.gen';
export {client};