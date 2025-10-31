"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type MenuItemButtonBase = {
  icon: ReactNode;
  children: ReactNode;
};

export type MenuItemButtonProps = MenuItemButtonBase & 
  (Omit<ButtonAsButton, "variant"> | Omit<ButtonAsLink, "variant">);

export default function MenuItemButton({
  icon,
  children,
  className,
  ...props
}: MenuItemButtonProps) {
  return (
    <Button
      variant="ghost"
      icon={icon}
      className={clsx(
        "w-full justify-start",
        "px-4 py-2.5",
        "text-sm text-neutral-700 dark:text-neutral-300",
        "hover:bg-neutral-50 dark:hover:bg-neutral-800",
        "rounded-none",
        className
      )}
      {...props as any}
    >
      {children}
    </Button>
  );
}
