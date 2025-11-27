//shared/components/shared/checkout-item-details.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
    title?: React.ReactNode;
    value?: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const CheckoutItemDetails: React.FC<Props> = ({
                                                         title,
                                                         value,
                                                         className,
                                                         size = 'md'
                                                     }) => {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base sm:text-lg',
        lg: 'text-lg sm:text-xl'
    };

    const marginClasses = {
        sm: 'my-2',
        md: 'my-3 sm:my-4',
        lg: 'my-4 sm:my-5'
    };

    return (
        <div className={cn('flex', marginClasses[size], className)}>
      <span className={cn('flex flex-1 text-neutral-500', sizeClasses[size])}>
        {title}
          <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
      </span>

            <span className={cn('font-bold', sizeClasses[size])}>{value}</span>
        </div>
    );
};
