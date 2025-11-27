//shared/components/shared/profile-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TFormRegisterValues, formRegisterSchema } from './modals/auth-modal/forms/schemas';
import { User } from '@prisma/client';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { Container } from './container';
import { Title } from './title';
import { FormInput } from './form';
import { Button } from '../ui';
import { updateUserInfo } from '@/app/actions';
import { cn } from '@/shared/lib/utils';

interface Props {
    data: User;
    className?: string;
}

export const ProfileForm: React.FC<Props> = ({ data, className }) => {
    const form = useForm({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            fullName: data.fullName,
            email: data.email,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (formData: TFormRegisterValues) => {
        try {
            await updateUserInfo({
                email: formData.email,
                fullName: formData.fullName,
                password: formData.password,
            });

            toast.success('Данные обновлены 📝', {
                duration: 3000,
                position: 'bottom-center', // Лучшая позиция для мобильных
            });

            // Сбрасываем поля паролей после успешного обновления
            form.reset({
                ...form.getValues(),
                password: '',
                confirmPassword: '',
            });
        } catch (error) {
            toast.error('Ошибка при обновлении данных', {
                duration: 4000,
                position: 'bottom-center',
            });
        }
    };

    const onClickSignOut = () => {
        signOut({
            callbackUrl: '/',
        });
    };

    return (
        <Container className={cn('my-6 sm:my-8 lg:my-10', className)}>
            <Title
                text={`Личные данные | #${data.id}`}
                size="md"
                className="font-bold text-center sm:text-left"
            />

            <FormProvider {...form}>
                <form
                    className="flex flex-col gap-4 sm:gap-5 w-full max-w-md sm:max-w-96 mt-6 sm:mt-8 lg:mt-10 mx-auto sm:mx-0"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormInput name="email" label="E-Mail" required />
                    <FormInput name="fullName" label="Полное имя" required />

                    <div className="mt-2 sm:mt-4">
                        <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-gray-700">Смена пароля</h3>
                        <div className="flex flex-col gap-4 sm:gap-5">
                            <FormInput
                                type="password"
                                name="password"
                                label="Новый пароль"
                                placeholder="Введите новый пароль"
                            />
                            <FormInput
                                type="password"
                                name="confirmPassword"
                                label="Повторите пароль"
                                placeholder="Повторите новый пароль"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Оставьте поля пустыми, если не хотите менять пароль
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 lg:mt-10">
                        <Button
                            disabled={form.formState.isSubmitting}
                            className="text-sm sm:text-base h-11 sm:h-12 flex-1"
                            type="submit"
                            loading={form.formState.isSubmitting}
                        >
                            Сохранить изменения
                        </Button>

                        <Button
                            onClick={onClickSignOut}
                            variant="outline"
                            disabled={form.formState.isSubmitting}
                            className="text-sm sm:text-base h-11 sm:h-12 flex-1"
                            type="button"
                        >
                            Выйти
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Container>
    );
};
