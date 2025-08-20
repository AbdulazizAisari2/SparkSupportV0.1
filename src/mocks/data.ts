import { User, Category, PriorityDef, Ticket, TicketMessage } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    phone: '+1234567890',
    role: 'customer'
  },
  {
    id: '2',
    name: 'Sarah Support',
    email: 'staff1@example.com',
    role: 'staff',
    department: 'Technical Support'
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'staff2@example.com',
    role: 'staff',
    department: 'Customer Success'
  },
  {
    id: '4',
    name: 'Admin User',
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
  {
    id: 'T001',
    customerId: '1',
    assignedStaffId: '2',
    categoryId: '1',
    priority: 'high',
    subject: 'Unable to login to application',
    description: 'I cannot access my account after the recent update. Getting authentication errors.',
    status: 'in_progress',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 'T002',
    customerId: '1',
    categoryId: '2',
    priority: 'medium',
    subject: 'Incorrect billing amount',
    description: 'Last month\'s invoice shows charges that don\'t match my usage.',
    status: 'open',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: 'T003',
    customerId: '1',
    assignedStaffId: '3',
    categoryId: '1',
    priority: 'low',
    subject: 'Feature request: Dark mode',
    description: 'Would love to have a dark theme option for better usability.',
    status: 'resolved',
    createdAt: '2024-01-10T16:45:00Z',
    updatedAt: '2024-01-14T11:30:00Z'
  },
  {
    id: 'T004',
    customerId: '1',
    assignedStaffId: '2',
    categoryId: '1',
    priority: 'urgent',
    subject: 'System down - critical',
    description: 'The entire system appears to be offline. This is affecting our production environment.',
    status: 'closed',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-12T10:45:00Z'
  }
];

export const mockMessages: TicketMessage[] = [
  {
    id: '1',
    ticketId: 'T001',
    senderId: '1',
    message: 'Unable to login to application. I cannot access my account after the recent update. Getting authentication errors.',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    ticketId: 'T001',
    senderId: '2',
    message: 'Hi John, I\'ve assigned this ticket to myself and will investigate the login issue right away.',
    createdAt: '2024-01-15T11:15:00Z'
  },
  {
    id: '3',
    ticketId: 'T001',
    senderId: '2',
    message: 'Internal note: Checked authentication service logs - seeing increased errors after yesterday\'s deployment.',
    isInternal: true,
    createdAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '4',
    ticketId: 'T001',
    senderId: '2',
    message: 'Update: I\'ve identified the issue with the authentication service. Working on a fix now.',
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '5',
    ticketId: 'T002',
    senderId: '1',
    message: 'Last month\'s invoice shows charges that don\'t match my usage. Can you please review this?',
    createdAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '6',
    ticketId: 'T003',
    senderId: '1',
    message: 'Would love to have a dark theme option for better usability during night work sessions.',
    createdAt: '2024-01-10T16:45:00Z'
  },
  {
    id: '7',
    ticketId: 'T003',
    senderId: '3',
    message: 'Great suggestion! I\'ve added this to our product roadmap. We\'ll consider it for the next release.',
    createdAt: '2024-01-11T09:30:00Z'
  },
  {
    id: '8',
    ticketId: 'T003',
    senderId: '3',
    message: 'Good news! Dark mode has been implemented and will be available in the next update.',
    createdAt: '2024-01-14T11:30:00Z'
  },
  {
    id: '9',
    ticketId: 'T004',
    senderId: '1',
    message: 'URGENT: The entire system appears to be offline. This is affecting our production environment.',
    createdAt: '2024-01-12T08:00:00Z'
  },
  {
    id: '10',
    ticketId: 'T004',
    senderId: '2',
    message: 'Escalating immediately to infrastructure team. Will provide updates every 30 minutes.',
    createdAt: '2024-01-12T08:05:00Z'
  },
  {
    id: '11',
    ticketId: 'T004',
    senderId: '2',
    message: 'System has been restored. Root cause was a database connection issue that has been resolved.',
    createdAt: '2024-01-12T10:45:00Z'
  }
];