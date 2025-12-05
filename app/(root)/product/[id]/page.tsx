// app/(root)/product/[id]/page.tsx
import { Container, ProductForm } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const currentCity = cookieStore.get('selectedCity')?.value || '';

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

    const productExists = await prisma.product.findFirst({
        where: {
            id: Number(id),
            ...(excludedSkus.length > 0 && {
                sku: {
                    notIn: excludedSkus
                }
            })
        }
    });

    if (!productExists) {
        return notFound();
    }

    // Получаем продукт с данными
    const rawProduct = await prisma.product.findFirst({
        where: {
            id: Number(id)
        },
        include: {
            ingredients: true,
            category: {
                include: {
                    products: {
                        include: {
                            items: true,
                        },
                    },
                },
            },
            items: true,
        },
    });

    if (!rawProduct) {
        return notFound();
    }
    //console.log(rawProduct);
    // Фильтруем ингредиенты
    const filteredIngredients = rawProduct.ingredients.filter(ingredient =>
        !excludedSkus.includes(ingredient.sku || '')
    );

    // Фильтруем варианты товара
    const filteredItems = rawProduct.items.filter(item =>
        !excludedSkus.includes(item.sku || '')
    );

    // Фильтруем связанные продукты в категории
    const filteredCategory = {
        ...rawProduct.category,
        products: rawProduct.category.products
            .filter(product => !excludedSkus.includes(product.sku || ''))
            .map(product => ({
                ...product,
                items: product.items.filter(item => !excludedSkus.includes(item.sku || ''))
            }))
    };

    const product = {
        ...rawProduct,
        ingredients: filteredIngredients,
        items: filteredItems,
        category: filteredCategory
    };

    if (product.items.length === 0) {
        return (
            <Container className="my-6 sm:my-8 lg:my-10">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Товар временно недоступен
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Этот товар отсутствует в вашем городе
                    </p>
                    <a
                        href="/"
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
                    >
                        Вернуться на главную
                    </a>
                </div>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col my-6 sm:my-8 lg:my-10 px-0 sm:px-4">
            <div className="min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)]">
                <ProductForm product={product} className="min-h-full" />
            </div>
        </Container>
    );
}