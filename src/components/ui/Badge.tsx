import React from 'react';
import { Award, Star, Zap, Target, Crown, Shield } from 'lucide-react';
import { Role, Status, Priority } from '../../types';
interface RoleBadgeProps {
  role: Role;
  className?: string;
}
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const getBadgeStyles = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case 'staff':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'customer':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };
  const getIcon = (role: Role) => {
    switch (role) {
      case 'admin': return Crown;
      case 'staff': return Shield;
      case 'customer': return Star;
      default: return Star;
    }
  };
  const Icon = getIcon(role);
  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors duration-200
      ${getBadgeStyles(role)} ${className}
    `}>
      <Icon className="w-3 h-3 mr-1" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};
interface StatusBadgeProps {
  status: Status;
  className?: string;
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'open':
        return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-400 shadow-sm dark:shadow-red-500/20';
      case 'in_progress':
        return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 border-2 border-yellow-300 dark:border-yellow-400 shadow-sm dark:shadow-yellow-500/20';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-400 shadow-sm dark:shadow-green-500/20';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-400 shadow-sm dark:shadow-gray-500/20';
      default:
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-400 shadow-sm dark:shadow-gray-500/20';
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
    <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${getStyles()} ${className}`}>
      {getDisplayText()}
    </span>
  );
};
interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const getStyles = () => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 dark:bg-red-500/25 text-red-900 dark:text-red-100 border-2 border-red-400 dark:border-red-300 shadow-lg dark:shadow-red-500/30 animate-pulse font-black';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-500/25 text-orange-900 dark:text-orange-100 border-2 border-orange-400 dark:border-orange-300 shadow-md dark:shadow-orange-500/20 font-bold';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-500/25 text-yellow-900 dark:text-yellow-100 border-2 border-yellow-400 dark:border-yellow-300 shadow-md dark:shadow-yellow-500/20 font-semibold';
      case 'low':
        return 'bg-green-100 dark:bg-green-500/25 text-green-900 dark:text-green-100 border-2 border-green-400 dark:border-green-300 shadow-md dark:shadow-green-500/20 font-medium';
      default:
        return 'bg-gray-100 dark:bg-gray-500/25 text-gray-900 dark:text-gray-100 border-2 border-gray-400 dark:border-gray-300 shadow-md dark:shadow-gray-500/20 font-medium';
    }
  };
  return (
    <span className={`inline-flex px-3 py-1.5 text-xs rounded-lg transition-all duration-200 uppercase tracking-wider ${getStyles()} ${className}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'award' | 'star' | 'zap' | 'target' | 'crown';
  color: 'gold' | 'silver' | 'bronze' | 'blue' | 'green' | 'purple';
  unlockedAt?: Date;
}
interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}
export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md',
  showTooltip = true 
}) => {
  const getIcon = (iconType: Achievement['icon']) => {
    switch (iconType) {
      case 'award': return Award;
      case 'star': return Star;
      case 'zap': return Zap;
      case 'target': return Target;
      case 'crown': return Crown;
      default: return Award;
    }
  };
  const getColorStyles = (color: Achievement['color']) => {
    switch (color) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-yellow-200 dark:shadow-yellow-900/20';
      case 'silver':
        return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-gray-200 dark:shadow-gray-900/20';
      case 'bronze':
        return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900 shadow-orange-200 dark:shadow-orange-900/20';
      case 'blue':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 text-blue-900 shadow-blue-200 dark:shadow-blue-900/20';
      case 'green':
        return 'bg-gradient-to-br from-green-400 to-green-600 text-green-900 shadow-green-200 dark:shadow-green-900/20';
      case 'purple':
        return 'bg-gradient-to-br from-purple-400 to-purple-600 text-purple-900 shadow-purple-200 dark:shadow-purple-900/20';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600 text-gray-900 shadow-gray-200 dark:shadow-gray-900/20';
    }
  };
  const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-xs';
      case 'md': return 'w-12 h-12 text-sm';
      case 'lg': return 'w-16 h-16 text-base';
      default: return 'w-12 h-12 text-sm';
    }
  };
  const Icon = getIcon(achievement.icon);
  const isUnlocked = !!achievement.unlockedAt;
  return (
    <div className="relative group">
      <div className={`
        rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer
        ${getSizeStyles(size)}
        ${isUnlocked 
          ? getColorStyles(achievement.color) 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }
        ${isUnlocked ? 'animate-bounce-gentle' : ''}
      `}>
        <Icon className={size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} />
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          <div className="font-semibold">{achievement.name}</div>
          <div className="text-gray-300 dark:text-gray-400">{achievement.description}</div>
          {isUnlocked && (
            <div className="text-green-400 text-xs mt-1">
              Unlocked {achievement.unlockedAt?.toLocaleDateString()}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
};