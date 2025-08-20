import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FloatingThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 group z-50 cursor-pointer select-none"
      style={{ 
        background: theme === 'light' 
          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
          : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        pointerEvents: 'auto'
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300
        ${theme === 'light' ? 'bg-yellow-400' : 'bg-blue-400'}
      `}></div>
      
      {/* Icon Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon */}
        <div className={`
          absolute transition-all duration-500 transform
          ${theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-180 scale-50'
          }
        `}>
          <Sun className="w-7 h-7 text-white animate-spin-slow group-hover:animate-pulse" />
        </div>
        
        {/* Moon Icon */}
        <div className={`
          absolute transition-all duration-500 transform
          ${theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-180 scale-50'
          }
        `}>
          <Moon className="w-7 h-7 text-white group-hover:animate-bounce" />
        </div>
      </div>

      {/* Hover Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
    </button>
  );
};