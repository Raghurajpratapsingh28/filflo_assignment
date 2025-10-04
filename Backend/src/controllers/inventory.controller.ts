import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Inventory } from '../models/inventory.model';
import { parseDateString, calculateInventoryMetrics, getDateRange } from '../utils/dateUtils';
import { generateReceiptPDF, generateReceiptNumber, calculateReceiptTotals, ReceiptItem, CustomerInfo } from '../utils/pdfGenerator';
import { asyncHandler, CustomError } from '../middleware/error.middleware';
import logger from '../config/logger';
import csv from 'csv-parser';
import fs from 'fs';

export interface InventoryFilters {
  jwl_part?: string;
  customer_part?: string;
  mfg_start?: string;
  mfg_end?: string;
  exp_start?: string;
  exp_end?: string;
  search?: string;
  batch?: string;
  page?: number;
  limit?: number;
}

export interface InventoryResponse {
  data: Inventory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardKPIs {
  total_stock: number;
  percent_near_expiry: number;
  average_ageing: number;
  total_items: number;
  ageing_buckets: {
    '0-30': number;
    '30-60': number;
    '60+': number;
  };
  expiry_risk: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface InventorySummary {
  jwl_part: string;
  description: string;
  available_qty: number;
}

export interface ReceiptRequest {
  customer: CustomerInfo;
  items: { jwl_part: string; qty: number }[];
  tax_rate?: number;
}

/**
 * Upload CSV file and process inventory data
 * POST /api/upload-csv
 */
export const uploadCSV = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new CustomError('No file uploaded', 400);
  }

  const filePath = req.file.path;
  const inventoryData: any[] = [];

  // Parse CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Parse dates and validate data
          const mfgDate = parseDateString(row['MFG Date']);
          const expDate = parseDateString(row['EXP Date']);
          
          const inventoryItem = {
            jwl_part: row['JWL Part'],
            customer_part: row['Customer Part'],
            description: row['Description'],
            uom: row['UOM'],
            batch: row['Batch'],
            mfg_date: mfgDate,
            exp_date: expDate,
            qty: parseInt(row['QTY']),
            weight: parseFloat(row['Weight (Kg)']),
            ageing_days: calculateInventoryMetrics(mfgDate, expDate).ageingDays,
            days_to_expiry: calculateInventoryMetrics(mfgDate, expDate).daysToExpiry
          };

          inventoryData.push(inventoryItem);
        } catch (error) {
          logger.error(`Error parsing CSV row: ${error}`);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (inventoryData.length === 0) {
    throw new CustomError('No valid data found in CSV file', 400);
  }

  // Bulk upsert inventory data
  let insertedCount = 0;
  for (const item of inventoryData) {
    try {
      await Inventory.upsert(item, {
        conflictFields: ['batch', 'jwl_part']
      });
      insertedCount++;
    } catch (error) {
      logger.error(`Error upserting inventory item: ${error}`);
    }
  }

  logger.info(`CSV upload completed. Processed ${insertedCount} items`);

  res.json({
    message: 'CSV file processed successfully',
    insertedCount,
    totalRows: inventoryData.length
  });
});

/**
 * Get inventory with filters and pagination
 * GET /api/inventory
 */
export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const {
    jwl_part,
    customer_part,
    mfg_start,
    mfg_end,
    exp_start,
    exp_end,
    search,
    batch,
    page = 1,
    limit = 50
  }: InventoryFilters = req.query as any;

  const offset = (Number(page) - 1) * Number(limit);
  const whereClause: any = {};

  // Apply filters
  if (jwl_part) {
    whereClause.jwl_part = { [Op.iLike]: `%${jwl_part}%` };
  }

  if (customer_part) {
    whereClause.customer_part = { [Op.iLike]: `%${customer_part}%` };
  }

  if (batch) {
    whereClause.batch = { [Op.iLike]: `%${batch}%` };
  }

  if (mfg_start && mfg_end) {
    try {
      const mfgRange = getDateRange(mfg_start, mfg_end);
      if (mfgRange) {
        whereClause.mfg_date = { [Op.between]: [mfgRange.start, mfgRange.end] };
      }
    } catch (error) {
      throw new CustomError('Invalid manufacturing date range', 400);
    }
  }

  if (exp_start && exp_end) {
    try {
      const expRange = getDateRange(exp_start, exp_end);
      if (expRange) {
        whereClause.exp_date = { [Op.between]: [expRange.start, expRange.end] };
      }
    } catch (error) {
      throw new CustomError('Invalid expiry date range', 400);
    }
  }

  if (search) {
    whereClause[Op.or] = [
      { description: { [Op.iLike]: `%${search}%` } },
      { batch: { [Op.iLike]: `%${search}%` } },
      { jwl_part: { [Op.iLike]: `%${search}%` } },
      { customer_part: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Get total count
  const total = await Inventory.count({ where: whereClause });

  // Get paginated data
  const data = await Inventory.findAll({
    where: whereClause,
    limit: Number(limit),
    offset: offset,
    order: [['created_at', 'DESC']]
  });

  const response: InventoryResponse = {
    data,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit))
  };

  res.json(response);
});

