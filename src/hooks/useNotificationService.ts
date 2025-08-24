import { useCallback } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export interface NotificationTrigger {
  type: 'ticket_submitted' | 'staff_reply' | 'status_change';
  ticketId: string;
  ticketSubject: string;
  recipientUserId?: string;
  recipientEmail?: string;
  recipientName?: string;
  metadata?: {
    newStatus?: string;
    staffName?: string;
    message?: string;
    oldStatus?: string;
  };
}

export const useNotificationService = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const sendNotification = useCallback(async (trigger: NotificationTrigger) => {
    try {
      // Send backend notification request (handles email)
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(trigger),
      });

      if (!response.ok) {
        throw new Error('Failed to send backend notification');
      }

      // Add in-app notification based on trigger type
      const inAppNotification = getInAppNotification(trigger);
      if (inAppNotification) {
        addNotification(inAppNotification);
      }

      return { success: true };
    } catch (error) {
      console.error('Notification service error:', error);
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const getInAppNotification = (trigger: NotificationTrigger) => {
    const { type, ticketId, ticketSubject, metadata } = trigger;

    switch (type) {
      case 'ticket_submitted':
        return {
          type: 'success' as const,
          title: '🎫 Ticket Submitted',
          message: `Your ticket "${ticketSubject}" has been submitted successfully.`,
          action: {
            label: 'View Ticket',
            onClick: () => window.location.href = `/my/tickets/${ticketId}`,
          },
        };

      case 'staff_reply':
        return {
          type: 'info' as const,
          title: '💬 New Staff Reply',
          message: `${metadata?.staffName || 'Support staff'} replied to your ticket "${ticketSubject}".`,
          action: {
            label: 'Read Reply',
            onClick: () => window.location.href = `/my/tickets/${ticketId}`,
          },
        };

      case 'status_change':
        const statusEmojis = {
          'open': '🔴',
          'in_progress': '🟡', 
          'resolved': '🟢',
          'closed': '⚫',
        };
        
        const statusColor = {
          'resolved': 'success' as const,
          'closed': 'info' as const,
          'in_progress': 'warning' as const,
          'open': 'error' as const,
        };

        const emoji = statusEmojis[metadata?.newStatus as keyof typeof statusEmojis] || '📝';
        const color = statusColor[metadata?.newStatus as keyof typeof statusColor] || 'info';
        
        return {
          type: color,
          title: `${emoji} Status Updated`,
          message: `Ticket "${ticketSubject}" status changed to ${metadata?.newStatus?.replace('_', ' ')}.`,
          action: {
            label: 'View Ticket',
            onClick: () => window.location.href = `/my/tickets/${ticketId}`,
          },
        };

      default:
        return null;
    }
  };

  // Notification preferences helpers
  const updateNotificationPreferences = useCallback(async (preferences: {
    emailNotificationsEnabled?: boolean;
    inAppNotificationsEnabled?: boolean;
    notifyOnTicketSubmitted?: boolean;
    notifyOnStaffReply?: boolean;
    notifyOnStatusChange?: boolean;
  }) => {
    try {
      const response = await fetch('/api/users/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      const updatedUser = await response.json();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const getNotificationPreferences = useCallback(async () => {
    try {
      const response = await fetch('/api/users/notification-preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }

      const preferences = await response.json();
      return { success: true, preferences };
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    sendNotification,
    updateNotificationPreferences,
    getNotificationPreferences,
    currentUser: user,
  };
};