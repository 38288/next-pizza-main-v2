//shared/components/shared/checkout/checkout-cart.tsx
import React from 'react';
import { WhiteBlock } from '../white-block';
import { CheckoutItem } from '../checkout-item';
import { getCartItemDetails } from '@/shared/lib';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import { CheckoutItemSkeleton } from '../checkout-item-skeleton';

interface Props {
    items: CartStateItem[];
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    removeCartItem: (id: number) => void;
    loading?: boolean;
    className?: string;
}

export const CheckoutCart: React.FC<Props> = ({
                                                  items,
                                                  onClickCountButton,
                                                  removeCartItem,
                                                  loading,
                                                  className,
                                              }) => {
    return (
        <WhiteBlock
            title="1. Корзина"
            className={className}
            padding="md"
        >
            <div className="flex flex-col gap-4 sm:gap-5"> {/* Адаптивные отступы */}
                {loading
                    ? [...Array(4)].map((_, index) => <CheckoutItemSkeleton key={index} />)
                    : items.map((item) => (
                        <CheckoutItem
                            key={item.id}
                            id={item.id}
                            imageUrl={item.imageUrl}
                            details={getCartItemDetails(
                                item.ingredients,
                                item.pizzaType as PizzaType,
                                item.pizzaSize as PizzaSize,
                            )}
                            name={item.name}
                            price={item.price}
                            quantity={item.quantity}
                            disabled={item.disabled}
                            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                            onClickRemove={() => removeCartItem(item.id)}
                        />
                    ))}
            </div>

            {/* Пустая корзина */}
            {!loading && items.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 text-lg">Корзина пуста</p>
                    <p className="text-gray-400 text-sm mt-2">Добавьте товары чтобы продолжить</p>
                </div>
            )}
        </WhiteBlock>
    );
};
