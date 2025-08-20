import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { User, Category, PriorityDef, Ticket, TicketMessage } from '../types';

const API_BASE = '/api';

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

  async login(email: string, role: string) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, role }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async me(token: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE}/me`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE}/categories`);
    return response.json();
  }

  async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteCategory(id: string): Promise<void> {
    await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getPriorities(): Promise<PriorityDef[]> {
    const response = await fetch(`${API_BASE}/priorities`);
    return response.json();
  }

  async createPriority(data: Omit<PriorityDef, 'id'>): Promise<PriorityDef> {
    const response = await fetch(`${API_BASE}/priorities`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updatePriority(id: string, data: Partial<PriorityDef>): Promise<PriorityDef> {
    const response = await fetch(`${API_BASE}/priorities/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deletePriority(id: string): Promise<void> {
    await fetch(`${API_BASE}/priorities/${id}`, {
      method: 'DELETE',
    });
  }

  async getUsers(token: string, role?: string): Promise<User[]> {
    const url = new URL(`${API_BASE}/users`, window.location.origin);
    if (role) {
      url.searchParams.append('role', role);
    }

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });
    return response.json();
  }

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteUser(id: string): Promise<void> {
    await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getTickets(token: string, params: {
    mine?: boolean;
    status?: string;
    category?: string;
    assignee?: string;
    priority?: string;
    q?: string;
  } = {}): Promise<Ticket[]> {
    const url = new URL(`${API_BASE}/tickets`, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });
    return response.json();
  }

  async createTicket(token: string, data: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getTicket(token: string, id: string): Promise<{ ticket: Ticket; messages: TicketMessage[] }> {
    const response = await fetch(`${API_BASE}/tickets/${id}`, {
      headers: this.getHeaders(token),
    });
    return response.json();
  }

  async updateTicket(token: string, id: string, data: Partial<Ticket>): Promise<Ticket> {
    const response = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async createMessage(token: string, ticketId: string, data: Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt'>): Promise<TicketMessage> {
    const response = await fetch(`${API_BASE}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async createNote(token: string, ticketId: string, data: Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt' | 'isInternal'>): Promise<TicketMessage> {
    const response = await fetch(`${API_BASE}/tickets/${ticketId}/notes`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

const apiClient = new ApiClient();

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
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Category, 'id'>) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      apiClient.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Priorities hooks
export const usePriorities = () => {
  return useQuery({
    queryKey: ['priorities'],
    queryFn: () => apiClient.getPriorities(),
  });
};

export const useCreatePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PriorityDef, 'id'>) => apiClient.createPriority(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
};

export const useUpdatePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PriorityDef> }) => 
      apiClient.updatePriority(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
};

export const useDeletePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deletePriority(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
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
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<User, 'id'>) => apiClient.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      apiClient.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Tickets hooks
export const useTickets = (params: {
  mine?: boolean;
  status?: string;
  category?: string;
  assignee?: string;
  priority?: string;
  q?: string;
} = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => apiClient.getTickets(token!, params),
    enabled: !!token,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => 
      apiClient.createTicket(token!, data),
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
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ticket> }) => 
      apiClient.updateTicket(token!, id, data),
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
    mutationFn: ({ ticketId, data }: { ticketId: string; data: Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt'> }) => 
      apiClient.createMessage(token!, ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt' | 'isInternal'> }) => 
      apiClient.createNote(token!, ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};