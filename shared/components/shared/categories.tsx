// shared/components/shared/categories.tsx
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
    const setActiveId = useCategoryStore((state) => state.setActiveId);

    const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, id: number, name: string) => {
        e.preventDefault(); // КЛЮЧЕВОЕ: предотвращаем перезагрузку страницы

        // Устанавливаем активную категорию
        setActiveId(id);

        // Плавная прокрутка к элементу
        const element = document.getElementById(name);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Обновляем URL без перезагрузки
        window.history.pushState(null, '', `/#${name}`);
    };

    return (
        <div className={cn('inline-flex gap-1 bg-gray-800 p-1 rounded-2xl', className)}>
            {items.map(({ name, id }, index) => (
                <a
                    className={cn(
                        'flex items-center font-bold h-11 rounded-2xl px-3 sm:px-4 md:px-5 whitespace-nowrap text-white cursor-pointer transition-all duration-200 hover:bg-gray-600',
                        categoryActiveId === id && 'bg-gray-700 shadow-md shadow-gray-600 text-primary',
                    )}
                    href={`/#${name}`}
                    onClick={(e) => handleCategoryClick(e, id, name)}
                    key={index}
                >
                    <span className="text-sm sm:text-base">
                        {name}
                    </span>
                </a>
            ))}
        </div>
    );
};