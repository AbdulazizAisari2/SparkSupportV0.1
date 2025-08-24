import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Users, AlertCircle, Loader, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '../../hooks/useChat';
interface TeamChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export const TeamChatDrawer: React.FC<TeamChatDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { 
    messages, 
    onlineUsers, 
    isLoading, 
    error, 
    sendMessage 
  } = useChat();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 dark:text-purple-400';
      case 'staff': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'staff': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };
  if (!isOpen) return null;
  const onlineUsersList = onlineUsers.filter(u => u.isOnline);
  const offlineUsersList = onlineUsers.filter(u => !u.isOnline);
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="relative ml-64 flex-1 flex justify-end">
        <div className="w-96 bg-white dark:bg-dark-800 shadow-2xl border-l border-gray-200 dark:border-dark-600 flex flex-col h-full animate-slide-in-right">
          <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-gray-50/50 dark:bg-dark-900/50 max-h-48 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Team Members</h4>
            {offlineUsersList.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center">
                  <Circle className="w-2 h-2 fill-current mr-1" />
                  Offline ({offlineUsersList.length})
                </p>
                <div className="space-y-1">
                  {offlineUsersList.map(chatUser => (
                    <div
                      key={chatUser.id}
                      className="flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-dark-700/50 rounded-lg border border-gray-200 dark:border-dark-600 opacity-75"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {chatUser.name.charAt(0)}
                          </span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 border-2 border-white dark:border-dark-800 rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {chatUser.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadge(chatUser.role)} opacity-75`}>
                            {chatUser.role}
                          </span>
                          {chatUser.lastSeen && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(chatUser.lastSeen), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-dark-600 bg-gray-50/50 dark:bg-dark-900/50">
            <div className="flex items-center space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to the team..."
                className="flex-1 px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};