import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeamChatDrawer } from '../chat/TeamChatDrawer';

export const FloatingChatButton: React.FC = () => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Check for new messages periodically
  useEffect(() => {
    if (!user || user.role === 'customer') return;

    const checkNewMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/chat/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const messages = await response.json();
          const lastReadTime = localStorage.getItem('lastChatReadTime');
          
          if (lastReadTime) {
            const hasUnread = messages.some((msg: any) => 
              new Date(msg.timestamp) > new Date(lastReadTime)
            );
            setHasNewMessages(hasUnread);
          } else {
            // First time - mark as having new messages if there are any messages
            setHasNewMessages(messages.length > 0);
          }
        }
      } catch (error) {
        console.error('Error checking for new messages:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkNewMessages();
    const interval = setInterval(checkNewMessages, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // Mark messages as read when chat is opened
  const handleOpenChat = () => {
    setIsChatOpen(true);
    setHasNewMessages(false);
    localStorage.setItem('lastChatReadTime', new Date().toISOString());
  };

  // Only show for staff and admin users
  if (!user || user.role === 'customer') {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-24 z-40">
        <button
          onClick={handleOpenChat}
          className="relative group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/25"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          
          {/* Button Content */}
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            
            {/* New Messages Indicator */}
            {hasNewMessages && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center animate-bounce">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Team Chat
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </button>
      </div>

      {/* Team Chat Drawer */}
      <TeamChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};