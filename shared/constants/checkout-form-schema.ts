// shared/constants/checkout-form-schema.ts
import { z } from 'zod';

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }),
    phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
    address: z.string(),
    city: z.string().min(1, { message: 'Выберите город доставки' }),
    comment: z.string().optional(),
    deliveryType: z.enum(['delivery', 'pickup']),
    paymentMethod: z.enum(['cash', 'online']),
}).refine((data) => {
    if (data.deliveryType === 'delivery') {
        return data.address.trim().length >= 5;
    }
    return true;
}, {
    message: 'Адрес должен содержать не менее 5 символов',
    path: ['address'],
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
