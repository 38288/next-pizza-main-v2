//shared/components/shared/white-block.tsx
import React from 'react';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';

interface Props {
    title?: string;
    endAdornment?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const WhiteBlock: React.FC<React.PropsWithChildren<Props>> = ({
                                                                         title,
                                                                         endAdornment,
                                                                         className,
                                                                         contentClassName,
                                                                         children,
                                                                         padding = 'md',
                                                                         shadow = 'md',
                                                                     }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-5 lg:p-6',
        lg: 'p-5 sm:p-6 lg:p-7'
    };

    const contentPaddingClasses = {
        none: '',
        sm: 'px-3 py-2 sm:px-4 sm:py-3',
        md: 'px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5',
        lg: 'px-5 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6'
    };

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm shadow-gray-800',
        md: 'shadow-md shadow-gray-800',
        lg: 'shadow-lg shadow-gray-800'
    };

    const titlePaddingClasses = {
        none: 'p-3 sm:p-4',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-5 lg:p-6',
        lg: 'p-5 sm:p-6 lg:p-7'
    };

    return (
        <div className={cn(
            'bg-gray-800 text-white rounded-xl sm:rounded-2xl lg:rounded-3xl', // Адаптивные скругления
            shadowClasses[shadow],
            'border border-gray-700', // Темная граница для темной темы
            className
        )}>
            {title && (
                <div className={cn(
                    'flex items-center justify-between border-b border-gray-700', // Темная граница
                    titlePaddingClasses[padding]
                )}>
                    <Title
                        text={title}
                        size="sm"
                        className="font-bold text-base sm:text-lg text-white" // Белый текст
                    />
                    {endAdornment}
                </div>
            )}

            <div className={cn(
                contentPaddingClasses[padding],
                contentClassName
            )}>
                {children}
            </div>
        </div>
    );
};