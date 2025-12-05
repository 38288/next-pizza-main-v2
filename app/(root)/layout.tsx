// app/(root)/layout.tsx
import { Header } from '@/shared/components/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
    title: 'M W S | Главная',
};

// Динамический рендеринг для доступа к cookies
export const dynamic = 'force-dynamic';

// Константа городов (вынести в отдельный файл)
const CITIES = [
    {
        id: "5a5963df-4e9a-45d2-aa7b-2e2a1a5e704d",
        name: "Гикалова",
        code: "3"
    },
    {
        id: "8740e9b6-ff6e-481e-b694-dc020cdf7bc4",
        name: "Парковая",
        code: "2"
    },
    {
        id: "8e57e25d-8c9c-486d-b41d-ac96a2c1f4cc",
        name: "Сибирский тракт",
        code: "1"
    }
];

export default async function HomeLayout({
                                             children,
                                             modal,
                                         }: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    // Получаем город из cookies на сервере
    const cookieStore = await cookies();
    const currentCity = cookieStore.get('selectedCity')?.value || '';

    return (
        <main className="min-h-screen">
            <Suspense fallback={<div className="h-16 bg-gray-900"></div>}>
                <Header
                    currentCity={currentCity}
                    cities={CITIES}
                    showCityModal={!currentCity}
                />
            </Suspense>
            {children}
            {modal}
        </main>
    );
}
