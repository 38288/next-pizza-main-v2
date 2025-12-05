// app/(checkout)/layout.tsx
import { Container, Header } from '@/shared/components/shared';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getOrganizations } from '@/shared/lib/get-organizations';

export const metadata: Metadata = {
    title: 'M W S | Корзина',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const currentCity = cookieStore.get('selectedCity')?.value || '';

    const organizations = await getOrganizations();

    return (
        <main className="min-h-screen bg-black">
            <Container>
                <Suspense>
                    <Header
                        hasSearch={false}
                        hasCart={false}
                        className="border-b-gray-200"
                        organizations={organizations}
                        currentCity={currentCity}
                        showCityModal={false}
                    />
                </Suspense>
                {children}
            </Container>
        </main>
    );
}