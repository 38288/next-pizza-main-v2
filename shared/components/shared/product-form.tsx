//shared/components/shared/product-form.tsx
'use client';

import { ProductWithRelations } from '@/@types/prisma';
import { useCartStore } from '@/shared/store';
import React from 'react';
import toast from 'react-hot-toast';
import { ChoosePizzaForm } from './choose-pizza-form';
import { ChooseProductForm } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

interface Props {
    product: ProductWithRelations;
    onSubmit?: VoidFunction;
    className?: string;
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit: _onSubmit, className }) => {
    const [addCartItem, loading] = useCartStore((state) => [state.addCartItem, state.loading]);
    const [submitting, setSubmitting] = React.useState(false);

    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);

    const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
        if (submitting) return;

        setSubmitting(true);

        try {
            const itemId = productItemId ?? firstItem.id;

            await addCartItem({
                productItemId: itemId,
                ingredients,
            });

            toast.success(`${product.name} добавлен в корзину`, {
                duration: 3000,
                position: 'bottom-center',
            });

            _onSubmit?.();
        } catch (err) {
            console.error('Ошибка добавления в корзину:', err);
            toast.error('Не удалось добавить товар в корзину. Попробуйте еще раз.', {
                duration: 4000,
                position: 'bottom-center',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const isLoading = loading || submitting;

    if (isPizzaForm) {
        return (
            <ChoosePizzaForm
                imageUrl={product.imageUrl}
                name={product.name}
                ingredients={product.ingredients}
                items={product.items}
                onSubmit={onSubmit}
                loading={isLoading}
                className={cn('h-full', className)} // Добавляем h-full для мобильных
            />
        );
    }

    return (
        <ChooseProductForm
            imageUrl={product.imageUrl}
            name={product.name}
            onSubmit={onSubmit}
            price={firstItem.price}
            loading={isLoading}
            className={cn('h-full', className)} // Добавляем h-full для мобильных
        />
    );
};