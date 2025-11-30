//shared/components/shared/ingredient-item.tsx
import { cn } from '@/shared/lib/utils';
import { CircleCheck } from 'lucide-react';
import React from 'react';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export const IngredientItem: React.FC<Props> = ({
                                                    className,
                                                    active,
                                                    price,
                                                    name,
                                                    imageUrl,
                                                    onClick,
                                                }) => {
    return (
        <button
            type="button"
            className={cn(
                'flex flex-col items-center justify-between p-2 sm:p-3 rounded-lg w-full text-center relative cursor-pointer bg-gray-700 text-white min-h-[100px] border transition-all duration-200 hover:bg-gray-600',
                { 'border-2 border-green-500 bg-gray-600 shadow-lg': active },
                { 'border-gray-600': !active },
                className,
            )}
            onClick={onClick}>
            {active && (
                <CircleCheck className="absolute top-1 right-1 text-green-500 w-4 h-4" />
            )}
            <img
                width={60}
                height={60}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                src={imageUrl}
                alt={name}
            />
            <span className="text-xs mt-1 text-gray-200 line-clamp-2 leading-tight">
                {name}
            </span>
            <span className="font-bold text-xs text-white mt-1">+{price} ₽</span>
        </button>
    );
};
