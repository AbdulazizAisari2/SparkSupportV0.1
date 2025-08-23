import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

// Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  isOnline: boolean;
  lastSeen?: string;
  status?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'file' | 'image';
  attachmentUrl?: string;
  attachmentName?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Conversation {
  id: string;
  otherUser: Employee;
  lastMessage?: {
    id: string;
    content: string;
    messageType: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  lastMessageAt?: string;
  createdAt: string;
}

interface ChatState {
  employees: Employee[];
  conversations: Conversation[];
  activeConversationId: string | null;
  activeMessages: ChatMessage[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedDepartment: string | null;
  showOnlineOnly: boolean;
  isTyping: { [conversationId: string]: boolean };
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'SET_ACTIVE_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_DEPARTMENT'; payload: string | null }
  | { type: 'SET_SHOW_ONLINE_ONLY'; payload: boolean }
  | { type: 'UPDATE_EMPLOYEE_STATUS'; payload: { id: string; isOnline: boolean; lastSeen?: string; status?: string } }
  | { type: 'SET_TYPING'; payload: { conversationId: string; isTyping: boolean } }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'MARK_MESSAGES_READ'; payload: string };

const initialState: ChatState = {
  employees: [],
  conversations: [],
  activeConversationId: null,
  activeMessages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedDepartment: null,
  showOnlineOnly: false,
  isTyping: {}
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    
    case 'SET_ACTIVE_CONVERSATION':
      return { 
        ...state, 
        activeConversationId: action.payload,
        activeMessages: action.payload ? state.activeMessages : []
      };
    
    case 'SET_ACTIVE_MESSAGES':
      return { ...state, activeMessages: action.payload };
    
    case 'ADD_MESSAGE':
      const newMessage = action.payload;
      
      // Update active messages if this message belongs to the active conversation
      const updatedActiveMessages = state.activeConversationId === newMessage.conversationId
        ? [...state.activeMessages, newMessage]
        : state.activeMessages;
      
      // Update conversations list
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === newMessage.conversationId) {
          return {
            ...conv,
            lastMessage: {
              id: newMessage.id,
              content: newMessage.content,
              messageType: newMessage.messageType,
              createdAt: newMessage.createdAt,
              senderId: newMessage.senderId
            },
            lastMessageAt: newMessage.createdAt,
            unreadCount: newMessage.senderId !== state.activeConversationId ? conv.unreadCount + 1 : conv.unreadCount
          };
        }
        return conv;
      });
      
      return {
        ...state,
        activeMessages: updatedActiveMessages,
        conversations: updatedConversations,
        unreadCount: state.unreadCount + (newMessage.senderId !== state.activeConversationId ? 1 : 0)
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        activeMessages: state.activeMessages.map(msg =>
          msg.id === action.payload.id ? action.payload : msg
        )
      };
    
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SELECTED_DEPARTMENT':
      return { ...state, selectedDepartment: action.payload };
    
    case 'SET_SHOW_ONLINE_ONLY':
      return { ...state, showOnlineOnly: action.payload };
    
    case 'UPDATE_EMPLOYEE_STATUS':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id
            ? { ...emp, ...action.payload }
            : emp
        )
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: {
          ...state.isTyping,
          [action.payload.conversationId]: action.payload.isTyping
        }
      };
    
    case 'UPDATE_CONVERSATION':
      const conversationExists = state.conversations.some(conv => conv.id === action.payload.id);
      
      if (conversationExists) {
        return {
          ...state,
          conversations: state.conversations.map(conv =>
            conv.id === action.payload.id ? action.payload : conv
          )
        };
      } else {
        return {
          ...state,
          conversations: [action.payload, ...state.conversations]
        };
      }
    
    case 'MARK_MESSAGES_READ':
      return {
        ...state,
        activeMessages: state.activeMessages.map(msg =>
          msg.conversationId === action.payload && !msg.isRead
            ? { ...msg, isRead: true, readAt: new Date().toISOString() }
            : msg
        ),
        conversations: state.conversations.map(conv =>
          conv.id === action.payload
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      };
    
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  // Employee actions
  fetchEmployees: () => Promise<void>;
  updateEmployeeStatus: (status: { isOnline?: boolean; status?: string }) => Promise<void>;
  
  // Conversation actions
  fetchConversations: () => Promise<void>;
  startConversation: (employeeId: string) => Promise<string>;
  setActiveConversation: (conversationId: string | null) => void;
  
  // Message actions
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (recipientId: string, content: string) => Promise<void>;
  sendFileMessage: (recipientId: string, file: File) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => void;
  
  // UI actions
  setSearchQuery: (query: string) => void;
  setSelectedDepartment: (department: string | null) => void;
  setShowOnlineOnly: (showOnlineOnly: boolean) => void;
  
  // Utility functions
  getFilteredEmployees: () => Employee[];
  getUnreadCount: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // API base URL
  const API_BASE = 'http://localhost:8000/api';

  // Helper function to make authenticated API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await apiCall('/chat/employees');
      dispatch({ type: 'SET_EMPLOYEES', payload: data.employees });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch employees' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update employee status
  const updateEmployeeStatus = async (status: { isOnline?: boolean; status?: string }) => {
    try {
      await apiCall('/chat/status', {
        method: 'PATCH',
        body: JSON.stringify(status),
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const data = await apiCall('/chat/conversations');
      dispatch({ type: 'SET_CONVERSATIONS', payload: data.conversations });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch conversations' });
    }
  };

  // Start a new conversation
  const startConversation = async (employeeId: string): Promise<string> => {
    try {
      // First, try to send a message which will create the conversation if it doesn't exist
      const data = await apiCall('/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
          recipientId: employeeId,
          content: 'Started a conversation',
          messageType: 'text'
        }),
      });
      
      // Refresh conversations to get the new one
      await fetchConversations();
      
      return data.message.conversationId;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to start conversation');
    }
  };

  // Set active conversation
  const setActiveConversation = (conversationId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
    if (conversationId) {
      fetchMessages(conversationId);
      markMessagesAsRead(conversationId);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await apiCall(`/chat/conversations/${conversationId}/messages`);
      dispatch({ type: 'SET_ACTIVE_MESSAGES', payload: data.messages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch messages' });
    }
  };

  // Send a text message
  const sendMessage = async (recipientId: string, content: string) => {
    try {
      const data = await apiCall('/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
          recipientId,
          content,
          messageType: 'text'
        }),
      });
      
      dispatch({ type: 'ADD_MESSAGE', payload: data.message });
      await fetchConversations(); // Refresh conversations list
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to send message',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Send a file message
  const sendFileMessage = async (recipientId: string, file: File) => {
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const uploadResponse = await fetch(`${API_BASE}/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadData = await uploadResponse.json();
      
      // Then send the file message
      const messageType = file.type.startsWith('image/') ? 'image' : 'file';
      const data = await apiCall('/chat/messages/file', {
        method: 'POST',
        body: JSON.stringify({
          recipientId,
          attachmentUrl: uploadData.url,
          attachmentName: uploadData.filename,
          messageType
        }),
      });
      
      dispatch({ type: 'ADD_MESSAGE', payload: data.message });
      await fetchConversations();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to send file',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Mark messages as read
  const markMessagesAsRead = (conversationId: string) => {
    dispatch({ type: 'MARK_MESSAGES_READ', payload: conversationId });
  };

  // Get unread count
  const getUnreadCount = async () => {
    try {
      const data = await apiCall('/chat/unread-count');
      dispatch({ type: 'SET_UNREAD_COUNT', payload: data.unreadCount });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // UI action creators
  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setSelectedDepartment = (department: string | null) => {
    dispatch({ type: 'SET_SELECTED_DEPARTMENT', payload: department });
  };

  const setShowOnlineOnly = (showOnlineOnly: boolean) => {
    dispatch({ type: 'SET_SHOW_ONLINE_ONLY', payload: showOnlineOnly });
  };

  // Get filtered employees based on search and filters
  const getFilteredEmployees = (): Employee[] => {
    return state.employees.filter(employee => {
      const matchesSearch = !state.searchQuery || 
        employee.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      const matchesDepartment = !state.selectedDepartment || 
        employee.department === state.selectedDepartment;
      
      const matchesOnlineFilter = !state.showOnlineOnly || employee.isOnline;
      
      return matchesSearch && matchesDepartment && matchesOnlineFilter;
    });
  };

  // Initialize data when user changes
  useEffect(() => {
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      fetchEmployees();
      fetchConversations();
      getUnreadCount();
      
      // Set user as online
      updateEmployeeStatus({ isOnline: true });
      
      // Set up periodic status updates
      const statusInterval = setInterval(() => {
        updateEmployeeStatus({ isOnline: true });
      }, 30000); // Update every 30 seconds
      
      return () => {
        clearInterval(statusInterval);
        // Set user as offline when component unmounts
        updateEmployeeStatus({ isOnline: false });
      };
    }
  }, [user]);

  // Periodic refresh of conversations and unread count
  useEffect(() => {
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      let previousUnreadCount = state.unreadCount;
      
      const refreshInterval = setInterval(async () => {
        await fetchConversations();
        
        // Check for new messages and show notifications
        const newUnreadData = await apiCall('/chat/unread-count');
        const newUnreadCount = newUnreadData.unreadCount;
        
        if (newUnreadCount > previousUnreadCount) {
          const newMessagesCount = newUnreadCount - previousUnreadCount;
          addNotification({
            type: 'info',
            title: '💬 New Chat Message',
            message: `You have ${newMessagesCount} new message${newMessagesCount > 1 ? 's' : ''} from your team.`
          });
        }
        
        dispatch({ type: 'SET_UNREAD_COUNT', payload: newUnreadCount });
        previousUnreadCount = newUnreadCount;
      }, 10000); // Refresh every 10 seconds
      
      return () => clearInterval(refreshInterval);
    }
  }, [user, addNotification]);

  const value: ChatContextType = {
    state,
    fetchEmployees,
    updateEmployeeStatus,
    fetchConversations,
    startConversation,
    setActiveConversation,
    fetchMessages,
    sendMessage,
    sendFileMessage,
    markMessagesAsRead,
    setSearchQuery,
    setSelectedDepartment,
    setShowOnlineOnly,
    getFilteredEmployees,
    getUnreadCount,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};