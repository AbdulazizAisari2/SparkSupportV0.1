const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sparksupport-local-dev-secret-123');
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      return res.status(401).json({ error: 'Token expired' });
    }
    const tokenAge = currentTime - (decoded.iat || 0);
    if (tokenAge > 3600) { 
      return res.status(401).json({ error: 'Token too old' });
    }
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
const requireAdmin = requireRole(['admin']);
const requireStaffOrAdmin = requireRole(['staff', 'admin']);
module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireStaffOrAdmin
};