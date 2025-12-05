// app/actions/city.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function changeCity(cityId: string) {
    const cookieStore = await cookies();

    // Сохраняем город в cookies
    cookieStore.set('selectedCity', cityId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 дней
        sameSite: 'lax',
    });

    // Перенаправляем на главную с параметром города
    redirect(`/?city=${cityId}`);
}