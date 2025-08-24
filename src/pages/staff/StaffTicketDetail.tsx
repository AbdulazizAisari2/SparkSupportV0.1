import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureParams, validateParamValue } from '../../hooks/useSecureParams';
import { ArrowLeft, UserPlus, Clock } from 'lucide-react';
import { useTicket, useCreateMessage, useUpdateTicket, useCategories, useUsers } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { StatusStepper } from '../../components/ui/StatusStepper';
import { Thread } from '../../components/tickets/Thread';
import { ReplyBox } from '../../components/tickets/ReplyBox';
import { AssignDrawer } from '../../components/tickets/AssignDrawer';
import { InternalNotes } from '../../components/tickets/InternalNotes';
import { Skeleton } from '../../components/ui/Loading';
import { SurveyResults } from '../../components/ui/SurveyResults';
import { useSurvey } from '../../hooks/useSurvey';
import { formatDistanceToNow } from 'date-fns';
import { Status } from '../../types';
import { useNotificationService } from '../../hooks/useNotificationService';

export const StaffTicketDetail: React.FC = () => {
  const { id } = useSecureParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { sendNotification } = useNotificationService();
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const { data: surveyData } = useSurvey(id);

  // Enhanced security validation for ticket ID
  useEffect(() => {
    if (!id) {
      // No ID provided or ID failed validation in useSecureParams
      console.warn('Invalid or missing ticket ID, redirecting to tickets list');
      navigate('/staff/tickets', { replace: true });
      return;
    }
    
    // Additional client-side validation as a fallback
    if (!validateParamValue('id', id)) {
      console.warn(`Ticket ID format validation failed for: ${id}`);
      navigate('/staff/tickets', { replace: true });
      return;
    }
  }, [id, navigate]);

  // Early return if no valid ID (component will be redirected via useEffect)
  if (!id) {
    return null;
  }

  const { data: ticketData, isLoading, error } = useTicket(id);
  const { data: categories = [] } = useCategories();
  const { data: users = [] } = useUsers();
  const { data: staff = [] } = useUsers('staff');
  const createMessageMutation = useCreateMessage();
  const createInternalNoteMutation = useCreateMessage();
  const updateTicketMutation = useUpdateTicket();

  const ticket = ticketData?.ticket;
  const messages = ticket?.messages || [];

  // Handle case where ticket doesn't exist after loading
  useEffect(() => {
    if (!isLoading && !error && !ticket) {
      // Ticket not found, redirect will be handled by the render return
      console.log('Ticket not found after loading completed');
    }
  }, [isLoading, error, ticket]);

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

      // Send notification to customer about staff reply
      const customer = users.find(u => u.id === ticket.customerId);
      if (customer) {
        await sendNotification({
          type: 'staff_reply',
          ticketId: ticket.id,
          ticketSubject: ticket.subject,
          recipientUserId: customer.id,
          metadata: {
            staffName: user.name,
            message: data.message,
            currentStatus: ticket.status
          }
        });
      }

      addToast('Reply sent successfully!', 'success');
    } catch {
      addToast('Failed to send reply. Please try again.', 'error');
    }
  };

  const handleAddNote = async (data: { message: string }) => {
    if (!user || !ticket) return;

    try {
      await createInternalNoteMutation.mutateAsync({
        ticketId: ticket.id,
        data: {
          message: data.message,
          isInternal: true,
        },
      });

      addToast('Internal note added successfully!', 'success');
    } catch {
      addToast('Failed to add note. Please try again.', 'error');
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (!ticket) return;

    const oldStatus = ticket.status;
    
    console.log('🔄 Staff changing ticket status:', {
      ticketId: ticket.id,
      oldStatus,
      newStatus,
      customerId: ticket.customerId
    });

    try {
      await updateTicketMutation.mutateAsync({
        id: ticket.id,
        data: { status: newStatus },
      });

      console.log('✅ Status change successful, sending notification');

      // Send notification to customer about status change
      const customer = users.find(u => u.id === ticket.customerId);
      if (customer) {
        await sendNotification({
          type: 'status_change',
          ticketId: ticket.id,
          ticketSubject: ticket.subject,
          recipientUserId: customer.id,
          metadata: {
            oldStatus,
            newStatus,
            staffName: user?.name,
            message: `Status changed from ${oldStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`
          }
        });
        
        console.log('📧 Notification sent to customer');
      }

      addToast(`Ticket status updated to ${newStatus.replace('_', ' ')}!`, 'success');
    } catch (error) {
      console.error('❌ Failed to update status:', error);
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
            isSubmitting={createInternalNoteMutation.isPending}
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

          {/* Customer Satisfaction Survey Results */}
          <SurveyResults
            surveyData={surveyData ? {
              overallRating: surveyData.overallRating,
              responseTime: surveyData.responseTime,
              helpfulness: surveyData.helpfulness,
              professionalism: surveyData.professionalism,
              resolutionQuality: surveyData.resolutionQuality,
              submittedAt: surveyData.submittedAt,
              customerName: customer?.name
            } : undefined}
            isVisible={true}
          />
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