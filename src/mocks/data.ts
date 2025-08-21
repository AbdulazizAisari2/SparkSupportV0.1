import { User, Category, PriorityDef, Ticket, TicketMessage } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed',
    email: 'customer@example.com',
    phone: '+1234567890',
    role: 'customer'
  },
  {
    id: '2',
    name: 'Mohammed',
    email: 'staff1@example.com',
    role: 'staff',
    department: 'Technical Support'
  },
  {
    id: '3',
    name: 'Sarah',
    email: 'staff2@example.com',
    role: 'staff',
    department: 'Customer Success'
  },
  {
    id: '4',
    name: 'Abdulaziz',
    email: 'admin@example.com',
    role: 'admin',
    department: 'IT'
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
  }
];

export const mockPriorities: PriorityDef[] = [
  { id: '1', name: 'Low', level: 1 },
  { id: '2', name: 'Medium', level: 2 },
  { id: '3', name: 'High', level: 3 },
  { id: '4', name: 'Urgent', level: 4 }
];

export const mockTickets: Ticket[] = [
  // Clean slate - no test tickets for customers
  // New tickets will be added when customers create them
];

export const mockMessages: TicketMessage[] = [
  // Clean slate - no test messages
  // Messages will be added when customers create tickets and communicate
];