import { parse, format, differenceInDays } from 'date-fns';

export interface DateCalculationResult {
  ageingDays: number;
  daysToExpiry: number;
  ageingBucket: '0-30' | '30-60' | '60+';
  expiryRisk: 'high' | 'medium' | 'low';
}

/**
 * Parse date string in DD-MM-YYYY or YYYY-MM-DD format to Date object
 * @param dateString - Date string in DD-MM-YYYY or YYYY-MM-DD format
 * @returns Date object
 */
export const parseDateString = (dateString: string): Date => {
  // Try DD-MM-YYYY format first
  let parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  
  // If that fails, try YYYY-MM-DD format
  if (isNaN(parsedDate.getTime())) {
    parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
  }
  
  // If both fail, throw error
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${dateString}. Expected format: DD-MM-YYYY or YYYY-MM-DD`);
  }
  
  return parsedDate;
};

/**
 * Calculate ageing days from manufacturing date to current date
 * @param mfgDate - Manufacturing date
 * @param currentDate - Current date (defaults to now)
 * @returns Number of ageing days
 */
export const calculateAgeingDays = (mfgDate: Date, currentDate: Date = new Date()): number => {
  return Math.floor(differenceInDays(currentDate, mfgDate));
};

/**
 * Calculate days to expiry from current date to expiry date
 * @param expDate - Expiry date
 * @param currentDate - Current date (defaults to now)
 * @returns Number of days to expiry (negative if expired)
 */
export const calculateDaysToExpiry = (expDate: Date, currentDate: Date = new Date()): number => {
  return Math.floor(differenceInDays(expDate, currentDate));
};

/**
 * Get ageing bucket based on ageing days
 * @param ageingDays - Number of ageing days
 * @returns Ageing bucket category
 */
export const getAgeingBucket = (ageingDays: number): '0-30' | '30-60' | '60+' => {
  if (ageingDays <= 30) return '0-30';
  if (ageingDays <= 60) return '30-60';
  return '60+';
};

/**
 * Get expiry risk based on days to expiry
 * @param daysToExpiry - Number of days to expiry
 * @returns Expiry risk category
 */
export const getExpiryRisk = (daysToExpiry: number): 'high' | 'medium' | 'low' => {
  if (daysToExpiry < 30) return 'high';
  if (daysToExpiry <= 90) return 'medium';
  return 'low';
};

/**
 * Calculate all date-related metrics for inventory item
 * @param mfgDate - Manufacturing date
 * @param expDate - Expiry date
 * @param currentDate - Current date (defaults to now)
 * @returns Complete date calculation result
 */
export const calculateInventoryMetrics = (
  mfgDate: Date,
  expDate: Date,
  currentDate: Date = new Date()
): DateCalculationResult => {
  const ageingDays = calculateAgeingDays(mfgDate, currentDate);
  const daysToExpiry = calculateDaysToExpiry(expDate, currentDate);
  const ageingBucket = getAgeingBucket(ageingDays);
  const expiryRisk = getExpiryRisk(daysToExpiry);

  return {
    ageingDays,
    daysToExpiry,
    ageingBucket,
    expiryRisk
  };
};

/**
 * Format date for display
 * @param date - Date object
 * @param formatString - Format string (defaults to 'dd-MM-yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: Date, formatString: string = 'dd-MM-yyyy'): string => {
  return format(date, formatString);
};

/**
 * Get current date for testing (hardcoded to 2025-10-04 for unit tests)
 * @param useTestDate - Whether to use test date
 * @returns Current date or test date
 */
export const getCurrentDate = (useTestDate: boolean = false): Date => {
  if (useTestDate) {
    return new Date('2025-10-04');
  }
  return new Date();
};

/**
 * Validate date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns True if valid range
 */
export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

/**
 * Get date range for filtering
 * @param startDateString - Start date string (optional)
 * @param endDateString - End date string (optional)
 * @returns Date range object or null
 */
export const getDateRange = (startDateString?: string, endDateString?: string): { start: Date; end: Date } | null => {
  if (!startDateString || !endDateString) return null;
  
  const start = parseDateString(startDateString);
  const end = parseDateString(endDateString);
  
  if (!isValidDateRange(start, end)) {
    throw new Error('Invalid date range: start date must be before or equal to end date');
  }
  
  return { start, end };
};
