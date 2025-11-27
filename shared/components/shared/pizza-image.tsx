//shared/components/shared/pizza-image.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
    className?: string;
    imageUrl: string;
}

export const PizzaImage: React.FC<Props> = ({ imageUrl, className }) => {
    return (
        <div className={cn('flex items-center justify-center relative w-full', className)}>
            <img
                src={imageUrl}
                alt="Pizza"
                className="w-full max-w-[280px] sm:max-w-[350px] h-auto object-contain" // Адаптивная ширина
            />
        </div>
    );
};
