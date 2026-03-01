import {client} from './generated/client.gen.ts';

// Cấu hình Base URL
client.setConfig({
    baseURL: 'http://localhost:8080/api/v1'
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
        if (error.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Export
export * from './generated';
export * from './generated/@tanstack/react-query.gen';
export { client };