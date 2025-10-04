import { Router } from 'express';
import {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  changePasswordValidation,
  createEmployeeValidation,
  updateEmployeeValidation
} from '../controllers/auth.controller';
import {
  uploadCSV,
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getUniqueParts,
  getDashboardKPIs,
  getInventorySummary,
  generateReceipt,
  healthCheck,
  receiptValidation,
  inventoryValidation,
  inventoryUpdateValidation
} from '../controllers/inventory.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { upload, handleMulterError, cleanupUploads } from '../middleware/upload.middleware';

const router = Router();

// Health check (public)
router.get('/health', healthCheck);

// Authentication routes (public)
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

// Protected routes
router.use(authenticateToken);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', changePasswordValidation, changePassword);

// Employee management routes (Manager only)
router.post('/employees', authorizeRoles('manager'), createEmployeeValidation, createEmployee);
router.get('/employees', authorizeRoles('manager'), getEmployees);
router.put('/employees/:id', authorizeRoles('manager'), updateEmployeeValidation, updateEmployee);
router.delete('/employees/:id', authorizeRoles('manager'), deleteEmployee);

// Inventory routes
router.post('/upload-csv', upload.single('file'), handleMulterError, cleanupUploads, uploadCSV);
router.get('/inventory', getInventory);
router.get('/inventory/:id', getInventoryItem);
router.post('/inventory', inventoryValidation, createInventoryItem);
router.put('/inventory/:id', inventoryUpdateValidation, updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);
router.get('/unique-parts', getUniqueParts);
router.get('/dashboard-kpis', getDashboardKPIs);
router.get('/inventory-summary', getInventorySummary);
router.post('/receipt', receiptValidation, generateReceipt);

export default router;
