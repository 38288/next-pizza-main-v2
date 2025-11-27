//shared/components/shared/count-icon-button.tsx
import { Minus, Plus } from 'lucide-react';
import { CountButtonProps } from './count-button';
import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';

interface IconButtonProps {
    size?: CountButtonProps['size'];
    disabled?: boolean;
    type?: 'plus' | 'minus';
    onClick?: () => void;
}

export const CountIconButton: React.FC<IconButtonProps> = ({
                                                               size = 'sm',
                                                               disabled,
                                                               type,
                                                               onClick,
                                                           }) => {
    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={onClick}
            type="button"
            className={cn(
                'p-0 hover:bg-primary hover:text-white disabled:bg-white disabled:border-gray-400 disabled:text-gray-400 min-w-[44px] min-h-[44px]', // Touch-friendly размеры
                size === 'sm' ? 'w-8 h-8 sm:w-[30px] sm:h-[30px] rounded-[10px]' : 'w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-md',
            )}>
            {type === 'plus' ? (
                <Plus className={cn(
                    size === 'sm' ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5' // Адаптивные размеры иконок
                )} />
            ) : (
                <Minus className={cn(
                    size === 'sm' ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5' // Адаптивные размеры иконок
                )} />
            )}
        </Button>
    );
};
