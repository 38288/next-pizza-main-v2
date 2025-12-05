// shared/components/shared/modals/modal.tsx
'use client';

import { cn } from '@/shared/lib/utils';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    closeable?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                description,
                                                children,
                                                className,
                                                closeable = true
                                            }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeable) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, closeable]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeable ? onClose : undefined}
            />

            {/* Modal */}
            <div className={cn(
                "relative z-10 w-full max-w-md mx-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl",
                className
            )}>
                {/* Header */}
                {(title || description) && (
                    <div className="px-6 pt-6 pb-4 border-b border-gray-700">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                {title && (
                                    <h3 className="text-xl font-bold text-white">
                                        {title}
                                    </h3>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-gray-400">
                                        {description}
                                    </p>
                                )}
                            </div>
                            {closeable && (
                                <button
                                    onClick={onClose}
                                    className="ml-4 p-1 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className={cn(
                    "px-6 py-4",
                    !title && !description && "pt-6"
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
};