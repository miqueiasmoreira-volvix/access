"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type PaginationButtonBase = {
  isActive?: boolean;
  children: ReactNode;
};

export type PaginationButtonProps = PaginationButtonBase & 
  (Omit<ButtonAsButton, "variant"> | Omit<ButtonAsLink, "variant">);

export default function PaginationButton({
  isActive = false,
  children,
  className,
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      variant="ghost"
      className={clsx(
        "px-3 py-1.5",
        "text-sm",
        "rounded-md",
        isActive
          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900",
        className
      )}
      {...props as any}
    >
      {children}
    </Button>
  );
}
