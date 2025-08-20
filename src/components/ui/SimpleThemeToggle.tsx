import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SimpleThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
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
        relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 group cursor-pointer select-none
        bg-white dark:bg-dark-700 
        border border-gray-300 dark:border-dark-500
        text-gray-600 dark:text-gray-300 
        hover:bg-gray-100 dark:hover:bg-dark-600 
        hover:border-primary-400 dark:hover:border-primary-500
        hover:shadow-lg hover:scale-110
        active:scale-95 active:shadow-inner
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon Container with Smooth Animations */}
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon */}
        <div className={`
          absolute inset-0 flex items-center justify-center transition-all duration-500 transform
          ${theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-180 scale-75'
          }
        `}>
          <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200 animate-spin-slow" />
        </div>
        
        {/* Moon Icon */}
        <div className={`
          absolute inset-0 flex items-center justify-center transition-all duration-500 transform
          ${theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-180 scale-75'
          }
        `}>
          <Moon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200 group-hover:animate-pulse" />
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium transition-colors duration-200">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}

      {/* Click Ripple Effect */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-primary-400/30 scale-0 group-active:scale-100 transition-transform duration-200 rounded-lg"></div>
      </div>
    </button>
  );
};