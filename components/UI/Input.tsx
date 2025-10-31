"use client";

import { ReactNode, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const inputVariants = cva(
  'w-full rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        default: 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-blue-500',
        error: 'border border-red-300 dark:border-red-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-red-500',
        ghost: 'border-0 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-blue-500',
      },
      size: {
        sm: 'h-8 text-sm px-3 py-1',
        md: 'h-10 text-sm px-4 py-2',
        lg: 'h-12 text-base px-4 py-3',
      },
      hasIconLeft: {
        true: '',
        false: '',
      },
      hasIconRight: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', hasIconLeft: true, className: 'pl-8' },
      { size: 'md', hasIconLeft: true, className: 'pl-9' },
      { size: 'lg', hasIconLeft: true, className: 'pl-10' },
      { size: 'sm', hasIconRight: true, className: 'pr-8' },
      { size: 'md', hasIconRight: true, className: 'pr-9' },
      { size: 'lg', hasIconRight: true, className: 'pr-10' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasIconLeft: false,
      hasIconRight: false,
    }
  }
);

const iconVariants = cva(
  'absolute top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none',
  {
    variants: {
      position: {
        left: 'left-3',
        right: 'right-3',
      },
      size: {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      }
    },
    defaultVariants: {
      position: 'left',
      size: 'md',
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  error?: string;
  helperText?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      iconLeft,
      iconRight,
      error,
      helperText,
      label,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasIconLeft = !!iconLeft;
    const hasIconRight = !!iconRight;
    const finalVariant = error ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className={iconVariants({ position: 'left', size })}>
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={clsx(
              inputVariants({
                variant: finalVariant,
                size,
                hasIconLeft,
                hasIconRight,
              }),
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className={iconVariants({ position: 'right', size })}>
              {iconRight}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={clsx(
              'mt-1 text-xs',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
