"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type PrimaryButtonBase = {
  icon?: ReactNode;
  children: ReactNode;
};

export type PrimaryButtonProps = PrimaryButtonBase & 
  (Omit<ButtonAsButton, "variant"> | Omit<ButtonAsLink, "variant">);

export default function PrimaryButton({
  icon,
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      variant="primary"
      icon={icon}
      isActive={true}
      className={clsx(
        "text-white dark:text-neutral-900",
        "hover:bg-neutral-800 dark:hover:bg-neutral-200",
        "font-medium",
        className
      )}
      {...props as any}
    >
      {children}
    </Button>
  );
}
