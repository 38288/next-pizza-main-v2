// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Пропускаем статические файлы
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Проверяем параметр города
    const city = searchParams.get('city');

    if (city) {
        const response = NextResponse.next();

        // Устанавливаем cookie с выбранным городом
        response.cookies.set('selectedCity', city, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 дней
            sameSite: 'lax',
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};