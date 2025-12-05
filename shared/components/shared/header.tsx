'use client';

import { cn } from '@/shared/lib/utils';
import React, { useState, useEffect, useMemo } from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProfileButton } from './profile-button';
import { AuthModal, CityModal } from './modals';
import { Button } from '@/shared/components/ui/button';
import { MapPin, ChevronDown } from 'lucide-react';
import { useCityStore } from '@/shared/store/city';

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
    currentCity?: string;
    cities?: Array<{ id: string; name: string; code: string }>;
    showCityModal?: boolean;
}

export const Header: React.FC<Props> = ({
                                            hasCart = true,
                                            className,
                                            currentCity: serverCurrentCity,
                                            cities: serverCities = [],
                                            showCityModal = false,
                                        }) => {
    const router = useRouter();
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [openCityModal, setOpenCityModal] = useState(showCityModal);
    const [isInitializing, setIsInitializing] = useState(true);

    const { selectedCity, cities: storeCities, setSelectedCity, setCities } = useCityStore();

    const searchParams = useSearchParams();

    // Инициализация при монтировании
    useEffect(() => {
        const initializeCity = async () => {
            setIsInitializing(true);

            // 1. Сохраняем города в стор
            if (serverCities.length > 0 && storeCities.length === 0) {
                setCities(serverCities);
            }

            // 2. Проверяем localStorage для быстрого отображения
            if (typeof window !== 'undefined') {
                const savedCity = localStorage.getItem('selectedCity');
                if (savedCity && savedCity !== selectedCity) {
                    setSelectedCity(savedCity);
                }
            }

            // 3. Синхронизируем серверный город с клиентским состоянием
            if (serverCurrentCity && serverCurrentCity !== selectedCity) {
                setSelectedCity(serverCurrentCity);

                // Сохраняем в localStorage для консистентности
                if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedCity', serverCurrentCity);
                }
            }

            setIsInitializing(false);
        };

        initializeCity();
    }, [serverCurrentCity, serverCities, storeCities.length, setCities, setSelectedCity]);

    // Показываем модальное окно при первом заходе (нет города)
    useEffect(() => {
        if (!isInitializing && !selectedCity && !serverCurrentCity && serverCities.length > 0) {
            setOpenCityModal(true);
        }
    }, [isInitializing, selectedCity, serverCurrentCity, serverCities]);

    // Обработка toast-уведомлений
    useEffect(() => {
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
    }, [searchParams, router]);

    const handleCitySelect = async (cityId: string) => {
        try {
            // Сохраняем в стор
            setSelectedCity(cityId);

            // Сохраняем в cookies через API
            const response = await fetch('/api/city', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cityId }),
            });

            if (!response.ok) {
                throw new Error('Failed to save city to cookies');
            }

            // Сохраняем в localStorage для клиентского доступа
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedCity', cityId);
            }

            setOpenCityModal(false);

            // Обновляем URL с параметром города
            const params = new URLSearchParams(searchParams.toString());
            params.set('city', cityId);

            // Обновляем страницу
            router.push(`/?${params.toString()}`);
            router.refresh();

            toast.success('Город успешно выбран!');

        } catch (error) {
            console.error('Failed to save city:', error);
            toast.error('Не удалось сохранить город. Попробуйте снова.');

            // В случае ошибки всё равно закрываем модалку, но показываем ошибку
            setOpenCityModal(false);
        }
    };

    const handleCityModalClose = () => {
        // Закрываем только если не в forced режиме
        if (selectedCity || serverCurrentCity) {
            setOpenCityModal(false);
        }
    };

    // Получаем уникальные города без дубликатов
    const uniqueCities = useMemo(() => {
        // Объединяем города, отдавая приоритет серверным
        const allCities = [...serverCities, ...storeCities];

        // Используем Map для гарантированной уникальности по id
        const cityMap = new Map();
        allCities.forEach(city => {
            if (!cityMap.has(city.id)) {
                cityMap.set(city.id, city);
            }
        });

        return Array.from(cityMap.values());
    }, [storeCities, serverCities]);

    // Получаем отображаемое название города
    const getCurrentCityName = () => {
        if (isInitializing) return 'Загрузка...';

        const cityId = selectedCity || serverCurrentCity;
        if (!cityId) return 'Выберите город';

        // Ищем в приоритетном порядке
        const city = serverCities.find(c => c.id === cityId)
            || storeCities.find(c => c.id === cityId)
            || uniqueCities.find(c => c.id === cityId);

        return city?.name || 'Город не найден';
    };

    return (
        <>
            <header className={cn('border-b border-gray-700 bg-gray-900', className)}>
                <Container className="flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
                    {/* Логотип */}
                    <Link href="/" className="flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <Image
                                src="/logo.jpg"
                                alt="Логотип Мясной Цех"
                                width={35}
                                height={35}
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-[35px] md:h-[35px] rounded-lg"
                                priority
                            />
                            <div className="hidden sm:block">
                                <h1 className="text-lg md:text-xl lg:text-2xl uppercase font-black leading-tight text-white">
                                    Мясной Цех
                                </h1>
                                <p className="text-xs md:text-sm text-gray-400 leading-3 hidden md:block">
                                    сделано на Урале
                                </p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-lg font-black uppercase leading-tight text-white">
                                    МЦ
                                </h1>
                            </div>
                        </div>
                    </Link>

                    {/* Кнопка выбора города */}
                    <div className="flex-1 max-w-xs mx-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:text-orange-400 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 transition-colors"
                            onClick={() => setOpenCityModal(true)}
                            aria-label="Выбрать город"
                            disabled={isInitializing}
                        >
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate font-medium">{getCurrentCityName()}</span>
                            <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                        </Button>
                    </div>

                    {/* Кнопки профиля и корзины */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <ProfileButton onAuthClick={() => setOpenAuthModal(true)} />
                        {hasCart && <CartButton />}
                    </div>
                </Container>
            </header>

            {/* Модальные окна */}
            <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

            <CityModal
                isOpen={openCityModal}
                onClose={handleCityModalClose}
                onCitySelect={handleCitySelect}
                cities={uniqueCities}
                currentCity={selectedCity || serverCurrentCity}
                isForced={!selectedCity && !serverCurrentCity}
            />
        </>
    );
};