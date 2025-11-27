//shared/components/shared/checkout-item-skeleton.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
    className?: string;
}

export const CheckoutItemSkeleton: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn(
            'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-lg sm:bg-transparent sm:p-0 animate-pulse',
            className
        )}>
            {/* Верхняя часть на мобильных - информация */}
            <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto sm:flex-1">
                <div className="w-14 h-14 sm:w-[50px] sm:h-[50px] bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="w-32 h-4 sm:w-40 sm:h-5 bg-gray-200 rounded mb-2" />
                    <div className="w-24 h-3 sm:hidden bg-gray-200 rounded" />
                </div>
            </div>

            {/* Нижняя часть на мобильных - цена и управление */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:ml-5">
                {/* Цена на мобильных */}
                <div className="sm:hidden flex items-center gap-2">
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                </div>

                {/* Цена на десктопе */}
                <div className="hidden sm:block h-5 w-16 bg-gray-200 rounded" />

                {/* Счетчик */}
                <div className="h-8 w-24 sm:w-[100px] bg-gray-200 rounded" />

                {/* Кнопка удаления */}
                <div className="w-10 h-10 bg-gray-200 rounded-lg sm:ml-5" />
            </div>
        </div>
    );
};
