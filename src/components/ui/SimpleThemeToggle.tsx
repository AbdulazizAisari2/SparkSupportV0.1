import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SimpleThemeToggleProps {
  className?: string;
}

export const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({ 
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Theme toggle clicked!', theme);
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`
        relative inline-flex items-center justify-center px-3 py-1.5 rounded-full transition-all duration-300 group cursor-pointer select-none
        ${theme === 'light' 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-600 shadow-yellow-200/50' 
          : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-600 shadow-indigo-200/50'
        }
        hover:shadow-lg hover:scale-105 transform hover:shadow-primary-500/25
        active:scale-95 active:shadow-inner
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
        shadow-sm backdrop-blur-sm
        ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ 
        pointerEvents: 'auto',
        zIndex: 100,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Icon with smooth transition */}
      <div className="relative flex items-center space-x-1.5">
        <div className="relative w-4 h-4 overflow-hidden">
          {/* Sun Icon */}
          <div className={`
            absolute inset-0 flex items-center justify-center transition-all duration-500 transform
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-180 scale-75'
            }
          `}>
            <Sun className="w-4 h-4 text-yellow-600 dark:text-yellow-400 group-hover:animate-spin transition-colors duration-200" />
          </div>
          
          {/* Moon Icon */}
          <div className={`
            absolute inset-0 flex items-center justify-center transition-all duration-500 transform
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-180 scale-75'
            }
          `}>
            <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:animate-pulse transition-colors duration-200" />
          </div>
        </div>
        
        {/* Badge Label */}
        <span className={`
          text-xs font-semibold transition-all duration-300
          ${theme === 'light' 
            ? 'text-yellow-700 dark:text-yellow-300' 
            : 'text-indigo-700 dark:text-indigo-300'
          }
        `}>
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm
        ${theme === 'light' 
          ? 'bg-gradient-to-r from-yellow-400/30 to-orange-400/30' 
          : 'bg-gradient-to-r from-indigo-400/30 to-purple-400/30'
        }
      `}></div>
      
      {/* Subtle pulse animation */}
      <div className={`
        absolute inset-0 rounded-full animate-pulse opacity-20
        ${theme === 'light' 
          ? 'bg-yellow-300 dark:bg-yellow-500' 
          : 'bg-indigo-300 dark:bg-indigo-500'
        }
      `}></div>
    </button>
  );
};