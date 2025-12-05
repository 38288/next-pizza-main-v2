//shared/components/shared/modals/city-modal.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modal } from './modal';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { MapPin, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface City {
    id: string;
    name: string;
    code: string;
}

interface CityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCitySelect: (cityId: string) => Promise<void> | void;
    cities: City[];
    currentCity?: string;
    isForced?: boolean;
}

export const CityModal: React.FC<CityModalProps> = ({
                                                        isOpen,
                                                        onClose,
                                                        onCitySelect,
                                                        cities,
                                                        currentCity,
                                                        isForced = false
                                                    }) => {
    const [tempSelectedCity, setTempSelectedCity] = useState<string | null>(currentCity || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Инициализация выбранного города
    useEffect(() => {
        if (currentCity) {
            setTempSelectedCity(currentCity);
        } else if (cities.length > 0 && !tempSelectedCity) {
            // Автовыбор первого города если нет текущего
            setTempSelectedCity(cities[0].id);
        }
    }, [currentCity, cities]);

    // Обработка клавиатуры
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape' && !isForced) {
                handleClose();
            }
            if (e.key === 'Enter' && tempSelectedCity && !isLoading) {
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, tempSelectedCity, isLoading, isForced]);

    const handleClose = useCallback(() => {
        // Разрешаем закрыть только если город выбран или это не forced режим
        if (isForced && !tempSelectedCity) {
            return; // Не закрываем если forced и город не выбран
        }

        // Анимация закрытия
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    }, [isForced, tempSelectedCity, onClose]);

    const handleSubmit = async () => {
        if (!tempSelectedCity || isLoading) return;

        setIsLoading(true);
        try {
            // Вызываем обработчик выбора города
            await onCitySelect(tempSelectedCity);

            // Успешный выбор - закрываем с задержкой для анимации
            setTimeout(() => {
                setIsLoading(false);
                handleClose();
            }, 500);

        } catch (error) {
            console.error('Error selecting city:', error);
            setIsLoading(false);
            // Не закрываем модалку при ошибке
        }
    };

    const selectedCityName = tempSelectedCity
        ? cities.find(city => city.id === tempSelectedCity)?.name
        : null;

    return (
        <Modal
            isOpen={isOpen && !isClosing}
            onClose={handleClose}
            title={isForced ? "Выберите город для продолжения" : "Выберите ваш город"}
            description={isForced
                ? "Для использования сайта необходимо выбрать филиал"
                : "Это поможет показать доступные товары в вашем филиале"
            }
            closeable={!isForced && !isLoading}
            className={cn(
                "transition-all duration-300",
                isClosing && "opacity-0 scale-95"
            )}
        >
            <div className="space-y-6">
                {isForced && !currentCity && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-700/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-500">
                                Требуется выбор города
                            </p>
                            <p className="text-xs text-amber-400/80 mt-1">
                                Для просмотра товаров и оформления заказов выберите ваш филиал
                            </p>
                        </div>
                    </div>
                )}

                {cities.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Нет доступных городов</p>
                    </div>
                ) : (
                    <RadioGroup
                        value={tempSelectedCity || ''}
                        onValueChange={setTempSelectedCity}
                        className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
                        disabled={isLoading}
                    >
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                className={cn(
                                    "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                                    "group hover:shadow-md",
                                    tempSelectedCity === city.id
                                        ? "border-orange-500 bg-gradient-to-r from-orange-500/10 to-orange-600/5 shadow-lg"
                                        : "border-gray-700 hover:bg-gray-800/50 hover:border-gray-600",
                                    isLoading && "opacity-60 cursor-not-allowed"
                                )}
                                onClick={() => !isLoading && setTempSelectedCity(city.id)}
                            >
                                <div className="relative">
                                    <RadioGroupItem
                                        value={city.id}
                                        id={`city-${city.id}`}
                                        className="border-gray-600 data-[state=checked]:border-orange-500"
                                        disabled={isLoading}
                                    />
                                    {tempSelectedCity === city.id && (
                                        <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-orange-500" />
                                    )}
                                </div>
                                <Label
                                    htmlFor={`city-${city.id}`}
                                    className="flex-1 cursor-pointer flex items-center gap-3"
                                >
                                    <MapPin className={cn(
                                        "w-5 h-5 flex-shrink-0 transition-colors",
                                        tempSelectedCity === city.id
                                            ? "text-orange-500"
                                            : "text-gray-400 group-hover:text-gray-300"
                                    )} />
                                    <div className="flex-1">
                                        <span className={cn(
                                            "font-semibold block transition-colors",
                                            tempSelectedCity === city.id
                                                ? "text-orange-400"
                                                : "text-white group-hover:text-orange-300"
                                        )}>
                                            {city.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            Код филиала: <span className="font-mono">{city.code}</span>
                                        </span>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/50">
                    {!isForced && (
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 border-gray-600 hover:bg-gray-800 hover:border-gray-500"
                        >
                            Позже
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={!tempSelectedCity || isLoading}
                        className={cn(
                            "flex-1 bg-gradient-to-r from-orange-500 to-orange-600",
                            "hover:from-orange-600 hover:to-orange-700",
                            "shadow-lg hover:shadow-orange-500/25",
                            "transition-all duration-300",
                            (!tempSelectedCity || isLoading) && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Сохранение...
                            </span>
                        ) : selectedCityName ? (
                            <span className="flex items-center justify-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Выбрать {selectedCityName}
                            </span>
                        ) : (
                            'Выбрать город'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};