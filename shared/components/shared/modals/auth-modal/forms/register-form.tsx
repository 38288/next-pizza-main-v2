// shared/components/shared/modals/auth-modal/forms/register-form.tsx
'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerUser } from '@/app/actions';
import { TFormRegisterValues, formRegisterSchema } from './schemas';
import { FormInput } from '../../../form';
import { Button } from '@/shared/components/ui';

interface Props {
    onClose?: VoidFunction;
    onClickLogin?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose, onClickLogin }) => {
    const form = useForm<TFormRegisterValues>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            phone: '',
            fullName: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: TFormRegisterValues) => {
        try {
            await registerUser({
                phone: data.phone,
                fullName: data.fullName,
                password: data.password,
            });

            toast.error('Регистрация успешна 📝. Проверьте ваш телефон', {
                icon: '✅',
            });

            onClose?.();
        } catch (error) {
            return toast.error('Ошибка регистрации', {
                icon: '❌',
            });
        }
    };

    return (
        <FormProvider {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormInput name="phone" label="Телефон" required />
                <FormInput name="fullName" label="Полное имя" required />
                <FormInput name="password" label="Пароль" type="password" required />
                <FormInput name="confirmPassword" label="Подтвердите пароль" type="password" required />

                <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
                    Зарегистрироваться
                </Button>
            </form>
        </FormProvider>
    );
};