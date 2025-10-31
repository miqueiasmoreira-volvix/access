"use client";

import { forwardRef } from "react";
import { Checkbox, CheckboxProps } from "../UI/Checkbox";

export interface TableCheckboxProps extends Omit<CheckboxProps, 'label' | 'helperText'> {
  'aria-label'?: string;
}

export const TableCheckbox = forwardRef<HTMLInputElement, TableCheckboxProps>(
  ({ 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Checkbox
        ref={ref}
        size="md"
        aria-label={ariaLabel}
        {...props}
      />
    );
  }
);

TableCheckbox.displayName = 'TableCheckbox';
