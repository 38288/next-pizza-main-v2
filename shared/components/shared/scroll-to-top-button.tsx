// shared/components/shared/scroll-to-top-button.tsx
'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg
                     bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                     border border-orange-400/30 flex items-center justify-center transition-all duration-300
                     animate-in fade-in slide-in-from-bottom-10"
            aria-label="Наверх"
        >
            <ArrowUp className="w-5 h-5 text-white" />
        </button>
    );
};