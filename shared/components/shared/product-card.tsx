//shared/components/shared/product-card.tsx
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { Ingredient } from '@prisma/client';

interface Props {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    ingredients: Ingredient[];
    className?: string;
}

export const ProductCard: React.FC<Props> = ({
                                                 id,
                                                 name,
                                                 price,
                                                 imageUrl,
                                                 ingredients,
                                                 className,
                                             }) => {
    return (
        <div className={className}>
            <Link href={`/product/${id}`}>
                <div className="flex justify-center p-4 sm:p-6 bg-secondary rounded-lg h-[200px] sm:h-[260px]">
                    <img
                        className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[215px] md:h-[215px]"
                        src={imageUrl}
                        alt={name}
                    />
                </div>

                <Title
                    text={name}
                    size="sm"
                    className="mb-1 mt-2 sm:mt-3 font-bold text-center text-base sm:text-[22px]"
                />

                <div className="flex justify-between items-center mt-3 sm:mt-4">
          <span className="text-lg sm:text-[20px]">
            <b>{price} ₽</b>
          </span>

                    <Button
                        variant="secondary"
                        className="text-sm sm:text-base font-bold min-h-[44px] px-3 sm:px-4"
                        size="sm"
                    >
                        {/* Десктопная версия */}
                        <div className="hidden sm:flex items-center">
                            <Plus size={16} className="mr-1" />
                            Добавить
                        </div>

                        {/* Мобильная версия */}
                        <div className="flex items-center sm:hidden">
                            <Plus size={16} />
                        </div>
                    </Button>
                </div>
            </Link>
        </div>
    );
};