import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureParams } from '../../hooks/useSecureParams';
import { ArrowLeft, Clock } from 'lucide-react';
import { useTicket, useCreateMessage, useCategories, useUsers } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Thread } from '../../components/tickets/Thread';
import { ReplyBox } from '../../components/tickets/ReplyBox';
import { Skeleton } from '../../components/ui/Loading';
import { SatisfactionSurveyModal } from '../../components/ui/SatisfactionSurveyModal';
import { SurveySuccessToast } from '../../components/ui/SurveySuccessToast';
import { useCreateSurvey, useSurvey } from '../../hooks/useSurvey';
import { formatDistanceToNow } from 'date-fns';

export const TicketDetail: React.FC = () => {
  const { id } = useSecureParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [surveyRating, setSurveyRating] = useState(0);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  // All hooks must be called before any conditional returns
  const { data: ticketData, isLoading, error } = useTicket(id || '');
  const { data: categories = [] } = useCategories();
  const { data: users = [] } = useUsers();
  const createMessageMutation = useCreateMessage();
  const createSurveyMutation = useCreateSurvey();
  const { data: existingSurvey } = useSurvey(id || '');

  const ticket = ticketData?.ticket;
  const messages = ticket?.messages || [];

  // Security: Validate ticket ID using useEffect to avoid render warnings
  useEffect(() => {
    if (!id) {
      navigate('/my/tickets', { replace: true });
    }
  }, [id, navigate]);

  // Survey trigger logic - check for status changes to resolved/closed
  useEffect(() => {
    console.log('Survey Effect Debug:', {
      ticket: !!ticket,
      ticketStatus: ticket?.status,
      previousStatus,
      showSurveyModal
    });

    if (ticket && previousStatus !== null && !existingSurvey) {
      const currentStatus = ticket.status;
      
      console.log('Status Change Check:', {
        currentStatus,
        previousStatus,
        isResolvedOrClosed: currentStatus === 'resolved' || currentStatus === 'closed',
        statusChanged: previousStatus !== currentStatus,
        wasPreviouslyNotFinished: previousStatus !== 'resolved' && previousStatus !== 'closed',
        existingSurvey: !!existingSurvey
      });
      
      // Trigger survey if status changed to resolved or closed and no survey exists
      if ((currentStatus === 'resolved' || currentStatus === 'closed') && 
          previousStatus !== currentStatus &&
          previousStatus !== 'resolved' && 
          previousStatus !== 'closed') {
        
        console.log('🎉 Triggering survey modal!');
        // Small delay to ensure status change is visually processed
        setTimeout(() => {
          setShowSurveyModal(true);
        }, 1000);
      }
    }
    
    // Check if ticket is already closed/resolved and no previous status (first load)
    if (ticket && previousStatus === null && !existingSurvey) {
      const currentStatus = ticket.status;
      if (currentStatus === 'resolved' || currentStatus === 'closed') {
        console.log('🎯 Ticket already closed/resolved on load, checking if survey needed');
        // Only show survey if none exists yet
        setTimeout(() => {
          setShowSurveyModal(true);
        }, 2000);
      }
    }
    
    // Update previous status
    if (ticket) {
      setPreviousStatus(ticket.status);
    }
  }, [ticket?.status, previousStatus, showSurveyModal, existingSurvey]);

  // Survey submission handler
  const handleSurveySubmit = async (surveyData: any) => {
    if (!ticket) return;
    
    try {
      // Calculate average rating
      const ratings = [
        surveyData.overallRating,
        surveyData.responseTime,
        surveyData.helpfulness,
        surveyData.professionalism,
        surveyData.resolutionQuality
      ].filter(rating => rating > 0);
      
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      setSurveyRating(averageRating);

      // Submit survey to backend
      const surveyPayload = {
        ticketId: ticket.id,
        data: {
          overallRating: surveyData.overallRating,
          responseTime: surveyData.responseTime,
          helpfulness: surveyData.helpfulness,
          professionalism: surveyData.professionalism,
          resolutionQuality: surveyData.resolutionQuality,
          feedback: surveyData.feedback || '',
          improvements: surveyData.improvements || ''
        }
      };
      
      console.log('📝 Submitting survey data:', surveyPayload);
      await createSurveyMutation.mutateAsync(surveyPayload);
      
      console.log('Survey submitted successfully:', { ticketId: ticket.id, surveyData, averageRating });
      
      setShowSurveyModal(false);
      setShowSuccessToast(true);
      
      addToast('Thank you for your feedback! Your response helps us improve our service.', 'success');
    } catch (error) {
      console.error('Error submitting survey:', error);
      addToast(error instanceof Error ? error.message : 'Failed to submit survey. Please try again.', 'error');
    }
  };

  // Debug logging
  console.log('TicketDetail Debug:', {
    id,
    ticketData,
    ticket,
    messages: messages?.length,
    isLoading,
    error,
    user
  });

  // Early return if no ID (component will be redirected via useEffect)
  if (!id) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Ticket</h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <button 
            onClick={() => navigate('/my/tickets')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ticket Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The ticket you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/my/tickets')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  const handleReply = async (data: { message: string }) => {
    if (!user || !ticket) return;

    try {
      await createMessageMutation.mutateAsync({
        ticketId: ticket.id,
        data: {
          message: data.message,
          isInternal: false,
        },
      });

      addToast('Reply sent successfully!', 'success');
    } catch (error) {
      console.error('❌ Reply failed:', error);
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

      {/* Customer Satisfaction Survey Modal */}
      <SatisfactionSurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onSubmit={handleSurveySubmit}
        ticketNumber={ticket?.id}
        staffName={users.find(u => u.id === ticket?.assignedToId)?.name}
      />

      {/* Survey Success Toast */}
      <SurveySuccessToast
        isVisible={showSuccessToast}
        averageRating={surveyRating}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};