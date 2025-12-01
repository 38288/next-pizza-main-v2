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
    selectedCity?: string;
    className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({ totalAmount, loading, selectedCity, className }) => {
    const totalPrice = totalAmount + DELIVERY_PRICE;

    return (
        <>
            <WhiteBlock className={cn(
                'p-6 sticky top-4 lg:block',
                className
            )}>
                <DesktopSidebarContent
                    totalAmount={totalAmount}
                    totalPrice={totalPrice}
                    loading={loading}
                />
            </WhiteBlock>

        </>
    );
};

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
                Заказать
                <ArrowRight className="w-5 ml-2" />
            </Button>
        </>
    );
};

