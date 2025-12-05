//shared/components/shared/form/form-input.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '../../ui/input';
import { ClearButton } from '../clear-button';
import { ErrorText } from '../error-text';
import { RequiredSymbol } from '../required-symbol';
import {cn} from "@/shared/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const FormInput: React.FC<Props> = ({ className, name, label, required, ...props }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, '', { shouldValidate: true });
  };

    return (
        <div className={className}>
            {label && (
                <p className="font-medium mb-2 text-white">
                    {label} {required && <RequiredSymbol />}
                </p>
            )}

            <div className="relative">
                <Input
                    className={cn(
                        "h-12 text-md",
                        // Используем такие же стили как в CheckoutSelectReceipt
                        "bg-gray-700 text-white border-gray-600",
                        "placeholder:text-gray-500",
                        "focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none",
                        // Убираем стандартные focus стили Shadcn
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        className
                    )}
                    {...register(name)}
                    {...props}
                />

                {value && <ClearButton onClick={onClickClear} />}
            </div>

            {errorText && <ErrorText text={errorText} className="mt-2" />}
        </div>
    );
};
