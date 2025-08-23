const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');
const { loginLimiter } = require('../middleware/rateLimit');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain: uppercase, lowercase, number, and special character'),
  phone: z.string().optional(),
  department: z.string().optional()
});

// Generate tokens (HARDCODED FOR LOCAL DEV)
const generateTokens = (userId) => {
  console.log('🔑 Generating tokens for user:', userId);
  
  const JWT_SECRET = 'sparksupport-local-dev-secret-123';
  const JWT_REFRESH_SECRET = 'sparksupport-local-dev-refresh-secret-456';

  const accessToken = jwt.sign(
    { userId, iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  console.log('✅ Tokens generated successfully with hardcoded secrets');
  return { accessToken, refreshToken };
};

// POST /api/auth/login
const loginHandler = async (req, res, next) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Return user without password hash
    const { passwordHash, ...userResponse } = user;

    console.log('✅ Login successful:', user.email, user.role);
    
    res.json({
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

// Apply rate limiter conditionally based on environment
if (process.env.NODE_ENV === 'production' && loginLimiter) {
  router.post('/login', loginLimiter, loginHandler);
} else {
  router.post('/login', loginHandler);
}

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    console.log('📝 Signup attempt:', req.body.email);
    
    // Validate input
    const validatedData = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, parseInt(process.env.BCRYPT_ROUNDS));

    // Create user (customers only for now)
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        phone: validatedData.phone,
        department: validatedData.department,
        role: 'customer',
        passwordHash
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Return user without password hash
    const { passwordHash: _, ...userResponse } = user;

    console.log('✅ Signup successful:', user.email);
    
    // Send welcome email (async, don't wait for it)
    emailService.sendWelcomeEmail({
      to: user.email,
      name: user.name,
      userId: user.id
    }).catch(error => {
      console.error('📧 Welcome email failed (non-blocking):', error);
    });
    
    res.status(201).json({
      message: 'Account created successfully',
      user: userResponse,
      accessToken,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, 'sparksupport-local-dev-refresh-secret-456');
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  // In a production app, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;