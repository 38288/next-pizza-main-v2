// shared/components/shared/header.tsx
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
import { useCity } from '@/shared/hooks/use-city'; // Импортируем наш хук

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({hasCart = true, className }) => {
    const router = useRouter();
    const [openAuthModal, setOpenAuthModal] = React.useState(false);
    const { selectedCity, setSelectedCity, isInitialized } = useCity();

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

    const cities = ['Верхняя Салда, Парковая', 'Верхняя Салда, Студент', 'Качканар', 'Екатеринбург'];

    // Показываем скелетон пока город загружается
    if (!isInitialized) {
        return (
            <header className={cn('border-b', className)}>
                <Container className="flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
                    {/* Скелетон для логотипа */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-[35px] md:h-[35px] bg-gray-200 rounded animate-pulse" />
                        <div className="hidden sm:block">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Скелетон для выбора города */}
                    <div className="flex-1 flex justify-center mx-4">
                        <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    {/* Скелетон для кнопок */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </Container>
            </header>
        );
    }

    return (
        <header className={cn('border-b', className)}>
            <Container className="flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
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

                {/* Компонент выбора города */}
                <div className="flex-1 flex justify-center mx-4">
                    <div className="relative group">
                        <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <span>{selectedCity}</span>
                            <svg
                                className="w-4 h-4 transition-transform group-hover:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Выпадающий список городов */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {cities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                        selectedCity === city
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

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