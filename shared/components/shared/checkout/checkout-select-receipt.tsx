//shared/components/shared/checkout/checkout-select-receipt.tsx
'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { cn } from '@/shared/lib/utils';
import { useCity } from '@/shared/hooks/use-city';
import { Truck, Store, Wallet, CreditCard } from 'lucide-react';

interface Props {
    loading?: boolean;
    className?: string;
    deliveryType: 'delivery' | 'pickup';
    setDeliveryType: (type: 'delivery' | 'pickup') => void;
    paymentMethod: 'cash' | 'online';
    setPaymentMethod: (method: 'cash' | 'online') => void;
}

export const CheckoutSelectReceipt: React.FC<Props> = ({
                                                           className,
                                                           deliveryType,
                                                           setDeliveryType,
                                                           paymentMethod,
                                                           setPaymentMethod
                                                       }) => {
    const { selectedCity } = useCity();

    // Проверяем доступность доставки
    const isDeliveryAvailable = selectedCity === 'Верхняя Салда, Парковая';

    // Автоматически переключаем на самовывоз если доставка недоступна
    React.useEffect(() => {
        if (!isDeliveryAvailable && deliveryType === 'delivery') {
            setDeliveryType('pickup');
        }
    }, [isDeliveryAvailable, deliveryType, setDeliveryType]);

    return (
        <WhiteBlock
            title="1. Выбор оплаты и доставки"
            className={className}
            padding="md"
        >
            {/* 1. Показать выбранный город */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full  flex items-center justify-center">
                        <span className=" text-sm font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold">Город</h3>
                </div>
                <div className="p-4  border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Выбранный город:</p>
                            <p className="text-2xl font-bold mt-1">{selectedCity}</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* 2. Выбор типа получения заказа */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full  flex items-center justify-center">
                        <span className=" text-sm font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold">Выберите способ получения</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Доставка */}
                    <button
                        type="button"
                        onClick={() => isDeliveryAvailable && setDeliveryType('delivery')}
                        disabled={!isDeliveryAvailable}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            deliveryType === 'delivery'
                                ? 'border-red-400'
                                : 'border-gray-500 hover:border-gray-500',
                            !isDeliveryAvailable && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Truck className={cn(
                                'w-5 h-5',
                                deliveryType === 'delivery' ? 'text-blue-500' : 'text-gray-500'
                            )} />
                            <span className="font-semibold">Доставка</span>
                        </div>
                        <p className="text-sm">
                            {isDeliveryAvailable
                                ? 'Доставим заказ по указанному адресу'
                                : 'Доставка не доступна для выбранного города'
                            }
                        </p>
                        {!isDeliveryAvailable && (
                            <p className="text-xs text-red-500 mt-1">
                                Доступно только для города Верхняя Салда
                            </p>
                        )}
                    </button>

                    {/* Самовывоз */}
                    <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            deliveryType === 'pickup'
                                ? 'border-red-400'
                                : 'border-gray-500 hover:border-gray-500'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Store className={cn(
                                'w-5 h-5',
                                deliveryType === 'pickup' ? 'text-blue-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold">Самовывоз</span>
                        </div>
                        <p className="text-sm">
                            Заберете заказ по адресу: {selectedCity}
                        </p>
                    </button>
                </div>
            </div>

            {/* 3. Выберите способ оплаты */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold">Выберите способ оплаты</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Оплата при получении */}
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            paymentMethod === 'cash'
                                ? 'border-red-400'
                                : 'border-gray-500 hover:border-gray-300'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className={cn(
                                'w-5 h-5',
                                paymentMethod === 'cash' ? 'text-green-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold">Оплата при получении</span>
                        </div>
                        <p className="text-sm">
                            Наличными или картой
                        </p>
                    </button>

                    {/* Оплата на сайте */}
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('online')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            paymentMethod === 'online'
                                ? 'border-red-400'
                                : 'border-gray-500 hover:border-gray-300'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className={cn(
                                'w-5 h-5',
                                paymentMethod === 'online' ? 'text-green-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold">Оплата на сайте</span>
                        </div>
                        <p className="text-sm">
                            Безопасная онлайн оплата картой
                        </p>
                    </button>
                </div>

                {/* Информация о выборе */}
                <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                    <p className="text-sm">
                        <span className="font-medium">Вы выбрали:  </span>{'  '}
                        {deliveryType === 'delivery' ? ' Доставку' : ' Самовывоз'} •{'  '}
                        {paymentMethod === 'cash' ? ' Оплата при получении' : ' Оплата на сайте'}
                    </p>
                </div>
            </div>
        </WhiteBlock>
    );
};