const { WebClient } = require('@slack/web-api');

class SparkSupportSlackService {
  constructor() {
    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.isEnabled = process.env.SLACK_ENABLED === 'true';
    this.defaultChannel = process.env.SLACK_DEFAULT_CHANNEL || '#sparksupport';
    this.alertsChannel = process.env.SLACK_ALERTS_CHANNEL || '#sparksupport-alerts';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
  }

  // Check if Slack is properly configured
  isConfigured() {
    return !!(process.env.SLACK_BOT_TOKEN && this.isEnabled);
  }

  // Get status information
  getStatus() {
    return {
      enabled: this.isEnabled,
      configured: this.isConfigured(),
      defaultChannel: this.defaultChannel,
      alertsChannel: this.alertsChannel,
      hasWebhook: !!this.webhookUrl,
      frontendUrl: this.frontendUrl
    };
  }

  // Send new ticket notification to Slack
  async sendTicketCreatedNotification({ ticket, customer, category }) {
    if (!this.isConfigured()) {
      console.log('📧 Slack not configured - ticket notification skipped');
      return false;
    }

    try {
      console.log(`📢 Sending Slack notification for ticket ${ticket.id}`);

      const priorityEmojis = {
        low: '🟢',
        medium: '🟡', 
        high: '🟠',
        urgent: '🔴'
      };

      const categoryEmojis = {
        'Technical Support': '🔧',
        'Account Access': '🔐',
        'Billing': '💰',
        'Feature Request': '💡',
        'Bug Report': '🐛'
      };

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🎫 New Ticket: ${ticket.id}`,
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Customer:*\n${customer.name}`
            },
            {
              type: 'mrkdwn',
              text: `*Priority:*\n${priorityEmojis[ticket.priority]} ${ticket.priority.toUpperCase()}`
            },
            {
              type: 'mrkdwn',
              text: `*Category:*\n${categoryEmojis[category.name] || '📋'} ${category.name}`
            },
            {
              type: 'mrkdwn',
              text: `*Status:*\n🔵 ${ticket.status.replace('_', ' ').toUpperCase()}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Subject:*\n${ticket.subject}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${ticket.description.length > 200 ? ticket.description.substring(0, 200) + '...' : ticket.description}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '👀 View Ticket',
                emoji: true
              },
              style: 'primary',
              url: `${this.frontendUrl}/staff/tickets/${ticket.id}`
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📝 Assign to Me',
                emoji: true
              },
              style: 'primary',
              action_id: 'assign_ticket',
              value: ticket.id
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '⚡ Set Urgent',
                emoji: true
              },
              style: 'danger',
              action_id: 'urgent_ticket',
              value: ticket.id
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `📧 ${customer.email} • ⏰ ${new Date(ticket.createdAt).toLocaleString()} • 🆔 ${ticket.id}`
            }
          ]
        }
      ];

      const result = await this.slack.chat.postMessage({
        channel: this.defaultChannel,
        text: `🎫 New Ticket: ${ticket.subject}`,
        blocks: blocks,
        unfurl_links: false,
        unfurl_media: false
      });

      console.log(`✅ Slack notification sent successfully!`);
      console.log(`📱 Message TS: ${result.ts}`);

      return true;
    } catch (error) {
      console.error('❌ Slack notification failed:', error);
      return false;
    }
  }

  // Send ticket status update to Slack
  async sendTicketStatusUpdate({ ticket, oldStatus, staffMember, customer, category }) {
    if (!this.isConfigured()) {
      console.log('📧 Slack not configured - status update skipped');
      return false;
    }

    try {
      console.log(`📢 Sending Slack status update for ticket ${ticket.id}`);

      const statusEmojis = {
        open: '🔵',
        in_progress: '🟡',
        resolved: '🟢',
        closed: '⚫'
      };

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📊 Ticket Status Update: ${ticket.id}`,
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Status Changed:*\n${statusEmojis[oldStatus]} ${oldStatus.replace('_', ' ')} → ${statusEmojis[ticket.status]} ${ticket.status.replace('_', ' ')}`
            },
            {
              type: 'mrkdwn',
              text: `*Updated by:*\n${staffMember.name} (${staffMember.department})`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Subject:* ${ticket.subject}\n*Customer:* ${customer.name}`
          }
        }
      ];

      // Add resolution celebration for resolved tickets
      if (ticket.status === 'resolved') {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎉 *Ticket Resolved!* Great work ${staffMember.name}! \n⏱️ Resolution time: ${ticket.resolutionTime ? ticket.resolutionTime.toFixed(1) + ' hours' : 'N/A'}`
          }
        });
      }

      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '👀 View Ticket',
              emoji: true
            },
            style: 'primary',
            url: `${this.frontendUrl}/staff/tickets/${ticket.id}`
          }
        ]
      });

      const result = await this.slack.chat.postMessage({
        channel: this.defaultChannel,
        text: `📊 Ticket ${ticket.id} status: ${ticket.status}`,
        blocks: blocks,
        unfurl_links: false,
        unfurl_media: false
      });

      console.log(`✅ Slack status update sent successfully!`);
      return true;
    } catch (error) {
      console.error('❌ Slack status update failed:', error);
      return false;
    }
  }

  // Send staff achievement notification
  async sendAchievementNotification({ user, achievement, points }) {
    if (!this.isConfigured()) {
      console.log('📧 Slack not configured - achievement notification skipped');
      return false;
    }

    try {
      console.log(`📢 Sending achievement notification for ${user.name}`);

      const achievementEmojis = {
        star: '⭐',
        zap: '⚡',
        crown: '👑',
        target: '🎯',
        award: '🏆',
        trophy: '🏆',
        flash: '⚡',
        heart: '❤️'
      };

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🏆 Achievement Unlocked!`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎉 *Congratulations ${user.name}!*\n\n${achievementEmojis[achievement.icon] || '🏅'} *${achievement.name}*\n_${achievement.description}_\n\n💰 *Bonus:* +${achievement.pointsReward} points\n📊 *Total Points:* ${points}`
          },
          accessory: {
            type: 'image',
            image_url: 'https://i.imgur.com/placeholder-trophy.png',
            alt_text: 'achievement badge'
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📊 View Leaderboard',
                emoji: true
              },
              style: 'primary',
              url: `${this.frontendUrl}/staff/leaderboard`
            }
          ]
        }
      ];

      const result = await this.slack.chat.postMessage({
        channel: this.defaultChannel,
        text: `🏆 ${user.name} unlocked achievement: ${achievement.name}`,
        blocks: blocks,
        unfurl_links: false,
        unfurl_media: false
      });

      console.log(`✅ Slack achievement notification sent!`);
      return true;
    } catch (error) {
      console.error('❌ Slack achievement notification failed:', error);
      return false;
    }
  }

  // Send daily/weekly team summary
  async sendTeamSummary({ period, stats }) {
    if (!this.isConfigured()) {
      console.log('📧 Slack not configured - team summary skipped');
      return false;
    }

    try {
      console.log(`📢 Sending ${period} team summary to Slack`);

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📊 ${period.charAt(0).toUpperCase() + period.slice(1)} Team Summary`,
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*🎫 Tickets Resolved:*\n${stats.ticketsResolved}`
            },
            {
              type: 'mrkdwn',
              text: `*⭐ Avg Satisfaction:*\n${stats.avgSatisfaction.toFixed(1)}/5.0`
            },
            {
              type: 'mrkdwn',
              text: `*⏱️ Avg Resolution:*\n${stats.avgResolutionTime.toFixed(1)} hours`
            },
            {
              type: 'mrkdwn',
              text: `*🏆 Top Performer:*\n${stats.topPerformer.name}`
            }
          ]
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📊 View Full Leaderboard',
                emoji: true
              },
              style: 'primary',
              url: `${this.frontendUrl}/staff/leaderboard`
            }
          ]
        }
      ];

      const result = await this.slack.chat.postMessage({
        channel: this.defaultChannel,
        text: `📊 ${period} team summary`,
        blocks: blocks
      });

      console.log(`✅ Team summary sent to Slack!`);
      return true;
    } catch (error) {
      console.error('❌ Team summary failed:', error);
      return false;
    }
  }

  // Send test message to verify integration
  async sendTestMessage(channel = null) {
    if (!this.isConfigured()) {
      console.log('❌ Slack not configured');
      return false;
    }

    try {
      const testChannel = channel || this.defaultChannel;
      console.log(`📢 Sending test message to ${testChannel}`);

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🧪 SparkSupport Integration Test',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `✅ *Slack integration is working!*\n\nSparkSupport is now connected and ready to send:\n• 🎫 New ticket notifications\n• 📊 Status updates\n• 🏆 Achievement celebrations\n• 📈 Team performance summaries`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Frontend URL:* ${this.frontendUrl}\n*Environment:* ${process.env.NODE_ENV || 'development'}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🚀 Open SparkSupport',
                emoji: true
              },
              style: 'primary',
              url: this.frontendUrl
            }
          ]
        }
      ];

      const result = await this.slack.chat.postMessage({
        channel: testChannel,
        text: '🧪 SparkSupport integration test',
        blocks: blocks
      });

      console.log(`✅ Test message sent successfully!`);
      console.log(`📱 Message TS: ${result.ts}`);
      console.log(`📍 Channel: ${testChannel}`);

      return true;
    } catch (error) {
      console.error('❌ Slack test message failed:', error);
      return false;
    }
  }

  // Send urgent ticket alert to alerts channel
  async sendUrgentAlert({ ticket, customer, category }) {
    if (!this.isConfigured()) {
      console.log('📧 Slack not configured - urgent alert skipped');
      return false;
    }

    try {
      console.log(`🚨 Sending urgent alert for ticket ${ticket.id}`);

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 URGENT TICKET ALERT',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🔴 *HIGH PRIORITY TICKET NEEDS IMMEDIATE ATTENTION*\n\n*Ticket:* ${ticket.id}\n*Subject:* ${ticket.subject}\n*Customer:* ${customer.name}\n*Category:* ${category.name}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🚨 Handle Now',
                emoji: true
              },
              style: 'danger',
              url: `${this.frontendUrl}/staff/tickets/${ticket.id}`
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📝 Assign to Me',
                emoji: true
              },
              action_id: 'assign_urgent_ticket',
              value: ticket.id
            }
          ]
        }
      ];

      const result = await this.slack.chat.postMessage({
        channel: this.alertsChannel,
        text: `🚨 URGENT: ${ticket.subject}`,
        blocks: blocks
      });

      console.log(`✅ Urgent alert sent to ${this.alertsChannel}!`);
      return true;
    } catch (error) {
      console.error('❌ Urgent alert failed:', error);
      return false;
    }
  }

  // Handle Slack interactive components (button clicks)
  async handleInteraction(payload) {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const { action_id, value, user } = payload.actions[0];
      const slackUserId = payload.user.id;
      const ticketId = value;

      console.log(`🔄 Handling Slack interaction: ${action_id} for ticket ${ticketId}`);

      switch (action_id) {
        case 'assign_ticket':
          await this.handleTicketAssignment(ticketId, slackUserId, payload.response_url);
          break;
        case 'urgent_ticket':
          await this.handleUrgentEscalation(ticketId, slackUserId, payload.response_url);
          break;
        case 'assign_urgent_ticket':
          await this.handleTicketAssignment(ticketId, slackUserId, payload.response_url);
          break;
        default:
          console.log(`❓ Unknown action: ${action_id}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Slack interaction failed:', error);
      return false;
    }
  }

  // Handle ticket assignment from Slack
  async handleTicketAssignment(ticketId, slackUserId, responseUrl) {
    try {
      // Note: In production, you'd need to map Slack user ID to your app user ID
      // For now, we'll just send a confirmation message
      
      await this.slack.chat.postMessage({
        channel: responseUrl.split('/').pop(), // Extract channel from response URL
        text: `✅ Ticket ${ticketId} assignment initiated! Please complete in SparkSupport dashboard.`,
        thread_ts: responseUrl.split('/').pop() // This would need proper implementation
      });

      console.log(`✅ Assignment initiated for ticket ${ticketId}`);
    } catch (error) {
      console.error('❌ Assignment handling failed:', error);
    }
  }

  // Handle urgent escalation from Slack  
  async handleUrgentEscalation(ticketId, slackUserId, responseUrl) {
    try {
      // Send confirmation
      console.log(`🚨 Ticket ${ticketId} marked as urgent via Slack`);
      
      // In production, you'd update the ticket priority in your database here
      // await updateTicketPriority(ticketId, 'urgent');
      
    } catch (error) {
      console.error('❌ Urgent escalation failed:', error);
    }
  }
}

module.exports = new SparkSupportSlackService();