//shared/components/shared/checkout-sidebar.tsx
import React from 'react';
import { WhiteBlock } from './white-block';
import { CheckoutItemDetails } from './checkout-item-details';
import { ArrowRight, Package, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { cn } from '@/shared/lib/utils';

const DELIVERY_PRICE = 100;

interface Props {
    totalAmount: number;
    loading?: boolean;
    className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({ totalAmount, loading, className }) => {
    const totalPrice = totalAmount + DELIVERY_PRICE;

    return (
        <>
            {/* Десктопная версия */}
            <WhiteBlock className={cn(
                'p-6 sticky top-4 hidden lg:block', // Скрываем на мобильных
                className
            )}>
                <DesktopSidebarContent
                    totalAmount={totalAmount}
                    totalPrice={totalPrice}
                    loading={loading}
                />
            </WhiteBlock>

            {/* Мобильная версия - фиксированная внизу */}
            <div className={cn(
                'lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4 safe-area-bottom', // Фиксированная позиция
                className
            )}>
                <MobileSidebarContent
                    totalAmount={totalAmount}
                    totalPrice={totalPrice}
                    loading={loading}
                />
            </div>
        </>
    );
};

// Компонент для десктопной версии
const DesktopSidebarContent: React.FC<{ totalAmount: number; totalPrice: number; loading?: boolean }> = ({
                                                                                                             totalAmount,
                                                                                                             totalPrice,
                                                                                                             loading
                                                                                                         }) => {

    return (
        <>
            <div className="flex flex-col gap-1">
                <span className="text-xl">Итого:</span>
                {loading ? (
                    <Skeleton className="h-11 w-48" />
                ) : (
                    <span className="h-11 text-[34px] font-extrabold">{totalPrice} ₽</span>
                )}
            </div>

            <CheckoutItemDetails
                title={
                    <div className="flex items-center">
                        <Package size={18} className="mr-2 text-gray-400" />
                        Стоимость корзины:
                    </div>
                }
                value={loading ? <Skeleton className="h-6 w-16 rounded-[6px]" /> : `${totalAmount} ₽`}
            />

            <CheckoutItemDetails
                title={
                    <div className="flex items-center">
                        <Truck size={18} className="mr-2 text-gray-400" />
                        Доставка:
                    </div>
                }
                value={loading ? <Skeleton className="h-6 w-16 rounded-[6px]" /> : `${DELIVERY_PRICE} ₽`}
            />

            <Button
                loading={loading}
                type="submit"
                className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
                Перейти к оплате
                <ArrowRight className="w-5 ml-2" />
            </Button>
        </>
    );
};

// Компонент для мобильной версии
const MobileSidebarContent: React.FC<{ totalAmount: number; totalPrice: number; loading?: boolean }> = ({
                                                                                                            totalPrice,
                                                                                                            loading
                                                                                                        }) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Общая сумма:</span>
                    {loading ? (
                        <Skeleton className="h-6 w-24 mt-1" />
                    ) : (
                        <span className="text-xl font-bold">{totalPrice} ₽</span>
                    )}
                </div>

                <Button
                    loading={loading}
                    type="submit"
                    className="h-12 px-6 rounded-xl text-sm font-bold flex-1 max-w-[200px]">
                    Оплатить
                    <ArrowRight className="w-4 ml-2" />
                </Button>
            </div>

            {/* Детали на мобильных можно показать по клику, если нужно */}
        </div>
    );
};