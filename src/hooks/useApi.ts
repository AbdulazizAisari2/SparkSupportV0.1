import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { User, Category, Ticket, TicketMessage } from '../types';

const API_BASE = 'http://localhost:8000/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface ApiResponse<T> {
  [key: string]: T;
}

class ApiClient {
  private getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async signup(data: SignupRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  async me(token: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async getCategories(token: string): Promise<{ categories: Category[] }> {
    const response = await fetch(`${API_BASE}/categories`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  async createCategory(token: string, data: { name: string; description?: string }): Promise<{ category: Category }> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }

    return response.json();
  }

  async updateCategory(token: string, id: string, data: { name?: string; description?: string }): Promise<{ category: Category }> {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }

    return response.json();
  }

  async deleteCategory(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
  }

  async getUsers(token: string, role?: string): Promise<{ users: User[] }> {
    const url = new URL(`${API_BASE}/users`);
    if (role) {
      url.searchParams.append('role', role);
    }

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async createUser(token: string, data: { name: string; email: string; password: string; role: string; phone?: string; department?: string }): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return response.json();
  }

  async updateUser(token: string, id: string, data: Partial<User>): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    return response.json();
  }

  async deleteUser(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
  }

  async getTickets(token: string, params: {
    status?: string;
    priority?: string;
    assignedToMe?: boolean;
  } = {}): Promise<{ tickets: Ticket[] }> {
    const url = new URL(`${API_BASE}/tickets`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  }

  async createTicket(token: string, data: {
    categoryId: string;
    priority: string;
    subject: string;
    description: string;
  }): Promise<{ ticket: Ticket }> {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create ticket');
    }

    return response.json();
  }

  async getTicket(token: string, id: string): Promise<{ ticket: Ticket }> {
    console.log('API: Fetching ticket', id);
    
    const response = await fetch(`${API_BASE}/tickets/${id}`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Failed to fetch ticket ${id}`);
    }

    const data = await response.json();
    console.log('API: Ticket data received', data);
    return data;
  }

  async updateTicket(token: string, id: string, data: {
    status?: string;
    priority?: string;
    assignedStaffId?: string | null;
  }): Promise<{ ticket: Ticket }> {
    const response = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update ticket');
    }

    return response.json();
  }

  async createMessage(token: string, ticketId: string, data: {
    message: string;
    isInternal?: boolean;
  }): Promise<{ message: TicketMessage }> {
    const response = await fetch(`${API_BASE}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create message');
    }

    return response.json();
  }

  // Leaderboard API methods
  async getLeaderboard(token: string, params?: {
    timeframe?: 'week' | 'month' | 'quarter' | 'year';
    metric?: 'points' | 'resolved' | 'satisfaction' | 'growth';
    limit?: number;
  }): Promise<{
    leaderboard: StaffStats[];
    topPerformer?: StaffStats;
    timeframe: string;
    metric: string;
    totalStaff: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.timeframe) queryParams.append('timeframe', params.timeframe);
    if (params?.metric) queryParams.append('metric', params.metric);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/leaderboard?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch leaderboard');
    }

    return response.json();
  }

  async getUserStats(token: string, userId: string): Promise<{
    user: {
      userId: string;
      name: string;
      department?: string;
      role: string;
      points: number;
      level: number;
      rank: number;
      ticketsResolved: number;
      averageResolutionTime?: number;
      customerSatisfaction?: number;
      currentStreak: number;
      totalTicketsHandled: number;
      responseTime?: number;
      monthlyGrowth: number;
      specialRecognition?: string;
      achievements: Achievement[];
    }
  }> {
    const response = await fetch(`${API_BASE}/leaderboard/user/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch user stats');
    }

    return response.json();
  }

  async getAchievements(token: string): Promise<{
    achievements: {
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
      pointsReward: number;
      requirements: string;
      isActive: boolean;
    }[]
  }> {
    const response = await fetch(`${API_BASE}/leaderboard/achievements`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch achievements');
    }

    return response.json();
  }

  async getChallenges(token: string): Promise<{
    challenges: {
      id: string;
      name: string;
      description: string;
      type: string;
      icon: string;
      color: string;
      progress: number;
      target: number;
      timeLeft: string;
      status: string;
    }[]
  }> {
    const response = await fetch(`${API_BASE}/leaderboard/challenges`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch challenges');
    }

    return response.json();
  }

  async awardPoints(token: string, data: {
    userId: string;
    points: number;
    reason?: string;
  }): Promise<{
    message: string;
    user: {
      id: string;
      name: string;
      points: number;
      level: number;
    };
    awarded: number;
    reason?: string;
  }> {
    const response = await fetch(`${API_BASE}/leaderboard/award-points`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to award points');
    }

    return response.json();
  }
}

const apiClient = new ApiClient();

// Authentication hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) => 
      apiClient.login(email, password),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => apiClient.signup(data),
  });
};

// Hook for getting current user
export const useMe = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.me(token!),
    enabled: !!token,
  });
};

// Categories hooks
export const useCategories = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(token!),
    enabled: !!token,
    select: (data) => data.categories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => 
      apiClient.createCategory(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) => 
      apiClient.updateCategory(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCategory(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Users hooks
export const useUsers = (role?: string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => apiClient.getUsers(token!, role),
    enabled: !!token,
    select: (data) => data.users,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role: string; phone?: string; department?: string }) => 
      apiClient.createUser(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      apiClient.updateUser(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Tickets hooks
export const useTickets = (params: {
  status?: string;
  priority?: string;
  assignedToMe?: boolean;
} = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => apiClient.getTickets(token!, params),
    enabled: !!token,
    select: (data) => data.tickets,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: {
      categoryId: string;
      priority: string;
      subject: string;
      description: string;
    }) => apiClient.createTicket(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useTicket = (id: string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => apiClient.getTicket(token!, id),
    enabled: !!token && !!id,
    // Return full response with ticket and messages
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: { status?: string; priority?: string; assignedStaffId?: string | null }
    }) => apiClient.updateTicket(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ ticketId, data }: { 
      ticketId: string; 
      data: { message: string; isInternal?: boolean }
    }) => apiClient.createMessage(token!, ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

// Leaderboard hooks
export const useLeaderboard = (params?: {
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  metric?: 'points' | 'resolved' | 'satisfaction' | 'growth';
  limit?: number;
}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: () => apiClient.getLeaderboard(token!, params),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserStats = (userId: string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => apiClient.getUserStats(token!, userId),
    enabled: !!token && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAchievements = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => apiClient.getAchievements(token!),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useChallenges = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['challenges'],
    queryFn: () => apiClient.getChallenges(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: { userId: string; points: number; reason?: string }) =>
      apiClient.awardPoints(token!, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['userStats', variables.userId] });
    },
  });
};