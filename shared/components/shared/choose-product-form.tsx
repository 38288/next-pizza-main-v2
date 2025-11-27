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
            <div className="lg:flex-1 flex justify-center items-center p-4 sm:p-6 bg-secondary min-h-[300px] sm:min-h-[400px]">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full max-w-[280px] sm:max-w-[350px] h-auto object-contain"
                />
            </div>

            {/* Информация и кнопка */}
            <div className="w-full lg:w-[490px] bg-[#f7f6f5] p-4 sm:p-6 lg:p-7 flex flex-col justify-center">
                <Title text={name} size="md" className="font-extrabold mb-4 text-center lg:text-left" />

                {/* Цена */}
                <div className="text-center lg:text-left mb-6">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{price} ₽</div>
                    <p className="text-gray-600 text-sm mt-2 hidden sm:block">
                        Готов к добавлению в корзину
                    </p>
                </div>

                <Button
                    loading={loading}
                    onClick={() => onSubmit?.()}
                    className="h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl w-full font-bold">
                    Добавить в корзину
                </Button>

                {/* Подпись под кнопкой на мобильных */}
                <p className="text-center text-gray-500 text-xs mt-2 sm:hidden">
                    Сумма: {price} ₽
                </p>
            </div>
        </div>
    );
};
