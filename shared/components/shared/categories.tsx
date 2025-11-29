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
        <div className={cn('inline-flex gap-1 bg-gray-800 p-1 rounded-2xl', className)}>
            {items.map(({ name, id }, index) => (
                <a
                    className={cn(
                        'flex items-center font-bold h-11 rounded-2xl px-3 sm:px-4 md:px-5 whitespace-nowrap text-white', // Добавлен text-white
                        categoryActiveId === id && 'bg-gray-700 shadow-md shadow-gray-600 text-primary', // Темный фон для активного элемента
                    )}
                    href={`/#${name}`}
                    key={index}>
                    <button className="text-sm sm:text-base">
                        {name}
                    </button>
                </a>
            ))}
        </div>
    );
};