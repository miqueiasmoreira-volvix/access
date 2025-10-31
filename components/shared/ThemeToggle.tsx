import { useTheme } from "@/context/ThemeContext";
import { MoonIcon as Moon, SunIcon as Sun } from "@heroicons/react/16/solid";
import { Button } from "@/components/UI/Button";

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export function ThemeToggleButton({ isCollapsed }: ThemeToggleProps) {
  
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="deafult"
      size="sm"
      icon={isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      ariaLabel="Alternar tema"
      className={`transition-all duration-500 ease-in-out ${isCollapsed ? "justify-start" : ""}`}
    >

      {
        isCollapsed ?
        <span  className="transition-all duration-500 ease-in-out"></span>
        :
      <span className="transition-all duration-500 ease-in-out">Alternar tema</span>
      }
    </Button>
  );
}
