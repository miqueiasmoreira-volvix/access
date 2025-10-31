"use client";

import { ReactNode } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200',
  {
    variants: {
      variant: {
        neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
        primary: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        success: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
        warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        danger: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
        info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
      }
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
      shape: 'pill',
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({
  variant,
  size,
  shape,
  children,
  icon,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(badgeVariants({ variant, size, shape }), className)}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
