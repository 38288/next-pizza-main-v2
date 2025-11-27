//shared/components/shared/count-button.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { CountIconButton } from './count-icon-button';

export interface CountButtonProps {
    value?: number;
    size?: 'sm' | 'lg';
    onClick?: (type: 'plus' | 'minus') => void;
    className?: string;
}

export const CountButton: React.FC<CountButtonProps> = ({
                                                            className,
                                                            onClick,
                                                            value = 1,
                                                            size = 'sm',
                                                        }) => {
    return (
        <div className={cn('inline-flex items-center justify-between gap-3 sm:gap-4', className)}>
            <CountIconButton
                onClick={() => onClick?.('minus')}
                disabled={value === 1}
                size={size}
                type="minus"
            />

            <b className={cn('min-w-[24px] text-center', {
                'text-base sm:text-sm': size === 'sm', // Крупнее на мобильных
                'text-lg sm:text-md': size === 'lg'
            })}>
                {value}
            </b>

            <CountIconButton onClick={() => onClick?.('plus')} size={size} type="plus" />
        </div>
    );
};
