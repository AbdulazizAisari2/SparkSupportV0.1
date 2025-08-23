const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// Get all chat messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 50 // Limit to last 50 messages
    });

    // Transform to frontend format
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName: msg.sender.name,
      senderRole: msg.sender.role,
      message: msg.message,
      timestamp: msg.createdAt.toISOString(),
      isEdited: msg.isEdited
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

// Send a new chat message
router.post('/messages', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        senderId: userId,
        message: message.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            department: true
          }
        }
      }
    });

    // Transform to frontend format
    const formattedMessage = {
      id: chatMessage.id,
      senderId: chatMessage.senderId,
      senderName: chatMessage.sender.name,
      senderRole: chatMessage.sender.role,
      message: chatMessage.message,
      timestamp: chatMessage.createdAt.toISOString(),
      isEdited: chatMessage.isEdited
    };

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error('Error creating chat message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get online users (staff and admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['staff', 'admin']
        }
      },
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        isOnline: true,
        lastSeen: true
      },
      orderBy: [
        { isOnline: 'desc' },
        { name: 'asc' }
      ]
    });

    // Transform to frontend format
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      role: user.role,
      department: user.department,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen?.toISOString()
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user online status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline } = req.body;
    
    // Users can only update their own status
    if (id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot update other user status' });
    }

    const updateData = {
      isOnline: Boolean(isOnline)
    };

    // Set lastSeen when going offline
    if (!isOnline) {
      updateData.lastSeen = new Date();
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete a chat message (sender only)
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if message exists and belongs to user
    const message = await prisma.chatMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'Cannot delete other user messages' });
    }

    await prisma.chatMessage.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;