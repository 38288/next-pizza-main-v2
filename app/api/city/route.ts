// app/api/city/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { cityId } = await request.json();
        const cookieStore = await cookies();

        cookieStore.set('selectedCity', cityId, {
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 дней
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving city to cookies:', error);
        return NextResponse.json({ error: 'Failed to save city' }, { status: 500 });
    }
}