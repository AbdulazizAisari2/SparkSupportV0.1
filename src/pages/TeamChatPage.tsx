import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  Settings,
  Search,
  Filter,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Employee, Conversation } from '../context/ChatContext';
import { EmployeeDirectory } from '../components/chat/EmployeeDirectory';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';

type TabType = 'conversations' | 'directory';

export const TeamChatPage: React.FC = () => {
  const { state, setActiveConversation, startConversation } = useChat();
  const [activeTab, setActiveTab] = useState<TabType>('conversations');
  const [activeChatConversation, setActiveChatConversation] = useState<Conversation | null>(null);

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

  // Show error state if there's an error
  if (state.error) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-dark-900">
        {/* Header */}
        <div className="bg-white dark:bg-dark-800 border-b dark:border-dark-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team Chat
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect and collaborate with your team
              </p>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load Team Chat
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {state.error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-dark-900">
        {/* Header */}
        <div className="bg-white dark:bg-dark-800 border-b dark:border-dark-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team Chat
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </p>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <MessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Team Chat
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we set up your chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b dark:border-dark-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team Chat
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect and collaborate with your team
              </p>
            </div>
            {state.unreadCount > 0 && (
              <span className="px-3 py-1 text-sm bg-red-500 text-white rounded-full">
                {state.unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className={`${activeChatConversation ? 'hidden lg:flex lg:w-96' : 'flex w-full'} flex-col bg-white dark:bg-dark-800 border-r dark:border-dark-600`}>
          
          {/* Tabs */}
          <div className="flex border-b dark:border-dark-600">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'conversations'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
                {state.conversations.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                    {state.conversations.length}
                  </span>
                )}
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'directory'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team Directory</span>
                {state.employees.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                    {state.employees.filter(e => e.isOnline).length} online
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

        {/* Right Panel - Chat Window */}
        {activeChatConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Mobile back button */}
            <div className="lg:hidden flex items-center p-3 border-b dark:border-dark-600 bg-white dark:bg-dark-800">
              <button
                onClick={handleCloseChatWindow}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Back to list</span>
              </button>
            </div>
            
            <div className="flex-1">
              <ChatWindow 
                conversation={activeChatConversation}
                onClose={handleCloseChatWindow}
              />
            </div>
          </div>
        ) : (
          /* No conversation selected */
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 dark:bg-dark-900">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Choose a conversation from the list or start a new chat with a team member from the directory.
              </p>
              <button
                onClick={() => setActiveTab('directory')}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Browse Team Directory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};