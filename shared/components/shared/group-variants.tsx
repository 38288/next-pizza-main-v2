//shared/components/shared/group-variants.tsx
'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';

export type Variant = {
    name: string;
    value: string;
    disabled?: boolean;
};

interface Props {
    items: readonly Variant[];
    onClick?: (value: Variant['value']) => void;
    value?: Variant['value'];
    className?: string;
}

export const GroupVariants: React.FC<Props> = ({ items, onClick, className, value }) => {
    return (
        <div className={cn(className, 'flex justify-between bg-gray-700 rounded-3xl p-1 select-none')}>
            {items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onClick?.(item.value)}
                    className={cn(
                        'flex items-center justify-center cursor-pointer h-8 sm:h-[30px] px-3 sm:px-5 flex-1 rounded-3xl transition-all duration-400 text-xs sm:text-sm text-white',
                        {
                            'bg-gray-900 shadow-lg': item.value === value,
                            'text-gray-400 opacity-50 pointer-events-none': item.disabled,
                            'hover:bg-gray-600': !item.disabled && item.value !== value,
                        },
                    )}>
                    {item.name}
                </button>
            ))}
        </div>
    );
};
