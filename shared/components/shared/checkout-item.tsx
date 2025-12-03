//shared/components/shared/checkout-item.tsx
'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import * as CartItemDetails from './cart-item-details';

interface Props extends CartItemProps {
    onClickCountButton?: (type: 'plus' | 'minus') => void;
    onClickRemove?: () => void;
    className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
                                                  name,
                                                  price,
                                                  imageUrl,
                                                  quantity,
                                                  details,
                                                  className,
                                                  disabled,
                                                  onClickCountButton,
                                                  onClickRemove,
                                              }) => {
    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg sm:bg-transparent sm:p-0', // Темная карточка на мобильных
                {
                    'opacity-50 pointer-events-none': disabled,
                },
                className,
            )}>

            {/* Верхняя часть на мобильных - информация и цена */}
            <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
                <CartItemDetails.Image src={imageUrl} className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <CartItemDetails.Info name={name} details={details} />

                    {/* Цена на мобильных - под информацией */}
                    <div className="flex items-center justify-between mt-2 sm:hidden">
                        <CartItemDetails.Price value={price} className="text-base font-bold text-white" />
                        <span className="text-sm text-gray-400">
                            {price} ₽
                        </span>
                    </div>
                </div>
            </div>

            {/* Нижняя часть на мобильных - управление */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:ml-5">
                {/* Счетчик */}
                <CartItemDetails.CountButton
                    onClick={onClickCountButton}
                    value={quantity}
                    size="sm"
                    className="flex-1 sm:flex-none justify-center"
                />

                {/* Цена на десктопе */}
                <CartItemDetails.Price
                    value={price}
                    className="hidden sm:block text-lg font-bold min-w-[80px] text-right text-white"
                />

                {/* Кнопка удаления */}
                <button
                    type="button"
                    onClick={onClickRemove}
                    className="text-gray-400 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-gray-700 sm:ml-5"
                >
                    <X size={20} className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
