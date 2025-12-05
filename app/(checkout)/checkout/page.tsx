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
    const { selectedCity: cityId, cities } = useCityStore();
    const router = useRouter();

    // Получаем название города для формы
    const currentCityName = React.useMemo(() => {
        if (!cityId) return '';
        const city = cities.find(c => c.id === cityId);
        return city ? city.name : '';
    }, [cityId, cities]);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            firstName: '',
            phone: '',
            address: '',
            comment: '',
            city: cityId || '',
            deliveryType: 'pickup',
            paymentMethod: 'cash',
        },
    });

    // Обновляем значение города при изменении
    React.useEffect(() => {
        if (cityId) {
            form.setValue('city', cityId, { shouldValidate: true });
        }
    }, [cityId, form]);

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

            // Город из стора уже установлен в useEffect выше
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }, [form, session]);

    React.useEffect(() => {
        if (session) {
            fetchUserInfo();
        }
    }, [session, fetchUserInfo]);

    // В функции onSubmit обновите передачу данных
    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);

            // Получаем полное название города
            const cityName = currentCityName || '';

            // Подготовка данных для отправки
            const orderData = {
                ...data,
                cityName: cityName // Добавляем название города
            };

            console.log('📦 Отправка данных заказа:', orderData);

            const result = await createOrder(orderData);

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

    const isFormDisabled = loading || submitting || !cityId;

    if (!cityId) {
        return (
            <Container className="mt-4 sm:mt-6 lg:mt-8 pb-20 sm:pb-24">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Город не выбран</h2>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Для оформления заказа необходимо выбрать город доставки
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Выбрать город
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
                                selectedCity={currentCityName}
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
