const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStaffOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for purchase
const purchaseSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  itemName: z.string().min(1, 'Item name is required'),
  pointsCost: z.number().min(1, 'Points cost must be positive'),
  category: z.string().optional(),
  vendor: z.string().optional()
});

// Mock marketplace items (in production, this would be in the database)
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

// POST /api/marketplace/purchase - Purchase an item with points
router.post('/purchase', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const user = req.user;
    const validatedData = purchaseSchema.parse(req.body);

    console.log(`🛍️ Purchase attempt by ${user.email} for item ${validatedData.itemId}`);

    // Verify item exists
    const item = marketplaceItems[validatedData.itemId];
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Verify item details match (security check)
    if (item.points !== validatedData.pointsCost) {
      return res.status(400).json({ error: 'Item price mismatch' });
    }

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true, level: true, name: true, email: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has enough points
    if (currentUser.points < validatedData.pointsCost) {
      return res.status(400).json({ 
        error: 'Insufficient points',
        required: validatedData.pointsCost,
        available: currentUser.points,
        shortfall: validatedData.pointsCost - currentUser.points
      });
    }

    // Calculate new points and level
    const newPoints = currentUser.points - validatedData.pointsCost;
    const newLevel = Math.max(1, Math.floor(newPoints / 500) + 1);

    // Process the purchase
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: newPoints,
        level: newLevel,
        lastActiveDate: new Date()
      },
      select: { points: true, level: true, name: true, email: true }
    });

    // Create purchase record (you might want to add a Purchase model to track this)
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

    // In production, you might want to:
    // 1. Send email confirmation
    // 2. Add to purchase history
    // 3. Trigger fulfillment process
    // 4. Send Slack notification

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

// GET /api/marketplace/items - Get available marketplace items
router.get('/items', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;

    // Only staff and admin can access marketplace
    if (user.role === 'customer') {
      return res.status(403).json({ error: 'Marketplace access restricted to staff and admin' });
    }

    // Get user's current points
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true, level: true }
    });

    const items = Object.values(marketplaceItems).map(item => ({
      ...item,
      canAfford: currentUser ? currentUser.points >= item.points : false,
      inStock: true // In production, this would be dynamic
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

// GET /api/marketplace/purchases - Get user's purchase history
router.get('/purchases', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;

    // Only staff and admin can access marketplace
    if (user.role === 'customer') {
      return res.status(403).json({ error: 'Marketplace access restricted to staff and admin' });
    }

    // In production, you would query actual purchase records from database
    // For now, return empty array as this is just demo functionality
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