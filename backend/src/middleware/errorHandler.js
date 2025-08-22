// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({ 
      error: 'Duplicate entry - this record already exists' 
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ 
      error: 'Record not found' 
    });
  }

  // Validation errors (Zod)
  if (err.name === 'ZodError') {
    return res.status(400).json({ 
      error: 'Validation error',
      details: err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };