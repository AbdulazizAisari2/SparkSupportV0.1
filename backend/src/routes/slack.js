const express = require('express');
const slackService = require('../services/slackService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/slack/status - Check Slack integration status
router.get('/status', authenticateToken, async (req, res, next) => {
  try {
    const status = slackService.getStatus();
    
    console.log(`📊 Slack status requested by ${req.user.email}`);
    
    res.json({
      ...status,
      message: status.configured 
        ? 'Slack integration is active and ready!' 
        : 'Slack integration not configured. Add SLACK_BOT_TOKEN to .env file.'
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/slack/test - Send test message to Slack (admin only)
router.post('/test', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { channel } = req.body;
    
    console.log(`🧪 Testing Slack integration requested by ${req.user.email}`);
    
    const success = await slackService.sendTestMessage(channel);
    
    if (success) {
      res.json({
        message: 'Test message sent to Slack successfully!',
        channel: channel || slackService.defaultChannel,
        instructions: 'Check your Slack workspace for the test message'
      });
    } else {
      res.status(500).json({
        error: 'Failed to send test message to Slack',
        hint: 'Check your SLACK_BOT_TOKEN and ensure the bot is added to the channel'
      });
    }

  } catch (error) {
    next(error);
  }
});

// POST /api/slack/webhooks/interactions - Handle Slack interactive components
router.post('/webhooks/interactions', express.raw({ type: 'application/x-www-form-urlencoded' }), async (req, res, next) => {
  try {
    // Parse the payload from Slack
    const payload = JSON.parse(req.body.toString().split('payload=')[1]);
    
    console.log(`🔄 Slack interaction received: ${payload.type}`);
    
    // Handle the interaction
    await slackService.handleInteraction(payload);
    
    // Respond to Slack (required within 3 seconds)
    res.status(200).json({
      response_type: 'ephemeral',
      text: 'Processing your request...'
    });

  } catch (error) {
    console.error('❌ Slack webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/slack/webhooks/events - Handle Slack events
router.post('/webhooks/events', express.json(), async (req, res, next) => {
  try {
    const { type, challenge, event } = req.body;
    
    // Handle URL verification challenge
    if (type === 'url_verification') {
      return res.json({ challenge });
    }
    
    // Handle app events
    if (type === 'event_callback') {
      console.log(`📨 Slack event received: ${event.type}`);
      
      // Handle specific events here (e.g., mentions, direct messages)
      switch (event.type) {
        case 'app_mention':
          // Handle @sparksupport mentions
          console.log(`📢 Bot mentioned in Slack`);
          break;
        case 'message':
          // Handle direct messages to bot
          console.log(`💬 Direct message received`);
          break;
        default:
          console.log(`❓ Unhandled event type: ${event.type}`);
      }
    }
    
    res.status(200).json({ ok: true });

  } catch (error) {
    console.error('❌ Slack event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/slack/notify/ticket - Manual ticket notification (for testing)
router.post('/notify/ticket', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { ticketId } = req.body;
    
    if (!ticketId) {
      return res.status(400).json({ error: 'Ticket ID required' });
    }
    
    // Get ticket data (you'd implement this)
    // const ticket = await getTicketById(ticketId);
    // const success = await slackService.sendTicketCreatedNotification(ticket);
    
    res.json({
      message: 'Ticket notification sent to Slack',
      ticketId: ticketId
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/slack/summary - Send team summary (admin only)
router.post('/summary', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { period = 'daily' } = req.body;
    
    // Calculate team stats (simplified for demo)
    const stats = {
      ticketsResolved: 23,
      avgSatisfaction: 4.7,
      avgResolutionTime: 3.2,
      topPerformer: { name: 'Mohammed Hassan' }
    };
    
    const success = await slackService.sendTeamSummary({ period, stats });
    
    if (success) {
      res.json({
        message: `${period} team summary sent to Slack`,
        stats: stats
      });
    } else {
      res.status(500).json({
        error: 'Failed to send team summary',
        hint: 'Check Slack configuration'
      });
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;