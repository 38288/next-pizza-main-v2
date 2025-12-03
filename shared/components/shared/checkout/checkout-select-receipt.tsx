//shared/components/shared/checkout/checkout-select-receipt.tsx
'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { cn } from '@/shared/lib/utils';
import { useCity } from '@/shared/hooks/use-city';
import { Truck, Store, Wallet, CreditCard, MessageSquare } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

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
                                                           deliveryType = 'pickup',
                                                           setDeliveryType,
                                                           paymentMethod = 'cash',
                                                           setPaymentMethod
                                                       }) => {
    const { selectedCity } = useCity();
    const { register, formState: { errors } } = useFormContext();

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
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Город</h3>
                </div>
                <div className="p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-muted-foreground">Выбранный город:</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{selectedCity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Выберите способ получения */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Выберите способ получения</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/* Доставка */}
                    <button
                        type="button"
                        onClick={() => isDeliveryAvailable && setDeliveryType('delivery')}
                        disabled={!isDeliveryAvailable}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-card',
                            deliveryType === 'delivery'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50',
                            !isDeliveryAvailable && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Truck className={cn(
                                'w-5 h-5',
                                deliveryType === 'delivery' ? 'text-primary' : 'text-muted-foreground'
                            )} />
                            <span className="font-semibold text-foreground">Доставка</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {isDeliveryAvailable
                                ? 'Доставим заказ по указанному адресу'
                                : 'Доставка не доступна для выбранного города'
                            }
                        </p>
                        {!isDeliveryAvailable && (
                            <p className="text-xs text-destructive mt-1">
                                Доступно только для города Верхняя Салда
                            </p>
                        )}
                    </button>

                    {/* Самовывоз */}
                    <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-card',
                            deliveryType === 'pickup'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Store className={cn(
                                'w-5 h-5',
                                deliveryType === 'pickup' ? 'text-primary' : 'text-muted-foreground'
                            )} />
                            <span className="font-semibold text-foreground">Самовывоз</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Заберете заказ по адресу: {selectedCity}
                        </p>
                    </button>
                </div>

                {/* Поле ввода адреса (только для доставки) */}
                {deliveryType === 'delivery' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Адрес доставки *
                        </label>
                        <input
                            {...register('address')}
                            type="text"
                            placeholder="Введите полный адрес доставки (улица, дом, квартира)"
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-background text-foreground"
                        />
                        {errors.address?.message && (
                            <p className="mt-1 text-sm text-destructive">{errors.address.message as string}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Укажите подробный адрес для доставки заказа
                        </p>
                    </div>
                )}
            </div>

            {/*/!* 3. Выберите способ оплаты *!/*/}
            {/*<div className="mb-6">*/}
            {/*    <div className="flex items-center gap-2 mb-4">*/}
            {/*        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">*/}
            {/*            <span className="text-sm font-bold text-white">3</span>*/}
            {/*        </div>*/}
            {/*        <h3 className="text-lg font-semibold text-foreground">Выберите способ оплаты</h3>*/}
            {/*    </div>*/}

            {/*    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">*/}
            {/*        /!* Оплата при получении *!/*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() => setPaymentMethod('cash')}*/}
            {/*            className={cn(*/}
            {/*                'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-card',*/}
            {/*                paymentMethod === 'cash'*/}
            {/*                    ? 'border-primary bg-primary/5'*/}
            {/*                    : 'border-border hover:border-primary/50'*/}
            {/*            )}*/}
            {/*        >*/}
            {/*            <div className="flex items-center gap-3 mb-2">*/}
            {/*                <Wallet className={cn(*/}
            {/*                    'w-5 h-5',*/}
            {/*                    paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'*/}
            {/*                )} />*/}
            {/*                <span className="font-semibold text-foreground">Оплата при получении</span>*/}
            {/*            </div>*/}
            {/*            <p className="text-sm text-muted-foreground">*/}
            {/*                Наличными или картой*/}
            {/*            </p>*/}
            {/*        </button>*/}

            {/*        /!* Оплата на сайте *!/*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() => setPaymentMethod('online')}*/}
            {/*            className={cn(*/}
            {/*                'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-card',*/}
            {/*                paymentMethod === 'online'*/}
            {/*                    ? 'border-primary bg-primary/5'*/}
            {/*                    : 'border-border hover:border-primary/50'*/}
            {/*            )}*/}
            {/*        >*/}
            {/*            <div className="flex items-center gap-3 mb-2">*/}
            {/*                <CreditCard className={cn(*/}
            {/*                    'w-5 h-5',*/}
            {/*                    paymentMethod === 'online' ? 'text-primary' : 'text-muted-foreground'*/}
            {/*                )} />*/}
            {/*                <span className="font-semibold text-foreground">Оплата на сайте</span>*/}
            {/*            </div>*/}
            {/*            <p className="text-sm text-muted-foreground">*/}
            {/*                Безопасная онлайн оплата картой*/}
            {/*            </p>*/}
            {/*        </button>*/}
            {/*    </div>*/}

            {/*    /!* Информация о выборе *!/*/}
            {/*    <div className="mt-4 p-3 border border-border rounded-lg bg-card">*/}
            {/*        <p className="text-sm text-foreground">*/}
            {/*            <span className="font-medium">Вы выбрали:  </span>{'  '}*/}
            {/*            {deliveryType === 'delivery' ? ' Доставку' : ' Самовывоз'} •{'  '}*/}
            {/*            {paymentMethod === 'cash' ? ' Оплата при получении' : ' Оплата на сайте'}*/}
            {/*        </p>*/}
            {/*        {deliveryType === 'delivery' && (*/}
            {/*            <p className="text-sm mt-2 text-foreground">*/}
            {/*                <span className="font-medium">Адрес доставки: </span>*/}
            {/*                <span className="text-muted-foreground">*/}
            {/*                    {selectedCity}, указанный вами адрес*/}
            {/*                </span>*/}
            {/*            </p>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 4. Комментарий к заказу */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Комментарий к заказу (необязательно)</h3>
                </div>

                <div className="mt-2">
                    <textarea
                        {...register('comment')}
                        rows={2}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none bg-background text-foreground"
                    />

                </div>
            </div>
        </WhiteBlock>
    );
};