//shared/components/shared/checkout/checkout-personal-form.tsx
import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput } from '../form';
import { cn } from '@/shared/lib/utils';

interface Props {
    className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock
            title="2. Персональные данные"
            className={className}
            padding="md"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormInput
                    name="firstName"
                    label="Имя"
                    required
                    placeholder="Введите ваше имя"
                    className="w-full"
                />

                <FormInput
                    name="phone"
                    label="Телефон"
                    type="tel"
                    required
                    placeholder="+7 (XXX) XXX-XX-XX"
                    className="w-full sm:col-span-2"
                />
            </div>
        </WhiteBlock>
    );
};
