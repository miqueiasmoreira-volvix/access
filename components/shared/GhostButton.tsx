"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type GhostButtonBase = {
  icon?: ReactNode;
  children?: ReactNode;
};

export type GhostButtonProps = GhostButtonBase & 
  (Omit<ButtonAsButton, "variant"> | Omit<ButtonAsLink, "variant">);

export default function GhostButton({
  icon,
  children,
  className,
  ...props
}: GhostButtonProps) {
  return (
    <Button
      variant="ghost"
      icon={icon}
      className={clsx(
        "text-neutral-600 dark:text-neutral-400",
        "hover:text-neutral-900 dark:hover:text-neutral-100",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        className
      )}
      {...props as any}
    >
      {children}
    </Button>
  );
}
