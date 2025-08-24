const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin, requireStaffOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  role: z.enum(['customer', 'staff', 'admin']),
  department: z.string().optional()
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().nullable().optional(),
  role: z.enum(['customer', 'staff', 'admin']).optional(),
  department: z.string().nullable().optional()
});

// GET /api/users - Get all users (staff/admin only)
router.get('/', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { role, search } = req.query;
    
    let whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        createdAt: true,
        _count: {
          select: {
            createdTickets: true,
            assignedTickets: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`👥 Retrieved ${users.length} users for ${req.user.email}`);
    res.json({ users });

  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get specific user (staff/admin only)
router.get('/:id', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdTickets: true,
            assignedTickets: true,
            sentMessages: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    next(error);
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, parseInt(process.env.BCRYPT_ROUNDS));

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        phone: validatedData.phone,
        role: validatedData.role,
        department: validatedData.department,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        createdAt: true
      }
    });

    console.log(`👤 New user created: ${user.email} (${user.role}) by ${req.user.email}`);
    res.status(201).json({ user });

  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id - Update user (admin only)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    // If email is being updated, check for duplicates
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email.toLowerCase(),
          id: { not: id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      validatedData.email = validatedData.email.toLowerCase();
    }

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        updatedAt: true
      }
    });

    console.log(`📝 User ${id} updated by ${req.user.email}`);
    res.json({ user });

  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user has tickets
    const ticketCount = await prisma.ticket.count({
      where: {
        OR: [
          { customerId: id },
          { assignedStaffId: id }
        ]
      }
    });

    if (ticketCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete user with ${ticketCount} associated tickets` 
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    console.log(`🗑️ User ${id} deleted by ${req.user.email}`);
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    next(error);
  }
});

// GET /api/users/staff/available - Get available staff for assignment
router.get('/staff/available', authenticateToken, async (req, res, next) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['staff', 'admin'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        _count: {
          select: { assignedTickets: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ staff });

  } catch (error) {
    next(error);
  }
});

// GET /api/users/notification-preferences - Get current user's notification preferences
router.get('/notification-preferences', authenticateToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        emailNotificationsEnabled: true,
        inAppNotificationsEnabled: true,
        notifyOnTicketSubmitted: true,
        notifyOnStaffReply: true,
        notifyOnStatusChange: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/notification-preferences - Update current user's notification preferences
router.put('/notification-preferences', authenticateToken, async (req, res, next) => {
  try {
    const {
      emailNotificationsEnabled,
      inAppNotificationsEnabled,
      notifyOnTicketSubmitted,
      notifyOnStaffReply,
      notifyOnStatusChange
    } = req.body;

    // Validate that at least one field is provided
    if (
      emailNotificationsEnabled === undefined &&
      inAppNotificationsEnabled === undefined &&
      notifyOnTicketSubmitted === undefined &&
      notifyOnStaffReply === undefined &&
      notifyOnStatusChange === undefined
    ) {
      return res.status(400).json({ 
        error: 'At least one notification preference must be provided' 
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (emailNotificationsEnabled !== undefined) updateData.emailNotificationsEnabled = Boolean(emailNotificationsEnabled);
    if (inAppNotificationsEnabled !== undefined) updateData.inAppNotificationsEnabled = Boolean(inAppNotificationsEnabled);
    if (notifyOnTicketSubmitted !== undefined) updateData.notifyOnTicketSubmitted = Boolean(notifyOnTicketSubmitted);
    if (notifyOnStaffReply !== undefined) updateData.notifyOnStaffReply = Boolean(notifyOnStaffReply);
    if (notifyOnStatusChange !== undefined) updateData.notifyOnStatusChange = Boolean(notifyOnStatusChange);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailNotificationsEnabled: true,
        inAppNotificationsEnabled: true,
        notifyOnTicketSubmitted: true,
        notifyOnStaffReply: true,
        notifyOnStatusChange: true,
      }
    });

    res.json({
      message: 'Notification preferences updated successfully',
      user: updatedUser
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;