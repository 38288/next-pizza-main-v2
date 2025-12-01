// app/(checkout)/checkout/page.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CheckoutSidebar,
    Container,
    Title,
    CheckoutCart,
    CheckoutPersonalForm,
    CheckoutSelectReceipt,
} from '@/shared/components'; // Убираем CheckoutAddressForm
import { CheckoutFormValues, checkoutFormSchema } from '@/shared/constants';
import { useCart } from '@/shared/hooks';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';
import { cn } from '@/shared/lib/utils';
import { useCity } from '@/shared/hooks/use-city';
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const [deliveryType, setDeliveryType] = React.useState<'delivery' | 'pickup'>('pickup');
    const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'online'>('cash');

    const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
    const { data: session } = useSession();
    const { selectedCity, isInitialized, useCitySubscription } = useCity();
    const router = useRouter();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            firstName: '',
            phone: '',
            address: '', // Теперь address в CheckoutSelectReceipt
            comment: '',
            city: selectedCity,
            deliveryType: 'pickup',
            paymentMethod: 'cash',
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

    // Синхронизируем локальные состояния с формой
    React.useEffect(() => {
        form.setValue('deliveryType', deliveryType);
    }, [deliveryType, form]);

    React.useEffect(() => {
        form.setValue('paymentMethod', paymentMethod);
    }, [paymentMethod, form]);

    const fetchUserInfo = React.useCallback(async () => {
        try {
            const data = await Api.auth.getMe();
            const [firstName] = data.fullName.split(' ');

            form.setValue('firstName', firstName || '');
            form.setValue('phone', data.phone || '');
            form.setValue('city', selectedCity);
            form.setValue('deliveryType', deliveryType);
            form.setValue('paymentMethod', paymentMethod);
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }, [form, selectedCity, deliveryType, paymentMethod]);

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

            toast.success(`Заказ #${result.orderId} успешно оформлен!`, {
                duration: 3000,
                position: 'bottom-center',
            });

            // Перенаправляем на главную страницу
            setTimeout(() => {
                router.push('/');
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

    if (!isInitialized) {
        return (
            <Container className="mt-4 sm:mt-6 lg:mt-8 pb-20 sm:pb-24">
                <div className="animate-pulse">
                    <div className="h-8 bg-black rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-64 bg-black rounded"></div>
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

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
                        {/* Левая часть - формы */}
                        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 flex-1">
                            <CheckoutSelectReceipt
                                deliveryType={deliveryType}
                                setDeliveryType={setDeliveryType}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                            />

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
                        </div>

                        {/* Правая часть - сайдбар */}
                        <div className="w-full xl:w-[400px] 2xl:w-[450px] order-first xl:order-last">
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                                loading={isFormDisabled}
                                selectedCity={selectedCity}
                                deliveryType={deliveryType}
                                className="sticky top-4"
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Container>
    );
}
