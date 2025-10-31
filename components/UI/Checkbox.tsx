"use client";

import { forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const checkboxVariants = cva(
  'rounded cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500',
        primary: 'border-blue-300 dark:border-blue-700 text-blue-600 focus:ring-blue-500',
        success: 'border-teal-300 dark:border-teal-700 text-teal-600 focus:ring-teal-500',
      },
      size: {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    }
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  helperText?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant,
      size,
      label,
      helperText,
      disabled,
      indeterminate,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={clsx(
              checkboxVariants({ variant, size }),
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
        {(label || helperText) && (
          <div className="ml-2">
            {label && (
              <label
                className={clsx(
                  'text-sm font-medium',
                  disabled
                    ? 'text-neutral-400 dark:text-neutral-600'
                    : 'text-neutral-700 dark:text-neutral-300'
                )}
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
