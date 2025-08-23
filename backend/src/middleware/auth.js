const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token with stricter validation
    const decoded = jwt.verify(token, 'sparksupport-local-dev-secret-123');
    
    // Check if token is expired (additional check)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    // Check token age (max 1 hour)
    const tokenAge = currentTime - (decoded.iat || 0);
    if (tokenAge > 3600) { // 1 hour = 3600 seconds
      return res.status(401).json({ error: 'Token too old' });
    }
    
    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Admin only middleware
const requireAdmin = requireRole(['admin']);

// Staff or Admin middleware
const requireStaffOrAdmin = requireRole(['staff', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireStaffOrAdmin
};