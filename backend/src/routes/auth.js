const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');
const router = express.Router();
const prisma = new PrismaClient();
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
router.post('/login', async (req, res, next) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true }
    });
    const { accessToken, refreshToken } = generateTokens(user.id);
    const { passwordHash, ...userResponse } = user;
    userResponse.isOnline = true; 
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
});
router.post('/signup', async (req, res, next) => {
  try {
    console.log('📝 Signup attempt:', req.body.email);
    const validatedData = signupSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(validatedData.password, parseInt(process.env.BCRYPT_ROUNDS));
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
    const { accessToken, refreshToken } = generateTokens(user.id);
    const { passwordHash: _, ...userResponse } = user;
    console.log('✅ Signup successful:', user.email);
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
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    const decoded = jwt.verify(refreshToken, 'sparksupport-local-dev-refresh-secret-456');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
});
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        points: true,
        level: true,
        ticketsResolved: true,
        averageResolutionTimeHours: true,
        customerSatisfactionRating: true,
        currentStreak: true,
        totalTicketsHandled: true,
        averageResponseTimeMinutes: true,
        monthlyGrowth: true,
        specialRecognition: true,
        lastActiveDate: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`👤 User data requested: ${currentUser.email} (${currentUser.points} points)`);
    res.json({
      user: currentUser
    });
  } catch (error) {
    console.error('❌ Failed to get user data:', error);
    next(error);
  }
});
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});
module.exports = router;