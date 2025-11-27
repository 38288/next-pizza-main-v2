//shared/components/shared/cart-drawer.tsx
'use client';

import React from 'react';
import Image from 'next/image';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails } from '@/shared/lib';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';
import { useCart } from '@/shared/hooks';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { totalAmount, updateItemQuantity, items, removeCartItem } = useCart();
    const [redirecting, setRedirecting] = React.useState(false);

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>

            <SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE] w-full sm:max-w-md">
                <div className={cn('flex flex-col h-full', !totalAmount && 'justify-center')}>
                    {totalAmount > 0 && (
                        <SheetHeader className="px-4 sm:px-6">
                            <SheetTitle className="text-lg sm:text-xl">
                                В корзине <span className="font-bold">{items.length} товара</span>
                            </SheetTitle>
                        </SheetHeader>
                    )}

                    {!totalAmount && (
                        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-0 sm:w-72 mx-auto">
                            <Image
                                src="/assets/images/empty-box.png"
                                alt="Empty cart"
                                width={100}
                                height={100}
                                className="w-20 h-20 sm:w-24 sm:h-24"
                            />
                            <Title
                                size="sm"
                                text="Корзина пустая"
                                className="text-center font-bold my-3 sm:my-2 text-lg sm:text-[22px]"
                            />
                            <p className="text-center text-neutral-500 mb-6 sm:mb-5 text-sm sm:text-base px-4">
                                Добавьте хотя бы одну пиццу, чтобы совершить заказ
                            </p>

                            <SheetClose>
                                <Button className="w-full sm:w-56 h-12 text-sm sm:text-base" size="lg">
                                    <ArrowLeft className="w-4 sm:w-5 mr-2" />
                                    Вернуться назад
                                </Button>
                            </SheetClose>
                        </div>
                    )}

                    {totalAmount > 0 && (
                        <>
                            <div className="-mx-4 sm:-mx-6 mt-4 sm:mt-5 overflow-auto flex-1 px-4 sm:px-6">
                                {items.map((item) => (
                                    <div key={item.id} className="mb-3 sm:mb-2">
                                        <CartDrawerItem
                                            id={item.id}
                                            imageUrl={item.imageUrl}
                                            details={getCartItemDetails(
                                                item.ingredients,
                                                item.pizzaType as PizzaType,
                                                item.pizzaSize as PizzaSize,
                                            )}
                                            disabled={item.disabled}
                                            name={item.name}
                                            price={item.price}
                                            quantity={item.quantity}
                                            onClickCountButton={(type) =>
                                                onClickCountButton(item.id, item.quantity, type)
                                            }
                                            onClickRemove={() => removeCartItem(item.id)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <SheetFooter className="-mx-4 sm:-mx-6 bg-white p-4 sm:p-6 lg:p-8">
                                <div className="w-full">
                                    <div className="flex mb-4 sm:mb-4">
                    <span className="flex flex-1 text-base sm:text-lg text-neutral-500">
                      Итого
                      <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>

                                        <span className="font-bold text-base sm:text-lg">{totalAmount} ₽</span>
                                    </div>

                                    <Link href="/checkout" className="block w-full">
                                        <Button
                                            onClick={() => setRedirecting(true)}
                                            loading={redirecting}
                                            type="submit"
                                            className="w-full h-12 text-sm sm:text-base">
                                            Оформить заказ
                                            <ArrowRight className="w-4 sm:w-5 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </SheetFooter>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};