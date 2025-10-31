import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/UI/Button";
import { ReactNode } from "react";

interface DefaultButtonProps {
  isCollapsed?: boolean;
  icon?: ReactNode;
  ariaLabel: string;
}

export function ThemeToggleButton({ isCollapsed, icon, ariaLabel }: DefaultButtonProps) {
  
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="deafult"
      size="sm"
      icon={icon}
      ariaLabel={ariaLabel}
      className={`transition-all duration-500 ease-in-out ${isCollapsed ? "justify-start" : ""}`}
    >

      {
        isCollapsed ?
        <span  className="transition-all duration-500 ease-in-out"></span>
        :
      <span className="transition-all duration-500 ease-in-out">{ariaLabel}</span>
      }
    </Button>
  );
}
