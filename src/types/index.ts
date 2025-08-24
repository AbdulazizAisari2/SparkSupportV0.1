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
  password?: string; 
  points?: number; 
  isOnline?: boolean; 
  lastSeen?: string; 
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
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  pointsReward?: number;
  unlockedAt?: Date;
}
export interface StaffStats {
  userId: string;
  name: string;
  department: string;
  ticketsResolved: number;
  averageResolutionTime: number; 
  customerSatisfaction: number; 
  points: number;
  achievements: Achievement[];
  streak: number; 
  level: number;
  totalTicketsHandled: number;
  responseTime: number; 
  monthlyGrowth: number; 
  specialRecognition?: string;
}
export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
}
export interface SlackConfig {
  botToken?: string;
  signingSecret?: string;
  channelId?: string;
  enabled: boolean;
}
export interface AppConfig {
  email?: EmailConfig;
  slack?: SlackConfig;
}
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  userId?: string;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  message: string;
  timestamp: string;
  isEdited?: boolean;
}
export interface ChatUser {
  id: string;
  name: string;
  role: Role;
  department?: string;
  isOnline: boolean;
  lastSeen?: string;
}