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
        <div
            className={cn(
                'flex items-center flex-col p-1 sm:p-2 rounded-md w-full max-w-[140px] sm:w-32 text-center relative cursor-pointer shadow-md bg-white min-h-[120px]',
                { 'border border-primary': active },
                className,
            )}
            onClick={onClick}>
            {active && <CircleCheck className="absolute top-1 right-1 sm:top-2 sm:right-2 text-primary w-4 h-4 sm:w-5 sm:h-5" />}
            <img width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[110px] lg:h-[110px]" src={imageUrl} />
            <span className="text-xs mb-1 mt-1">{name}</span>
            <span className="font-bold text-sm">{price} ₽</span>
        </div>
    );
};
