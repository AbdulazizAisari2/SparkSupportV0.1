import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Users, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, ChatUser } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface TeamChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for now - will be replaced with real API calls
const mockChatUsers: ChatUser[] = [
  { id: '1', name: 'Sarah Wilson', role: 'staff', department: 'Technical Support', isOnline: true },
  { id: '2', name: 'Mike Johnson', role: 'staff', department: 'Customer Success', isOnline: true },
  { id: '3', name: 'Admin User', role: 'admin', isOnline: false, lastSeen: '2024-01-15T10:30:00Z' },
  { id: '4', name: 'Emily Chen', role: 'staff', department: 'Technical Support', isOnline: true },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Sarah Wilson',
    senderRole: 'staff',
    message: 'Good morning team! Ready for another productive day? 🌟',
    timestamp: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Mike Johnson',
    senderRole: 'staff',
    message: 'Morning Sarah! Just reviewed the overnight tickets - looking good.',
    timestamp: '2024-01-15T09:05:00Z',
  },
  {
    id: '3',
    senderId: '4',
    senderName: 'Emily Chen',
    senderRole: 'staff',
    message: 'Has anyone dealt with the payment processing issue from yesterday? Customer is asking for an update.',
    timestamp: '2024-01-15T09:15:00Z',
  },
  {
    id: '4',
    senderId: '1',
    senderName: 'Sarah Wilson',
    senderRole: 'staff',
    message: 'Yes! I resolved it this morning. The issue was with their billing address format. Already updated the customer.',
    timestamp: '2024-01-15T09:18:00Z',
  },
];

export const TeamChatDrawer: React.FC<TeamChatDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>(mockChatUsers);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
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

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Drawer */}
      <div className="relative ml-64 flex-1 flex justify-end">
        <div className="w-96 bg-white dark:bg-dark-800 shadow-2xl border-l border-gray-200 dark:border-dark-600 flex flex-col h-full animate-slide-in-right">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Team Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {onlineUsers.filter(u => u.isOnline).length} online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Online Users */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-gray-50/50 dark:bg-dark-900/50">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Online Now</h4>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.filter(u => u.isOnline).map(user => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 px-3 py-1 bg-white dark:bg-dark-800 rounded-full border border-gray-200 dark:border-dark-600"
                >
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="group">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {msg.senderName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-semibold text-sm ${getRoleColor(msg.senderRole)}`}>
                        {msg.senderName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadge(msg.senderRole)}`}>
                        {msg.senderRole}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-sm px-4 py-2">
                      <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-600 bg-gray-50/50 dark:bg-dark-900/50">
            <div className="flex items-center space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
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