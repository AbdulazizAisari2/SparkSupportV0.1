const express = require('express');
const { z } = require('zod');
const emailService = require('../services/emailService');

const router = express.Router();

// Test email endpoint for development
router.post('/test', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address required' });
    }

    console.log(`🧪 Testing email service with: ${email}`);
    
    const success = await emailService.sendTestEmail(email);
    
    if (success) {
      res.json({ 
        message: 'Test email sent successfully!',
        email: email,
        instructions: 'Check your inbox and spam folder'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send test email',
        hint: 'Check your RESEND_API_KEY in .env file'
      });
    }

  } catch (error) {
    next(error);
  }
});

// Email configuration status
router.get('/status', (req, res) => {
  const isConfigured = emailService.isConfigured();
  
  res.json({
    configured: isConfigured,
    service: 'Resend',
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    fromName: process.env.FROM_NAME || 'SparkSupport Team',
    hint: isConfigured ? 'Email service ready!' : 'Add RESEND_API_KEY to .env file'
  });
});

module.exports = router;