import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Clock } from 'lucide-react';
import { useTicket, useCreateMessage, useCreateNote, useUpdateTicket, useCategories, useUsers } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { StatusStepper } from '../../components/ui/StatusStepper';
import { Thread } from '../../components/tickets/Thread';
import { ReplyBox } from '../../components/tickets/ReplyBox';
import { AssignDrawer } from '../../components/tickets/AssignDrawer';
import { InternalNotes } from '../../components/tickets/InternalNotes';
import { Skeleton } from '../../components/ui/Loading';
import { formatDistanceToNow } from 'date-fns';
import { Status } from '../../types';

export const StaffTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);

  // Safety check for ID
  if (!id) {
    console.error('No ticket ID provided in route params');
    navigate('/staff/tickets');
    return null;
  }

  const { data: ticketData, isLoading, error } = useTicket(id || '');
  const { data: categories = [] } = useCategories();
  const { data: users = [] } = useUsers();
  const { data: staff = [] } = useUsers('staff');
  const createMessageMutation = useCreateMessage();
  const createNoteMutation = useCreateNote();
  const updateTicketMutation = useUpdateTicket();

  const ticket = ticketData?.ticket;
  const messages = ticketData?.messages || [];

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

  const handleAddNote = async (data: { message: string }) => {
    if (!user || !ticket) return;

    try {
      await createNoteMutation.mutateAsync({
        ticketId: ticket.id,
        data: {
          senderId: user.id,
          message: data.message,
        },
      });

      addToast('Internal note added successfully!', 'success');
    } catch {
      addToast('Failed to add note. Please try again.', 'error');
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (!ticket) return;

    try {
      await updateTicketMutation.mutateAsync({
        id: ticket.id,
        data: { status: newStatus },
      });

      addToast(`Ticket status updated to ${newStatus.replace('_', ' ')}!`, 'success');
    } catch {
      addToast('Failed to update status. Please try again.', 'error');
    }
  };

  const handleAssign = async (staffId: string) => {
    if (!ticket) return;

    try {
      await updateTicketMutation.mutateAsync({
        id: ticket.id,
        data: { assignedStaffId: staffId || undefined },
      });

      const action = staffId ? 'assigned' : 'unassigned';
      addToast(`Ticket ${action} successfully!`, 'success');
    } catch {
      addToast('Failed to update assignment. Please try again.', 'error');
    }
  };

  // Debug logging
  console.log('StaffTicketDetail - ID:', id);
  console.log('StaffTicketDetail - Loading:', isLoading);
  console.log('StaffTicketDetail - Error:', error);
  console.log('StaffTicketDetail - TicketData:', ticketData);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Ticket</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error instanceof Error ? error.message : 'Unable to load ticket details'}
        </p>
        <button
          onClick={() => navigate('/staff/tickets')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to All Tickets
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ticket Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The ticket you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/staff/tickets')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to All Tickets
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === ticket.categoryId);
  const assignedUser = users.find(u => u.id === ticket.assignedStaffId);
  const customer = users.find(u => u.id === ticket.customerId);

  // Additional safety checks
  if (!ticket || !user) {
    console.error('Missing ticket or user data:', { ticket: !!ticket, user: !!user });
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Loading Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Unable to load ticket details</p>
        <button
          onClick={() => navigate('/staff/tickets')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to All Tickets
        </button>
      </div>
    );
  }

  try {
    return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/staff/tickets')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ticket {ticket.id}</h1>
            <p className="text-gray-600 dark:text-gray-400">{ticket.subject}</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsAssignDrawerOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Assign</span>
        </button>
      </div>

      {/* Status Controls */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h3>
        <StatusStepper
          currentStatus={ticket.status}
          onStatusChange={handleStatusChange}
          disabled={updateTicketMutation.isPending}
        />
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reply to Customer</h2>
            <ReplyBox
              onSubmit={handleReply}
              isSubmitting={createMessageMutation.isPending}
              disabled={ticket.status === 'closed'}
            />
          </div>

          {/* Internal Notes */}
          <InternalNotes
            messages={messages}
            users={users}
            onAddNote={handleAddNote}
            isSubmitting={createNoteMutation.isPending}
          />
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer</span>
                <span className="text-sm font-medium text-gray-900">
                  {customer?.name || 'Unknown'}
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

      {/* Assign Drawer */}
      <AssignDrawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        onAssign={handleAssign}
        staff={staff}
        currentAssigneeId={ticket.assignedStaffId}
        isAssigning={updateTicketMutation.isPending}
      />
    </div>
    );
  } catch (renderError) {
    console.error('Error rendering StaffTicketDetail:', renderError);
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Rendering Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Something went wrong displaying this ticket. Please try refreshing the page.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={() => navigate('/staff/tickets')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to All Tickets
          </button>
        </div>
      </div>
    );
  }
};