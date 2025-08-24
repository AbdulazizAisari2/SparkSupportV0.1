import React, { useState } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'floating' | 'minimal';
}
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false,
  variant = 'default'
}) => {
  const { theme, toggleTheme } = useTheme();
  const getVariantStyles = () => {
    switch (variant) {
      case 'floating':
        return `
          fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl
          bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl
          border border-gray-200/50 dark:border-dark-600/50
          hover:scale-110 hover:shadow-xl
        `;
      case 'minimal':
        return `
          w-10 h-10 rounded-lg
          bg-gray-100/80 dark:bg-dark-700/80 backdrop-blur-sm
          border border-gray-200/50 dark:border-dark-600/50
          hover:bg-gray-200/80 dark:hover:bg-dark-600/80
        `;
      default:
        return `
          px-3 py-2 rounded-xl
          bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm
          border border-gray-200/50 dark:border-dark-600/50
          hover:bg-gray-50 dark:hover:bg-dark-600/80
          hover:shadow-lg hover:scale-105
        `;
    }
  };
  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center transition-all duration-300 group
        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900
        ${getVariantStyles()}
        ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        <div className="relative w-5 h-5 overflow-hidden">
          <Sun 
            className={`
              absolute inset-0 w-5 h-5 transition-all duration-500 transform
              ${theme === 'light' 
                ? 'rotate-0 opacity-100 scale-100' 
                : 'rotate-180 opacity-0 scale-75'
              }
            `}
          />
          <Moon 
            className={`
              absolute inset-0 w-5 h-5 transition-all duration-500 transform
              ${theme === 'dark' 
                ? 'rotate-0 opacity-100 scale-100' 
                : '-rotate-180 opacity-0 scale-75'
              }
            `}
          />
        </div>
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-primary-400/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl"></div>
      </div>
    </button>
  );
};
interface AdvancedThemeToggleProps {
  className?: string;
}
export const AdvancedThemeToggle: React.FC<AdvancedThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const themes = [
    { id: 'light', name: 'Light', icon: Sun, color: 'from-yellow-400 to-orange-500' },
    { id: 'dark', name: 'Dark', icon: Moon, color: 'from-indigo-500 to-purple-600' },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 group
          bg-white/80 dark:bg-dark-700/80 backdrop-blur-xl
          border border-gray-200/50 dark:border-dark-600/50
          text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
          hover:shadow-lg hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-900
          ${className}
        `}
      >
        <Palette className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Theme</span>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-dark-600/50 z-50 animate-slide-down">
          <div className="space-y-1">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.id;
              return (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id as "light" | "dark");
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700/50'
                    }
                  `}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${themeOption.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{themeOption.name}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};