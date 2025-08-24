import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useToast, Toast as ToastType } from '../../context/ToastContext';
const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast();
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
  };
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50/90 dark:bg-green-900/30 border-green-200 dark:border-green-700/50 text-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50/90 dark:bg-red-900/30 border-red-200 dark:border-red-700/50 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50/90 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-blue-50/90 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200';
    }
  };
  return (
    <div
      className={`
        flex items-center justify-between p-4 mb-3 rounded-xl shadow-2xl max-w-sm backdrop-blur-xl border
        transform transition-all duration-500 ease-out animate-slide-down hover:scale-105
        ${getStyles()}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          {getIcon()}
          {toast.type === 'success' && (
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
          )}
        </div>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};