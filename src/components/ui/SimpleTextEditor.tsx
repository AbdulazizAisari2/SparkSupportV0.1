import React, { useState } from 'react';
import { Bold, Italic, List, Link, Type, Eye } from 'lucide-react';

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export const SimpleTextEditor: React.FC<SimpleTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '200px',
  className = ''
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-dark-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-5 space-y-1">$1</ul>')
      .replace(/\n/g, '<br>');
  };

  const toolbarButtons = [
    {
      icon: Bold,
      tooltip: 'Bold (**text**)',
      action: () => insertText('**', '**')
    },
    {
      icon: Italic,
      tooltip: 'Italic (*text*)',
      action: () => insertText('*', '*')
    },
    {
      icon: List,
      tooltip: 'List (- item)',
      action: () => insertText('- ')
    },
    {
      icon: Link,
      tooltip: 'Link ([text](url))',
      action: () => insertText('[', '](url)')
    },
    {
      icon: Type,
      tooltip: 'Code (`code`)',
      action: () => insertText('`', '`')
    }
  ];

  return (
    <div className={`border-2 border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden transition-all duration-200 ${isFocused ? 'border-primary-500 shadow-lg' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 group relative"
                  title={button.tooltip}
                >
                  <Icon className="w-4 h-4" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {button.tooltip}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`
                flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200
                ${isPreview 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-500'
                }
              `}
            >
              <Eye className="w-3 h-3" />
              <span>{isPreview ? 'Edit' : 'Preview'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div 
          className="p-4 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 prose prose-sm dark:prose-invert max-w-none"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(value) }}
        />
      ) : (
        <textarea
          id="editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full p-4 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            resize-none outline-none transition-colors duration-200
            focus:bg-gray-50 dark:focus:bg-dark-700/50
          `}
          style={{ minHeight }}
        />
      )}

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-dark-700 px-4 py-2 border-t border-gray-200 dark:border-dark-600">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Markdown formatting supported</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};