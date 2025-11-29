//shared/components/shared/modals/choose-product-modal.tsx
'use client';

import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductWithRelations } from '@/@types/prisma';
import { ProductForm } from '../product-form';

interface Props {
    product: ProductWithRelations;
    className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.back();
        }
    };

    return (
        <Dialog open={Boolean(product)} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    // Базовые стили
                    'p-0 bg-gray-900 text-white overflow-hidden', // Изменено на темный фон и белый текст

                    // Мобильные стили
                    'w-full h-full max-h-full rounded-none',

                    // Планшет и десктоп
                    'sm:w-auto sm:h-auto sm:max-h-[90vh] sm:max-w-[90vw] sm:rounded-lg',

                    // Большие экраны
                    'lg:max-w-[1060px]',

                    // Минимальная высота только на десктопе
                    'sm:min-h-[500px]',

                    className,
                )}>
                <ProductForm
                    product={product}
                    onSubmit={() => router.back()}
                    className="h-full"
                />
            </DialogContent>
        </Dialog>
    );
};
