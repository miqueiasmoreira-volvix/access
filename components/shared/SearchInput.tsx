"use client";

import { forwardRef } from "react";
import { Search } from "lucide-react";
import { Input, InputProps } from "../UI/Input";

export interface SearchInputProps extends Omit<InputProps, 'iconLeft'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <Input
        ref={ref}
        type="text"
        placeholder="Search"
        iconLeft={<Search className="w-4 h-4" />}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
