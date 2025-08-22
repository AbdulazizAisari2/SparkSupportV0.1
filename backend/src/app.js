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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

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