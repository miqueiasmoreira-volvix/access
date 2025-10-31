"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cva, VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  'flex px-4 py-2 items-center gap-1 rounded-md transition-colors duration-200 focus:ouline-none transition-all ease-in-out duration-500', {
    variants: {
      variant: {
        deafult: 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 cursor-pointer',
        primary: 'text-neutral-600 font-medium hover:bg-blue-600/40 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer',
        destructive: 'bg-red-400/20 text-red-300 hover:bg-red-200 hover:text-red-700 dark:bg-red-400/10 dark:text-red-700 dark:hover:text-red-300 cursor-pointer',
        ghost: 'text-neutral-300 dark:text-neutral-800'
      },
      size: {
        md: 'h-10 text-sm px-4',
        sm: 'h-9 text-base px-3',
        lg: 'h-12 text-md px-6',
      },
      isIconOnly: {
        true: '',
        false: '',
      },
      isActive: {
        true: '',
        false: '',
      }
    },
    compoundVariants: [
      { size: 'md', isIconOnly: true, className: 'w-10 px-0' },
      { size: 'lg', isIconOnly: true, className: 'w-12 px-0' },
      {
        variant: 'primary',
        isActive: true,
        className: 'bg-blue-700 text-white hover:bg-blue-700 hover:text-white dark:bg-blue-700 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white font-semibold'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isIconOnly: false,
      isActive: false,
    }
  }
)

type BaseButtonProps = VariantProps<typeof buttonVariants> & {
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export type ButtonAsButton = BaseButtonProps & {
  href?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonAsLink = BaseButtonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {

  const isIconOnly = !props.children;

  const buttonClasses = clsx(
    buttonVariants({
      variant: props.variant,
      size: props.size,
      isActive: 'isActive' in props ? props.isActive : false,
      isIconOnly,
    }),
    props.className
  );

  const content = (
    <>
      {props.icon}
      {props.children && (
        <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap">
          {props.children}
        </span>
      )}
    </>
  );

  if ('href' in props && props.href !== undefined) {
    // Extrair props customizadas para Link
    const { ariaLabel, icon, variant, size, isActive, className, children, ...linkProps } = props;
    
    return (
        <Link
          {...linkProps}
          href={props.href}
          className={buttonClasses}
          aria-label={ariaLabel}
        >
          {content}
        </Link>
    )
  }

  // Extrair props customizadas para button
  const { ariaLabel, icon, variant, size, isActive, className, children, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={buttonClasses}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}