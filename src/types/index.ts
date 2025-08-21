export type Role = 'customer' | 'staff' | 'admin';
export type Status = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  department?: string;
  password?: string; // Optional for security - not included in API responses
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface PriorityDef {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4;
}

export interface Ticket {
  id: string;
  customerId: string;
  assignedStaffId?: string;
  categoryId: string;
  priority: Priority;
  subject: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  attachmentUrls?: string[];
  isInternal?: boolean;
  createdAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}