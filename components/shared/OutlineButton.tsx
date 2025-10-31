"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type OutlineButtonBase = {
  icon?: ReactNode;
  children: ReactNode;
};

export type OutlineButtonProps = OutlineButtonBase & 
  (Omit<ButtonAsButton, "variant"> | Omit<ButtonAsLink, "variant">);

export default function OutlineButton({
  icon,
  children,
  className,
  ...props
}: OutlineButtonProps) {
  return (
    <Button
      variant="deafult"
      icon={icon}
      className={clsx(
        "border border-neutral-300 dark:border-neutral-700",
        "bg-white dark:bg-neutral-900",
        "text-neutral-700 dark:text-neutral-300",
        "hover:bg-neutral-50 dark:hover:bg-neutral-800",
        "font-medium",
        className
      )}
      {...props as any}
    >
      {children}
    </Button>
  );
}
