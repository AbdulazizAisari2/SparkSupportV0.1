const rateLimit = require('express-rate-limit');

const isProd = process.env.NODE_ENV === 'production';

// Login-specific rate limiter - only applied in production
const loginLimiter = isProd ? rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." },
}) : null;

module.exports = { loginLimiter };