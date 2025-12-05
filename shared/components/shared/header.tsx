// shared/components/shared/header.tsx
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
    organizations?: Array<{
        id: string;
        externalId: string;
        name: string;
        code: string | null;
    }>;
    showCityModal?: boolean;
}

export const Header: React.FC<Props> = ({
                                            hasCart = true,
                                            className,
                                            currentCity: serverCurrentCity,
                                            organizations: serverOrganizations = [],
                                            showCityModal = false,
                                        }) => {
    const router = useRouter();
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [openCityModal, setOpenCityModal] = useState(showCityModal);

    const { selectedCity, organizations: storeOrganizations, setSelectedCity, setOrganizations } = useCityStore();

    const searchParams = useSearchParams();

    // Инициализация организаций
    useEffect(() => {
        if (serverOrganizations.length > 0 && storeOrganizations.length === 0) {
            setOrganizations(serverOrganizations);
        }
    }, [serverOrganizations, storeOrganizations.length, setOrganizations]);

    // Показываем модальное окно при первом заходе
    useEffect(() => {
        if (!selectedCity && !serverCurrentCity && serverOrganizations.length > 0) {
            setOpenCityModal(true);
        }
    }, [selectedCity, serverCurrentCity, serverOrganizations]);

    // Обработка toast-уведомлений
    useEffect(() => {
        if (searchParams.has('paid')) {
            setTimeout(() => {
                router.replace('/');
                toast.success('Заказ успешно оплачен! Информация отправлена на почту.', {
                    duration: 3000,
                });
            }, 1000);
        }
    }, [searchParams, router]);

    const handleCitySelect = async (orgId: string) => {
        try {
            setSelectedCity(orgId);

            // Сохраняем в cookies через API
            const response = await fetch('/api/city', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cityId: orgId }),
            });

            if (!response.ok) {
                throw new Error('Failed to save city');
            }

            // Сохраняем в localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedCity', orgId);
            }

            setOpenCityModal(false);

            // Обновляем URL
            const params = new URLSearchParams(searchParams.toString());
            params.set('city', orgId);
            router.push(`/?${params.toString()}`);
            router.refresh();

            toast.success('Филиал успешно выбран!');

        } catch (error) {
            console.error('Failed to save city:', error);
            toast.error('Не удалось сохранить филиал');
            setOpenCityModal(false);
        }
    };

    const handleCityModalClose = () => {
        if (selectedCity || serverCurrentCity) {
            setOpenCityModal(false);
        }
    };

    // Получаем уникальные организации
    const uniqueOrganizations = useMemo(() => {
        const allOrganizations = [...serverOrganizations, ...storeOrganizations];
        const orgMap = new Map();
        allOrganizations.forEach(org => {
            if (!orgMap.has(org.externalId)) {
                orgMap.set(org.externalId, org);
            }
        });
        return Array.from(orgMap.values());
    }, [storeOrganizations, serverOrganizations]);

    // Получаем название текущей организации
    const getCurrentOrganizationName = () => {
        const orgId = selectedCity || serverCurrentCity;
        if (!orgId) return 'Выберите филиал';

        const organization = serverOrganizations.find(o => o.externalId === orgId)
            || storeOrganizations.find(o => o.externalId === orgId)
            || uniqueOrganizations.find(o => o.externalId === orgId);

        return organization?.name || 'Филиал не найден';
    };

    // Форматируем для CityModal
    const organizationsForModal = useMemo(() => {
        return uniqueOrganizations.map(org => ({
            id: org.externalId,
            name: org.name,
            code: org.code || ''
        }));
    }, [uniqueOrganizations]);

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

                    {/* Кнопка выбора филиала */}
                    <div className="flex-1 max-w-xs mx-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:text-orange-400 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 transition-colors"
                            onClick={() => setOpenCityModal(true)}
                            aria-label="Выбрать филиал"
                        >
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate font-medium">
                                {getCurrentOrganizationName()}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                        </Button>
                    </div>

                    {/* Кнопки профиля и корзины */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/*<ProfileButton onAuthClick={() => setOpenAuthModal(true)} />*/}
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
                cities={organizationsForModal}
                currentCity={selectedCity || serverCurrentCity}
                isForced={!selectedCity && !serverCurrentCity}
            />
        </>
    );
};