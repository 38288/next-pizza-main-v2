//shared/components/shared/profile-button.tsx
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';
import { CircleUser, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface Props {
    onClickSignIn?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showNotification?: boolean; // Для показа уведомлений/бейджей
}

export const ProfileButton: React.FC<Props> = ({
                                                   className,
                                                   onClickSignIn,
                                                   size = 'md',
                                                   showNotification = false
                                               }) => {
    const { data: session } = useSession();

    const sizeClasses = {
        sm: 'h-8 w-8 sm:h-9 sm:w-auto sm:px-3 text-sm',
        md: 'h-9 w-9 sm:h-10 sm:w-auto sm:px-4 text-sm',
        lg: 'h-10 w-10 sm:h-11 sm:w-auto sm:px-4 text-base'
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18
    };

    return (
        <div className={cn('relative', className)}>
            {!session ? (
                <Button
                    onClick={onClickSignIn}
                    variant="outline"
                    className={cn(
                        'flex items-center justify-center sm:justify-start gap-2 rounded-full sm:rounded-md',
                        'min-w-[44px] min-h-[44px] p-0 sm:p-2', // Touch-friendly
                        sizeClasses[size]
                    )}
                    size="sm"
                >
                    <User size={iconSizes[size]} className="flex-shrink-0" />
                    <span className="hidden sm:inline">Войти</span>
                </Button>
            ) : (
                <Link href="/profile">
                    <Button
                        variant="secondary"
                        className={cn(
                            'flex items-center justify-center sm:justify-start gap-2 rounded-full sm:rounded-md relative',
                            'min-w-[44px] min-h-[44px] p-0 sm:p-2', // Touch-friendly
                            sizeClasses[size]
                        )}
                        size="sm"
                    >
                        <CircleUser size={iconSizes[size]} className="flex-shrink-0" />
                        <span className="hidden sm:inline">Профиль</span>

                        {/* Бейдж уведомлений */}
                        {showNotification && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white sm:hidden"></span>
                        )}
                    </Button>
                </Link>
            )}
        </div>
    );
};
