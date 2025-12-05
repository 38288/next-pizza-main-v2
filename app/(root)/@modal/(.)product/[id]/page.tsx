// app/(root)/@modal/(.)product/[id]/page.tsx
import { ChooseProductModal } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function ProductModalPage({ params: { id } }: { params: { id: string } }) {
    // Получаем текущий город из cookies
    const cookieStore = await cookies();
    const currentCity = cookieStore.get('selectedCity')?.value || '';

    // Получаем стоп-лист для текущего города
    let excludedSkus: string[] = [];

    if (currentCity) {
        const stopList = await prisma.stopList.findMany({
            where: {
                organizationId: currentCity,
            },
            select: {
                sku: true
            }
        });

        excludedSkus = Array.from(new Set(
            stopList
                .filter(item => item.sku && item.sku.trim() !== '')
                .map(item => item.sku)
        ));
    }

    // Проверяем, исключен ли сам продукт
    const productExists = await prisma.product.findFirst({
        where: {
            id: Number(id),
            ...(excludedSkus.length > 0 && {
                sku: {
                    notIn: excludedSkus
                }
            })
        },
        select: {
            id: true
        }
    });

    if (!productExists) {
        return notFound();
    }

    // Получаем продукт с его данными
    const product = await prisma.product.findFirst({
        where: {
            id: Number(id),
        },
        include: {
            ingredients: true,
            items: true,
        },
    });

    if (!product) {
        return notFound();
    }

    // Фильтруем ингредиенты
    const filteredIngredients = product.ingredients.filter(ingredient =>
        !excludedSkus.includes(ingredient.sku || '')
    );

    // Фильтруем варианты товара
    const filteredItems = product.items.filter(item =>
        !excludedSkus.includes(item.sku || '')
    );

    // Создаем отфильтрованный продукт
    const filteredProduct = {
        ...product,
        ingredients: filteredIngredients,
        items: filteredItems
    };

    // Проверяем, есть ли у товара варианты после фильтрации
    if (filteredProduct.items.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="relative z-10 w-full max-w-md mx-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Товар временно недоступен
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Все варианты этого товара отсутствуют в вашем городе
                    </p>
                    <a
                        href="/"
                        className="block w-full text-center px-5 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
                    >
                        Вернуться на главную
                    </a>
                </div>
            </div>
        );
    }

    return <ChooseProductModal product={filteredProduct} />;
}