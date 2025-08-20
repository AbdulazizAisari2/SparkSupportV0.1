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
  Type,
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
  icon: React.ComponentType<any>;
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
    
    {/* Tooltip */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
      {tooltip}
    </div>
  </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '200px',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const isCommandActive = (command: string) => {
    return document.queryCommandState(command);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', `<${tag}>`);
  };

  return (
    <div className={`border-2 border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden transition-all duration-200 ${isEditorFocused ? 'border-primary-500 shadow-lg' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1 mr-3">
            <ToolbarButton
              onClick={() => executeCommand('bold')}
              isActive={isCommandActive('bold')}
              icon={Bold}
              tooltip="Bold (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => executeCommand('italic')}
              isActive={isCommandActive('italic')}
              icon={Italic}
              tooltip="Italic (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => executeCommand('underline')}
              isActive={isCommandActive('underline')}
              icon={Underline}
              tooltip="Underline (Ctrl+U)"
            />
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 mr-3"></div>

          {/* Lists */}
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

          {/* Insert Elements */}
          <div className="flex items-center space-x-1 mr-3">
            <ToolbarButton
              onClick={insertLink}
              icon={Link}
              tooltip="Insert Link"
            />
            <ToolbarButton
              onClick={insertImage}
              icon={Image}
              tooltip="Insert Image"
            />
            <ToolbarButton
              onClick={() => executeCommand('formatBlock', 'blockquote')}
              icon={Quote}
              tooltip="Quote"
            />
            <ToolbarButton
              onClick={() => executeCommand('formatBlock', 'pre')}
              icon={Code}
              tooltip="Code Block"
            />
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 mr-3"></div>

          {/* Undo/Redo */}
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

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        onPaste={handlePaste}
        className={`
          p-4 outline-none bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 transition-colors duration-200
          prose prose-sm dark:prose-invert max-w-none
          focus:bg-gray-50 dark:focus:bg-dark-700/50
        `}
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      {/* Character Count */}
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