import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import sequelize from './config/db';
import logger from './config/logger';
import apiRoutes from './routes/api.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { setupAssociations } from './models';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create necessary directories
const createDirectories = () => {
  const dirs = ['./logs', './uploads', './dist'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Serve static files (if needed for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    createDirectories();
    
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Setup model associations
    setupAssociations();
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database synchronized');
    
    // Create default admin user if it doesn't exist
    await createDefaultAdmin();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API available at: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Create default admin users
const createDefaultAdmin = async () => {
  try {
    const { User } = await import('./models/user.model');
    const { hashPassword } = await import('./middleware/auth.middleware');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const adminHashedPassword = await hashPassword('admin123');
      await User.create({
        username: 'admin',
        hashed_password: adminHashedPassword,
        email: 'admin@inventory.com',
        role: 'admin'
      });
      logger.info('Default admin user created (username: admin, password: admin123)');
    }

    // Check if manager user exists
    const managerExists = await User.findOne({ where: { username: 'manager' } });
    if (!managerExists) {
      const managerHashedPassword = await hashPassword('raghuraj');
      await User.create({
        username: 'manager',
        hashed_password: managerHashedPassword,
        email: 'manager@inventory.com',
        role: 'admin'
      });
      logger.info('Manager user created (username: manager, password: raghuraj)');
    }
  } catch (error) {
    logger.error('Error creating default users:', error);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app;
