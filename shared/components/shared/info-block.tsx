//shared/components/shared/info-block.tsx
import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Title } from './title';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface Props {
    title: string;
    text: string;
    className?: string;
    imageUrl?: string;
}

export const InfoBlock: React.FC<Props> = ({ className, title, text, imageUrl }) => {
    return (
        <div className={cn(
            className,
            'flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full max-w-[840px] gap-8 lg:gap-12 p-4 sm:p-6' // Адаптивная компоновка и отступы
        )}>
            {/* Текстовая часть */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                <div className="w-full lg:w-[445px]">
                    <Title size="lg" text={title} className="font-extrabold mb-3 lg:mb-4" />
                    <p className="text-gray-400 text-base lg:text-lg leading-relaxed">{text}</p>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 lg:mt-11 w-full sm:w-auto">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="gap-2 w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base"
                            size="sm"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            На главную
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="text-gray-500 border-gray-400 hover:bg-gray-50 w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base"
                        size="sm"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Обновить
                    </Button>
                </div>
            </div>

            {/* Изображение */}
            {imageUrl && (
                <div className="order-1 lg:order-2 flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px] object-contain" // Адаптивные размеры
                    />
                </div>
            )}
        </div>
    );
};
