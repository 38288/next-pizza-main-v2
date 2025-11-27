//shared/components/shared/cart-button.tsx
'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Button } from '../ui';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { CartDrawer } from './cart-drawer';
import { useCartStore } from '@/shared/store';

interface Props {
    className?: string;
}

export const CartButton: React.FC<Props> = ({ className }) => {
    const [totalAmount, items, loading] = useCartStore((state) => [
        state.totalAmount,
        state.items,
        state.loading,
    ]);

    return (
        <CartDrawer>
            <Button
                loading={loading}
                size="sm"
                className={cn(
                    'group relative min-h-[44px] px-3 sm:px-4', // Touch-friendly и адаптивные отступы
                    {
                        'w-[90px] sm:w-[105px]': loading // Адаптивная ширина при загрузке
                    },
                    className
                )}>

                {/* Сумма - всегда видна */}
                <b className="text-sm sm:text-base">{totalAmount} ₽</b>

                {/* Разделитель - скрываем на мобильных */}
                <span className="hidden sm:block h-full w-[1px] bg-white/30 mx-2 sm:mx-3" />

                {/* Количество товаров и иконка */}
                <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0 sm:group-hover:opacity-100">
                    <ShoppingCart size={16} className="relative" strokeWidth={2} />
                    <b className="text-sm sm:text-base">{items.length}</b>
                </div>

                {/* Стрелка - показываем только на десктопе при hover */}
                <ArrowRight
                    size={18}
                    className="hidden sm:block absolute right-4 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                />
            </Button>
        </CartDrawer>
    );
};
