//shared/components/shared/header.tsx
'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProfileButton } from './profile-button';
import { AuthModal } from './modals';

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({hasCart = true, className }) => {
    const router = useRouter();
    const [openAuthModal, setOpenAuthModal] = React.useState(false);

    const searchParams = useSearchParams();

    React.useEffect(() => {
        let toastMessage = '';

        if (searchParams.has('paid')) {
            toastMessage = 'Заказ успешно оплачен! Информация отправлена на почту.';
        }

        if (searchParams.has('verified')) {
            toastMessage = 'Почта успешно подтверждена!';
        }

        if (toastMessage) {
            setTimeout(() => {
                router.replace('/');
                toast.success(toastMessage, {
                    duration: 3000,
                });
            }, 1000);
        }
    }, []);

    return (
        <header className={cn('border-b', className)}>
            <Container className="flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8"> {/* Добавляем горизонтальные отступы */}
                {/* Левая часть - логотип */}
                <Link href="/" className="flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <Image
                            src="/logo.jpg"
                            alt="Logo"
                            width={35}
                            height={35}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-[35px] md:h-[35px]"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-lg md:text-xl lg:text-2xl uppercase font-black leading-tight">
                                Мясной Цех
                            </h1>
                            <p className="text-xs md:text-sm text-gray-400 leading-3 hidden md:block">
                                сделано на Урале
                            </p>
                        </div>
                        {/* Мобильная версия текста */}
                        <div className="sm:hidden">
                            <h1 className="text-lg font-black uppercase leading-tight">
                                МЦ
                            </h1>
                        </div>
                    </div>
                </Link>

                {/* Правая часть - кнопки */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

                    <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

                    {hasCart && <CartButton />}
                </div>
            </Container>
        </header>
    );
};