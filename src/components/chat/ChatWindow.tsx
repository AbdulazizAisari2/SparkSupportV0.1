import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Send, 
  Paperclip, 
  Image, 
  X, 
  Download,
  Check,
  CheckCheck,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { Employee, ChatMessage } from '../../context/ChatContext';

interface ChatWindowProps {
  conversation: {
    id: string;
    otherUser: Employee;
  };
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onClose }) => {
  const { state, sendMessage, sendFileMessage, markMessagesAsRead } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.activeMessages]);

  // Mark messages as read when window opens
  useEffect(() => {
    markMessagesAsRead(conversation.id);
  }, [conversation.id, markMessagesAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMessage(conversation.otherUser.id, messageText);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await sendFileMessage(conversation.otherUser.id, file);
    } catch (error) {
      console.error('Failed to send file:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getMessageTime = (createdAt: string) => {
    const messageDate = new Date(createdAt);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(messageDate, 'HH:mm');
    } else {
      return format(messageDate, 'MMM dd, HH:mm');
    }
  };

  const getFileIcon = (messageType: string, attachmentName?: string) => {
    if (messageType === 'image') return <Image className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  const isCurrentUser = (senderId: string) => {
    return senderId === state.activeMessages[0]?.sender.id; // Simplified check
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-800 rounded-lg shadow-xl border dark:border-dark-600">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-dark-600 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-700 dark:to-dark-600 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {conversation.otherUser.name.charAt(0).toUpperCase()}
            </div>
            {conversation.otherUser.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-800"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {conversation.otherUser.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversation.otherUser.isOnline ? (
                <span className="text-green-600 dark:text-green-400">● Online</span>
              ) : (
                `Last seen ${conversation.otherUser.lastSeen ? format(new Date(conversation.otherUser.lastSeen), 'MMM dd, HH:mm') : 'recently'}`
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/20 dark:hover:bg-dark-600 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 hover:bg-white/20 dark:hover:bg-dark-600 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 hover:bg-white/20 dark:hover:bg-dark-600 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-900">
        {state.activeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {conversation.otherUser.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <p className="text-lg font-medium mb-2">Start a conversation</p>
            <p className="text-sm text-center">Send a message to {conversation.otherUser.name} to get started!</p>
          </div>
        ) : (
          state.activeMessages.map((message) => {
            const isOwnMessage = message.sender.id !== conversation.otherUser.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                  {!isOwnMessage && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {message.sender.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.sender.name}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-dark-700 border dark:border-dark-600 text-gray-900 dark:text-white rounded-bl-md'
                    }`}
                  >
                    {message.messageType === 'text' ? (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {getFileIcon(message.messageType, message.attachmentName)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{message.attachmentName || 'File'}</p>
                          {message.messageType === 'image' && message.attachmentUrl && (
                            <img 
                              src={`http://localhost:8000${message.attachmentUrl}`}
                              alt={message.attachmentName}
                              className="mt-2 max-w-full h-auto rounded-lg"
                              loading="lazy"
                            />
                          )}
                        </div>
                        {message.attachmentUrl && (
                          <a 
                            href={`http://localhost:8000${message.attachmentUrl}`}
                            download={message.attachmentName}
                            className={`p-1 rounded hover:bg-black/10 ${isOwnMessage ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getMessageTime(message.createdAt)}
                    </span>
                    {isOwnMessage && (
                      <div className="text-gray-500 dark:text-gray-400">
                        {message.isRead ? (
                          <CheckCheck className="w-3 h-3 text-green-500" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing indicator */}
        {state.isTyping[conversation.id] && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="bg-white dark:bg-dark-700 border dark:border-dark-600 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {conversation.otherUser.name} is typing...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t dark:border-dark-600 bg-white dark:bg-dark-800">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-dark-700 rounded-2xl border dark:border-dark-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message ${conversation.otherUser.name}...`}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isUploading}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Image className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!messageText.trim() || isUploading}
            className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          className="hidden"
        />
        
        {isUploading && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading file...</span>
          </div>
        )}
      </div>
    </div>
  );
};