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

export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
    const { data: session } = useSession();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        },
    });

    // Используем useCallback для стабильной функции
    const fetchUserInfo = React.useCallback(async () => {
        try {
            const data = await Api.auth.getMe();
            const [firstName, lastName] = data.fullName.split(' ');

            form.setValue('firstName', firstName || '');
            form.setValue('lastName', lastName || '');
            form.setValue('email', data.email || '');
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }, [form]); // Добавляем form в зависимости

    React.useEffect(() => {
        if (session) {
            fetchUserInfo();
        }
    }, [session, fetchUserInfo]); // Добавляем fetchUserInfo в зависимости

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            const url = await createOrder(data);

            toast.success('Заказ успешно оформлен! Переход на оплату...', {
                duration: 3000,
                position: 'bottom-center',
            });

            if (url) {
                setTimeout(() => {
                    location.href = url;
                }, 1500);
            }
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

    const isFormDisabled = loading || submitting;

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
                        </div>

                        {/* Правая часть - сайдбар */}
                        <div className="w-full xl:w-[400px] 2xl:w-[450px] order-first xl:order-last">
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                                loading={isFormDisabled}
                                className="sticky top-4"
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Container>
    );
}
