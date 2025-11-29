// shared/components/shared/cart-drawer-item.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

import * as CartItem from './cart-item-details';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import { Trash2Icon } from 'lucide-react';

interface Props extends CartItemProps {
    onClickCountButton?: (type: 'plus' | 'minus') => void;
    onClickRemove?: () => void;
    className?: string;
}

export const CartDrawerItem: React.FC<Props> = ({
                                                    imageUrl,
                                                    name,
                                                    price,
                                                    quantity,
                                                    details,
                                                    disabled,
                                                    onClickCountButton,
                                                    onClickRemove,
                                                    className,
                                                }) => {
    return (
        <div
            className={cn(
                // Базовые стили с темной темой
                'flex bg-gray-800 text-white p-3 sm:p-4 lg:p-5 gap-3 sm:gap-4 lg:gap-6 rounded-lg',
                {
                    'opacity-50 pointer-events-none': disabled,
                },
                className,
            )}>

            <CartItem.Image src={imageUrl} />

            <div className="flex-1 min-w-0">
                <CartItem.Info name={name} details={details} />

                {/* Разделитель в темной теме */}
                <hr className="my-2 sm:my-3 border-gray-600" />

                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CartItem.CountButton
                        onClick={onClickCountButton}
                        value={quantity}
                        size="lg" // Используем большой размер для лучшей доступности на мобильных
                    />

                    <div className="flex items-center gap-2 sm:gap-3">
                        <CartItem.Price value={price} />
                        <button
                            onClick={onClickRemove}
                            className="text-blue-900 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-gray-700"
                        >
                            <Trash2Icon size={18} className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};