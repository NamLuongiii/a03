import axios, {AxiosError, type AxiosRequestConfig} from 'axios';

// 1. Khởi tạo instance với cấu hình cơ bản
export const AXIOS_INSTANCE = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Khớp với basePath trong Swagger của bạn
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor: Tự động đính kèm Token từ LocalStorage (cho Auth)
AXIOS_INSTANCE.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Hàm mồi (Custom Instance) để Orval gọi vào
export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig
): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};

// Kiểu dữ liệu lỗi trả về từ Backend (Khớp với types.CommonResponse trong Swagger)
export type ErrorType<Error> = AxiosError<Error>;