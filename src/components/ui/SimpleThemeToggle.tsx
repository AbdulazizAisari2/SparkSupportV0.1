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
        relative inline-flex items-center justify-center px-2 py-1 rounded-full transition-all duration-300 group cursor-pointer select-none text-xs
        ${theme === 'light' 
          ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300' 
          : 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300'
        }
        hover:shadow-md hover:scale-105 transform
        active:scale-95
        focus:outline-none focus:ring-1 focus:ring-primary-400
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
