import {client} from './generated/client.gen';
import {getCookie} from 'cookies-next';

// Setup base URL with fetch cache config for Next.js
client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_BE,
    // @ts-ignore - Add Next.js cache config
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, {
            ...init,
            // Enable caching with revalidation
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
    },
});

// Add token to every request (only for client-side)
client.interceptors.request.use(async (request) => {
    let token: string | undefined | null;

    // Only get token on client-side to avoid breaking SSG/ISR cache
    if (typeof window !== 'undefined') {
        token = getCookie('auth_token') as string;

        // Nếu có token, đính kèm vào header Authorization
        if (token) {
            request.headers.set('Authorization', `${token}`);
        }
    }
    // On server, don't read cookies to allow static caching
    // If you need auth on server, pass it explicitly in the request

    return request;
});

export {client};
export * from './generated';