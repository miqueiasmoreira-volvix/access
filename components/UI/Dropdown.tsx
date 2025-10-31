"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
  open: controlledOpen,
  onOpenChange,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={clsx(
            'absolute top-full mt-2 z-50',
            'bg-white dark:bg-neutral-900',
            'border border-neutral-200 dark:border-neutral-800',
            'rounded-lg shadow-lg',
            'py-1',
            'min-w-[200px]',
            alignmentClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export function DropdownItem({
  icon,
  children,
  variant = 'default',
  disabled,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
        variant === 'default' && 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800',
        variant === 'danger' && 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />;
}
