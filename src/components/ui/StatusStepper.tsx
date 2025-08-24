import React from 'react';
import { Status } from '../../types';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
interface StatusStepperProps {
  currentStatus: Status;
  onStatusChange: (newStatus: Status) => void;
  disabled?: boolean;
}
const statusFlow: Status[] = ['open', 'in_progress', 'resolved', 'closed'];
const statusConfig = {
  open: { label: 'Open', icon: AlertCircle, color: 'text-red-500' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-yellow-500' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-green-500' },
  closed: { label: 'Closed', icon: Circle, color: 'text-gray-500' }
};
export const StatusStepper: React.FC<StatusStepperProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false
}) => {
  const currentIndex = statusFlow.indexOf(currentStatus);
  const isValidTransition = (targetStatus: Status): boolean => {
    const targetIndex = statusFlow.indexOf(targetStatus);
    if (targetIndex === currentIndex + 1) return true;
    if (currentStatus === 'closed' && targetStatus === 'in_progress') return true;
    return false;
  };
  const handleStatusClick = (status: Status) => {
    if (disabled || !isValidTransition(status)) return;
    if (status === 'closed' && currentStatus !== 'closed') {
      if (confirm('Are you sure you want to close this ticket?')) {
        onStatusChange(status);
      }
    } else if (currentStatus === 'closed' && status === 'in_progress') {
      if (confirm('Are you sure you want to reopen this ticket?')) {
        onStatusChange(status);
      }
    } else {
      onStatusChange(status);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      {statusFlow.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isActive = status === currentStatus;
        const isPast = index < currentIndex;
        const isClickable = !disabled && isValidTransition(status);
        return (
          <div key={status} className="flex items-center">
            <button
              onClick={() => handleStatusClick(status)}
              disabled={!isClickable}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : isPast 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }
                ${isClickable 
                  ? 'hover:bg-blue-50 cursor-pointer' 
                  : 'cursor-not-allowed opacity-60'
                }
              `}
            >
              <Icon 
                className={`w-4 h-4 ${
                  isActive 
                    ? 'text-blue-500' 
                    : isPast 
                      ? 'text-green-500' 
                      : config.color
                }`} 
              />
              <span className={`text-sm font-medium ${
                isActive ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {config.label}
              </span>
            </button>
            {index < statusFlow.length - 1 && (
              <div className="w-8 h-px bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};