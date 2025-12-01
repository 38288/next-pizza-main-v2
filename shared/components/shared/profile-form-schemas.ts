// shared/components/shared/profile-form-schemas.ts
import { z } from 'zod';

export const formProfileSchema = z.object({
    fullName: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
    phone: z.string()
        .min(10, { message: 'Телефон должен содержать минимум 10 цифр' })
        .regex(/^\+?[0-9\s\-\(\)]+$/, { message: 'Некорректный формат телефона' }),
    password: z.string().min(0), // Делаем необязательным, минимальная длина 0
    confirmPassword: z.string().min(0), // Делаем необязательным, минимальная длина 0
})
    .refine((data) => {
        // Если указан пароль, проверяем длину (мин 4 символа)
        if (data.password && data.password.length > 0) {
            return data.password.length >= 4;
        }
        return true;
    }, {
        message: 'Пароль должен содержать минимум 4 символа',
        path: ['password'],
    })
    .refine((data) => {
        // Если указан пароль, должно быть и подтверждение
        if (data.password && data.password.length > 0 && !data.confirmPassword) {
            return false;
        }
        return true;
    }, {
        message: 'Подтвердите пароль',
        path: ['confirmPassword'],
    })
    .refine((data) => {
        // Если указаны оба пароля, они должны совпадать
        if (data.password && data.password.length > 0 && data.confirmPassword && data.confirmPassword.length > 0) {
            return data.password === data.confirmPassword;
        }
        return true;
    }, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    });

export type TFormProfileValues = z.infer<typeof formProfileSchema>;