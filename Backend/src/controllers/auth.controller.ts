import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user.model';
import { generateToken, hashPassword, comparePassword } from '../middleware/auth.middleware';
import { asyncHandler, CustomError } from '../middleware/error.middleware';
import logger from '../config/logger';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  role?: string;
}

/**
 * Login user
 * POST /api/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { username, password }: LoginRequest = req.body;

  // Find user by username
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new CustomError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.hashed_password);
  if (!isPasswordValid) {
    throw new CustomError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  logger.info(`User ${username} logged in successfully`);

  const response: LoginResponse = {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };

  res.json(response);
});

/**
 * Register new user
 * POST /api/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { username, password, email, role }: RegisterRequest = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    where: { username } 
  });
  if (existingUser) {
    throw new CustomError('Username already exists', 400);
  }

  // Check if email already exists (if provided)
  if (email) {
    const existingEmail = await User.findOne({ 
      where: { email } 
    });
    if (existingEmail) {
      throw new CustomError('Email already exists', 400);
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    username,
    hashed_password: hashedPassword,
    email,
    role: role || 'user'
  });

  logger.info(`New user registered: ${username}`);

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Get current user profile
 * GET /api/profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('User not authenticated', 401);
  }

  const user = await User.findByPk(userId, {
    attributes: { exclude: ['hashed_password'] }
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }
  });
});

/**
 * Update user profile
 * PUT /api/profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('User not authenticated', 401);
  }

  const { email, role } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Check if email already exists (if provided and different)
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ 
      where: { email } 
    });
    if (existingEmail) {
      throw new CustomError('Email already exists', 400);
    }
  }

  // Update user
  await user.update({
    email: email || user.email,
    role: role || user.role
  });

  logger.info(`User ${user.username} updated profile`);

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Change password
 * PUT /api/change-password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('User not authenticated', 401);
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.hashed_password);
  if (!isCurrentPasswordValid) {
    throw new CustomError('Current password is incorrect', 400);
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  await user.update({
    hashed_password: hashedNewPassword
  });

  logger.info(`User ${user.username} changed password`);

  res.json({
    message: 'Password changed successfully'
  });
});

// Validation rules
export const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const registerValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
];

export const updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];
