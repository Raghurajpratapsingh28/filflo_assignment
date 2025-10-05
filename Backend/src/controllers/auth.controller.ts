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
  role?: 'manager' | 'employee';
}

export interface CreateEmployeeRequest {
  username: string;
  password: string;
  email?: string;
}

export interface UpdateEmployeeRequest {
  username?: string;
  password?: string;
  email?: string;
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
    role: role || 'employee'
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
if(user.role != "manager"){
  throw new CustomError('You are not authorized to update the role', 403);
}

  // Update user
  await user.update({
    email: email || user.email,
    role: role || user.role,
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
  body('role').optional().isIn(['manager', 'employee']).withMessage('Invalid role')
];

export const updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role').optional().isIn(['manager', 'employee']).withMessage('Invalid role')
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

/**
 * Create new employee (Manager only)
 * POST /api/employees
 */
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const currentUser = (req as any).user;
  if (!currentUser || currentUser.role !== 'manager') {
    throw new CustomError('Only managers can create employees', 403);
  }

  const { username, password, email }: CreateEmployeeRequest = req.body;

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

  // Create employee
  const employee = await User.create({
    username,
    hashed_password: hashedPassword,
    email,
    role: 'employee'
  });

  logger.info(`Manager ${currentUser.username} created employee: ${username}`);

  res.status(201).json({
    message: 'Employee created successfully',
    employee: {
      id: employee.id,
      username: employee.username,
      email: employee.email,
      role: employee.role,
      created_at: employee.created_at
    }
  });
});

/**
 * Get all employees (Manager only)
 * GET /api/employees
 */
export const getEmployees = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  if (!currentUser || currentUser.role !== 'manager') {
    throw new CustomError('Only managers can view employees', 403);
  }

  const employees = await User.findAll({
    where: { role: 'employee' },
    attributes: { exclude: ['hashed_password'] },
    order: [['created_at', 'DESC']]
  });

  res.json({
    employees: employees.map(emp => ({
      id: emp.id,
      username: emp.username,
      email: emp.email,
      role: emp.role,
      created_at: emp.created_at,
      updated_at: emp.updated_at
    }))
  });
});

/**
 * Update employee (Manager only)
 * PUT /api/employees/:id
 */
export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const currentUser = (req as any).user;
  if (!currentUser || currentUser.role !== 'manager') {
    throw new CustomError('Only managers can update employees', 403);
  }

  const employeeId = parseInt(req.params.id);
  const { username, password, email }: UpdateEmployeeRequest = req.body;

  const employee = await User.findByPk(employeeId);
  if (!employee) {
    throw new CustomError('Employee not found', 404);
  }

  if (employee.role !== 'employee') {
    throw new CustomError('Can only update employee accounts', 400);
  }

  // Check if username already exists (if provided and different)
  if (username && username !== employee.username) {
    const existingUser = await User.findOne({ 
      where: { username } 
    });
    if (existingUser) {
      throw new CustomError('Username already exists', 400);
    }
  }

  // Check if email already exists (if provided and different)
  if (email && email !== employee.email) {
    const existingEmail = await User.findOne({ 
      where: { email } 
    });
    if (existingEmail) {
      throw new CustomError('Email already exists', 400);
    }
  }

  // Prepare update data
  const updateData: any = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) {
    updateData.hashed_password = await hashPassword(password);
  }

  // Update employee
  await employee.update(updateData);

  logger.info(`Manager ${currentUser.username} updated employee: ${employee.username}`);

  res.json({
    message: 'Employee updated successfully',
    employee: {
      id: employee.id,
      username: employee.username,
      email: employee.email,
      role: employee.role,
      updated_at: employee.updated_at
    }
  });
});

/**
 * Delete employee (Manager only)
 * DELETE /api/employees/:id
 */
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  if (!currentUser || currentUser.role !== 'manager') {
    throw new CustomError('Only managers can delete employees', 403);
  }

  const employeeId = parseInt(req.params.id);
  const employee = await User.findByPk(employeeId);
  
  if (!employee) {
    throw new CustomError('Employee not found', 404);
  }

  if (employee.role !== 'employee') {
    throw new CustomError('Can only delete employee accounts', 400);
  }

  await employee.destroy();

  logger.info(`Manager ${currentUser.username} deleted employee: ${employee.username}`);

  res.json({
    message: 'Employee deleted successfully'
  });
});

// Validation rules for employee management
export const createEmployeeValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format')
];

export const updateEmployeeValidation = [
  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format')
];
