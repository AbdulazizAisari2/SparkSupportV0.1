const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStaffOrAdmin } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();
const timeframeSchema = z.enum(['week', 'month', 'quarter', 'year']).optional();
const metricSchema = z.enum(['points', 'resolved', 'satisfaction', 'growth']).optional();
router.get('/', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const { timeframe = 'month', metric = 'points', limit = 50 } = req.query;
    console.log(`📊 Fetching leaderboard: timeframe=${timeframe}, metric=${metric}`);
    const staffUsers = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'staff' },
          { role: 'admin' }
        ]
      },
      include: {
        achievements: {
          include: {
            achievement: true
          },
          orderBy: {
            unlockedAt: 'desc'
          }
        }
      },
      orderBy: {
        points: 'desc'
      }
    });
    console.log(`👥 Found ${staffUsers.length} staff members`);
    const leaderboardData = staffUsers.map(user => ({
      userId: user.id,
      name: user.name,
      department: user.department || 'General',
      ticketsResolved: user.ticketsResolved,
      averageResolutionTime: user.averageResolutionTimeHours || 0,
      customerSatisfaction: user.customerSatisfactionRating || 4.0,
      points: user.points,
      achievements: user.achievements.map(ua => ({
        id: ua.achievement.name.toLowerCase().replace(/\s+/g, '-'),
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        color: ua.achievement.color,
        unlockedAt: ua.unlockedAt
      })),
      streak: user.currentStreak,
      level: user.level,
      totalTicketsHandled: user.totalTicketsHandled,
      responseTime: user.averageResponseTimeMinutes || 0,
      monthlyGrowth: user.monthlyGrowth,
      specialRecognition: user.specialRecognition
    }));
    const sortedData = [...leaderboardData].sort((a, b) => {
      switch (metric) {
        case 'points':
          return b.points - a.points;
        case 'resolved':
          return b.ticketsResolved - a.ticketsResolved;
        case 'satisfaction':
          return b.customerSatisfaction - a.customerSatisfaction;
        case 'growth':
          return b.monthlyGrowth - a.monthlyGrowth;
        default:
          return b.points - a.points;
      }
    });
    const topPerformer = sortedData.find(user => user.specialRecognition === 'Staff of the Month');
    res.json({
      leaderboard: sortedData.slice(0, parseInt(limit)),
      topPerformer,
      timeframe,
      metric,
      totalStaff: staffUsers.length
    });
  } catch (error) {
    next(error);
  }
});
router.get('/achievements', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { pointsReward: 'desc' }
    });
    console.log(`🏆 Retrieved ${achievements.length} active achievements`);
    res.json({ achievements });
  } catch (error) {
    next(error);
  }
});
router.get('/user/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.role === 'customer' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: {
            achievement: true
          },
          orderBy: { unlockedAt: 'desc' }
        }
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const staffCount = await prisma.user.count({
      where: {
        OR: [{ role: 'staff' }, { role: 'admin' }],
        points: { gt: user.points }
      }
    });
    const rank = staffCount + 1;
    const userStats = {
      userId: user.id,
      name: user.name,
      department: user.department,
      role: user.role,
      points: user.points,
      level: user.level,
      rank,
      ticketsResolved: user.ticketsResolved,
      averageResolutionTime: user.averageResolutionTimeHours,
      customerSatisfaction: user.customerSatisfactionRating,
      currentStreak: user.currentStreak,
      totalTicketsHandled: user.totalTicketsHandled,
      responseTime: user.averageResponseTimeMinutes,
      monthlyGrowth: user.monthlyGrowth,
      specialRecognition: user.specialRecognition,
      achievements: user.achievements.map(ua => ({
        id: ua.achievement.name.toLowerCase().replace(/\s+/g, '-'),
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        color: ua.achievement.color,
        pointsReward: ua.achievement.pointsReward,
        unlockedAt: ua.unlockedAt
      }))
    };
    console.log(`📊 Retrieved stats for user: ${user.name} (Rank: ${rank})`);
    res.json({ user: userStats });
  } catch (error) {
    next(error);
  }
});
router.post('/award-points', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { userId, points, reason } = req.body;
    if (!userId || !points || points <= 0) {
      return res.status(400).json({ error: 'Valid userId and positive points required' });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: points },
        level: { increment: Math.floor(points / 500) }
      }
    });
    console.log(`🎯 Awarded ${points} points to ${user.name}. Reason: ${reason || 'Manual award'}`);
    res.json({
      message: 'Points awarded successfully',
      user: {
        id: user.id,
        name: user.name,
        points: user.points,
        level: user.level
      },
      awarded: points,
      reason
    });
  } catch (error) {
    next(error);
  }
});
router.get('/challenges', authenticateToken, requireStaffOrAdmin, async (req, res, next) => {
  try {
    const challenges = [
      {
        id: 'weekly-sprint',
        name: 'Weekly Sprint',
        description: 'Resolve 50 tickets as a team this week',
        type: 'team',
        icon: 'target',
        color: 'blue',
        progress: 38,
        target: 50,
        timeLeft: '2 days',
        status: 'active'
      },
      {
        id: 'satisfaction-goal',
        name: 'Satisfaction Goal',
        description: 'Maintain 4.5+ average rating this month',
        type: 'team',
        icon: 'star',
        color: 'green',
        progress: 4.6,
        target: 4.5,
        timeLeft: 'On track!',
        status: 'completed'
      },
      {
        id: 'speed-challenge',
        name: 'Speed Challenge',
        description: 'Average resolution under 3 hours',
        type: 'team',
        icon: 'zap',
        color: 'purple',
        progress: 3.2,
        target: 3.0,
        timeLeft: '⚡ Almost there!',
        status: 'active'
      }
    ];
    console.log(`🎯 Retrieved ${challenges.length} active challenges`);
    res.json({ challenges });
  } catch (error) {
    next(error);
  }
});
module.exports = router;