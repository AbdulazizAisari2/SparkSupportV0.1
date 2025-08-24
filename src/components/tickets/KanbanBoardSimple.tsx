import React, { useState } from 'react';
import { Ticket, User, Category, Status } from '../../types';
import { PriorityBadge } from '../ui/Badge';
import { Clock, User as UserIcon, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useUpdateTicket } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
interface KanbanBoardSimpleProps {
  tickets: Ticket[];
  users: User[];
  categories: Category[];
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void;
  linkPrefix: string;
}
interface KanbanColumnProps {
  status: Status;
  tickets: Ticket[];
  users: User[];
  categories: Category[];
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void;
  linkPrefix: string;
}
interface KanbanTicketCardProps {
  ticket: Ticket;
  users: User[];
  categories: Category[];
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void;
  linkPrefix: string;
}
const statusConfig = {
  open: {
    title: 'Open',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-700',
    textColor: 'text-red-700 dark:text-red-300'
  },
  in_progress: {
    title: 'In Progress',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    textColor: 'text-yellow-700 dark:text-yellow-300'
  },
  resolved: {
    title: 'Resolved',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700',
    textColor: 'text-green-700 dark:text-green-300'
  },
  closed: {
    title: 'Closed',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-700 dark:text-gray-300'
  }
};
const KanbanTicketCard: React.FC<KanbanTicketCardProps> = ({ ticket, users, categories, onTicketUpdate, linkPrefix }) => {
  const [showActions, setShowActions] = useState(false);
  const updateTicketMutation = useUpdateTicket();
  const { addToast } = useToast();
  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const getNextStatus = (currentStatus: Status): Status | null => {
    switch (currentStatus) {
      case 'open': return 'in_progress';
      case 'in_progress': return 'resolved';
      case 'resolved': return 'closed';
      case 'closed': return null;
      default: return null;
    }
  };
  const getPreviousStatus = (currentStatus: Status): Status | null => {
    switch (currentStatus) {
      case 'in_progress': return 'open';
      case 'resolved': return 'in_progress';
      case 'closed': return 'resolved';
      case 'open': return null;
      default: return null;
    }
  };
  const nextStatus = getNextStatus(ticket.status);
  const prevStatus = getPreviousStatus(ticket.status);
  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateTicketMutation.mutateAsync({
        id: ticket.id,
        data: { status: newStatus }
      });
      addToast(`Ticket moved to ${newStatus.replace('_', ' ')}!`, 'success');
      onTicketUpdate(ticket.id, { status: newStatus });
    } catch {
      addToast('Failed to update ticket status', 'error');
    }
  };
  return (
    <div
      className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-4 mb-3 shadow-sm hover:shadow-lg transition-all duration-200 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
          {ticket.id}
        </span>
        <div className="flex space-x-2">
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {ticket.subject}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {ticket.description}
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg border border-gray-200 dark:border-dark-600">
            {getCategoryName(ticket.categoryId)}
          </span>
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <UserIcon className="w-3 h-3" />
            <span>{getUserName(ticket.assignedStaffId)}</span>
          </div>
