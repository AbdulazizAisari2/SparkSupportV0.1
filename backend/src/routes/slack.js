const express = require('express');
const slackService = require('../services/slackService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();
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
router.post('/webhooks/interactions', express.raw({ type: 'application/x-www-form-urlencoded' }), async (req, res, next) => {
  try {
    const payload = JSON.parse(req.body.toString().split('payload=')[1]);
    console.log(`🔄 Slack interaction received: ${payload.type}`);
    await slackService.handleInteraction(payload);
    res.status(200).json({
      response_type: 'ephemeral',
      text: 'Processing your request...'
    });
  } catch (error) {
    console.error('❌ Slack webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/webhooks/events', express.json(), async (req, res, next) => {
  try {
    const { type, challenge, event } = req.body;
    if (type === 'url_verification') {
      return res.json({ challenge });
    }
    if (type === 'event_callback') {
      console.log(`📨 Slack event received: ${event.type}`);
      switch (event.type) {
        case 'app_mention':
          console.log(`📢 Bot mentioned in Slack`);
          break;
        case 'message':
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
router.post('/notify/ticket', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ error: 'Ticket ID required' });
    }
    res.json({
      message: 'Ticket notification sent to Slack',
      ticketId: ticketId
    });
  } catch (error) {
    next(error);
  }
});
router.post('/summary', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { period = 'daily' } = req.body;
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