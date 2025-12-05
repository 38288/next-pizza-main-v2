// app/(checkout)/checkout/page.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CheckoutSidebar,
    Container,
    Title,
    CheckoutCart,
    CheckoutSelectReceipt,
} from '@/shared/components';
import { CheckoutFormValues, checkoutFormSchema } from '@/shared/constants/checkout-form-schema';
import { useCart } from '@/shared/hooks';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import React from 'react';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';
import { useCityStore } from '@/shared/store/city';
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const [deliveryType, setDeliveryType] = React.useState<'delivery' | 'pickup'>('pickup');
    const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'online'>('cash');

    const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
    const { data: session } = useSession();
    const { selectedCity: orgId, organizations } = useCityStore(); // Изменено: organizations вместо cities
    const router = useRouter();

    // Получаем название организации для формы
    const currentOrganizationName = React.useMemo(() => {
        if (!orgId) return '';
        const organization = organizations.find(org => org.externalId === orgId); // Поиск по externalId
        return organization ? organization.name : '';
    }, [orgId, organizations]);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            firstName: '',
            phone: '',
            address: '',
            comment: '',
            city: orgId || '', // externalId организации
            deliveryType: 'pickup',
            paymentMethod: 'cash',
        },
    });

    // Обновляем значение города (externalId организации) при изменении
    React.useEffect(() => {
        if (orgId) {
            form.setValue('city', orgId, { shouldValidate: true });
        }
    }, [orgId, form]);

    // Синхронизируем локальные состояния с формой
    React.useEffect(() => {
        form.setValue('deliveryType', deliveryType, { shouldValidate: true });
    }, [deliveryType, form]);

    React.useEffect(() => {
        form.setValue('paymentMethod', paymentMethod, { shouldValidate: true });
    }, [paymentMethod, form]);

    const fetchUserInfo = React.useCallback(async () => {
        try {
            if (!session) return;

            const data = await Api.auth.getMe();
            const [firstName] = data.fullName.split(' ');

            form.setValue('firstName', firstName || '');
            form.setValue('phone', data.phone || '');

        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }, [form, session]);

    React.useEffect(() => {
        if (session) {
            fetchUserInfo();
        }
    }, [session, fetchUserInfo]);

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            // Получаем полное название организации
            const organizationName = currentOrganizationName || '';

            // Подготовка данных для отправки
            const orderData = {
                ...data,
                cityName: organizationName // Добавляем название организации
            };


            const result = await createOrder(orderData);


            toast.success(
                <div className="text-center">
                    <div className="font-bold text-lg mb-1">✅ Заказ оформлен!</div>
                    <div>Номер заказа: <span className="font-bold">#{result.orderId}</span></div>
                    <div className="text-sm text-gray-200 mt-1">
                        На указанный телефон придёт уведомление
                    </div>
                </div>,
                {
                    duration: 6000,
                    position: 'bottom-center',
                    style: {
                        background: 'black',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        maxWidth: '450px',
                        border: '1px solid #f97316',
                        boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.3)',
                    },
                }
            );

            // Перенаправляем на главную страницу
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } catch (err) {
            console.error('Ошибка оформления заказа:', err);
            toast.error('Не удалось создать заказ. Попробуйте еще раз.', {
                duration: 4000,
                position: 'bottom-center',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };

    const isFormDisabled = loading || submitting || !orgId;

    // Если организация не выбрана
    if (!orgId) {
        return (
            <Container className="mt-4 sm:mt-6 lg:mt-8 pb-20 sm:pb-24">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Филиал не выбран</h2>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Для оформления заказа необходимо выбрать филиал
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Выбрать филиал
                    </button>
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
                            <CheckoutCart
                                onClickCountButton={onClickCountButton}
                                removeCartItem={removeCartItem}
                                items={items}
                                loading={loading}
                            />

                            <CheckoutSelectReceipt
                                deliveryType={deliveryType}
                                setDeliveryType={setDeliveryType}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                            />
                        </div>

                        {/* Правая часть - сайдбар */}
                        <div className="w-full xl:w-[400px] 2xl:w-[450px] order-last xl:order-last">
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                                loading={isFormDisabled}
                                selectedCity={currentOrganizationName}
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