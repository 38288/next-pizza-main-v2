// shared/lib/find-pizzas.ts
import { prisma } from '@/prisma/prisma-client';

export interface GetSearchParams {
    query?: string;
    sortBy?: string;
    sizes?: string;
    pizzaTypes?: string;
    ingredients?: string;
    priceFrom?: string;
    priceTo?: string;
    city?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

interface StopListItem {
    sku: string;
    organizationId: string;
    balance: number;
}

export const findPizzas = async (
    params: GetSearchParams,
    stopList: StopListItem[] = []
) => {
    const sizes = params.sizes?.split(',').map(Number);
    const pizzaTypes = params.pizzaTypes?.split(',').map(Number);
    const ingredientsIdArr = params.ingredients?.split(',').map(Number);

    const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
    const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

    // Получаем все SKU из стоп-листа для выбранного города
    const cityId = params.city;
    let excludedSkus: string[] = [];

    if (cityId && stopList.length > 0) {
        excludedSkus = Array.from(new Set(
            stopList
                .filter(item => item.organizationId === cityId && item.sku)
                .map(item => item.sku)
        ));
    }

    const categories = await prisma.category.findMany({
        include: {
            products: {
                orderBy: { id: 'desc' },
                where: {
                    ...(excludedSkus.length > 0 && { sku: { notIn: excludedSkus } }),
                    ...(ingredientsIdArr && ingredientsIdArr.length > 0 && {
                        ingredients: {
                            some: {
                                id: { in: ingredientsIdArr },
                                ...(excludedSkus.length > 0 && { sku: { notIn: excludedSkus } })
                            }
                        }
                    }),
                    items: {
                        some: {
                            ...(sizes && sizes.length > 0 && { size: { in: sizes } }),
                            ...(pizzaTypes && pizzaTypes.length > 0 && { pizzaType: { in: pizzaTypes } }),
                            price: { gte: minPrice, lte: maxPrice },
                            ...(excludedSkus.length > 0 && { sku: { notIn: excludedSkus } })
                        }
                    }
                },
                include: {
                    // ВАЖНО: Получаем ВСЕ ингредиенты без фильтрации на уровне запроса
                    ingredients: true,
                    items: {
                        where: {
                            price: { gte: minPrice, lte: maxPrice },
                            ...(excludedSkus.length > 0 && { sku: { notIn: excludedSkus } }),
                            ...(sizes && sizes.length > 0 && { size: { in: sizes } }),
                            ...(pizzaTypes && pizzaTypes.length > 0 && { pizzaType: { in: pizzaTypes } })
                        },
                        orderBy: { price: 'asc' }
                    }
                }
            }
        }
    });

    // ВАЖНО: ФИЛЬТРАЦИЯ ИНГРЕДИЕНТОВ ПОСЛЕ ПОЛУЧЕНИЯ ДАННЫХ
    const filteredCategories = categories.map(category => ({
        ...category,
        products: category.products
            .map(product => ({
                ...product,
                // ФИЛЬТРУЕМ ИНГРЕДИЕНТЫ ПО excludedSkus
                ingredients: product.ingredients.filter(ingredient =>
                    !excludedSkus.includes(ingredient.sku || '')
                ),
                // ФИЛЬТРУЕМ ITEMS (уже отфильтрованы в запросе, но для надежности)
                items: product.items.filter(item =>
                    !excludedSkus.includes(item.sku || '')
                )
            }))
            // Оставляем только продукты с items
            .filter(product => product.items.length > 0)
    })).filter(category => category.products.length > 0);

    return filteredCategories;
};