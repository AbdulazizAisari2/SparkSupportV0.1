import { User, Category, PriorityDef, Ticket, TicketMessage } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed',
    email: 'customer@example.com',
    phone: '+1234567890',
    role: 'customer',
    password: 'Customer123!' // Secure default password
  },
  {
    id: '2',
    name: 'Mohammed',
    email: 'staff1@example.com',
    role: 'staff',
    department: 'Technical Support',
    password: 'Staff123!' // Secure default password
  },
  {
    id: '3',
    name: 'Ahmed',
    email: 'staff2@example.com',
    role: 'staff',
    department: 'Customer Success',
    password: 'Staff123!' // Secure default password
  },
  {
    id: '4',
    name: 'Sarah',
    email: 'staff3@example.com',
    role: 'staff',
    department: 'Billing Support',
    password: 'Staff123!' // Secure default password
  },
  {
    id: '5',
    name: 'Abdulaziz',
    email: 'admin@example.com',
    role: 'admin',
    department: 'IT',
    password: 'Admin123!' // Secure default password
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Technical Issue',
    description: 'Problems with software, hardware, or system functionality'
  },
  {
    id: '2',
    name: 'Billing',
    description: 'Questions about invoices, payments, or account charges'
  },
  {
    id: '3',
    name: 'General Inquiry',
    description: 'General questions and information requests'
  },
  {
    id: '4',
    name: 'Account Access',
    description: 'Login issues, password resets, and account management'
  },
  {
    id: '5',
    name: 'Feature Request',
    description: 'Suggestions for new features or improvements'
  }
];

export const mockPriorities: PriorityDef[] = [
  { id: '1', name: 'Low', level: 1 },
  { id: '2', name: 'Medium', level: 2 },
  { id: '3', name: 'High', level: 3 },
  { id: '4', name: 'Urgent', level: 4 }
];

export const mockTickets: Ticket[] = [
  {
    id: 'T001',
    customerId: '1',
    assignedStaffId: '2',
    categoryId: '4',
    priority: 'medium',
    subject: 'Password reset not working',
    description: 'I tried to reset my password multiple times but I\'m not receiving the reset email. Could you please help me access my account?',
    status: 'open',
    createdAt: '2025-01-15T16:45:00Z',
    updatedAt: '2025-01-15T16:45:00Z'
  },
  {
    id: 'T002',
    customerId: '1',
    categoryId: '2',
    priority: 'low',
    subject: 'Question about subscription pricing',
    description: 'Hi, I\'m interested in upgrading my plan but I have some questions about the pricing tiers. What are the differences between the Standard and Premium plans?',
    status: 'open',
    createdAt: '2025-01-12T09:15:00Z',
    updatedAt: '2025-01-12T09:15:00Z'
  }
];

export const mockMessages: TicketMessage[] = [
  {
    id: '1',
    ticketId: 'T001',
    senderId: '1',
    message: 'I tried to reset my password multiple times but I\'m not receiving the reset email. Could you please help me access my account?',
    createdAt: '2025-01-15T16:45:00Z'
  },
  {
    id: '2',
    ticketId: 'T002',
    senderId: '1',
    message: 'Hi, I\'m interested in upgrading my plan but I have some questions about the pricing tiers. What are the differences between the Standard and Premium plans?',
    createdAt: '2025-01-12T09:15:00Z'
  }
];