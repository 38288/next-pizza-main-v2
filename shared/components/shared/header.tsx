// shared/components/shared/header.tsx
'use client';

import { cn } from '@/shared/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProfileButton } from './profile-button';
import { AuthModal } from './modals';
import { useCity } from '@/shared/hooks/use-city';

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

const CitySelector: React.FC<{
    selectedCity: string;
    setSelectedCity: (city: string) => void
}> = ({ selectedCity, setSelectedCity }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const cities = ['Верхняя Салда, Парковая', 'Верхняя Салда, Студент', 'Качканар', 'Екатеринбург'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setIsOpen(false);
    };

    return (
        <div className="flex-1 flex justify-center mx-4">
            <div className="relative group" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                >
                    <span>{selectedCity}</span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-gray-900/50 transition-all duration-200 z-50 ${
                    isOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                }`}>
                    {cities.map((city) => (
                        <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                selectedCity === city
                                    ? 'bg-gray-700 text-white font-medium'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Header: React.FC<Props> = ({ hasCart = true, className }) => {
    const router = useRouter();
    const [openAuthModal, setOpenAuthModal] = useState(false);
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

    // Скелетон для загрузки
    if (!isInitialized) {
        return (
            <header className={cn('border-b border-gray-700', className)}>
                <Container className="flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
                    {/* Скелетон для логотипа */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-[35px] md:h-[35px] bg-gray-700 rounded animate-pulse" />
                        <div className="hidden sm:block">
                            <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-1" />
                            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Скелетон для выбора города */}
                    <div className="flex-1 flex justify-center mx-4">
                        <div className="w-32 h-9 bg-gray-700 rounded-lg animate-pulse" />
                    </div>

                    {/* Скелетон для кнопок */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                    </div>
                </Container>
            </header>
        );
    }

    return (
        <header className={cn('border-b border-gray-700 bg-gray-900', className)}>
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
                            <h1 className="text-lg md:text-xl lg:text-2xl uppercase font-black leading-tight text-white">
                                Мясной Цех
                            </h1>
                            <p className="text-xs md:text-sm text-gray-400 leading-3 hidden md:block">
                                сделано на Урале
                            </p>
                        </div>
                        {/* Мобильная версия текста */}
                        <div className="sm:hidden">
                            <h1 className="text-lg font-black uppercase leading-tight text-white">
                                МЦ
                            </h1>
                        </div>
                    </div>
                </Link>

                {/* Компонент выбора города */}
                {hasCart && <CitySelector
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                />}

                {/* Правая часть - кнопки */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

                    {/*<ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />*/}

                    {hasCart && <CartButton />}
                </div>
            </Container>
        </header>
    );
};