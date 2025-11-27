//app/(root)/page.tsx
import {
    Container,
    TopBar,
    ProductsGroupList,
} from '@/shared/components/shared';
import { GetSearchParams, findPizzas } from '@/shared/lib/find-pizzas';

export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {
    const categories = await findPizzas(searchParams);

    return (
        <>
            <TopBar categories={categories.filter((category) => category.products.length > 0)} />

            <Container className="mt-6 sm:mt-8 md:mt-10 pb-8 sm:pb-10 md:pb-14"> {/* Адаптивные отступы */}
                <div className="flex flex-col lg:gap-[80px]"> {/* На мобильных - колонка, на десктопе - ряд с отступом */}

                    {/* Список товаров */}
                    <div className="flex-1">
                        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16"> {/* Адаптивные отступы между категориями */}
                            {categories.map(
                                (category) =>
                                    category.products.length > 0 && (
                                        <ProductsGroupList
                                            key={category.id}
                                            title={category.name}
                                            categoryId={category.id}
                                            items={category.products}
                                        />
                                    ),
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
