// shared/constants/checkout-form-schema.ts
import { z } from 'zod';

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }),
    //lastName: z.string().min(2, { message: 'Фамилия должна содержать не менее 2-х символов' }),
    //email: z.string().email({ message: 'Введите корректную почту' }),
    phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
    address: z.string().optional(),
    city: z.string().min(1, { message: 'Выберите город доставки' }),
    comment: z.string().optional(),
    deliveryType: z.enum(['delivery', 'pickup']), // Добавляем
    paymentMethod: z.enum(['cash', 'online']), // Добавляем
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
