const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStaffOrAdmin } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();
const purchaseSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  itemName: z.string().min(1, 'Item name is required'),
  pointsCost: z.number().min(1, 'Points cost must be positive'),
  category: z.string().optional(),
  vendor: z.string().optional()
});
const marketplaceItems = {
  '1': { id: '1', name: 'Apple AirPods Pro (2nd Gen)', points: 2500, category: 'Audio', vendor: 'Apple' },
  '2': { id: '2', name: 'iPhone 15 Pro', points: 12000, category: 'Smartphones', vendor: 'Apple' },
  '3': { id: '3', name: 'Sony PlayStation 5', points: 5500, category: 'Gaming', vendor: 'Sony' },
  '4': { id: '4', name: 'MacBook Air M3', points: 15000, category: 'Laptops', vendor: 'Apple' },
  '5': { id: '5', name: 'Samsung Galaxy Watch 6', points: 3200, category: 'Wearables', vendor: 'Samsung' },
  '6': { id: '6', name: 'Nintendo Switch OLED', points: 3800, category: 'Gaming', vendor: 'Nintendo' },
  '7': { id: '7', name: 'iPad Pro 12.9"', points: 11000, category: 'Tablets', vendor: 'Apple' },
  '8': { id: '8', name: 'Bose QuietComfort Headphones', points: 3500, category: 'Audio', vendor: 'Bose' }
};
router.post('/purchase', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const user = req.user;
    const validatedData = purchaseSchema.parse(req.body);
    console.log(`🛍️ Purchase attempt by ${user.email} for item ${validatedData.itemId}`);
    const item = marketplaceItems[validatedData.itemId];
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (item.points !== validatedData.pointsCost) {
      return res.status(400).json({ error: 'Item price mismatch' });
    }
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true, level: true, name: true, email: true }
    });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (currentUser.points < validatedData.pointsCost) {
      return res.status(400).json({ 
        error: 'Insufficient points',
        required: validatedData.pointsCost,
        available: currentUser.points,
        shortfall: validatedData.pointsCost - currentUser.points
      });
    }
    const newPoints = currentUser.points - validatedData.pointsCost;
    const newLevel = Math.max(1, Math.floor(newPoints / 500) + 1);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: newPoints,
        level: newLevel,
        lastActiveDate: new Date()
      },
      select: { points: true, level: true, name: true, email: true }
    });
    const purchaseRecord = {
      id: `PUR_${Date.now()}_${user.id}`,
      userId: user.id,
      itemId: validatedData.itemId,
      itemName: validatedData.itemName,
      pointsCost: validatedData.pointsCost,
      category: validatedData.category,
      vendor: validatedData.vendor,
      purchasedAt: new Date(),
      status: 'completed'
    };
    console.log(`✅ Purchase successful: ${validatedData.itemName} for ${validatedData.pointsCost} points`);
    console.log(`💰 Points: ${currentUser.points} → ${newPoints} (${validatedData.pointsCost} deducted)`);
    console.log(`⭐ Level: ${currentUser.level} → ${newLevel}`);
    res.json({
      success: true,
      message: `Successfully purchased ${validatedData.itemName}`,
      purchase: purchaseRecord,
      user: {
        points: updatedUser.points,
        level: updatedUser.level,
        pointsDeducted: validatedData.pointsCost,
        remainingPoints: newPoints
      }
    });
  } catch (error) {
    console.error('❌ Purchase failed:', error);
    next(error);
  }
});
router.get('/items', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === 'customer') {
      return res.status(403).json({ error: 'Marketplace access restricted to staff and admin' });
    }
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true, level: true }
    });
    const items = Object.values(marketplaceItems).map(item => ({
      ...item,
      canAfford: currentUser ? currentUser.points >= item.points : false,
      inStock: true 
    }));
    res.json({
      items,
      userPoints: currentUser ? currentUser.points : 0,
      userLevel: currentUser ? currentUser.level : 1
    });
  } catch (error) {
    console.error('❌ Failed to fetch marketplace items:', error);
    next(error);
  }
});
router.get('/purchases', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === 'customer') {
      return res.status(403).json({ error: 'Marketplace access restricted to staff and admin' });
    }
    res.json({
      purchases: [],
      message: 'Purchase history feature coming soon'
    });
  } catch (error) {
    console.error('❌ Failed to fetch purchase history:', error);
    next(error);
  }
});
module.exports = router;