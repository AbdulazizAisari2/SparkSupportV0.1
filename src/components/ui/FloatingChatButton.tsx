import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeamChatDrawer } from '../chat/TeamChatDrawer';
export const FloatingChatButton: React.FC = () => {
  const { user, token } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  useEffect(() => {
    if (!user || user.role === 'customer' || !token) return;
    const checkNewMessages = async () => {
      try {
        const response = await fetch('http:
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
            setHasNewMessages(messages.length > 0);
          }
        }
      } catch (error) {
        console.error('Error checking for new messages:', error);
      }
    };
    checkNewMessages();
    const interval = setInterval(checkNewMessages, 30000);
    return () => clearInterval(interval);
  }, [user, token]);
  const handleOpenChat = () => {
    setIsChatOpen(true);
    setHasNewMessages(false);
    localStorage.setItem('lastChatReadTime', new Date().toISOString());
  };
  if (!user || user.role === 'customer') {
    return null;
  }
  return (
    <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            {hasNewMessages && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center animate-bounce">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
      <TeamChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};