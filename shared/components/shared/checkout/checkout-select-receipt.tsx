//shared/components/shared/checkout/checkout-select-receipt.tsx
'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { cn } from '@/shared/lib/utils';
import { useCity } from '@/shared/hooks/use-city';
import { Truck, Store, Wallet, CreditCard, MessageSquare } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '../form';

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
    const { register, formState: { errors }, watch, trigger } = useFormContext();

    // Проверяем доступность доставки
    const isDeliveryAvailable = selectedCity === 'Верхняя Салда, Парковая';

    // Автоматически переключаем на самовывоз если доставка недоступна
    React.useEffect(() => {
        if (!isDeliveryAvailable && deliveryType === 'delivery') {
            setDeliveryType('pickup');
        }
    }, [isDeliveryAvailable, deliveryType, setDeliveryType]);

    // Следим за полем адреса и валидируем при изменении deliveryType
    const addressValue = watch('address');
    const firstNameValue = watch('firstName');
    const phoneValue = watch('phone');

    // Автоматически валидируем адрес при переключении типа доставки
    React.useEffect(() => {
        if (deliveryType === 'delivery') {
            trigger('address');
        }
    }, [deliveryType, trigger]);

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
                    <h3 className="text-lg font-semibold text-white">Город</h3>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-white mt-1">{selectedCity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Персональные данные */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Персональные данные</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FormInput
                        name="firstName"
                        label="Имя"
                        required
                        placeholder="Введите ваше имя"
                        className="w-full"
                    />

                    <FormInput
                        name="phone"
                        label="Телефон"
                        type="tel"
                        required
                        placeholder="+7 (XXX) XXX-XX-XX"
                        className="w-full sm:col-span-2"
                    />
                </div>
            </div>

            {/* 3. Выберите способ получения */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Выберите способ получения</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

                    {/* Самовывоз */}
                    <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-gray-800',
                            deliveryType === 'pickup'
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-600 hover:border-primary/50'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Store className={cn(
                                'w-5 h-5',
                                deliveryType === 'pickup' ? 'text-primary' : 'text-gray-400'
                            )} />
                            <span className="font-semibold text-white">Самовывоз</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Заберете заказ по адресу: {selectedCity}
                        </p>
                    </button>


                    {/* Доставка */}
                    <button
                        type="button"
                        onClick={() => isDeliveryAvailable && setDeliveryType('delivery')}
                        disabled={!isDeliveryAvailable}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-gray-800',
                            deliveryType === 'delivery'
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-600 hover:border-primary/50',
                            !isDeliveryAvailable && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Truck className={cn(
                                'w-5 h-5',
                                deliveryType === 'delivery' ? 'text-primary' : 'text-gray-400'
                            )} />
                            <span className="font-semibold text-white">Доставка</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            {isDeliveryAvailable
                                ? 'Доставим заказ по указанному адресу'
                                : 'Доставка не доступна для выбранного города'
                            }
                        </p>
                        {!isDeliveryAvailable && (
                            <p className="text-xs text-red-400 mt-1">
                                Доступно только для города Верхняя Салда
                            </p>
                        )}
                    </button>


                </div>

                {/* Поле ввода адреса (только для доставки) */}
                {deliveryType === 'delivery' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-white mb-2">
                            Адрес доставки *
                        </label>
                        <input
                            {...register('address', {
                                required: deliveryType === 'delivery' ? 'Адрес доставки обязателен' : false,
                                minLength: {
                                    value: 5,
                                    message: 'Адрес должен содержать минимум 5 символов'
                                }
                            })}
                            type="text"
                            placeholder="Введите полный адрес доставки (улица, дом, квартира)"
                            className={cn(
                                "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-gray-700 text-white placeholder:text-gray-500",
                                errors.address?.message
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                    : addressValue && addressValue.trim()
                                        ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                                        : "border-gray-600"
                            )}
                        />
                        {errors.address?.message && (
                            <p className="mt-1 text-sm text-red-400">{errors.address.message as string}</p>
                        )}



                        <p className="text-xs text-gray-400 mt-2">
                            Укажите подробный адрес для доставки заказа
                        </p>
                    </div>
                )}
            </div>

            {/*/!* 4. Выберите способ оплаты *!/*/}
            {/*<div className="mb-6">*/}
            {/*    <div className="flex items-center gap-2 mb-4">*/}
            {/*        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">*/}
            {/*            <span className="text-sm font-bold text-white">4</span>*/}
            {/*        </div>*/}
            {/*        <h3 className="text-lg font-semibold text-white">Выберите способ оплаты</h3>*/}
            {/*    </div>*/}

            {/*    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">*/}
            {/*        /!* Наличными при получении *!/*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() => setPaymentMethod('cash')}*/}
            {/*            className={cn(*/}
            {/*                'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-gray-800',*/}
            {/*                paymentMethod === 'cash'*/}
            {/*                    ? 'border-primary bg-primary/10'*/}
            {/*                    : 'border-gray-600 hover:border-primary/50'*/}
            {/*            )}*/}
            {/*        >*/}
            {/*            <div className="flex items-center gap-3 mb-2">*/}
            {/*                <Wallet className={cn(*/}
            {/*                    'w-5 h-5',*/}
            {/*                    paymentMethod === 'cash' ? 'text-primary' : 'text-gray-400'*/}
            {/*                )} />*/}
            {/*                <span className="font-semibold text-white">Наличные</span>*/}
            {/*            </div>*/}
            {/*            <p className="text-sm text-gray-400">*/}
            {/*                Оплата наличными при получении заказа*/}
            {/*            </p>*/}
            {/*            <p className="text-xs text-green-400 mt-1">*/}
            {/*                {deliveryType === 'delivery'*/}
            {/*                    ? 'Оплата курьеру при доставке'*/}
            {/*                    : 'Оплата при самовывозе'*/}
            {/*                }*/}
            {/*            </p>*/}
            {/*        </button>*/}

            {/*        /!* Онлайн оплата *!/*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() => setPaymentMethod('online')}*/}
            {/*            className={cn(*/}
            {/*                'p-4 border-2 rounded-lg text-left transition-all duration-200 bg-gray-800',*/}
            {/*                paymentMethod === 'online'*/}
            {/*                    ? 'border-primary bg-primary/10'*/}
            {/*                    : 'border-gray-600 hover:border-primary/50'*/}
            {/*            )}*/}
            {/*        >*/}
            {/*            <div className="flex items-center gap-3 mb-2">*/}
            {/*                <CreditCard className={cn(*/}
            {/*                    'w-5 h-5',*/}
            {/*                    paymentMethod === 'online' ? 'text-primary' : 'text-gray-400'*/}
            {/*                )} />*/}
            {/*                <span className="font-semibold text-white">Онлайн</span>*/}
            {/*            </div>*/}
            {/*            <p className="text-sm text-gray-400">*/}
            {/*                Оплата картой онлайн через платёжную систему*/}
            {/*            </p>*/}
            {/*            <p className="text-xs text-blue-400 mt-1">*/}
            {/*                Безопасная оплата банковской картой*/}
            {/*            </p>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 5. Комментарий к заказу */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Комментарий к заказу (необязательно)</h3>
                </div>

                <div className="mt-2">
                    <textarea
                        {...register('comment')}
                        rows={3}
                        className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none bg-gray-700 text-white placeholder:text-gray-500",
                            errors.comment?.message
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-600"
                        )}
                    />
                    {errors.comment?.message && (
                        <p className="mt-1 text-sm text-red-400">{errors.comment.message as string}</p>
                    )}

                </div>
            </div>
        </WhiteBlock>
    );
};