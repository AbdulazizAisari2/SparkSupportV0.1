import React, { useState } from 'react';
import { Smile, Plus } from 'lucide-react';
export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; 
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
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          title="Add reaction"
        >
          {showPicker ? <Smile className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
