// app/(checkout)/checkout/page.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CheckoutSidebar,
    Container,
    Title,
    CheckoutAddressForm,
    CheckoutCart,
    CheckoutPersonalForm,
} from '@/shared/components';
import { CheckoutFormValues, checkoutFormSchema } from '@/shared/constants';
import { useCart } from '@/shared/hooks';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';
import { cn } from '@/shared/lib/utils';
import { useCity } from '@/shared/hooks/use-city';
import {useRouter} from "next/navigation";

export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
    const { data: session } = useSession();
    const { selectedCity, isInitialized, useCitySubscription } = useCity();
    const router = useRouter(); // Добавьте эту строку


    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
            city: selectedCity, // Добавляем город в значения по умолчанию
        },
    });

    // Подписка на изменения города в реальном времени
    useCitySubscription((city: string) => {
        form.setValue('city', city, { shouldValidate: true });
    });

    // Обновляем значение города при инициализации и изменении
    React.useEffect(() => {
        if (isInitialized) {
            form.setValue('city', selectedCity, { shouldValidate: true });
        }
    }, [selectedCity, isInitialized, form]);

    const fetchUserInfo = React.useCallback(async () => {
        try {
            const data = await Api.auth.getMe();
            const [firstName, lastName] = data.fullName.split(' ');

            form.setValue('firstName', firstName || '');
            form.setValue('lastName', lastName || '');
            form.setValue('email', data.email || '');
            form.setValue('city', selectedCity); // Устанавливаем город при загрузке данных пользователя
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }, [form, selectedCity]);

    React.useEffect(() => {
        if (session && isInitialized) {
            fetchUserInfo();
        }
    }, [session, fetchUserInfo, isInitialized]);

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            console.log('Данные заказа:', data);

            const result = await createOrder(data);

            toast.success(`Заказ #${result.orderId} успешно оформлен для города ${selectedCity}!`, {
                duration: 3000,
                position: 'bottom-center',
            });

            // Перенаправляем на главную страницу
            setTimeout(() => {
                router.push('/'); // Редирект на главную
            }, 1500);

        } catch (err) {
            console.error('Ошибка оформления заказа:', err);
            setSubmitting(false);
            toast.error('Не удалось создать заказ. Попробуйте еще раз.', {
                duration: 4000,
                position: 'bottom-center',
            });
        }
    };

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };

    const isFormDisabled = loading || submitting || !isInitialized;

    // Отслеживаем изменения формы для отладки
    React.useEffect(() => {
        const subscription = form.watch((value) => {
            console.log('Текущие значения формы:', value);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    if (!isInitialized) {
        return (
            <Container className="mt-4 sm:mt-6 lg:mt-8 pb-20 sm:pb-24">
                <div className="animate-pulse">
                    <div className="h-8 bg-black rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-64 bg-black rounded"></div>
                            <div className="h-32 bg-black rounded"></div>
                            <div className="h-32 bg-black rounded"></div>
                        </div>
                        <div className="h-48 bg-black rounded"></div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4 sm:mt-6 lg:mt-8 pb-20 sm:pb-24">
            <Title
                text="Оформление заказа"
                className="font-extrabold mb-4 sm:mb-6 lg:mb-8 text-xl sm:text-2xl lg:text-3xl text-center lg:text-left"
            />

            {/* Блок с информацией о выбранном городе */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-900">
                            Город доставки: <span className="font-bold">{selectedCity}</span>
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                            Доступность товаров и условия доставки зависят от выбранного города
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-blue-600">
                            Город сохранен в заказе
                        </p>
                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                        >
                            Изменить город
                        </button>
                    </div>
                </div>
            </div>

            {/* Скрытое поле для города (опционально) */}
            <input type="hidden" {...form.register('city')} />

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
                        {/* Левая часть - формы */}
                        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 flex-1">
                            <CheckoutCart
                                onClickCountButton={onClickCountButton}
                                removeCartItem={removeCartItem}
                                items={items}
                                loading={loading}
                            />

                            <CheckoutPersonalForm
                                className={cn(
                                    'transition-opacity duration-200',
                                    isFormDisabled && 'opacity-50 pointer-events-none'
                                )}
                            />

                            <CheckoutAddressForm
                                className={cn(
                                    'transition-opacity duration-200',
                                    isFormDisabled && 'opacity-50 pointer-events-none'
                                )}
                            />

                            {/* Отладочная информация (можно удалить в продакшене) */}
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <p className="text-sm text-gray-600">
                                    <strong>Отладка:</strong> Город в форме: {form.watch('city')}
                                </p>
                            </div>
                        </div>

                        {/* Правая часть - сайдбар */}
                        <div className="w-full xl:w-[400px] 2xl:w-[450px] order-first xl:order-last">
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                                loading={isFormDisabled}
                                selectedCity={selectedCity}
                                className="sticky top-4"
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Container>
    );
}