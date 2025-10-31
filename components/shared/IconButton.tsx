"use client";

import { ReactNode } from "react";
import { Button, ButtonAsButton, ButtonAsLink } from "../UI/Button";
import { clsx } from "clsx";

type IconButtonBase = {
  icon: ReactNode;
};

export type IconButtonProps = IconButtonBase & 
  (Omit<ButtonAsButton, "variant" | "children"> | Omit<ButtonAsLink, "variant" | "children">);

export default function IconButton({
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      icon={icon}
      isIconOnly={true}
      className={clsx(
        "p-1 w-auto h-auto",
        "text-neutral-400",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "rounded",
        className
      )}
      {...props as any}
    />
  );
}
