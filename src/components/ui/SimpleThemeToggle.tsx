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
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
    console.log('Theme should now be:', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center justify-center p-3 rounded-xl transition-all duration-200 group cursor-pointer z-50
        bg-white dark:bg-dark-700 
        border-2 border-gray-300 dark:border-dark-500
        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
        hover:bg-gray-100 dark:hover:bg-dark-600 hover:shadow-lg hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-primary-500
        active:scale-95 active:bg-primary-100 dark:active:bg-primary-900/30
        ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      
      <div className="relative flex items-center space-x-2">
        {/* Icon with smooth transition */}
        <div className="relative w-6 h-6">
          {theme === 'light' ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-blue-400" />
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