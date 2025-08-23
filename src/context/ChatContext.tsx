import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

// Rate limiting and retry configuration
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2
};

// Rate limiter class to track API calls
class RateLimiter {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private requestQueue: Array<{ endpoint: string; resolve: Function; reject: Function; timestamp: number }> = [];
  private isProcessingQueue = false;

  // Check if we're being rate limited for a specific endpoint
  isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const endpointData = this.requestCounts.get(endpoint);
    
    if (!endpointData) return false;
    
    // Reset count if time window has passed
    if (now >= endpointData.resetTime) {
      this.requestCounts.delete(endpoint);
      return false;
    }
    
    // Consider rate limited if we've made too many requests
    return endpointData.count >= 10; // Adjust based on your API limits
  }

  // Record a request
  recordRequest(endpoint: string) {
    const now = Date.now();
    const windowSize = 60000; // 1 minute window
    const endpointData = this.requestCounts.get(endpoint);
    
    if (!endpointData || now >= endpointData.resetTime) {
      this.requestCounts.set(endpoint, {
        count: 1,
        resetTime: now + windowSize
      });
    } else {
      endpointData.count++;
    }
  }

  // Add request to queue for delayed processing
  queueRequest(endpoint: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        endpoint,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (!request) break;
      
      // Remove stale requests (older than 5 minutes)
      if (Date.now() - request.timestamp > 300000) {
        request.reject(new Error('Request timed out in queue'));
        continue;
      }
      
      if (!this.isRateLimited(request.endpoint)) {
        request.resolve();
        break;
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.isProcessingQueue = false;
  }

  // Get estimated wait time for rate limit reset
  getWaitTime(endpoint: string): number {
    const endpointData = this.requestCounts.get(endpoint);
    if (!endpointData) return 0;
    
    return Math.max(0, endpointData.resetTime - Date.now());
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Sleep utility function
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Calculate retry delay with exponential backoff
const calculateRetryDelay = (attempt: number, config: RetryConfig): number => {
  const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
};

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
  isRateLimited: boolean;
  rateLimitInfo: {
    retryAfter?: number;
    message?: string;
  } | null;
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
  | { type: 'MARK_MESSAGES_READ'; payload: string }
  | { type: 'SET_RATE_LIMITED'; payload: { isRateLimited: boolean; retryAfter?: number; message?: string } };

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
  isTyping: {},
  isRateLimited: false,
  rateLimitInfo: null
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
    
    case 'SET_RATE_LIMITED':
      return {
        ...state,
        isRateLimited: action.payload.isRateLimited,
        rateLimitInfo: action.payload.isRateLimited ? {
          retryAfter: action.payload.retryAfter,
          message: action.payload.message
        } : null
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
  const { user, token } = useAuth();
  const { addNotification } = useNotifications();

  // API base URL
  const API_BASE = 'http://localhost:8000/api';

  // Helper function to make authenticated API calls with rate limiting and retry logic
  const apiCall = async (
    endpoint: string, 
    options: RequestInit = {}, 
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ) => {
    console.log(`🔗 Making API call to: ${API_BASE}${endpoint}`);
    
    if (!token) {
      console.error('❌ No authentication token available');
      throw new Error('No authentication token available');
    }
    
    console.log('🔑 Token found, length:', token?.length);
    
    // Check if we're being rate limited and need to queue the request
    if (rateLimiter.isRateLimited(endpoint)) {
      console.log(`⏳ Rate limited for ${endpoint}, queueing request...`);
      await rateLimiter.queueRequest(endpoint);
    }
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        // Record this request for rate limiting tracking
        rateLimiter.recordRequest(endpoint);
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
          },
        });

        console.log(`📡 API response status: ${response.status} ${response.statusText} (attempt ${attempt})`);

        if (!response.ok) {
          if (response.status === 401) {
            console.error('❌ Authentication failed (401)');
            // Token is invalid or expired, clear auth data
            localStorage.removeItem('auth');
            throw new Error('Authentication failed - please log in again');
          }
          
                     if (response.status === 429) {
             // Rate limit error - extract retry information
             const retryAfter = response.headers.get('Retry-After');
             const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : calculateRetryDelay(attempt, retryConfig);
             
             console.log(`⏳ Rate limited (429), waiting ${waitTime}ms before retry...`);
             
             let errorMessage = 'Too many requests from this IP, please try again later.';
             try {
               const error = await response.json();
               errorMessage = error.error || error.message || errorMessage;
             } catch {
               // Use default message if response is not JSON
             }
             
             // Update rate limit status in state
             dispatch({ 
               type: 'SET_RATE_LIMITED', 
               payload: { 
                 isRateLimited: true, 
                 retryAfter: Math.ceil(waitTime / 1000),
                 message: errorMessage 
               } 
             });
             
             // If this is the last attempt, throw the error
             if (attempt === retryConfig.maxRetries) {
               throw new Error(errorMessage);
             }
             
             // Wait and retry
             await sleep(waitTime);
             lastError = new Error(errorMessage);
             continue;
           }
          
          // Handle other HTTP errors
          let errorMessage = 'API request failed';
          try {
            const error = await response.json();
            errorMessage = error.error || error.message || errorMessage;
            console.error('❌ API error response:', error);
          } catch {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
            console.error('❌ Non-JSON error response:', response.statusText);
          }
          
          // For 5xx errors, retry with exponential backoff
          if (response.status >= 500 && attempt < retryConfig.maxRetries) {
            const waitTime = calculateRetryDelay(attempt, retryConfig);
            console.log(`🔄 Server error (${response.status}), retrying in ${waitTime}ms...`);
            await sleep(waitTime);
            lastError = new Error(errorMessage);
            continue;
          }
          
          throw new Error(errorMessage);
        }

                 // Success - return the response
         console.log(`✅ API call successful after ${attempt} attempt(s)`);
         
         // Clear rate limit status on successful request
         if (state.isRateLimited) {
           dispatch({ 
             type: 'SET_RATE_LIMITED', 
             payload: { isRateLimited: false } 
           });
         }
         
         return response.json();
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry for authentication errors or client errors (except 429)
        if (lastError.message.includes('Authentication failed') || 
            lastError.message.includes('No authentication token')) {
          throw lastError;
        }
        
        // If this is the last attempt, throw the error
        if (attempt === retryConfig.maxRetries) {
          console.error(`❌ All ${retryConfig.maxRetries} attempts failed for ${endpoint}`);
          throw lastError;
        }
        
        // Wait before retrying
        const waitTime = calculateRetryDelay(attempt, retryConfig);
        console.log(`🔄 Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
        await sleep(waitTime);
      }
    }
    
    // This should never be reached, but just in case
    throw lastError || new Error('Maximum retry attempts exceeded');
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🔄 Fetching employees...');
      const data = await apiCall('/chat/employees');
      console.log('✅ Employees fetched successfully:', data.employees?.length, 'employees');
      dispatch({ type: 'SET_EMPLOYEES', payload: data.employees });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
      console.error('❌ Failed to fetch employees:', errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // If it's an authentication error, also show notification
      if (errorMessage.includes('Authentication failed')) {
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'Your session has expired. Please log in again.'
        });
      }
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
      console.log('🔄 Fetching conversations...');
      const data = await apiCall('/chat/conversations');
      console.log('✅ Conversations fetched successfully:', data.conversations?.length, 'conversations');
      dispatch({ type: 'SET_CONVERSATIONS', payload: data.conversations });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversations';
      console.error('❌ Failed to fetch conversations:', errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // If it's an authentication error, also show notification
      if (errorMessage.includes('Authentication failed')) {
        addNotification({
          type: 'error',
          title: 'Authentication Error', 
          message: 'Your session has expired. Please log in again.'
        });
      }
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // If it's an authentication error, also show notification
      if (errorMessage.includes('Authentication failed')) {
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'Your session has expired. Please log in again.'
        });
      }
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide specific feedback for rate limiting
      if (errorMessage.includes('Too many requests') || errorMessage.includes('rate limit')) {
        addNotification({
          type: 'warning',
          title: 'Message sending rate limited',
          message: 'Please wait a moment before sending another message. Your message will be sent automatically when possible.'
        });
        
        // Retry sending the message after a delay
        setTimeout(async () => {
          try {
            await sendMessage(recipientId, content);
            addNotification({
              type: 'success',
              title: 'Message sent',
              message: 'Your message has been delivered successfully.'
            });
          } catch (retryError) {
            addNotification({
              type: 'error',
              title: 'Failed to send message',
              message: 'Please try sending your message again.'
            });
          }
        }, 5000); // Retry after 5 seconds
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to send message',
          message: errorMessage
        });
      }
    }
  };

  // Send a file message
  const sendFileMessage = async (recipientId: string, file: File) => {
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', file);
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const uploadResponse = await fetch(`${API_BASE}/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        if (uploadResponse.status === 429) {
          throw new Error('Too many file uploads. Please wait before uploading another file.');
        }
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide specific feedback for rate limiting
      if (errorMessage.includes('Too many') || errorMessage.includes('rate limit')) {
        addNotification({
          type: 'warning',
          title: 'File upload rate limited',
          message: 'Please wait before uploading another file. File uploads are temporarily limited.'
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to send file',
          message: errorMessage
        });
      }
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

  // Initialize data when user and token are available
  useEffect(() => {
    if (user && token && (user.role === 'staff' || user.role === 'admin')) {
      // Clear any previous error state
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Initialize chat data
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
    } else if (user && user.role === 'customer') {
      // Customers don't have access to team chat
      dispatch({ type: 'SET_ERROR', payload: 'Team chat is only available for staff and admin users' });
    }
  }, [user, token]);

  // Periodic refresh of conversations and unread count with rate limiting awareness
  useEffect(() => {
    if (user && token && (user.role === 'staff' || user.role === 'admin')) {
      let previousUnreadCount = state.unreadCount;
      let refreshInterval: NodeJS.Timeout;
      let currentInterval = 30000; // Start with 30 seconds
      const minInterval = 30000; // Minimum 30 seconds
      const maxInterval = 300000; // Maximum 5 minutes
      
      const scheduleNextRefresh = (delay: number = currentInterval) => {
        refreshInterval = setTimeout(async () => {
          try {
            // Use a more conservative retry config for background tasks
            const backgroundRetryConfig: RetryConfig = {
              maxRetries: 2,
              baseDelay: 2000,
              maxDelay: 10000,
              backoffMultiplier: 2
            };
            
            await fetchConversations();
            
            // Check for new messages and show notifications
            const newUnreadData = await apiCall('/chat/unread-count', {}, backgroundRetryConfig);
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
            
            // Reset to normal interval on success
            currentInterval = minInterval;
            scheduleNextRefresh();
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('📡 Background refresh failed:', errorMessage);
            
            // Check if it's a rate limiting error
            if (errorMessage.includes('Too many requests') || errorMessage.includes('rate limit')) {
              // Exponentially back off the refresh interval
              currentInterval = Math.min(currentInterval * 2, maxInterval);
              console.log(`⏳ Rate limited, increasing refresh interval to ${currentInterval / 1000} seconds`);
              
              // Show a less intrusive notification for rate limiting
              if (currentInterval === minInterval * 2) { // Only show on first rate limit
                addNotification({
                  type: 'warning',
                  title: 'Chat Refresh Slowed',
                  message: 'Chat updates have been slowed due to rate limiting. Your messages will still be delivered.'
                });
              }
            } else {
              // For other errors, increase interval moderately
              currentInterval = Math.min(currentInterval * 1.5, maxInterval);
            }
            
            // Schedule next attempt
            scheduleNextRefresh();
          }
        }, delay);
      };
      
      // Start the refresh cycle
      scheduleNextRefresh();
      
      return () => {
        if (refreshInterval) {
          clearTimeout(refreshInterval);
        }
      };
    }
  }, [user, token, addNotification]);

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