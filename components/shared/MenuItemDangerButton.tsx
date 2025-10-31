"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type MenuItemDangerButtonBase = {
  icon: ReactNode;
  children: ReactNode;
};

export type MenuItemDangerButtonProps = MenuItemDangerButtonBase & 
  (Omit<ButtonAsButton, "variant"> | Omit<ButtonAsLink, "variant">);

export default function MenuItemDangerButton({
  icon,
  children,
  className,
  ...props
}: MenuItemDangerButtonProps) {
  return (
    <Button
      variant="destructive"
      icon={icon}
      className={clsx(
        "w-full justify-start",
        "px-4 py-2.5",
        "text-sm text-red-600 dark:text-red-400",
        "hover:bg-red-50 dark:hover:bg-red-900/20",
        "rounded-none",
        className
      )}
      {...props as any}
    >
      {children}
    </Button>
  );
}
