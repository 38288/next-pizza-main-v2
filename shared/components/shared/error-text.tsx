//shared/components/shared/error-text.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
    text: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ErrorText: React.FC<Props> = ({ text, className, size = 'md' }) => {
    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    return (
        <p
            className={cn(
                'text-red-500 font-medium',
                sizeClasses[size],
                'mt-1', // Стандартный отступ сверху
                'break-words', // Перенос длинных слов
                className
            )}
            role="alert" // Accessibility
        >
            {text}
        </p>
    );
};
