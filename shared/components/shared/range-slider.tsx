//shared/components/shared/range-slider.tsx
'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/shared/lib/utils';

type SliderProps = {
    className?: string;
    min: number;
    max: number;
    step: number;
    formatLabel?: (value: number) => string;
    value?: number[] | readonly number[];
    onValueChange?: (values: number[]) => void;
    showLabels?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

const RangeSlider = React.forwardRef(
    (
        {
            className,
            min,
            max,
            step,
            formatLabel,
            value,
            onValueChange,
            showLabels = true,
            size = 'md',
            ...props
        }: SliderProps,
        ref,
    ) => {
        const initialValue = Array.isArray(value) ? value : [min, max];
        const [localValues, setLocalValues] = React.useState(initialValue);

        // Размеры для разных вариантов
        const sizeClasses = {
            sm: {
                track: 'h-1',
                thumb: 'h-3 w-3',
                label: 'text-xs -top-4'
            },
            md: {
                track: 'h-1.5 sm:h-2',
                thumb: 'h-4 w-4 sm:h-5 sm:w-5',
                label: 'text-xs sm:text-sm -top-5 sm:-top-6'
            },
            lg: {
                track: 'h-2 sm:h-2.5',
                thumb: 'h-5 w-5 sm:h-6 sm:w-6',
                label: 'text-sm sm:text-base -top-6 sm:-top-7'
            }
        };

        React.useEffect(() => {
            // Update localValues when the external value prop changes
            setLocalValues(Array.isArray(value) ? value : [min, max]);
        }, [min, max, value]);

        const handleValueChange = (newValues: number[]) => {
            setLocalValues(newValues);
            if (onValueChange) {
                onValueChange(newValues);
            }
        };

        return (
            <div className={cn('w-full', className)}>
                <SliderPrimitive.Root
                    ref={ref as React.RefObject<HTMLDivElement>}
                    min={min}
                    max={max}
                    step={step}
                    value={localValues}
                    onValueChange={handleValueChange}
                    className={cn(
                        "relative flex w-full touch-none select-none items-center",
                        "mb-8 sm:mb-6" // Больше отступ снизу для мобильных
                    )}
                    {...props}>

                    {/* Track */}
                    <SliderPrimitive.Track
                        className={cn(
                            "relative w-full grow overflow-hidden rounded-full bg-primary/20",
                            sizeClasses[size].track
                        )}
                    >
                        <SliderPrimitive.Range className="absolute h-full bg-primary" />
                    </SliderPrimitive.Track>

                    {/* Thumbs and Labels */}
                    {localValues.map((value, index) => (
                        <React.Fragment key={index}>
                            {/* Value Label */}
                            {showLabels && (
                                <div
                                    className="absolute text-center transform -translate-x-1/2"
                                    style={{
                                        left: `calc(${((value - min) / (max - min)) * 100}%)`,
                                    }}>
                  <span className={cn(
                      "font-medium text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm border",
                      "min-w-[40px] inline-block",
                      sizeClasses[size].label
                  )}>
                    {formatLabel ? formatLabel(value) : value}
                  </span>
                                </div>
                            )}

                            {/* Thumb */}
                            <SliderPrimitive.Thumb
                                className={cn(
                                    "block rounded-full border-2 border-primary bg-white shadow-lg",
                                    "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                    "hover:scale-110 active:scale-105 disabled:pointer-events-none disabled:opacity-50",
                                    "min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0", // Touch-friendly на мобильных
                                    sizeClasses[size].thumb
                                )}
                            />
                        </React.Fragment>
                    ))}
                </SliderPrimitive.Root>
            </div>
        );
    },
);

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
