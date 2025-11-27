// shared/components/shared/info-block.tsx
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
        <div className={cn(className, 'flex flex-col lg:flex-row items-center justify-center w-full max-w-2xl lg:max-w-[840px] p-4 sm:p-6 lg:p-8 gap-8 lg:gap-12')}>

            {/* Текстовая часть */}
            <div className="flex flex-col items-center text-center w-full">
                <div className="w-full max-w-lg lg:max-w-xl">
                    <Title size="lg" text={title} className="font-extrabold mb-3 lg:mb-4 text-2xl lg:text-3xl" />
                    <p className="text-gray-400 text-base lg:text-lg leading-relaxed">{text}</p>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-6 lg:mt-8 max-w-sm">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto h-11">
                            <ArrowLeft className="w-4 h-4" />
                            На главную
                        </Button>
                    </Link>

                    {/* Убираем onClick и используем Link или делаем клиентским компонентом */}
                    <Link href="/" replace className="w-full sm:w-auto">
                        <Button variant="outline" className="text-gray-500 border-gray-400 hover:bg-gray-50 w-full sm:w-auto h-11 gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Обновить
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Изображение */}
            {imageUrl && (
                <div className="flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 object-contain"
                    />
                </div>
            )}
        </div>
    );
};
