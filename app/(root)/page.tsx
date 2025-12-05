// app/(root)/page.tsx
import {
    Container,
    TopBar,
    ProductsGroupList,
} from '@/shared/components/shared';
import { GetSearchParams, findPizzas } from '@/shared/lib/find-pizzas';
import { prisma } from '@/prisma/prisma-client';
import { cookies } from 'next/headers';
import { getOrganizations } from '@/shared/lib/get-organizations';
import { ScrollToTopButton } from '@/shared/components/shared/scroll-to-top-button'; // Импортируем

export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {
    const city = searchParams.city;
    const cookieStore = await cookies();
    const savedCity = cookieStore.get('selectedCity')?.value;
    const currentCity = city || savedCity || '';

    const organizations = await getOrganizations();

    if (!currentCity) {
        return (
            <Container className="mt-6 sm:mt-8 md:mt-10 pb-8 sm:pb-10 md:pb-14">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="max-w-md">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                            Добро пожаловать в Мясной Цех!
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Пожалуйста, выберите филиал доставки
                        </p>
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-300 mb-2">🏪 Доступные филиалы:</p>
                            <ul className="text-sm text-gray-400 space-y-1">
                                {organizations.map(org => (
                                    <li key={org.externalId}>• {org.name} (код: {org.code})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    const stopList = await prisma.stopList.findMany({
        where: { organizationId: currentCity },
        select: { sku: true, organizationId: true, balance: true }
    });

    const categories = await findPizzas({ ...searchParams, city: currentCity }, stopList);

    if (categories.length === 0) {
        return (
            <Container className="mt-6 sm:mt-8 md:mt-10 pb-8 sm:pb-10 md:pb-14">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="max-w-md">
                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                            В выбранном филиале временно нет товаров
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Попробуйте выбрать другой филиал или проверьте позже.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <a
                                href="/"
                                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium border border-gray-700 transition-colors"
                            >
                                Вернуться на главную
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <>
            <TopBar categories={categories} />
            <Container className="mt-6 sm:mt-8 md:mt-10 pb-8 sm:pb-10 md:pb-14">
                <div className="flex flex-col lg:gap-[80px]">
                    <div className="flex-1">
                        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16">
                            {categories.map((category) => (
                                <ProductsGroupList
                                    key={category.id}
                                    title={category.name}
                                    categoryId={category.id}
                                    items={category.products}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>

            {/* Кнопка "Наверх" - КЛИЕНТСКИЙ КОМПОНЕНТ */}
            <ScrollToTopButton />
        </>
    );
}