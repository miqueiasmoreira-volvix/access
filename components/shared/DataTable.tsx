"use client";

import { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../UI/Table";

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface DataTableColumn<T> {
  header: string | ReactNode;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow hoverable={false}>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              style={{ width: column.width }}
              className={
                column.align === 'center'
                  ? 'text-center'
                  : column.align === 'right'
                  ? 'text-right'
                  : 'text-left'
              }
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={row.id ?? rowIndex}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? 'cursor-pointer' : ''}
          >
            {columns.map((column, colIndex) => (
              <TableCell
                key={colIndex}
                className={
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                    ? 'text-right'
                    : 'text-left'
                }
              >
                {column.cell
                  ? column.cell(row)
                  : column.accessor
                  ? String(row[column.accessor])
                  : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
