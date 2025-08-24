const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStaffOrAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');
const slackService = require('../services/slackService');
const router = express.Router();
const prisma = new PrismaClient();
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
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { status, priority, assignedToMe } = req.query;
    const user = req.user;
    let whereClause = {};
    if (user.role === 'customer') {
      whereClause.customerId = user.id;
    } else if (user.role === 'staff' && assignedToMe === 'true') {
      whereClause.assignedStaffId = user.id;
    }
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
    if (user.role === 'customer' && ticket.customerId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to view this ticket' });
    }
    if (user.role === 'customer') {
      ticket.messages = ticket.messages.filter(msg => !msg.isInternal);
    }
    console.log(`🎫 Ticket ${id} viewed by ${user.role}: ${user.email}`);
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
});
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== 'customer') {
      return res.status(403).json({ error: 'Only customers can create tickets' });
    }
    const validatedData = createTicketSchema.parse(req.body);
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    });
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const ticketCount = await prisma.ticket.count();
    const ticketId = `T${String(ticketCount + 1).padStart(3, '0')}`;
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
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: user.id,
        message: validatedData.description,
        isInternal: false
      }
    });
    console.log(`🎫 New ticket created: ${ticket.id} by ${user.email}`);
    emailService.sendTicketCreatedEmail({
      to: ticket.customer.email,
      name: ticket.customer.name,
      ticketId: ticket.id,
      subject: ticket.subject,
      description: ticket.description
    }).catch(error => {
      console.error('📧 Ticket email failed (non-blocking):', error);
    });
    slackService.sendTicketCreatedNotification({
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt
      },
      customer: {
        name: ticket.customer.name,
        email: ticket.customer.email
      },
      category: {
        name: ticket.category.name
      }
    }).catch(error => {
      console.error('💬 Slack ticket notification failed (non-blocking):', error);
    });
    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
});
router.patch('/:id', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateTicketSchema.parse(req.body);
    const user = req.user;
    const currentTicket = await prisma.ticket.findUnique({
      where: { id },
      select: { 
        status: true, 
        assignedStaffId: true, 
        createdAt: true,
        customerId: true,
        resolvedAt: true,
        resolutionTime: true
      }
    });
    if (!currentTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    const updateData = { ...validatedData };
    const isResolved = validatedData.status === 'resolved' || validatedData.status === 'closed';
    const wasNotResolved = currentTicket.status !== 'resolved' && currentTicket.status !== 'closed';
    const ticketJustResolved = isResolved && wasNotResolved;
    const wasResolved = currentTicket.status === 'resolved' || currentTicket.status === 'closed';
    const isBeingReopened = (validatedData.status === 'open' || validatedData.status === 'in_progress') && wasResolved;
    if (ticketJustResolved) {
      const resolutionTime = (new Date() - new Date(currentTicket.createdAt)) / (1000 * 60 * 60); 
      updateData.resolvedAt = new Date();
      updateData.resolutionTime = resolutionTime;
      console.log(`🎯 Ticket ${id} resolved in ${resolutionTime.toFixed(2)} hours`);
    }
    if (isBeingReopened) {
      updateData.resolvedAt = null;
      updateData.resolutionTime = null;
      console.log(`🔄 Ticket ${id} reopened - resolution data cleared`);
    }
    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
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
    if (ticketJustResolved && currentTicket.assignedStaffId) {
      try {
        await awardPointsForResolution(currentTicket.assignedStaffId, ticket.resolutionTime);
        console.log(`🏆 Points awarded to staff member for resolving ticket ${id}`);
      } catch (pointsError) {
        console.error('❌ Failed to award points:', pointsError);
      }
    }
    if (isBeingReopened && currentTicket.assignedStaffId) {
      try {
        await deductPointsForReopening(currentTicket.assignedStaffId, currentTicket.resolutionTime);
        console.log(`⚠️ Points deducted from staff member for ticket ${id} being reopened`);
      } catch (pointsError) {
        console.error('❌ Failed to deduct points:', pointsError);
      }
    }
    if (validatedData.status && validatedData.status !== currentTicket.status) {
      slackService.sendTicketStatusUpdate({
        ticket: {
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          resolutionTime: ticket.resolutionTime
        },
        oldStatus: currentTicket.status,
        staffMember: {
          name: user.name,
          department: user.department
        },
        customer: {
          name: ticket.customer.name,
          email: ticket.customer.email
        },
        category: {
          name: ticket.category.name
        }
      }).catch(error => {
        console.error('💬 Slack status update failed (non-blocking):', error);
      });
    }
    console.log(`📝 Ticket ${id} updated by ${user.email}`);
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
});
async function deductPointsForReopening(staffId, originalResolutionTimeHours) {
  let pointsToDeduct = 20; 
  if (originalResolutionTimeHours && originalResolutionTimeHours <= 1) {
    pointsToDeduct += 30; 
  } else if (originalResolutionTimeHours && originalResolutionTimeHours <= 4) {
    pointsToDeduct += 20; 
  } else if (originalResolutionTimeHours && originalResolutionTimeHours <= 24) {
    pointsToDeduct += 10; 
  }
  const currentUser = await prisma.user.findUnique({
    where: { id: staffId },
    select: { points: true, level: true, ticketsResolved: true }
  });
  if (!currentUser) return 0;
  const newPoints = Math.max(0, currentUser.points - pointsToDeduct);
  const newLevel = Math.max(1, Math.floor(newPoints / 500) + 1);
  await prisma.user.update({
    where: { id: staffId },
    data: {
      points: newPoints,
      level: newLevel,
      ticketsResolved: Math.max(0, currentUser.ticketsResolved - 1), 
      lastActiveDate: new Date()
    }
  });
  await recalculateStaffAverages(staffId);
  console.log(`⚠️ Deducted ${pointsToDeduct} points from staff member ${staffId} for ticket reopening`);
  return pointsToDeduct;
}
async function awardPointsForResolution(staffId, resolutionTimeHours) {
  let points = 20;
  if (resolutionTimeHours <= 1) {
    points += 30; 
  } else if (resolutionTimeHours <= 4) {
    points += 20; 
  } else if (resolutionTimeHours <= 24) {
    points += 10; 
  }
  const currentUser = await prisma.user.findUnique({
    where: { id: staffId },
    select: { points: true, level: true }
  });
  if (!currentUser) return 0;
  const newPoints = currentUser.points + points;
  const newLevel = Math.floor(newPoints / 500) + 1;
  await prisma.user.update({
    where: { id: staffId },
    data: {
      points: newPoints,
      level: newLevel,
      ticketsResolved: { increment: 1 },
      totalTicketsHandled: { increment: 1 },
      lastActiveDate: new Date()
    }
  });
  await recalculateStaffAverages(staffId);
  await checkAndAwardAchievements(staffId);
  console.log(`🎯 Awarded ${points} points to staff member ${staffId} for ticket resolution (${resolutionTimeHours.toFixed(2)}h)`);
  return points;
}
async function recalculateStaffAverages(staffId) {
  const staffTickets = await prisma.ticket.findMany({
    where: {
      assignedStaffId: staffId,
      status: { in: ['resolved', 'closed'] },
      resolutionTime: { not: null }
    },
    select: { resolutionTime: true, customerRating: true }
  });
  if (staffTickets.length > 0) {
    const avgResolutionTime = staffTickets.reduce((sum, t) => sum + (t.resolutionTime || 0), 0) / staffTickets.length;
    const ratingsWithValues = staffTickets.filter(t => t.customerRating);
    const avgRating = ratingsWithValues.length > 0 
      ? ratingsWithValues.reduce((sum, t) => sum + t.customerRating, 0) / ratingsWithValues.length 
      : null;
    const updateData = {
      averageResolutionTimeHours: avgResolutionTime
    };
    if (avgRating !== null) {
      updateData.customerSatisfactionRating = avgRating;
    }
    await prisma.user.update({
      where: { id: staffId },
      data: updateData
    });
  }
}
async function checkAndAwardAchievements(staffId) {
  const user = await prisma.user.findUnique({
    where: { id: staffId },
    include: {
      achievements: {
        include: { achievement: true }
      }
    }
  });
  if (!user) return;
  const existingAchievements = new Set(user.achievements.map(ua => ua.achievement.name));
  if (user.ticketsResolved >= 1 && !existingAchievements.has('First Resolution')) {
    await awardAchievement(staffId, 'First Resolution');
  }
  if (user.ticketsResolved >= 100 && !existingAchievements.has('Resolution Master')) {
    await awardAchievement(staffId, 'Resolution Master');
  }
  if (user.customerSatisfactionRating >= 4.8 && !existingAchievements.has('Customer Champion')) {
    await awardAchievement(staffId, 'Customer Champion');
  }
  if (user.averageResponseTimeMinutes <= 5 && !existingAchievements.has('Lightning Fast')) {
    await awardAchievement(staffId, 'Lightning Fast');
  }
}
async function awardAchievement(staffId, achievementName) {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { name: achievementName }
    });
    if (achievement) {
      await prisma.userAchievement.create({
        data: {
          userId: staffId,
          achievementId: achievement.id
        }
      });
      const updatedUser = await prisma.user.update({
        where: { id: staffId },
        data: {
          points: { increment: achievement.pointsReward }
        }
      });
      slackService.sendAchievementNotification({
        user: {
          name: updatedUser.name
        },
        achievement: {
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          pointsReward: achievement.pointsReward
        },
        points: updatedUser.points
      }).catch(error => {
        console.error('💬 Slack achievement notification failed (non-blocking):', error);
      });
      console.log(`🏅 Achievement "${achievementName}" awarded to staff member ${staffId} (+${achievement.pointsReward} points)`);
    }
  } catch (error) {
    console.error(`❌ Failed to award achievement "${achievementName}":`, error);
  }
}
router.post('/:id/messages', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const validatedData = addMessageSchema.parse(req.body);
    const ticket = await prisma.ticket.findUnique({
      where: { id }
    });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    if (user.role === 'customer' && ticket.customerId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to message this ticket' });
    }
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId: user.id,
        message: validatedData.message,
        isInternal: validatedData.isInternal && user.role !== 'customer' 
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