import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Nếu chưa login mà vào trang bảo mật -> đá về login
    const protectedPaths = ['/profile'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Nếu đã login mà vẫn vào trang /login -> đá về home
    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}