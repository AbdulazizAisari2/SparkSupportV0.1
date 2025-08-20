import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const TestThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 left-4 z-[9999] bg-red-500 text-white p-4 rounded-lg shadow-2xl">
      <div className="text-sm mb-2">
        Current theme: <strong>{theme}</strong>
      </div>
      <button
        onClick={() => {
          console.log('TEST: Clicking theme toggle, current:', theme);
          toggleTheme();
          console.log('TEST: After toggle call');
        }}
        className="bg-white text-red-500 px-4 py-2 rounded font-bold hover:bg-gray-100 cursor-pointer"
        style={{ pointerEvents: 'auto', zIndex: 9999 }}
      >
        TOGGLE THEME (TEST)
      </button>
    </div>
  );
};