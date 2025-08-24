const { Resend } = require('resend');
class SparkSupportEmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.isLocal = process.env.NODE_ENV === 'development';
    this.frontendUrl = process.env.FRONTEND_URL || 'http:
    this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    this.fromName = process.env.FROM_NAME || 'SparkSupport Team';
  }
  isConfigured() {
    return !!process.env.RESEND_API_KEY;
  }
  getSender() {
    return `${this.fromName} <${this.fromEmail}>`;
  }
  getLocalhostNotice() {
    if (!this.isLocal) return '';
    return `
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); 
                  border: 2px solid #f59e0b; border-radius: 12px; padding: 16px; 
                  margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: #92400e; font-weight: bold; font-size: 16px;">
          🏠 Development Mode - Localhost
        </p>
        <p style="margin: 8px 0 0 0; color: #92400e; font-size: 14px;">
          Make sure your SparkSupport is running at <strong>${this.frontendUrl}</strong>
        </p>
      </div>
    `;
  }
  async sendWelcomeEmail({ to, name, userId }) {
    if (!this.isConfigured()) {
      console.log('📧 Email not configured - welcome email skipped');
      return false;
    }
    try {
      console.log(`📧 Sending welcome email to: ${to}`);
      const { data, error } = await this.resend.emails.send({
        from: this.getSender(),
        to: [to],
        subject: '🎉 Welcome to SparkSupport!',
        html: `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="background: white; border-radius: 20px; padding: 40px; 
                        max-width: 600px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 16px; 
                           display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 32px;">💬</span>
                </div>
                <h1 style="color: #667eea; font-size: 32px; margin: 0; font-weight: 800;">
                  Welcome to SparkSupport!
                </h1>
              </div>
              <!-- Content -->
              <div style="margin-bottom: 32px;">
                <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 16px 0;">
                  Hi <strong style="color: #667eea;">${name}</strong>! 👋
                </p>
                <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                  Your SparkSupport account has been created successfully! You can now:
                </p>
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <ul style="margin: 0; padding-left: 20px; color: #475569;">
                    <li style="margin-bottom: 8px;">✨ Submit and track support tickets</li>
                    <li style="margin-bottom: 8px;">💬 Communicate with our expert support team</li>
                    <li style="margin-bottom: 8px;">📊 View real-time ticket progress</li>
                    <li>🎯 Access your personalized dashboard</li>
                  </ul>
                </div>
              </div>
              ${this.getLocalhostNotice()}
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${this.frontendUrl}/login" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 16px 32px; text-decoration: none; 
                          border-radius: 12px; font-weight: bold; font-size: 16px; 
                          display: inline-block; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                          transition: transform 0.2s ease;">
                  🚀 Sign In to SparkSupport
                </a>
              </div>
              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
                <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
                  Welcome to the future of customer support! 🌟
                </p>
                ${this.isLocal ? `
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 8px 0 0 0;">
                    Development environment: ${this.frontendUrl}
                  </p>
                ` : ''}
              </div>
            </div>
          </div>
        `,
      });
      if (error) {
        console.error('❌ Email error:', error);
        return false;
      }
      console.log(`✅ Welcome email sent successfully!`);
      console.log(`📱 Email ID: ${data.id}`);
      console.log(`📬 Check your inbox: ${to}`);
      return true;
    } catch (error) {
      console.error('❌ Welcome email failed:', error);
      return false;
    }
  }
  async sendTicketCreatedEmail({ to, name, ticketId, subject, description }) {
    if (!this.isConfigured()) {
      console.log('📧 Email not configured - ticket email skipped');
      return false;
    }
    try {
      console.log(`📧 Sending ticket confirmation to: ${to}`);
      const { data, error } = await this.resend.emails.send({
        from: this.getSender(),
        to: [to],
        subject: `🎫 Ticket Created: ${subject}`,
        html: `
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); 
                      padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="background: white; border-radius: 20px; padding: 40px; 
                        max-width: 600px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); 
                           width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 16px; 
                           display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 32px;">🎫</span>
                </div>
                <h1 style="color: #0891b2; font-size: 28px; margin: 0; font-weight: 800;">
                  Ticket Created Successfully!
                </h1>
              </div>
              <!-- Ticket Details -->
              <div style="background: #f0f9ff; border-radius: 16px; padding: 24px; margin: 24px 0; 
                          border-left: 4px solid #0891b2;">
                <h2 style="color: #0891b2; font-size: 20px; margin: 0 0 16px 0;">
                  Ticket #${ticketId}
                </h2>
                <p style="color: #475569; margin: 0 0 8px 0;">
                  <strong>Subject:</strong> ${subject}
                </p>
                <p style="color: #64748b; margin: 0; line-height: 1.5;">
                  <strong>Description:</strong> ${description.substring(0, 150)}${description.length > 150 ? '...' : ''}
                </p>
              </div>
              <!-- What's Next -->
              <div style="margin: 24px 0;">
                <h3 style="color: #374151; font-size: 18px; margin: 0 0 16px 0;">What happens next?</h3>
                <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">📋 Our support team has received your ticket</p>
                  <p style="margin: 0 0 8px 0;">⏱️ We typically respond within 24 hours</p>
                  <p style="margin: 0 0 8px 0;">📱 You'll receive email updates on progress</p>
                  <p style="margin: 0;">💬 You can add messages anytime via your dashboard</p>
                </div>
              </div>
              ${this.getLocalhostNotice()}
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${this.frontendUrl}/my/tickets/${ticketId}" 
                   style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); 
                          color: white; padding: 16px 32px; text-decoration: none; 
                          border-radius: 12px; font-weight: bold; font-size: 16px; 
                          display: inline-block; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);">
                  🔍 View Your Ticket
                </a>
              </div>
              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
                <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
                  Thank you for using SparkSupport! We're here to help. 💪
                </p>
              </div>
            </div>
          </div>
        `,
      });
      if (error) {
        console.error('❌ Ticket email error:', error);
        return false;
      }
      console.log(`✅ Ticket email sent successfully!`);
      console.log(`📱 Email ID: ${data.id}`);
      console.log(`📬 Check your inbox: ${to}`);
      return true;
    } catch (error) {
      console.error('❌ Ticket email failed:', error);
      return false;
    }
  }
  async sendTicketUpdateEmail({ to, name, ticketId, subject, newStatus, staffName, message }) {
    if (!this.isConfigured()) {
      console.log('📧 Email not configured - update email skipped');
      return false;
    }
    try {
      const statusColors = {
        'open': '#ef4444',
        'in_progress': '#f59e0b', 
        'resolved': '#22c55e',
        'closed': '#6b7280'
      };
      const statusEmojis = {
        'open': '🔴',
        'in_progress': '🟡',
        'resolved': '🟢', 
        'closed': '⚫'
      };
      const statusColor = statusColors[newStatus] || '#6b7280';
      const statusEmoji = statusEmojis[newStatus] || '📝';
      console.log(`📧 Sending ticket update to: ${to}`);
      const { data, error } = await this.resend.emails.send({
        from: this.getSender(),
        to: [to],
        subject: `${statusEmoji} Ticket Update: ${subject}`,
        html: `
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); 
                      padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="background: white; border-radius: 20px; padding: 40px; 
                        max-width: 600px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); 
                           width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 16px; 
                           display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 32px;">${statusEmoji}</span>
                </div>
                <h1 style="color: #8b5cf6; font-size: 28px; margin: 0; font-weight: 800;">
                  Ticket Update
                </h1>
              </div>
              <!-- Ticket Info -->
              <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin: 24px 0;">
                <h2 style="color: #374151; font-size: 20px; margin: 0 0 16px 0;">
                  Ticket #${ticketId}
                </h2>
                <p style="color: #475569; margin: 0 0 12px 0;">
                  <strong>Subject:</strong> ${subject}
                </p>
                <div style="margin: 16px 0;">
                  <span style="background: ${statusColor}; color: white; padding: 6px 12px; 
                             border-radius: 20px; font-size: 14px; font-weight: bold;">
                    Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('_', ' ')}
                  </span>
                </div>
              </div>
              ${staffName && message ? `
                <div style="background: #f0f9ff; border-radius: 16px; padding: 24px; margin: 24px 0; 
                            border-left: 4px solid #0891b2;">
                  <h3 style="color: #0891b2; font-size: 18px; margin: 0 0 12px 0;">
                    New Message from ${staffName}:
                  </h3>
                  <p style="color: #475569; line-height: 1.6; margin: 0;">
                    "${message}"
                  </p>
                </div>
              ` : ''}
              ${this.getLocalhostNotice()}
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${this.frontendUrl}/my/tickets/${ticketId}" 
                   style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); 
                          color: white; padding: 16px 32px; text-decoration: none; 
                          border-radius: 12px; font-weight: bold; font-size: 16px; 
                          display: inline-block; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                  💬 View & Reply to Ticket
                </a>
              </div>
              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
                <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
                  Thanks for using SparkSupport! Our team is here to help. 🚀
                </p>
              </div>
            </div>
          </div>
        `,
      });
      if (error) {
        console.error('❌ Update email error:', error);
        return false;
      }
      console.log(`✅ Ticket update email sent successfully!`);
      console.log(`📱 Email ID: ${data.id}`);
      return true;
    } catch (error) {
      console.error('❌ Ticket update email failed:', error);
      return false;
    }
  }
  async sendTestEmail(to) {
    if (!this.isConfigured()) {
      console.log('❌ RESEND_API_KEY not configured');
      return false;
    }
    try {
      console.log(`📧 Sending test email to: ${to}`);
      const { data, error } = await this.resend.emails.send({
        from: this.getSender(),
        to: [to],
        subject: '🧪 SparkSupport Email Test',
        html: `
          <div style="padding: 40px; font-family: system-ui;">
            <h1 style="color: #667eea;">✅ Email Service Working!</h1>
            <p>Your SparkSupport email service is configured correctly.</p>
            <p><strong>Frontend URL:</strong> ${this.frontendUrl}</p>
            <p><strong>Environment:</strong> ${this.isLocal ? 'Development (Localhost)' : 'Production'}</p>
          </div>
        `,
      });
      if (error) {
        console.error('❌ Test email error:', error);
        return false;
      }
      console.log(`✅ Test email sent! ID: ${data.id}`);
      return true;
    } catch (error) {
      console.error('❌ Test email failed:', error);
      return false;
    }
  }
}
module.exports = new SparkSupportEmailService();