//shared/components/shared/container.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
                                                                        className,
                                                                        children,
                                                                        size = 'xl',
                                                                        padding = 'md'
                                                                    }) => {
    const sizeClasses = {
        sm: 'max-w-[640px]',
        md: 'max-w-[768px]',
        lg: 'max-w-[1024px]',
        xl: 'max-w-[1280px]',
        full: 'max-w-full'
    };

    const paddingClasses = {
        none: 'px-0',
        sm: 'px-3 sm:px-4',
        md: 'px-4 sm:px-6 lg:px-8',
        lg: 'px-4 sm:px-8 lg:px-12'
    };

    return (
        <div className={cn(
            'mx-auto w-full',
            sizeClasses[size],
            paddingClasses[padding],
            className
        )}>
            {children}
        </div>
    );
};
