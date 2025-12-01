// shared/components/shared/modals/auth-modal/forms/schemas.ts
import { z } from 'zod';

export const passwordSchema = z.string().min(4, { message: 'Введите корректный пароль' });

// Схема для логина через телефон
export const formLoginSchema = z.object({
    phone: z.string()
        .min(10, { message: 'Телефон должен содержать минимум 10 цифр' })
        .regex(/^\+?[0-9\s\-\(\)]+$/, { message: 'Некорректный формат телефона' }),
    password: passwordSchema,
});

// Схема для регистрации через телефон
export const formRegisterSchema = z.object({
    phone: z.string()
        .min(10, { message: 'Телефон должен содержать минимум 10 цифр' })
        .regex(/^\+?[0-9\s\-\(\)]+$/, { message: 'Некорректный формат телефона' }),
    fullName: z.string().min(2, { message: 'Введите имя и фамилию' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    });

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
