import React from 'react';
import { format } from 'date-fns';
import { 
  MessageCircle, 
  Search,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  CheckCheck,
  Check,
  Image,
  Paperclip
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { Conversation } from '../../context/ChatContext';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string | null;
}

export const ConversationList: React.FC<ConversationListProps> = ({ 
  onSelectConversation, 
  selectedConversationId 
}) => {
  const { state, fetchConversations } = useChat();

  React.useEffect(() => {
    fetchConversations();
  }, []);

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const { content, messageType } = conversation.lastMessage;
    
    if (messageType === 'image') {
      return '📷 Image';
    } else if (messageType === 'file') {
      return '📎 File';
    }
    
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  const getMessageTime = (conversation: Conversation) => {
    if (!conversation.lastMessageAt) return '';
    
    const messageDate = new Date(conversation.lastMessageAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h`;
    } else if (diffInMinutes < 10080) {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d`;
    } else {
      return format(messageDate, 'MMM dd');
    }
  };

  const isCurrentUserLastSender = (conversation: Conversation) => {
    // This would need the current user ID - simplified for now
    return conversation.lastMessage?.senderId !== conversation.otherUser.id;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-800">
      {/* Header */}
      <div className="p-4 border-b dark:border-dark-600 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-700 dark:to-dark-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Messages
            </h2>
            {state.unreadCount > 0 && (
              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {state.unreadCount}
              </span>
            )}
          </div>
          
          <button
            onClick={fetchConversations}
            className="p-2 hover:bg-white/20 dark:hover:bg-dark-600 rounded-lg transition-colors"
            title="Refresh"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-700 border dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {state.conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start chatting with your team!</p>
          </div>
        ) : (
          <div className="divide-y dark:divide-dark-600">
            {state.conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-700 ${
                  selectedConversationId === conversation.id 
                    ? 'bg-primary-50 dark:bg-primary-900/10 border-r-2 border-primary-500' 
                    : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversation.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    {conversation.otherUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-800"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${
                        conversation.unreadCount > 0 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {conversation.otherUser.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {conversation.lastMessage && isCurrentUserLastSender(conversation) && (
                          <div className="text-gray-400">
                            <CheckCheck className="w-3 h-3" />
                          </div>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getMessageTime(conversation)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {conversation.lastMessage?.messageType === 'image' && (
                          <Image className="w-4 h-4 inline mr-1" />
                        )}
                        {conversation.lastMessage?.messageType === 'file' && (
                          <Paperclip className="w-4 h-4 inline mr-1" />
                        )}
                        {getLastMessagePreview(conversation)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">
                        {conversation.otherUser.department}
                      </span>
                      <div className="flex items-center space-x-1">
                        {conversation.otherUser.isOnline ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Offline</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t dark:border-dark-600 bg-gray-50 dark:bg-dark-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{state.conversations.length} conversations</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span>
              {state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};