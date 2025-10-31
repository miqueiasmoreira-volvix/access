"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <table className={clsx('w-full', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={clsx(
        'bg-neutral-50 dark:bg-neutral-900',
        'border-b border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={clsx(
        'bg-white dark:bg-neutral-950',
        'divide-y divide-neutral-200 dark:divide-neutral-800',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function TableRow({ children, hoverable = true, className, ...props }: TableRowProps) {
  return (
    <tr
      className={clsx(
        hoverable && 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50',
        'transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <th
      className={clsx(
        'text-left px-6 py-3',
        'text-xs font-medium text-neutral-500 dark:text-neutral-400',
        'uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={clsx(
        'px-6 py-4',
        'text-sm text-neutral-600 dark:text-neutral-400',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
