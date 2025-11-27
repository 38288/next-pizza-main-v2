//shared/components/shared/choose-pizza-form.tsx
'use client';

import React from 'react';
import { Ingredient, ProductItem } from '@prisma/client';

import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { PizzaSize } from '@/shared/constants/pizza';
import { IngredientItem } from './ingredient-item';
import { cn } from '@/shared/lib/utils';
import { getPizzaDetails } from '@/shared/lib';
import { usePizzaOptions } from '@/shared/hooks';

interface Props {
    imageUrl: string;
    name: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    loading?: boolean;
    onSubmit: (itemId: number, ingredients: number[]) => void;
    className?: string;
}

/**
 * Форма выбора ПИЦЦЫ
 */
export const ChoosePizzaForm: React.FC<Props> = ({
                                                     name,
                                                     items,
                                                     imageUrl,
                                                     ingredients,
                                                     loading,
                                                     onSubmit,
                                                     className,
                                                 }) => {
    const {
        size,
        type,
        selectedIngredients,
        availableSizes,
        currentItemId,
        setSize,
        setType,
        addIngredient,
    } = usePizzaOptions(items);

    const { totalPrice, textDetaills } = getPizzaDetails(
        type,
        size,
        items,
        ingredients,
        selectedIngredients,
    );

    const handleClickAdd = () => {
        if (currentItemId) {
            onSubmit(currentItemId, Array.from(selectedIngredients));
        }
    };

    return (
        <div className={cn(className, 'flex flex-col lg:flex-row flex-1 min-h-0')}>
            {/* Изображение пиццы */}
            <div className="lg:flex-1 flex justify-center items-center p-4 sm:p-6 bg-secondary min-h-[300px] sm:min-h-[400px]">
                <PizzaImage imageUrl={imageUrl} />
            </div>

            {/* Форма выбора */}
            <div className="w-full lg:w-[490px] bg-[#f7f6f5] p-4 sm:p-6 lg:p-7 flex flex-col min-h-0">
                <Title text={name} size="md" className="font-extrabold mb-1" />

                <p className="text-gray-400 text-sm sm:text-base">{textDetaills}</p>

                <div className="flex flex-col gap-4 mt-4 sm:mt-5">
                    <GroupVariants
                        items={availableSizes}
                        value={String(size)}
                        onClick={(value) => setSize(Number(value) as PizzaSize)}
                    />
                </div>

                {/* Контейнер ингредиентов с гибкой высотой */}
                <div className="flex-1 min-h-0 flex flex-col mt-4 sm:mt-5">
                    <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md flex-1 min-h-0 overflow-auto scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {ingredients.map((ingredient) => (
                                <IngredientItem
                                    key={ingredient.id}
                                    name={ingredient.name}
                                    price={ingredient.price}
                                    imageUrl={ingredient.imageUrl}
                                    onClick={() => addIngredient(ingredient.id)}
                                    active={selectedIngredients.has(ingredient.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <Button
                    loading={loading}
                    onClick={handleClickAdd}
                    className="h-12 sm:h-[55px] px-4 sm:px-10 text-sm sm:text-base rounded-xl sm:rounded-[18px] w-full mt-4 sm:mt-6 lg:mt-8 flex-shrink-0">
                    Добавить в корзину за {totalPrice} ₽
                </Button>
            </div>
        </div>
    );
};