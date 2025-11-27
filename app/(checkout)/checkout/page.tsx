//app/(checkout)/checkout/page.tsx
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

    React.useEffect(() => {
        async function fetchUserInfo() {
            const data = await Api.auth.getMe();
            const [firstName, lastName] = data.fullName.split(' ');

            form.setValue('firstName', firstName);
            form.setValue('lastName', lastName);
            form.setValue('email', data.email);
        }

        if (session) {
            fetchUserInfo();
        }
    }, [session]);

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            const url = await createOrder(data);

            toast.success('Заказ успешно оформлен! 📝 Переход на оплату... ', {
                duration: 3000,
                position: 'bottom-center', // Лучшая позиция для мобильных
            });

            if (url) {
                location.href = url;
            }
        } catch (err) {
            console.log(err);
            setSubmitting(false);
            toast.error('Не удалось создать заказ', {
                duration: 4000,
                position: 'bottom-center',
            });
        }
    };

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };

    return (
        <Container className="mt-6 sm:mt-8 lg:mt-10">
            <Title
                text="Оформление заказа"
                className="font-extrabold mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-[36px] text-center sm:text-left"
            />

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
                        {/* Левая часть - формы */}
                        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 flex-1 mb-16 sm:mb-20 lg:mb-20">
                            <CheckoutCart
                                onClickCountButton={onClickCountButton}
                                removeCartItem={removeCartItem}
                                items={items}
                                loading={loading}
                            />

                            <CheckoutPersonalForm className={loading ? 'opacity-40 pointer-events-none' : ''} />

                            <CheckoutAddressForm className={loading ? 'opacity-40 pointer-events-none' : ''} />
                        </div>

                        {/* Правая часть - сайдбар */}
                        <div className="w-full lg:w-[450px] order-first lg:order-last">
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                                loading={loading || submitting}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Container>
    );
}
