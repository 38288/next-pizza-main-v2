//shared/components/shared/clear-button.tsx
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import React from 'react';

interface Props {
    className?: string;
    onClick?: VoidFunction;
    size?: 'sm' | 'md' | 'lg';
}

export const ClearButton: React.FC<Props> = ({ onClick, className, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 min-w-[32px] min-h-[32px]',
        md: 'w-10 h-10 min-w-[40px] min-h-[40px]',
        lg: 'w-12 h-12 min-w-[48px] min-h-[48px]'
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                'absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-pointer', // Адаптивная позиция
                'flex items-center justify-center rounded-full transition-all duration-200',
                'hover:bg-gray-100 active:bg-gray-200', // Улучшенная интерактивность
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50', // Accessibility
                sizeClasses[size],
                className,
            )}
            aria-label="Очистить"
        >
            <X className={cn('text-gray-600', iconSizes[size])} />
        </button>
    );
};