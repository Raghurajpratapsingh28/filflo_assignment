import { Router } from 'express';
import {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  changePasswordValidation
} from '../controllers/auth.controller';
import {
  uploadCSV,
  getInventory,
  getUniqueParts,
  getDashboardKPIs,
  getInventorySummary,
  generateReceipt,
  healthCheck,
  receiptValidation
} from '../controllers/inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';
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

// Inventory routes
router.post('/upload-csv', upload.single('file'), handleMulterError, cleanupUploads, uploadCSV);
router.get('/inventory', getInventory);
router.get('/unique-parts', getUniqueParts);
router.get('/dashboard-kpis', getDashboardKPIs);
router.get('/inventory-summary', getInventorySummary);
router.post('/receipt', receiptValidation, generateReceipt);

export default router;
