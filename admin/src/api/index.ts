import { client } from './generated/client.gen';

// Cấu hình Base URL
client.setConfig({
    baseURL: 'http://localhost:8080/api/v1'
});

// Gắn Token vào Header
client.interceptors.request.use((request) => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.set('Authorization', token);
    }
    return request;
});

// Handle 401
client.interceptors.response.use(
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
