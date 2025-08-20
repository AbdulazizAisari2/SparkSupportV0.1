import React from 'react';
import { Role, Status, Priority } from '../../types';

interface RoleBadgeProps {
  role: Role;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getStyles = () => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'staff':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStyles()}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getDisplayText = () => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStyles()}`}>
      {getDisplayText()}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStyles()}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};