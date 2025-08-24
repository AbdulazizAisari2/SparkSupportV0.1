const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createSurveySchema = z.object({
  ticketId: z.string().min(1),
  overallRating: z.number().min(1).max(5),
  responseTime: z.number().min(1).max(5),
  helpfulness: z.number().min(1).max(5),
  professionalism: z.number().min(1).max(5),
  resolutionQuality: z.number().min(1).max(5),
  feedback: z.string().optional(),
  improvements: z.string().optional()
});

// Create a new customer satisfaction survey
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Survey creation request:', { body: req.body, userId: req.user.id });
    const validatedData = createSurveySchema.parse(req.body);
    const userId = req.user.id;

    // Verify the ticket belongs to the user (customers only) or user is staff
    const ticket = await prisma.ticket.findUnique({
      where: { id: validatedData.ticketId },
      include: { customer: true, assignedStaff: true }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Only the customer can submit a survey for their ticket
    if (req.user.role === 'customer' && ticket.customerId !== userId) {
      return res.status(403).json({ error: 'You can only submit surveys for your own tickets' });
    }

    // Check if survey already exists for this ticket
    const existingSurvey = await prisma.customerSatisfactionSurvey.findUnique({
      where: { ticketId: validatedData.ticketId }
    });

    if (existingSurvey) {
      return res.status(400).json({ error: 'Survey already submitted for this ticket' });
    }

    // Calculate average rating
    const ratings = [
      validatedData.overallRating,
      validatedData.responseTime,
      validatedData.helpfulness,
      validatedData.professionalism,
      validatedData.resolutionQuality
    ];
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    // Create the survey
    const survey = await prisma.customerSatisfactionSurvey.create({
      data: {
        ticketId: validatedData.ticketId,
        customerId: ticket.customerId,
        overallRating: validatedData.overallRating,
        responseTime: validatedData.responseTime,
        helpfulness: validatedData.helpfulness,
        professionalism: validatedData.professionalism,
        resolutionQuality: validatedData.resolutionQuality,
        averageRating: parseFloat(averageRating.toFixed(1)),
        feedback: validatedData.feedback || '',
        improvements: validatedData.improvements || '',
        isCompleted: true,
        submittedAt: new Date()
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true }
        },
        ticket: {
          select: { id: true, subject: true, status: true }
        }
      }
    });

    // Update customer's overall satisfaction rating
    const customerSurveys = await prisma.customerSatisfactionSurvey.findMany({
      where: { customerId: ticket.customerId }
    });

    const customerAvgRating = customerSurveys.reduce((sum, s) => sum + s.averageRating, 0) / customerSurveys.length;

    await prisma.user.update({
      where: { id: ticket.customerId },
      data: { customerSatisfactionRating: parseFloat(customerAvgRating.toFixed(1)) }
    });

    const responseData = {
      message: 'Survey submitted successfully',
      survey: {
        id: survey.id,
        ticketId: survey.ticketId,
        averageRating: survey.averageRating,
        submittedAt: survey.submittedAt,
        customer: survey.customer,
        ticket: survey.ticket
      }
    };
    
    console.log('✅ Survey created successfully, sending response:', responseData);
    res.status(201).json(responseData);

  } catch (error) {
    console.error('❌ Error creating survey:', error);
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('❌ Internal server error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get survey for a specific ticket
router.get('/ticket/:ticketId', authenticateToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    // Verify access to the ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { customer: true, assignedStaff: true }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      (req.user.role === 'staff') ||
      (req.user.role === 'customer' && ticket.customerId === userId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get the survey
    const survey = await prisma.customerSatisfactionSurvey.findUnique({
      where: { ticketId },
      include: {
        customer: {
          select: { id: true, name: true, email: true }
        },
        ticket: {
          select: { id: true, subject: true, status: true }
        }
      }
    });

    if (!survey) {
      return res.status(404).json({ error: 'No survey found for this ticket' });
    }

    res.json({
      survey: {
        id: survey.id,
        ticketId: survey.ticketId,
        overallRating: survey.overallRating,
        responseTime: survey.responseTime,
        helpfulness: survey.helpfulness,
        professionalism: survey.professionalism,
        resolutionQuality: survey.resolutionQuality,
        averageRating: survey.averageRating,
        feedback: survey.feedback,
        improvements: survey.improvements,
        submittedAt: survey.submittedAt,
        customer: survey.customer,
        ticket: survey.ticket
      }
    });

  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all surveys (admin/staff only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [surveys, total] = await Promise.all([
      prisma.customerSatisfactionSurvey.findMany({
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, email: true }
          },
          ticket: {
            select: { id: true, subject: true, status: true }
          }
        }
      }),
      prisma.customerSatisfactionSurvey.count()
    ]);

    res.json({
      surveys: surveys.map(survey => ({
        id: survey.id,
        ticketId: survey.ticketId,
        overallRating: survey.overallRating,
        responseTime: survey.responseTime,
        helpfulness: survey.helpfulness,
        professionalism: survey.professionalism,
        resolutionQuality: survey.resolutionQuality,
        averageRating: survey.averageRating,
        feedback: survey.feedback,
        improvements: survey.improvements,
        submittedAt: survey.submittedAt,
        customer: survey.customer,
        ticket: survey.ticket
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;