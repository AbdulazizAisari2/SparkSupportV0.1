import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { Ticket, User as UserType, Category } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
interface TicketCardProps {
  ticket: Ticket;
  users: UserType[];
  categories: Category[];
  linkPrefix: string;
}
export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  users,
  categories,
  linkPrefix,
}) => {
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
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-4 hover:shadow-md dark:hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-3">
        <Link 
          to={`${linkPrefix}/${ticket.id}`}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          {ticket.id}
        </Link>
        <div className="flex space-x-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <div className="mb-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {ticket.subject}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {ticket.description}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-dark-600">
            {getCategoryName(ticket.categoryId)}
          </span>
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{getUserName(ticket.assignedStaffId)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(ticket.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};