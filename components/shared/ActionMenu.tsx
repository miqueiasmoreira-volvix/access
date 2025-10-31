"use client";

import { ReactNode } from "react";
import { Dropdown, DropdownItem, DropdownSeparator, DropdownProps } from "../UI/Dropdown";

export interface ActionMenuProps extends Omit<DropdownProps, 'children'> {
  items: ActionMenuItem[];
}

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  separator?: boolean;
}

export function ActionMenu({ items, ...props }: ActionMenuProps) {
  return (
    <Dropdown {...props}>
      {items.map((item, index) => (
        <div key={index}>
          {item.separator && index > 0 && <DropdownSeparator />}
          <DropdownItem
            icon={item.icon}
            onClick={item.onClick}
            variant={item.variant}
            disabled={item.disabled}
          >
            {item.label}
          </DropdownItem>
        </div>
      ))}
    </Dropdown>
  );
}
