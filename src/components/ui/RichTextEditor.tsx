import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code, 
  Quote,
  Undo,
  Redo,
  Palette
} from 'lucide-react';
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tooltip: string;
  disabled?: boolean;
}
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, icon: Icon, tooltip, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      p-2 rounded-lg transition-all duration-200 group relative
      ${isActive 
        ? 'bg-primary-500 text-white shadow-lg' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
    `}
    title={tooltip}
  >
    <Icon className="w-4 h-4" />
      <div className="bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600 p-3">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center space-x-1 mr-3">
            <ToolbarButton
              onClick={() => executeCommand('insertUnorderedList')}
              isActive={isCommandActive('insertUnorderedList')}
              icon={List}
              tooltip="Bullet List"
            />
            <ToolbarButton
              onClick={() => executeCommand('insertOrderedList')}
              isActive={isCommandActive('insertOrderedList')}
              icon={ListOrdered}
              tooltip="Numbered List"
            />
          </div>
          <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 mr-3"></div>
          <div className="flex items-center space-x-1">
            <ToolbarButton
              onClick={() => executeCommand('undo')}
              icon={Undo}
              tooltip="Undo (Ctrl+Z)"
            />
            <ToolbarButton
              onClick={() => executeCommand('redo')}
              icon={Redo}
              tooltip="Redo (Ctrl+Y)"
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-dark-700 px-4 py-2 border-t border-gray-200 dark:border-dark-600">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Rich text formatting enabled</span>
          <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
        </div>
      </div>
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .dark [contenteditable]:empty:before {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};