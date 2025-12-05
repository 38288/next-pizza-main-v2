// shared/components/shared/profile-button.tsx
'use client';

import { Button } from '@/shared/components/ui/button';
import { User, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ProfileButtonProps {
    onAuthClick: () => void;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ onAuthClick }) => {
    const { data: session } = useSession();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-orange-400 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 transition-colors"
            onClick={onAuthClick}
            aria-label={session ? "Профиль" : "Войти"}
        >
            {session ? (
                <User className="w-5 h-5" />
            ) : (
                <LogIn className="w-5 h-5" />
            )}
        </Button>
    );
};
