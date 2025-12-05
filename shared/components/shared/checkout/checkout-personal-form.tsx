// shared/components/shared/checkout/checkout-personal-form.tsx
import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput } from '../form';

interface Props {
    className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock
            className={className}
            padding="md"
        >
            {/* Добавляем такую же структуру с нумерацией как в CheckoutSelectReceipt */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Персональные данные</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FormInput
                        name="firstName"
                        label="Имя *"
                        required
                        placeholder="Введите ваше имя"
                        className="w-full"
                    />

                    <FormInput
                        name="phone"
                        label="Телефон *"
                        type="tel"
                        required
                        placeholder="+7 (XXX) XXX-XX-XX"
                        className="w-full sm:col-span-2"
                    />
                </div>
            </div>
        </WhiteBlock>
    );
};
