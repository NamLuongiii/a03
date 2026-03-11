import {client} from './generated/client.gen';
import {getCookie} from 'cookies-next';

// Setup base URL
client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_BE,
});

// Add token to every request
client.interceptors.request.use(async (request) => {
    let token: string | undefined | null;

    // 1. Kiểm tra nếu đang chạy ở Client (Browser)
    if (typeof window !== 'undefined') {
        token = getCookie('auth_token') as string;
    }
    // 2. Nếu đang chạy ở Server (Server Component / Server Action)
    else {
        const {cookies} = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('auth_token')?.value;
    }

    // Nếu có token, đính kèm vào header Authorization
    if (token) {
        request.headers.set('Authorization', `${token}`);
    }

    return request;
});

export {client};
export * from './generated';