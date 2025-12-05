// app/(root)/layout.tsx
import { Header } from '@/shared/components/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getOrganizations } from '@/shared/lib/get-organizations';

export const metadata: Metadata = {
    title: 'M W S | Главная',
};

export const dynamic = 'force-dynamic';

export default async function HomeLayout({
                                             children,
                                             modal,
                                         }: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const currentCity = cookieStore.get('selectedCity')?.value || '';

    const organizations = await getOrganizations();

    return (
        <main className="min-h-screen">
            <Suspense fallback={<div className="h-16 bg-gray-900"></div>}>
                <Header
                    currentCity={currentCity}
                    organizations={organizations}
                    showCityModal={!currentCity}
                />
            </Suspense>
            {children}
            {modal}
        </main>
    );
}
