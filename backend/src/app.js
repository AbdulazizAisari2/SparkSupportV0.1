require('dotenv').config({ path: '.env' });
console.log('🔧 Environment variables loaded from .env');
console.log('🔑 JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('🔑 JWT_SECRET value length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
console.log('🗄️ DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const emailRoutes = require('./routes/email');
const leaderboardRoutes = require('./routes/leaderboard');
const slackRoutes = require('./routes/slack');
const chatRoutes = require('./routes/chat');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || `${60 * 60 * 1000}`, 10); // default 1 hour
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '1000', 10); // default 1000 requests per window

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip limiting certain safe endpoints
  skip: (req) => {
    const path = req.path || '';
    // Allow health checks and static assets without rate limits
    if (path.startsWith('/health') || path.startsWith('/uploads')) {
      return true;
    }
    return false;
  },
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/slack', slackRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SparkSupport Backend running on http://localhost:${PORT}`);
  console.log(`📊 Database Studio: npx prisma studio`);
  console.log(`🔥 Ready for frontend connections!`);
});

module.exports = app;