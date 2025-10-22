require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import database
const { sequelize, testConnection, syncDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// ===========================
// MIDDLEWARE
// ===========================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// ===========================
// ROUTES
// ===========================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'MySQL',
    version: process.env.API_VERSION || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Invoice API - Libyan Telecom Company',
    version: process.env.API_VERSION || '1.0.0',
    database: 'MySQL with Sequelize',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password'
      }
    },
    documentation: 'See README_DAY3.md for detailed documentation'
  });
});

// ===========================
// ERROR HANDLING
// ===========================

// 404 handler (route not found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint not found: ${req.method} ${req.url}`,
      availableEndpoints: [
        'GET /',
        'GET /health',
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/profile',
        'PUT /api/auth/profile',
        'PUT /api/auth/change-password'
      ]
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: err.errors.map(error => ({
          field: error.path,
          message: error.message
        }))
      }
    });
  }
  
  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Duplicate entry',
        field: err.errors[0]?.path
      }
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ===========================
// DATABASE & SERVER START
// ===========================

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ FATAL ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env file with all required variables.');
  console.error('See .env.example for reference.');
  process.exit(1);
}

// Connect to MySQL and start server
const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    
    // Sync database (create tables if they don't exist)
    await syncDatabase(false); // Set to true to force recreate tables
    console.log('📊 Database: ' + process.env.DB_NAME);
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ==========================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 ==========================================`);
      console.log('');
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: MySQL (${process.env.DB_HOST}:${process.env.DB_PORT})`);
      console.log(`🔗 Local URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('');
      console.log('📚 Available endpoints:');
      console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
      console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
      console.log(`   GET    http://localhost:${PORT}/api/auth/profile`);
      console.log(`   PUT    http://localhost:${PORT}/api/auth/profile`);
      console.log(`   PUT    http://localhost:${PORT}/api/auth/change-password`);
      console.log('');
      console.log('🎓 Day 3: API Authentication & Security (MySQL Version)');
      console.log('');
      console.log('Press Ctrl+C to stop the server');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('');
    console.error('Make sure MySQL is running:');
    console.error('  Check phpMyAdmin at: http://localhost/phpmyadmin');
    console.error('  Verify database exists: ' + process.env.DB_NAME);
    console.error('  Check credentials in .env file');
    console.error('');
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  console.error('Shutting down server...');
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  console.log('✅ MySQL connection closed');
  process.exit(0);
});
