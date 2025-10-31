"use client";

import { Badge, BadgeProps } from "../UI/Badge";

export type StatusType = 'admin' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status?: StatusType;
  children: React.ReactNode;
}

const statusVariantMap: Record<StatusType, BadgeProps['variant']> = {
  admin: 'success',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  neutral: 'neutral',
};

export function StatusBadge({ status = 'neutral', children, ...props }: StatusBadgeProps) {
  return (
    <Badge
      variant={statusVariantMap[status]}
      shape="rounded"
      size="sm"
      {...props}
    >
      {children}
    </Badge>
  );
}
