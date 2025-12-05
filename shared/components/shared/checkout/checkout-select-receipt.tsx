//shared/components/shared/checkout/checkout-select-receipt.tsx
'use client';

import React from 'react';
import { WhiteBlock } from '../white-block';
import { cn } from '@/shared/lib/utils';
import { Truck, Store, Wallet, CreditCard } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '../form';
import { useCityStore, City } from '@/shared/store/city';

interface Props {
    loading?: boolean;
    className?: string;
    deliveryType: 'delivery' | 'pickup';
    setDeliveryType: (type: 'delivery' | 'pickup') => void;
    paymentMethod: 'cash' | 'online';
    setPaymentMethod: (method: 'cash' | 'online') => void;
}

// ID города где доступна доставка (Парковая)
const DELIVERY_AVAILABLE_CITY_ID = '8740e9b6-ff6e-481e-b694-dc020cdf7bc4';

export const CheckoutSelectReceipt: React.FC<Props> = ({
                                                           className,
                                                           deliveryType = 'pickup',
                                                           setDeliveryType,
                                                           paymentMethod = 'cash',
                                                           setPaymentMethod
                                                       }) => {
    const { selectedCity: cityId, cities } = useCityStore();
    const { register, formState: { errors }, watch, trigger, setValue } = useFormContext();

    // Получаем текущий город
    const currentCity: City | undefined = React.useMemo(() => {
        return cities.find(city => city.id === cityId);
    }, [cityId, cities]);

    // Проверяем доступность доставки
    const isDeliveryAvailable = cityId === DELIVERY_AVAILABLE_CITY_ID;

    // Автоматически переключаем на самовывоз если доставка недоступна
    React.useEffect(() => {
        if (!isDeliveryAvailable && deliveryType === 'delivery') {
            setDeliveryType('pickup');
            // Сбрасываем адрес при переключении на самовывоз
            setValue('address', '', { shouldValidate: false });
        }
    }, [isDeliveryAvailable, deliveryType, setDeliveryType, setValue]);

    // Следим за полем адреса
    const addressValue = watch('address');

    // Автоматически валидируем адрес при переключении типа доставки
    React.useEffect(() => {
        if (deliveryType === 'delivery') {
            trigger('address');
        }
    }, [deliveryType, trigger]);

    // Маска для телефона
    const formatPhone = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return '';

        if (numbers.length <= 1) return `+7`;
        if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`;
        if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
        if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`;
        return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
    };

    // Обработчик изменения телефона с маской
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const selectionStart = input.selectionStart;
        const formatted = formatPhone(input.value);

        // Сохраняем позицию курсора
        const diff = formatted.length - input.value.length;

        input.value = formatted;

        if (selectionStart !== null) {
            input.setSelectionRange(selectionStart + diff, selectionStart + diff);
        }

        // Триггерим валидацию
        setValue('phone', formatted, { shouldValidate: true });
    };

    // Валидация телефона при блуре
    const validatePhone = (e: React.FocusEvent<HTMLInputElement>) => {
        const phone = e.target.value.replace(/\D/g, '');
        if (phone && phone.length < 10) {
            trigger('phone');
        }
    };

    // Проверка валидности адреса для доставки
    const isAddressValidForDelivery = deliveryType === 'delivery' && addressValue && addressValue.trim().length >= 5;

    // Если город не выбран - показываем сообщение
    if (!currentCity) {
        return (
            <WhiteBlock
                title="Выбор оплаты и доставки"
                className={className}
                padding="md"
            >
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Пожалуйста, выберите город для оформления заказа</p>
                    <button
                        type="button"
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Выбрать город
                    </button>
                </div>
            </WhiteBlock>
        );
    }

    return (
        <WhiteBlock
            title="1. Выбор оплаты и доставки"
            className={className}
            padding="md"
        >
            {/* 1. Показать выбранный город */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Город доставки</h3>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Выбранный филиал:</p>
                            <p className="text-xl font-bold text-white mt-1">
                                {currentCity.name} (код: {currentCity.code})
                            </p>
                        </div>
                        {!isDeliveryAvailable && (
                            <div className="text-sm text-amber-400">
                                <span className="px-2 py-1 bg-amber-500/10 rounded border border-amber-500/30">
                                    Только самовывоз
                                </span>
                            </div>
                        )}
                    </div>
                    {isDeliveryAvailable && (
                        <p className="text-sm text-green-400 mt-3 flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Доставка доступна для этого филиала
                        </p>
                    )}
                </div>
            </div>

            {/* 2. Персональные данные */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Персональные данные</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FormInput
                        name="firstName"
                        label="Имя *"
                        required
                        placeholder="Введите ваше имя"
                        className="w-full"
                    />

                    <div className="sm:col-span-2">
                        <div className="relative">
                            <input
                                {...register('phone', {
                                    required: 'Телефон обязателен',
                                    validate: (value) => {
                                        const phoneDigits = value.replace(/\D/g, '');
                                        return phoneDigits.length >= 10 || 'Введите корректный номер телефона';
                                    }
                                })}
                                type="tel"
                                placeholder="+7 (___) ___-__-__"
                                onChange={handlePhoneChange}
                                onBlur={validatePhone}
                                className={cn(
                                    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-gray-700 text-white placeholder:text-gray-500",
                                    "peer",
                                    errors.phone?.message
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-gray-600"
                                )}
                            />
                            <label className="block text-sm font-medium text-white mb-2">
                                Телефон *
                            </label>
                            {errors.phone?.message && (
                                <p className="mt-1 text-sm text-red-400">{errors.phone.message as string}</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Формат: +7 (XXX) XXX-XX-XX
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Выберите способ получения */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Способ получения</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/* Самовывоз */}
                    <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            deliveryType === 'pickup'
                                ? 'border-orange-500 bg-orange-500/10 shadow-lg'
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800 hover:bg-gray-750'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Store className={cn(
                                'w-5 h-5',
                                deliveryType === 'pickup' ? 'text-orange-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold text-white">Самовывоз</span>
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                ✓ Доступно
                            </span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Заберете заказ по адресу филиала
                        </p>
                        <p className="text-xs text-green-400 mt-2 font-medium">
                            {currentCity.name}
                        </p>
                    </button>

                    {/* Доставка */}
                    <button
                        type="button"
                        onClick={() => isDeliveryAvailable && setDeliveryType('delivery')}
                        disabled={!isDeliveryAvailable}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            deliveryType === 'delivery'
                                ? 'border-orange-500 bg-orange-500/10 shadow-lg'
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800 hover:bg-gray-750',
                            !isDeliveryAvailable && 'opacity-50 cursor-not-allowed hover:border-gray-600'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Truck className={cn(
                                'w-5 h-5',
                                deliveryType === 'delivery' ? 'text-orange-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold text-white">Доставка</span>
                            {isDeliveryAvailable ? (
                                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                    ✓ Доступно
                                </span>
                            ) : (
                                <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                                    ✗ Недоступно
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">
                            {isDeliveryAvailable
                                ? 'Доставим заказ по указанному адресу'
                                : 'Доставка не доступна для этого филиала'
                            }
                        </p>
                        {isDeliveryAvailable ? (
                            <p className="text-xs text-green-400 mt-2 font-medium">
                                ✓ Доступно для {currentCity.name}
                            </p>
                        ) : (
                            <p className="text-xs text-red-400 mt-2">
                                Только для филиала "Парковая"
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
                            {...register('address')}
                            type="text"
                            placeholder={`Пример для ${currentCity.name}: ул. Ленина, д. 15, кв. 42, подъезд 3, этаж 5`}
                            className={cn(
                                "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-gray-700 text-white placeholder:text-gray-500",
                                errors.address?.message
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                    : isAddressValidForDelivery
                                        ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                                        : "border-gray-600"
                            )}
                        />
                        {errors.address?.message ? (
                            <p className="mt-1 text-sm text-red-400">{errors.address.message as string}</p>
                        ) : isAddressValidForDelivery ? (
                            <p className="mt-1 text-sm text-green-400">✓ Адрес указан правильно</p>
                        ) : (
                            <p className="text-xs text-gray-400 mt-2">
                                Укажите подробный адрес (минимум 5 символов)
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 4. Выберите способ оплаты */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Способ оплаты</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Наличными при получении */}
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            paymentMethod === 'cash'
                                ? 'border-orange-500 bg-orange-500/10 shadow-lg'
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800 hover:bg-gray-750'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className={cn(
                                'w-5 h-5',
                                paymentMethod === 'cash' ? 'text-orange-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold text-white">Наличными</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Оплата наличными при получении заказа
                        </p>
                        <p className="text-xs text-green-400 mt-2 font-medium">
                            {deliveryType === 'delivery'
                                ? '✓ Оплата курьеру при доставке'
                                : '✓ Оплата при самовывозе'
                            }
                        </p>
                    </button>

                    {/* Онлайн оплата */}
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('online')}
                        className={cn(
                            'p-4 border-2 rounded-lg text-left transition-all duration-200',
                            paymentMethod === 'online'
                                ? 'border-orange-500 bg-orange-500/10 shadow-lg'
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800 hover:bg-gray-750'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className={cn(
                                'w-5 h-5',
                                paymentMethod === 'online' ? 'text-orange-500' : 'text-gray-400'
                            )} />
                            <span className="font-semibold text-white">Онлайн картой</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Оплата картой онлайн через платёжную систему
                        </p>
                        <p className="text-xs text-blue-400 mt-2 font-medium">
                            ✓ Безопасная оплата банковской картой
                        </p>
                    </button>
                </div>
            </div>

            {/* 5. Комментарий к заказу */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">5</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Комментарий к заказу</h3>
                    <span className="text-sm text-gray-400">(необязательно)</span>
                </div>

                <div className="mt-2">
                    <textarea
                        {...register('comment')}
                        rows={3}
                        placeholder="Например: позвонить за час до доставки, оставить у двери, дополнительные пожелания по заказу..."
                        className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none bg-gray-700 text-white placeholder:text-gray-500",
                            errors.comment?.message
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-600"
                        )}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-400">
                            Максимум 500 символов
                        </p>
                        <p className="text-xs text-gray-400">
                            {watch('comment')?.length || 0}/500
                        </p>
                    </div>
                </div>
            </div>
        </WhiteBlock>
    );
};