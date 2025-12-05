// shared/components/shared/top-bar.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import { Categories } from './categories';
import { Category } from '@prisma/client';

interface Props {
    categories: Category[];
    className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
    return (
        <div
            className={cn('sticky top-0 bg-black py-4 shadow-lg shadow-white/5 z-10', className)}
            style={{
                pointerEvents: 'none', // Отключаем обработку событий мыши для самого контейнера
            }}
        >
            {/* Десктопная версия */}
            <div className="hidden lg:block">
                <Container className="flex items-center justify-between">
                    {/* Включаем pointer-events только для контента */}
                    <div style={{ pointerEvents: 'auto' }}>
                        <Categories items={categories} />
                    </div>
                </Container>
            </div>

            {/* Мобильная версия с горизонтальным скроллом */}
            <div className="lg:hidden">
                <div className="overflow-x-auto scrollbar-hide w-full">
                    <div
                        className="flex items-center gap-4 px-4 min-w-max"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <Categories items={categories} />
                    </div>
                </div>
            </div>
        </div>
    );
};