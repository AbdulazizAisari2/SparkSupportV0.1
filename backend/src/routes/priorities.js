const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Mock priority data since we don't have a priorities table yet
const mockPriorities = [
  { id: '1', name: 'Low', level: 1 },
  { id: '2', name: 'Medium', level: 2 },
  { id: '3', name: 'High', level: 3 },
  { id: '4', name: 'Urgent', level: 4 }
];

// GET /api/priorities - Get all priorities
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    // For now, return mock data since we don't have a priorities table
    res.json({ priorities: mockPriorities });
  } catch (error) {
    next(error);
  }
});

// POST /api/priorities - Create new priority
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, level } = req.body;

    // Validate input
    if (!name || !level || level < 1 || level > 4) {
      return res.status(400).json({ 
        error: 'Name and level (1-4) are required' 
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    // For now, simulate creating a priority
    const newPriority = {
      id: Date.now().toString(),
      name,
      level: parseInt(level)
    };

    // In a real implementation, you would save to database:
    // const priority = await prisma.priority.create({
    //   data: { name, level }
    // });

    res.status(201).json({ 
      priority: newPriority,
      message: 'Priority created successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/priorities/:id - Update priority
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, level } = req.body;

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    // Find existing priority
    const existingPriority = mockPriorities.find(p => p.id === id);
    if (!existingPriority) {
      return res.status(404).json({ 
        error: 'Priority not found' 
      });
    }

    // Update the priority
    const updatedPriority = {
      ...existingPriority,
      ...(name && { name }),
      ...(level && { level: parseInt(level) })
    };

    // In a real implementation:
    // const priority = await prisma.priority.update({
    //   where: { id },
    //   data: { name, level }
    // });

    res.json({ 
      priority: updatedPriority,
      message: 'Priority updated successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/priorities/:id - Partial update priority
router.patch('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    // Find existing priority
    const existingPriority = mockPriorities.find(p => p.id === id);
    if (!existingPriority) {
      return res.status(404).json({ 
        error: 'Priority not found' 
      });
    }

    // Update the priority
    const updatedPriority = {
      ...existingPriority,
      ...updates,
      ...(updates.level && { level: parseInt(updates.level) })
    };

    res.json({ 
      priority: updatedPriority,
      message: 'Priority updated successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/priorities/:id - Delete priority
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    // Find existing priority
    const existingPriority = mockPriorities.find(p => p.id === id);
    if (!existingPriority) {
      return res.status(404).json({ 
        error: 'Priority not found' 
      });
    }

    // In a real implementation:
    // await prisma.priority.delete({
    //   where: { id }
    // });

    res.json({ 
      message: 'Priority deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;