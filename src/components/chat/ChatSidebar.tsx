import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  X, 
  Minimize2, 
  Maximize2,
  Settings
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { Employee, Conversation } from '../../context/ChatContext';
import { EmployeeDirectory } from './EmployeeDirectory';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'conversations' | 'directory';

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const { state, setActiveConversation, startConversation } = useChat();
  const [activeTab, setActiveTab] = useState<TabType>('conversations');
  const [activeChatConversation, setActiveChatConversation] = useState<Conversation | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleStartChat = async (employee: Employee) => {
    try {
      // Check if conversation already exists
      const existingConversation = state.conversations.find(
        conv => conv.otherUser.id === employee.id
      );

      if (existingConversation) {
        setActiveChatConversation(existingConversation);
        setActiveConversation(existingConversation.id);
      } else {
        // Start new conversation
        const conversationId = await startConversation(employee.id);
        
        // Find the newly created conversation
        const newConversation = state.conversations.find(
          conv => conv.id === conversationId
        );
        
        if (newConversation) {
          setActiveChatConversation(newConversation);
          setActiveConversation(conversationId);
        }
      }
      
      // Switch to conversations tab to show the chat
      setActiveTab('conversations');
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveChatConversation(conversation);
    setActiveConversation(conversation.id);
  };

  const handleCloseChatWindow = () => {
    setActiveChatConversation(null);
    setActiveConversation(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      
      {/* Chat Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-white dark:bg-dark-800 shadow-2xl border-l dark:border-dark-600 transition-all duration-300 lg:relative lg:shadow-lg ${
        isMinimized 
          ? 'w-16' 
          : activeChatConversation 
            ? 'w-full lg:w-[800px]' 
            : 'w-full lg:w-96'
      }`}>
        
        {isMinimized ? (
          /* Minimized State */
          <div className="h-full flex flex-col items-center py-4 space-y-4">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-3 bg-primary-100 dark:bg-primary-900/20 hover:bg-primary-200 dark:hover:bg-primary-800/40 text-primary-600 dark:text-primary-400 rounded-lg transition-colors group"
            >
              <MessageCircle className="w-6 h-6" />
              {state.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                  {state.unreadCount > 99 ? '99+' : state.unreadCount}
                </div>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500 dark:text-gray-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Expanded State */
          <div className={`h-full flex ${activeChatConversation ? 'lg:flex-row' : 'flex-col'}`}>
            
            {/* Main Chat Panel */}
            <div className={`${activeChatConversation ? 'hidden lg:flex lg:w-96' : 'flex w-full'} flex-col`}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b dark:border-dark-600 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-700 dark:to-dark-600">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Chat
                  </h1>
                  {state.unreadCount > 0 && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {state.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-white/20 dark:hover:bg-dark-600 rounded-lg transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                    title="Close"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b dark:border-dark-600 bg-white dark:bg-dark-800">
                <button
                  onClick={() => setActiveTab('conversations')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'conversations'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Messages</span>
                    {state.conversations.length > 0 && (
                      <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                        {state.conversations.length}
                      </span>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('directory')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'directory'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                    {state.employees.length > 0 && (
                      <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                        {state.employees.filter(e => e.isOnline).length}
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'conversations' ? (
                  <ConversationList 
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={activeChatConversation?.id}
                  />
                ) : (
                  <EmployeeDirectory onStartChat={handleStartChat} />
                )}
              </div>
            </div>

            {/* Chat Window */}
            {activeChatConversation && (
              <div className="flex-1 flex flex-col">
                {/* Mobile back button */}
                <div className="lg:hidden flex items-center p-2 border-b dark:border-dark-600 bg-white dark:bg-dark-800">
                  <button
                    onClick={handleCloseChatWindow}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <ChatWindow 
                    conversation={activeChatConversation}
                    onClose={handleCloseChatWindow}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};