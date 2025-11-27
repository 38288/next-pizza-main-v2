//shared/components/shared/modals/auth-modal/auth-modal.tsx
'use client';

import { Button } from '@/shared/components';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { signIn } from 'next-auth/react';
import React from 'react';
import { LoginForm } from './forms/login-form';
import { RegisterForm } from './forms/register-form';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
    const [type, setType] = React.useState<'login' | 'register'>('login');

    const onSwitchType = () => {
        setType(type === 'login' ? 'register' : 'login');
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-[450px] bg-white p-4 sm:p-6 md:p-10 mx-auto"> {/* Адаптивные отступы и ширина */}
                {type === 'login' ? (
                    <LoginForm onClose={handleClose} />
                ) : (
                    <RegisterForm onClose={handleClose} />
                )}

                <hr className="my-4 sm:my-6" /> {/* Адаптивные отступы */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3"> {/* Вертикально на мобильных, горизонтально на планшетах+ */}
                    <Button
                        variant="secondary"
                        onClick={() =>
                            signIn('github', {
                                callbackUrl: '/',
                                redirect: true,
                            })
                        }
                        type="button"
                        className="gap-2 h-12 p-2 flex-1 min-h-[44px]"> {/* Минимальная высота для touch */}
                        <img
                            className="w-5 h-5 sm:w-6 sm:h-6" // Адаптивный размер иконок
                            src="https://github.githubassets.com/favicons/favicon.svg"
                            alt="GitHub"
                        />
                        <span className="text-sm sm:text-base">GitHub</span> {/* Адаптивный текст */}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() =>
                            signIn('google', {
                                callbackUrl: '/',
                                redirect: true,
                            })
                        }
                        type="button"
                        className="gap-2 h-12 p-2 flex-1 min-h-[44px]"> {/* Минимальная высота для touch */}
                        <img
                            className="w-5 h-5 sm:w-6 sm:h-6" // Адаптивный размер иконок
                            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                            alt="Google"
                        />
                        <span className="text-sm sm:text-base">Google</span> {/* Адаптивный текст */}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    onClick={onSwitchType}
                    type="button"
                    className="h-12 min-h-[44px] mt-4 sm:mt-6" // Адаптивные отступы и высота
                >
          <span className="text-sm sm:text-base"> {/* Адаптивный текст */}
              {type !== 'login' ? 'Войти' : 'Регистрация'}
          </span>
                </Button>
            </DialogContent>
        </Dialog>
    );
};