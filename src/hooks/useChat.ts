import { useState, useEffect } from 'react';
import { ChatMessage, ChatUser } from '../types';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8000/api';

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // Fetch chat messages
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/chat/messages`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setOnlineUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Send a message
  const sendMessage = async (message: string) => {
    if (!message.trim() || !user) return;

    try {
      const response = await fetch(`${API_BASE}/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      setError(null);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
      throw err;
    }
  };

  // Update user online status
  const updateOnlineStatus = async (isOnline: boolean) => {
    if (!user) return;

    try {
      await fetch(`${API_BASE}/chat/users/${user.id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isOnline }),
      });
    } catch (err) {
      console.error('Error updating online status:', err);
    }
  };

  // Set user online when component mounts
  useEffect(() => {
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      updateOnlineStatus(true);
      fetchMessages();
      fetchOnlineUsers();

      // Refresh data periodically
      const interval = setInterval(() => {
        fetchMessages();
        fetchOnlineUsers();
      }, 5000); // Refresh every 5 seconds

      return () => {
        clearInterval(interval);
        updateOnlineStatus(false);
      };
    }
  }, [user]);

  // Set user offline when page unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        // Use navigator.sendBeacon for reliable offline status update
        const token = localStorage.getItem('token');
        if (token) {
          navigator.sendBeacon(
            `${API_BASE}/chat/users/${user.id}/status`,
            JSON.stringify({ isOnline: false })
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  return {
    messages,
    onlineUsers,
    isLoading,
    error,
    sendMessage,
    refreshMessages: fetchMessages,
    refreshUsers: fetchOnlineUsers,
  };
};