const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireStaffOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/chat';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Validation schemas
const sendMessageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1, 'Message cannot be empty'),
  messageType: z.enum(['text', 'file', 'image']).default('text')
});

const updateStatusSchema = z.object({
  status: z.string().optional(),
  isOnline: z.boolean().optional()
});

// GET /api/chat/employees - Get all employees available for chat
router.get('/employees', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { search, department, excludeOffline } = req.query;
    
    let whereClause = {
      role: { in: ['staff', 'admin'] },
      id: { not: req.user.id } // Exclude current user
    };
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (department) {
      whereClause.department = department;
    }
    
    if (excludeOffline === 'true') {
      whereClause.isOnline = true;
    }

    const employees = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        isOnline: true,
        lastSeen: true,
        status: true
      },
      orderBy: [
        { isOnline: 'desc' },
        { name: 'asc' }
      ]
    });

    res.json({ employees });

  } catch (error) {
    next(error);
  }
});

// GET /api/chat/conversations - Get user's conversations
router.get('/conversations', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const conversations = await prisma.chatConversation.findMany({
      where: {
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isOnline: true,
            lastSeen: true
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isOnline: true,
            lastSeen: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            messageType: true,
            createdAt: true,
            senderId: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: req.user.id },
                isRead: false
              }
            }
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    // Format conversations to always show the other user
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === req.user.id ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;
      
      return {
        id: conv.id,
        otherUser,
        lastMessage,
        unreadCount: conv._count.messages,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt
      };
    });

    res.json({ conversations: formattedConversations });

  } catch (error) {
    next(error);
  }
});

// GET /api/chat/conversations/:id/messages - Get messages in a conversation
router.get('/conversations/:id/messages', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const conversation = await prisma.chatConversation.findFirst({
      where: {
        id,
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    // Mark messages as read
    await prisma.chatMessage.updateMany({
      where: {
        conversationId: id,
        senderId: { not: req.user.id },
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({ 
      messages: messages.reverse(), // Show oldest first
      hasMore: messages.length === parseInt(limit)
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/chat/messages - Send a new message
router.post('/messages', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const validatedData = sendMessageSchema.parse(req.body);
    const { recipientId, content, messageType } = validatedData;

    // Check if recipient exists and is staff/admin
    const recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        role: { in: ['staff', 'admin'] }
      }
    });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Find or create conversation
    let conversation = await prisma.chatConversation.findFirst({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: recipientId },
          { user1Id: recipientId, user2Id: req.user.id }
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          user1Id: req.user.id,
          user2Id: recipientId,
          lastMessageAt: new Date()
        }
      });
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: req.user.id,
        content,
        messageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Update conversation's last message time
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    });

    console.log(`💬 New chat message sent from ${req.user.name} to ${recipient.name}`);
    res.status(201).json({ message });

  } catch (error) {
    next(error);
  }
});

// POST /api/chat/upload - Upload file for chat
router.post('/upload', authenticateToken, requireStaffOrAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/chat/${req.file.filename}`;
    
    res.json({
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/chat/messages/file - Send a file message
router.post('/messages/file', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { recipientId, attachmentUrl, attachmentName, messageType = 'file' } = req.body;

    if (!recipientId || !attachmentUrl || !attachmentName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if recipient exists
    const recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        role: { in: ['staff', 'admin'] }
      }
    });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Find or create conversation
    let conversation = await prisma.chatConversation.findFirst({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: recipientId },
          { user1Id: recipientId, user2Id: req.user.id }
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          user1Id: req.user.id,
          user2Id: recipientId,
          lastMessageAt: new Date()
        }
      });
    }

    // Create file message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: req.user.id,
        content: `Shared a ${messageType}: ${attachmentName}`,
        messageType,
        attachmentUrl,
        attachmentName
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Update conversation
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    });

    res.status(201).json({ message });

  } catch (error) {
    next(error);
  }
});

// PATCH /api/chat/status - Update user status
router.patch('/status', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const validatedData = updateStatusSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...validatedData,
        lastSeen: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isOnline: true,
        lastSeen: true,
        status: true
      }
    });

    res.json({ user: updatedUser });

  } catch (error) {
    next(error);
  }
});

// GET /api/chat/unread-count - Get total unread message count
router.get('/unread-count', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const unreadCount = await prisma.chatMessage.count({
      where: {
        conversation: {
          OR: [
            { user1Id: req.user.id },
            { user2Id: req.user.id }
          ]
        },
        senderId: { not: req.user.id },
        isRead: false
      }
    });

    res.json({ unreadCount });

  } catch (error) {
    next(error);
  }
});

// GET /api/chat/departments - Get unique departments for filtering
router.get('/departments', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const departments = await prisma.user.findMany({
      where: {
        role: { in: ['staff', 'admin'] },
        department: { not: null }
      },
      select: { department: true },
      distinct: ['department']
    });

    const departmentList = departments
      .map(d => d.department)
      .filter(Boolean)
      .sort();

    res.json({ departments: departmentList });

  } catch (error) {
    next(error);
  }
});

module.exports = router;