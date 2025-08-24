import { useState, useEffect } from 'react';
import { ChatMessage, ChatUser } from '../types';
import { useAuth } from '../context/AuthContext';
const API_BASE = 'http:
export const useChat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };
  const fetchMessages = async () => {
    if (!token) {
      setError('No authentication token');
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/chat/messages`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to fetch messages: ${response.status}`);
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
  const fetchOnlineUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/chat/users`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed when fetching users');
          return;
        }
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setOnlineUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };
  const sendMessage = async (message: string) => {
    if (!message.trim() || !user || !token) return;
    try {
      const response = await fetch(`${API_BASE}/chat/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: message.trim() }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to send message: ${response.status}`);
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
  const updateOnlineStatus = async (isOnline: boolean) => {
    if (!user || !token) return;
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
  useEffect(() => {
    if (user && token && (user.role === 'staff' || user.role === 'admin')) {
      updateOnlineStatus(true);
      fetchMessages();
      fetchOnlineUsers();
      const interval = setInterval(() => {
        fetchMessages();
        fetchOnlineUsers();
      }, 5000); 
      return () => {
        clearInterval(interval);
        updateOnlineStatus(false);
      };
    }
  }, [user, token]);
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user && token) {
        const blob = new Blob([JSON.stringify({ isOnline: false })], {
          type: 'application/json'
        });
        navigator.sendBeacon(
          `${API_BASE}/chat/users/${user.id}/status`,
          blob
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, token]);
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