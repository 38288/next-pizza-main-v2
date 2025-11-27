//shared/components/shared/cart-item-details/cart-item-info.tsx
import { cn } from '@/shared/lib/utils';

interface Props {
    name: string;
    details: string;
    className?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, details, className }) => {
    return (
        <div className={className}>
            <h2 className="text-base sm:text-lg font-bold leading-5 sm:leading-6 line-clamp-1">{name}</h2>
            {details && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 w-full max-w-[90%]">
                    {details}
                </p>
            )}
        </div>
    );
};