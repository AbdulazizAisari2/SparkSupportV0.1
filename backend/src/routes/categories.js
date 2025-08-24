const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();
const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional()
});
const updateCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').optional(),
  description: z.string().nullable().optional()
});
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { tickets: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    console.log(`📂 Retrieved ${categories.length} categories for ${req.user.email}`);
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tickets: true }
        }
      }
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category });
  } catch (error) {
    next(error);
  }
});
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await prisma.category.create({
      data: validatedData
    });
    console.log(`📂 New category created: ${category.name} by ${req.user.email}`);
    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
});
router.patch('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await prisma.category.update({
      where: { id },
      data: validatedData
    });
    console.log(`📝 Category ${id} updated by ${req.user.email}`);
    res.json({ category });
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticketCount = await prisma.ticket.count({
      where: { categoryId: id }
    });
    if (ticketCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category with ${ticketCount} existing tickets` 
      });
    }
    await prisma.category.delete({
      where: { id }
    });
    console.log(`🗑️ Category ${id} deleted by ${req.user.email}`);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});
module.exports = router;