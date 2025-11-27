//shared/components/shared/categories.tsx
'use client';

import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store/category';
import { Category } from '@prisma/client';
import React from 'react';

interface Props {
    items: Category[];
    className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
    const categoryActiveId = useCategoryStore((state) => state.activeId);

    return (
        <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
            {items.map(({ name, id }, index) => (
                <a
                    className={cn(
                        'flex items-center font-bold h-11 rounded-2xl px-3 sm:px-4 md:px-5 whitespace-nowrap', // Адаптивные отступы и запрет переноса
                        categoryActiveId === id && 'bg-white shadow-md shadow-gray-200 text-primary',
                    )}
                    href={`/#${name}`}
                    key={index}>
                    <button className="text-sm sm:text-base"> {/* Адаптивный размер текста */}
                        {name}
                    </button>
                </a>
            ))}
        </div>
    );
};