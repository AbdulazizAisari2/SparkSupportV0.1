const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();
const prisma = new PrismaClient();

// Send notification (handles both email and in-app based on user preferences)
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      ticketId,
      ticketSubject,
      recipientUserId,
      recipientEmail,
      recipientName,
      metadata = {}
    } = req.body;

    // Validate required fields
    if (!type || !ticketId || !ticketSubject) {
      return res.status(400).json({
        error: 'Missing required fields: type, ticketId, ticketSubject'
      });
    }

    let recipient = null;

    // Get recipient user and their notification preferences
    if (recipientUserId) {
      recipient = await prisma.user.findUnique({
        where: { id: recipientUserId },
        select: {
          id: true,
          name: true,
          email: true,
          emailNotificationsEnabled: true,
          inAppNotificationsEnabled: true,
          notifyOnTicketSubmitted: true,
          notifyOnStaffReply: true,
          notifyOnStatusChange: true,
        }
      });
    } else if (recipientEmail) {
      recipient = await prisma.user.findUnique({
        where: { email: recipientEmail },
        select: {
          id: true,
          name: true,
          email: true,
          emailNotificationsEnabled: true,
          inAppNotificationsEnabled: true,
          notifyOnTicketSubmitted: true,
          notifyOnStaffReply: true,
          notifyOnStatusChange: true,
        }
      });
    }

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check if user wants this type of notification
    let shouldSend = false;
    switch (type) {
      case 'ticket_submitted':
        shouldSend = recipient.notifyOnTicketSubmitted;
        break;
      case 'staff_reply':
        shouldSend = recipient.notifyOnStaffReply;
        break;
      case 'status_change':
        shouldSend = recipient.notifyOnStatusChange;
        break;
      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    if (!shouldSend) {
      return res.json({
        success: true,
        message: 'Notification skipped - user preference disabled',
        emailSent: false,
        inAppSent: false
      });
    }

    let emailSent = false;
    let inAppSent = false;

    // Send email notification if enabled
    if (recipient.emailNotificationsEnabled) {
      try {
        switch (type) {
          case 'ticket_submitted':
            emailSent = await emailService.sendTicketCreatedEmail({
              to: recipient.email,
              name: recipient.name,
              ticketId,
              subject: ticketSubject,
              description: metadata.description || 'No description provided'
            });
            break;

          case 'staff_reply':
            emailSent = await emailService.sendTicketUpdateEmail({
              to: recipient.email,
              name: recipient.name,
              ticketId,
              subject: ticketSubject,
              newStatus: metadata.currentStatus || 'in_progress',
              staffName: metadata.staffName,
              message: metadata.message
            });
            break;

          case 'status_change':
            emailSent = await emailService.sendTicketUpdateEmail({
              to: recipient.email,
              name: recipient.name,
              ticketId,
              subject: ticketSubject,
              newStatus: metadata.newStatus,
              staffName: metadata.staffName,
              message: metadata.message || `Status changed from ${metadata.oldStatus} to ${metadata.newStatus}`
            });
            break;
        }
      } catch (error) {
        console.error('Email notification failed:', error);
      }
    }

    // Note: In-app notifications are handled on the frontend
    // The frontend will show the notification when this API succeeds
    if (recipient.inAppNotificationsEnabled) {
      inAppSent = true;
    }

    res.json({
      success: true,
      message: 'Notification processed',
      emailSent,
      inAppSent,
      recipientPreferences: {
        emailEnabled: recipient.emailNotificationsEnabled,
        inAppEnabled: recipient.inAppNotificationsEnabled,
        typeEnabled: shouldSend
      }
    });

  } catch (error) {
    console.error('Notification API error:', error);
    res.status(500).json({ error: 'Failed to process notification' });
  }
});

// Get notification history for current user
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // For now, return empty array - we could implement a notification log table later
    res.json({
      notifications: [],
      message: 'Notification history feature coming soon'
    });
  } catch (error) {
    console.error('Notification history error:', error);
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
});

module.exports = router;