/**
 * Get unique parts for dropdowns
 * GET /api/unique-parts
 */
export const getUniqueParts = asyncHandler(async (req: Request, res: Response) => {
  const jwlParts = await Inventory.findAll({
    attributes: ['jwl_part'],
    group: ['jwl_part'],
    order: [['jwl_part', 'ASC']]
  });

  const customerParts = await Inventory.findAll({
    attributes: ['customer_part'],
    group: ['customer_part'],
    order: [['customer_part', 'ASC']]
  });

  res.json({
    jwl_parts: jwlParts.map(item => item.jwl_part),
    customer_parts: customerParts.map(item => item.customer_part)
  });
});

/**
 * Get dashboard KPIs
 * GET /api/dashboard-kpis
 */
export const getDashboardKPIs = asyncHandler(async (req: Request, res: Response) => {
  const totalStock = await Inventory.sum('qty') || 0;
  const totalItems = await Inventory.count();

  // Calculate near expiry (less than 30 days)
  const nearExpiryCount = await Inventory.count({
    where: {
      days_to_expiry: { [Op.lt]: 30 }
    }
  });

  const percentNearExpiry = totalItems > 0 ? (nearExpiryCount / totalItems) * 100 : 0;

  // Calculate average ageing
  const averageAgeing = await Inventory.findOne({
    attributes: [
      [Inventory.sequelize!.fn('AVG', Inventory.sequelize!.col('ageing_days')), 'avg_ageing']
    ],
    raw: true
  }) as any;

  // Ageing buckets - simplified approach
  const ageingBuckets = await Inventory.findAll({
    attributes: [
      [Inventory.sequelize!.fn('COUNT', Inventory.sequelize!.col('id')), 'count']
    ],
    where: {
      ageing_days: { [Op.lte]: 30 }
    },
    raw: true
  });

  const ageingBuckets30_60 = await Inventory.findAll({
    attributes: [
      [Inventory.sequelize!.fn('COUNT', Inventory.sequelize!.col('id')), 'count']
    ],
    where: {
      ageing_days: { [Op.between]: [31, 60] }
    },
    raw: true
  });

  const ageingBuckets60Plus = await Inventory.findAll({
    attributes: [
      [Inventory.sequelize!.fn('COUNT', Inventory.sequelize!.col('id')), 'count']
    ],
    where: {
      ageing_days: { [Op.gt]: 60 }
    },
    raw: true
  });

  // Expiry risk buckets - simplified approach
  const expiryRiskHigh = await Inventory.findAll({
    attributes: [
      [Inventory.sequelize!.fn('COUNT', Inventory.sequelize!.col('id')), 'count']
    ],
    where: {
      days_to_expiry: { [Op.lt]: 30 }
    },
    raw: true
  });

  const expiryRiskMedium = await Inventory.findAll({
    attributes: [
      [Inventory.sequelize!.fn('COUNT', Inventory.sequelize!.col('id')), 'count']
    ],
    where: {
      days_to_expiry: { [Op.between]: [30, 90] }
    },
    raw: true
  });

  const expiryRiskLow = await Inventory.findAll({
    attributes: [
      [Inventory.sequelize!.fn('COUNT', Inventory.sequelize!.col('id')), 'count']
    ],
    where: {
      days_to_expiry: { [Op.gt]: 90 }
    },
    raw: true
  });

  const response: DashboardKPIs = {
    total_stock: totalStock,
    percent_near_expiry: Math.round(percentNearExpiry * 100) / 100,
    average_ageing: Math.round((averageAgeing?.avg_ageing || 0) * 100) / 100,
    total_items: totalItems,
    ageing_buckets: {
      '0-30': 0,
      '30-60': 0,
      '60+': 0
    },
    expiry_risk: {
      high: 0,
      medium: 0,
      low: 0
    }
  };

  // Process ageing buckets
  response.ageing_buckets['0-30'] = parseInt((ageingBuckets[0] as any)?.count || '0');
  response.ageing_buckets['30-60'] = parseInt((ageingBuckets30_60[0] as any)?.count || '0');
  response.ageing_buckets['60+'] = parseInt((ageingBuckets60Plus[0] as any)?.count || '0');

  // Process expiry risk
  response.expiry_risk.high = parseInt((expiryRiskHigh[0] as any)?.count || '0');
  response.expiry_risk.medium = parseInt((expiryRiskMedium[0] as any)?.count || '0');
  response.expiry_risk.low = parseInt((expiryRiskLow[0] as any)?.count || '0');

  res.json(response);
});

