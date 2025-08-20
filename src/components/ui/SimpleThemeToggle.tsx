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
  
  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 group cursor-pointer
        bg-white/90 dark:bg-dark-700/90 backdrop-blur-sm
        border border-gray-200 dark:border-dark-600
        text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
        hover:bg-gray-50 dark:hover:bg-dark-600 hover:shadow-md hover:scale-105
        focus:outline-none active:scale-95
        ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      
      <div className="relative flex items-center space-x-2">
        {/* Icon with smooth transition */}
        <div className="relative w-5 h-5">
          {theme === 'light' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-blue-400" />
          )}
        </div>

        {/* Label */}
        {showLabel && (
          <span className="text-sm font-bold">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        )}
      </div>

      {/* Click ripple effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-primary-400/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl"></div>
      </div>
    </button>
  );
};