"use client";

import { Badge, BadgeProps } from "../UI/Badge";

export interface CountBadgeProps extends Omit<BadgeProps, 'variant' | 'shape' | 'children'> {
  count: number;
}

export function CountBadge({ count, ...props }: CountBadgeProps) {
  return (
    <Badge
      variant="neutral"
      shape="pill"
      size="sm"
      {...props}
    >
      {count}
    </Badge>
  );
}
