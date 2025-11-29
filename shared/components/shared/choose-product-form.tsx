//shared/components/shared/choose-product-form.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    loading?: boolean;
    onSubmit?: VoidFunction;
    className?: string;
}

/**
 * Форма выбора ПРОДУКТА
 */
export const ChooseProductForm: React.FC<Props> = ({
                                                       name,
                                                       imageUrl,
                                                       price,
                                                       onSubmit,
                                                       className,
                                                       loading,
                                                   }) => {
    return (
        <div className={cn(className, 'flex flex-col lg:flex-row flex-1 min-h-0')}>
            {/* Изображение продукта */}
            <div className="lg:flex-1 flex justify-center items-center p-4 sm:p-6 bg-gray-800 min-h-[300px] sm:min-h-[400px]">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full max-w-[280px] sm:max-w-[350px] h-auto object-contain"
                />
            </div>

            {/* Информация и кнопка */}
            <div className="w-full lg:w-[490px] bg-gray-800 p-4 sm:p-6 lg:p-7 flex flex-col justify-center">
                <Title text={name} size="md" className="font-extrabold mb-4 text-center lg:text-left text-white" />

                {/* Цена */}
                <div className="text-center lg:text-left mb-6">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{price} ₽</div>
                    <p className="text-gray-300 text-sm mt-2 hidden sm:block">
                        Готов к добавлению в корзину
                    </p>
                </div>

                <Button
                    loading={loading}
                    onClick={() => onSubmit?.()}
                    className="h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl w-full font-bold hover:bg-gray-600 text-white">
                    Добавить в корзину
                </Button>

                {/* Подпись под кнопкой на мобильных */}
                <p className="text-center text-gray-400 text-xs mt-2 sm:hidden">
                    Сумма: {price} ₽
                </p>
            </div>
        </div>
    );
};