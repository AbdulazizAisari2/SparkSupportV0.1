import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useToast, Toast as ToastType } from '../../context/ToastContext';

const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg max-w-sm
        transform transition-all duration-300 ease-in-out
        ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
        ${toast.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
        ${toast.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : ''}
        ${toast.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="text-sm font-medium text-gray-800">{toast.message}</span>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};