const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStaffOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createTicketSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedStaffId: z.string().nullable().optional()
});

const addMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  isInternal: z.boolean().default(false)
});

// GET /api/tickets - Get tickets based on user role
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { status, priority, assignedToMe } = req.query;
    const user = req.user;

    let whereClause = {};

    // Role-based filtering
    if (user.role === 'customer') {
      whereClause.customerId = user.id;
    } else if (user.role === 'staff' && assignedToMe === 'true') {
      whereClause.assignedStaffId = user.id;
    }

    // Additional filters
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        customer: {
          select: { id: true, name: true, email: true, role: true }
        },
        assignedStaff: {
          select: { id: true, name: true, email: true, role: true }
        },
        category: true,
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📋 Found ${tickets.length} tickets for ${user.role}: ${user.email}`);
    res.json({ tickets });

  } catch (error) {
    next(error);
  }
});

// GET /api/tickets/:id - Get specific ticket with messages
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, email: true, role: true }
        },
        assignedStaff: {
          select: { id: true, name: true, email: true, role: true }
        },
        category: true,
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, email: true, role: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Permission check
    if (user.role === 'customer' && ticket.customerId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to view this ticket' });
    }

    // Filter internal messages for customers
    if (user.role === 'customer') {
      ticket.messages = ticket.messages.filter(msg => !msg.isInternal);
    }

    console.log(`🎫 Ticket ${id} viewed by ${user.role}: ${user.email}`);
    res.json({ ticket });

  } catch (error) {
    next(error);
  }
});

// POST /api/tickets - Create new ticket (customers only)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== 'customer') {
      return res.status(403).json({ error: 'Only customers can create tickets' });
    }

    // Validate input
    const validatedData = createTicketSchema.parse(req.body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Generate ticket ID
    const ticketCount = await prisma.ticket.count();
    const ticketId = `T${String(ticketCount + 1).padStart(3, '0')}`;

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        id: ticketId,
        customerId: user.id,
        categoryId: validatedData.categoryId,
        priority: validatedData.priority,
        subject: validatedData.subject,
        description: validatedData.description,
        status: 'open'
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, role: true }
        },
        category: true
      }
    });

    // Create initial message with ticket description
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: user.id,
        message: validatedData.description,
        isInternal: false
      }
    });

    console.log(`🎫 New ticket created: ${ticket.id} by ${user.email}`);
    res.status(201).json({ ticket });

  } catch (error) {
    next(error);
  }
});

// PATCH /api/tickets/:id - Update ticket (staff/admin only)
router.patch('/:id', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.update({
      where: { id },
      data: validatedData,
      include: {
        customer: {
          select: { id: true, name: true, email: true, role: true }
        },
        assignedStaff: {
          select: { id: true, name: true, email: true, role: true }
        },
        category: true
      }
    });

    console.log(`📝 Ticket ${id} updated by ${req.user.email}`);
    res.json({ ticket });

  } catch (error) {
    next(error);
  }
});

// POST /api/tickets/:id/messages - Add message to ticket
router.post('/:id/messages', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const validatedData = addMessageSchema.parse(req.body);

    // Check if ticket exists and user has permission
    const ticket = await prisma.ticket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Permission check
    if (user.role === 'customer' && ticket.customerId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to message this ticket' });
    }

    // Create message
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId: user.id,
        message: validatedData.message,
        isInternal: validatedData.isInternal && user.role !== 'customer' // Only staff/admin can send internal messages
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    console.log(`💬 Message added to ticket ${id} by ${user.email}`);
    res.status(201).json({ message });

  } catch (error) {
    next(error);
  }
});

module.exports = router;