/**
 * Get inventory summary for receipt selection
 * GET /api/inventory-summary
 */
export const getInventorySummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await Inventory.findAll({
    attributes: [
      'jwl_part',
      'description',
      [Inventory.sequelize!.fn('SUM', Inventory.sequelize!.col('qty')), 'available_qty']
    ],
    group: ['jwl_part', 'description'],
    having: Inventory.sequelize!.where(Inventory.sequelize!.fn('SUM', Inventory.sequelize!.col('qty')), '>', 0),
    order: [['jwl_part', 'ASC']]
  });

  const response: InventorySummary[] = summary.map(item => ({
    jwl_part: item.jwl_part,
    description: item.description,
    available_qty: parseInt((item as any).available_qty)
  }));

  res.json(response);
});

/**
 * Generate receipt
 * POST /api/receipt
 */
export const generateReceipt = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { customer, items, tax_rate = 0 }: ReceiptRequest = req.body;

  // Validate items and check availability
  const receiptItems: ReceiptItem[] = [];
  
  for (const item of items) {
    const inventoryItems = await Inventory.findAll({
      where: { jwl_part: item.jwl_part },
      order: [['mfg_date', 'ASC']] // FIFO
    });

    const totalAvailable = inventoryItems.reduce((sum, inv) => sum + inv.qty, 0);
    
    if (totalAvailable < item.qty) {
      throw new CustomError(`Insufficient quantity for part ${item.jwl_part}. Available: ${totalAvailable}, Requested: ${item.qty}`, 400);
    }

    // Deduct quantities (simplified - in production, you'd want more sophisticated inventory management)
    let remainingQty = item.qty;
    for (const invItem of inventoryItems) {
      if (remainingQty <= 0) break;
      
      const deductQty = Math.min(remainingQty, invItem.qty);
      await invItem.update({ qty: invItem.qty - deductQty });
      remainingQty -= deductQty;
    }

    receiptItems.push({
      jwl_part: item.jwl_part,
      description: inventoryItems[0]?.description || '',
      qty: item.qty,
      unit_price: 0, // Placeholder for future price implementation
      total_price: 0
    });
  }

  // Calculate totals
  const totals = calculateReceiptTotals(receiptItems, tax_rate);

  // Generate receipt data
  const receiptData = {
    receipt_number: generateReceiptNumber(),
    date: new Date(),
    customer,
    items: receiptItems,
    subtotal: totals.subtotal,
    tax_rate,
    tax_amount: totals.tax_amount,
    grand_total: totals.grand_total,
    company_name: 'Inventory Management System',
    company_address: '123 Business St, City, State 12345'
  };

  // Generate PDF
  const pdfBase64 = await generateReceiptPDF(receiptData);

  logger.info(`Receipt generated: ${receiptData.receipt_number}`);

  res.json({
    receipt_number: receiptData.receipt_number,
    pdf_base64: pdfBase64,
    totals: totals
  });
});

/**
 * Health check endpoint
 * GET /api/health
 */
export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Validation rules
export const receiptValidation = [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.address').notEmpty().withMessage('Customer address is required'),
  body('customer.email').optional().isEmail().withMessage('Invalid email format'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.jwl_part').notEmpty().withMessage('Part number is required'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('tax_rate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100')
];
