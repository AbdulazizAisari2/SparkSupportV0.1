import React, { useState } from 'react';
import { Smile, Plus } from 'lucide-react';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs who reacted
}

interface EmojiReactionProps {
  messageId: string;
  reactions: Reaction[];
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
  className?: string;
}

const popularEmojis = ['👍', '👎', '❤️', '😊', '😢', '😮', '🎉', '🚀'];

export const EmojiReaction: React.FC<EmojiReactionProps> = ({
  messageId,
  reactions,
  currentUserId,
  onReact,
  className = ''
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onReact(messageId, emoji);
    setShowPicker(false);
  };

  const hasUserReacted = (reaction: Reaction) => {
    return reaction.users.includes(currentUserId);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Existing Reactions */}
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => handleEmojiClick(reaction.emoji)}
          className={`
            inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all duration-200 hover:scale-105
            ${hasUserReacted(reaction)
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          <span className="text-base">{reaction.emoji}</span>
          <span className="text-xs font-medium">{reaction.count}</span>
        </button>
      ))}

      {/* Add Reaction Button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          title="Add reaction"
        >
          {showPicker ? <Smile className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        {/* Emoji Picker */}
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 animate-slide-up">
            <div className="grid grid-cols-4 gap-1">
              {popularEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Achievement Badge Component
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

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'open':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700';
      case 'in_progress':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
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
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${getStyles()} ${className}`}>
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
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700 animate-pulse';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${getStyles()} ${className}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};