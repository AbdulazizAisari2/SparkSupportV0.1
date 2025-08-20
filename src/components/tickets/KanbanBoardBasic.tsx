import React, { useState } from 'react';
import { Ticket, User, Category, Status } from '../../types';
import { PriorityBadge } from '../ui/Badge';
import { Clock, User as UserIcon, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

interface KanbanBoardBasicProps {
  tickets: Ticket[];
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

const KanbanTicketCard: React.FC<{
  ticket: Ticket;
  users: User[];
  categories: Category[];
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void;
}> = ({ ticket, users, categories, onTicketUpdate }) => {
  const [showActions, setShowActions] = useState(false);

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
    });
  };

  const getNextStatus = (currentStatus: Status): Status | null => {
    switch (currentStatus) {
      case 'open': return 'in_progress';
      case 'in_progress': return 'resolved';
      case 'resolved': return 'closed';
      default: return null;
    }
  };

  const getPreviousStatus = (currentStatus: Status): Status | null => {
    switch (currentStatus) {
      case 'in_progress': return 'open';
      case 'resolved': return 'in_progress';
      case 'closed': return 'resolved';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(ticket.status);
  const prevStatus = getPreviousStatus(ticket.status);

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
        <PriorityBadge priority={ticket.priority} />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
        {ticket.subject}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
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
          
          {/* Quick Actions */}
          {showActions && (
            <div className="flex items-center space-x-1">
              {prevStatus && (
                <button
                  onClick={() => onTicketUpdate(ticket.id, { status: prevStatus })}
                  className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded text-xs hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  title={`Move to ${prevStatus.replace('_', ' ')}`}
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
              )}
              {nextStatus && (
                <button
                  onClick={() => onTicketUpdate(ticket.id, { status: nextStatus })}
                  className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded text-xs hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  title={`Move to ${nextStatus.replace('_', ' ')}`}
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const KanbanBoardBasic: React.FC<KanbanBoardBasicProps> = ({ tickets, users, categories, onTicketUpdate }) => {
  const statuses: Status[] = ['open', 'in_progress', 'resolved', 'closed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Board View</h2>
          <p className="text-gray-600 dark:text-gray-400">Visual workflow - click arrows to move tickets between statuses</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{tickets.length}</span> tickets
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statuses.map(status => {
          const config = statusConfig[status];
          const columnTickets = tickets.filter(ticket => ticket.status === status);

          return (
            <div key={status} className="space-y-4">
              <div className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color}`}></div>
                    <h3 className={`font-bold text-lg ${config.textColor}`}>
                      {config.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.textColor} bg-white/50 dark:bg-dark-800/50`}>
                      {columnTickets.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 min-h-96">
                  {columnTickets.map(ticket => (
                    <KanbanTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      users={users}
                      categories={categories}
                      onTicketUpdate={onTicketUpdate}
                    />
                  ))}
                  {columnTickets.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.color} opacity-20 mx-auto mb-3`}></div>
                      <p className="text-sm">No {config.title.toLowerCase()} tickets</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};