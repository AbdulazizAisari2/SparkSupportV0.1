import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useTicket, useCreateMessage, useCategories, useUsers } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Thread } from '../../components/tickets/Thread';
import { ReplyBox } from '../../components/tickets/ReplyBox';
import { Skeleton } from '../../components/ui/Loading';
import { formatDistanceToNow } from 'date-fns';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const { data: ticketData, isLoading, error } = useTicket(id!);
  const { data: categories = [] } = useCategories();
  const { data: users = [] } = useUsers();
  const createMessageMutation = useCreateMessage();

  const ticket = ticketData?.ticket;
  const messages = ticket?.messages || [];

  // Debug logging
  console.log('TicketDetail Debug:', {
    id,
    ticketData,
    ticket,
    isLoading,
    error,
    user
  });

  const handleReply = async (data: { message: string }) => {
    if (!user || !ticket) return;

    try {
      await createMessageMutation.mutateAsync({
        ticketId: ticket.id,
        data: {
          senderId: user.id,
          message: data.message,
        },
      });

      addToast('Reply sent successfully!', 'success');
    } catch {
      addToast('Failed to send reply. Please try again.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Ticket</h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400 mb-8">
          There was an error loading ticket {id}. Please try again.
        </p>
        <div className="text-sm text-red-600 dark:text-red-400 mb-4">
          Error: {error?.message || 'Unknown error'}
        </div>
        <button
          onClick={() => navigate('/my/tickets')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  if (!isLoading && !ticket) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ticket Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400 mb-4">
          Ticket {id} doesn't exist or you don't have access to it.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Available tickets: T001, T002, T003, T004
        </div>
        <button
          onClick={() => navigate('/my/tickets')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === ticket.categoryId);
  const assignedUser = users.find(u => u.id === ticket.assignedStaffId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/my/tickets')}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ticket {ticket.id}</h1>
          <p className="text-gray-600 dark:text-gray-400">{ticket.subject}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thread */}
          <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>
            <Thread messages={messages} users={users} />
          </div>

          {/* Reply Box */}
          <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reply</h2>
            <ReplyBox
              onSubmit={handleReply}
              isSubmitting={createMessageMutation.isPending}
              disabled={ticket.status === 'closed'}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <StatusBadge status={ticket.status} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                <span className="text-sm font-medium text-gray-900">
                  {category?.name || 'Unknown'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Assigned to</span>
                <span className="text-sm font-medium text-gray-900">
                  {assignedUser?.name || 'Unassigned'}
                </span>
              </div>

              <hr className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};