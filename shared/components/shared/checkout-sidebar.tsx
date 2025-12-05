// shared/components/shared/checkout-sidebar.tsx
import React from 'react';
import { WhiteBlock } from './white-block';
import { CheckoutItemDetails } from './checkout-item-details';
import { ArrowRight, Package, Truck, MapPin } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { cn } from '@/shared/lib/utils';

const DELIVERY_PRICE = 130;

interface Props {
    totalAmount: number;
    loading?: boolean;
    deliveryType: 'delivery' | 'pickup'; // Уточнен тип
    selectedCity?: string; // Название организации
    className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({
                                                     totalAmount,
                                                     loading,
                                                     selectedCity,
                                                     deliveryType,
                                                     className
                                                 }) => {
    const totalPrice = deliveryType === 'delivery' ? totalAmount + DELIVERY_PRICE : totalAmount;

    return (
        <WhiteBlock className={cn(
            'p-6 sticky top-4 lg:block',
            className
        )}>
            <DesktopSidebarContent
                totalAmount={totalAmount}
                totalPrice={totalPrice}
                loading={loading}
                deliveryType={deliveryType}
                selectedCity={selectedCity}
            />
        </WhiteBlock>
    );
};

// Компонент для десктопной версии
const DesktopSidebarContent: React.FC<{
    totalAmount: number;
    totalPrice: number;
    loading?: boolean;
    deliveryType: 'delivery' | 'pickup';
    selectedCity?: string;
}> = ({
          totalAmount,
          totalPrice,
          loading,
          deliveryType,
          selectedCity
      }) => {

    // Форматирование суммы
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <>
            {/* Информация о филиале */}
            {selectedCity && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center text-sm text-gray-400 mb-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        Филиал:
                    </div>
                    <div className="font-medium text-white">{selectedCity}</div>
                </div>
            )}

            <div className="flex flex-col gap-1 mb-4">
                <span className="text-gray-400 text-base">Итого:</span>
                {loading ? (
                    <Skeleton className="h-11 w-48 bg-gray-700" />
                ) : (
                    <span className="h-11 text-[34px] font-extrabold text-white">
                        {formatPrice(totalPrice)} ₽
                    </span>
                )}
            </div>

            <div className="space-y-3 mb-6">
                <CheckoutItemDetails
                    title={
                        <div className="flex items-center">
                            <Package size={18} className="mr-2 text-gray-400" />
                            <span className="text-gray-300">Стоимость товаров:</span>
                        </div>
                    }
                    value={loading ?
                        <Skeleton className="h-6 w-16 bg-gray-700 rounded-[6px]" /> :
                        `${formatPrice(totalAmount)} ₽`
                    }
                />

                {deliveryType === 'delivery' && (
                    <CheckoutItemDetails
                        title={
                            <div className="flex items-center">
                                <Truck size={18} className="mr-2 text-gray-400" />
                                <span className="text-gray-300">Доставка:</span>
                            </div>
                        }
                        value={loading ?
                            <Skeleton className="h-6 w-16 bg-gray-700 rounded-[6px]" /> :
                            `${formatPrice(DELIVERY_PRICE)} ₽`
                        }
                    />
                )}
            </div>

            <div className="pt-4 border-t border-gray-700">
                <Button
                    loading={loading}
                    type="submit"
                    className="w-full h-14 rounded-xl mt-2 text-base font-bold
                             bg-gradient-to-r from-orange-500 to-orange-600
                             hover:from-orange-600 hover:to-orange-700
                             transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
                >
                    Оформить заказ
                    <ArrowRight className="w-5 ml-2" />
                </Button>

                {deliveryType === 'delivery' && (
                    <p className="text-xs text-gray-400 text-center mt-3">
                        Курьер доставит заказ по указанному адресу
                    </p>
                )}
                {deliveryType === 'pickup' && (
                    <p className="text-xs text-gray-400 text-center mt-3">
                        Заберете заказ в выбранном филиале
                    </p>
                )}
            </div>
        </>
    );
};
