// shared/hooks/use-city.ts
'use client';

import { useState, useEffect } from 'react';

export const useCity = () => {
    const [selectedCity, setSelectedCity] = useState<string>('Верхняя Салда, Парковая');
    const [isInitialized, setIsInitialized] = useState(false);

    // Инициализация из localStorage при монтировании
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCity = localStorage.getItem('selectedCity');
            if (savedCity) {
                setSelectedCity(savedCity);
            }
            setIsInitialized(true);
        }
    }, []);

    // Функция для обновления города
    const updateCity = (city: string) => {
        setSelectedCity(city);
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedCity', city);

            // Опционально: можно также диспатчить кастомное событие
            // для уведомления других компонентов об изменении города
            window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
        }
    };

    // Хук для подписки на изменения города
    const useCitySubscription = (callback: (city: string) => void) => {
        useEffect(() => {
            const handleCityChange = (event: CustomEvent) => {
                callback(event.detail);
            };

            window.addEventListener('cityChanged', handleCityChange as EventListener);

            return () => {
                window.removeEventListener('cityChanged', handleCityChange as EventListener);
            };
        }, [callback]);
    };

    return {
        selectedCity,
        setSelectedCity: updateCity,
        isInitialized,
        useCitySubscription
    };
};