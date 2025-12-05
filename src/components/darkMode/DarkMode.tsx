import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-12 h-12 
        flex items-center justify-center
        rounded-2xl 
        backdrop-blur-md 
        bg-white/40 dark:bg-white/10
        border border-white/40 dark:border-white/20
        shadow-lg dark:shadow-none
        hover:scale-105 active:scale-95
        transition-all duration-300
      "
    >
      <span
        className={`
          absolute transition-all duration-500 
          ${darkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}
        `}
      >
        <Sun className="w-6 h-6 text-yellow-300 drop-shadow-md" />
      </span>

      <span
        className={`
          absolute transition-all duration-500 
          ${darkMode ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}
        `}
      >
        <Moon className="w-6 h-6 text-indigo-500 drop-shadow-md" />
      </span>
    </button>
  );
};

export default ThemeToggleButton;
