import {
  parseDateString,
  calculateAgeingDays,
  calculateDaysToExpiry,
  getAgeingBucket,
  getExpiryRisk,
  calculateInventoryMetrics,
  getCurrentDate,
  isValidDateRange,
  getDateRange
} from '../utils/dateUtils';

describe('Date Utils', () => {
  describe('parseDateString', () => {
    it('should parse valid date string in DD-MM-YYYY format', () => {
      const date = parseDateString('15-03-2024');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(2); // March (0-indexed)
      expect(date.getDate()).toBe(15);
    });

    it('should throw error for invalid date format', () => {
      expect(() => parseDateString('2024-03-15')).toThrow('Invalid date format');
      expect(() => parseDateString('15/03/2024')).toThrow('Invalid date format');
    });
  });

  describe('calculateAgeingDays', () => {
    it('should calculate ageing days correctly', () => {
      const mfgDate = new Date('2024-01-01');
      const currentDate = new Date('2024-01-31');
      const ageingDays = calculateAgeingDays(mfgDate, currentDate);
      expect(ageingDays).toBe(30);
    });

    it('should use current date when not provided', () => {
      const mfgDate = new Date('2024-01-01');
      const ageingDays = calculateAgeingDays(mfgDate);
      expect(typeof ageingDays).toBe('number');
      expect(ageingDays).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateDaysToExpiry', () => {
    it('should calculate days to expiry correctly', () => {
      const expDate = new Date('2024-12-31');
      const currentDate = new Date('2024-12-01');
      const daysToExpiry = calculateDaysToExpiry(expDate, currentDate);
      expect(daysToExpiry).toBe(30);
    });

    it('should return negative value for expired items', () => {
      const expDate = new Date('2024-01-01');
      const currentDate = new Date('2024-01-31');
      const daysToExpiry = calculateDaysToExpiry(expDate, currentDate);
      expect(daysToExpiry).toBe(-30);
    });
  });

  describe('getAgeingBucket', () => {
    it('should return correct ageing bucket for 0-30 days', () => {
      expect(getAgeingBucket(15)).toBe('0-30');
      expect(getAgeingBucket(30)).toBe('0-30');
    });

    it('should return correct ageing bucket for 30-60 days', () => {
      expect(getAgeingBucket(45)).toBe('30-60');
      expect(getAgeingBucket(60)).toBe('30-60');
    });

    it('should return correct ageing bucket for 60+ days', () => {
      expect(getAgeingBucket(90)).toBe('60+');
      expect(getAgeingBucket(120)).toBe('60+');
    });
  });

  describe('getExpiryRisk', () => {
    it('should return high risk for <30 days', () => {
      expect(getExpiryRisk(15)).toBe('high');
      expect(getExpiryRisk(29)).toBe('high');
    });

    it('should return medium risk for 30-90 days', () => {
      expect(getExpiryRisk(30)).toBe('medium');
      expect(getExpiryRisk(60)).toBe('medium');
      expect(getExpiryRisk(90)).toBe('medium');
    });

    it('should return low risk for >90 days', () => {
      expect(getExpiryRisk(91)).toBe('low');
      expect(getExpiryRisk(120)).toBe('low');
    });
  });

  describe('calculateInventoryMetrics', () => {
    it('should calculate all metrics correctly', () => {
      const mfgDate = new Date('2024-01-01');
      const expDate = new Date('2024-12-31');
      const currentDate = new Date('2024-06-01');
      
      const metrics = calculateInventoryMetrics(mfgDate, expDate, currentDate);
      
      expect(metrics.ageingDays).toBe(152); // Jan 1 to Jun 1 (accounting for leap year)
      expect(metrics.daysToExpiry).toBe(213); // Jun 1 to Dec 31
      expect(metrics.ageingBucket).toBe('60+');
      expect(metrics.expiryRisk).toBe('low');
    });
  });

  describe('getCurrentDate', () => {
    it('should return test date when useTestDate is true', () => {
      const testDate = getCurrentDate(true);
      expect(testDate.getFullYear()).toBe(2025);
      expect(testDate.getMonth()).toBe(9); // October (0-indexed)
      expect(testDate.getDate()).toBe(4);
    });

    it('should return current date when useTestDate is false', () => {
      const currentDate = getCurrentDate(false);
      const now = new Date();
      expect(currentDate.getTime()).toBeCloseTo(now.getTime(), -2); // Within 100ms
    });
  });

  describe('isValidDateRange', () => {
    it('should return true for valid date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      expect(isValidDateRange(startDate, endDate)).toBe(true);
    });

    it('should return true for same start and end date', () => {
      const date = new Date('2024-06-01');
      expect(isValidDateRange(date, date)).toBe(true);
    });

    it('should return false for invalid date range', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');
      expect(isValidDateRange(startDate, endDate)).toBe(false);
    });
  });

  describe('getDateRange', () => {
    it('should return date range for valid inputs', () => {
      const range = getDateRange('01-01-2024', '31-12-2024');
      expect(range).not.toBeNull();
      expect(range!.start.getFullYear()).toBe(2024);
      expect(range!.end.getFullYear()).toBe(2024);
    });

    it('should return null for missing inputs', () => {
      expect(getDateRange('01-01-2024')).toBeNull();
      expect(getDateRange(undefined, '31-12-2024')).toBeNull();
      expect(getDateRange()).toBeNull();
    });

    it('should throw error for invalid date range', () => {
      expect(() => getDateRange('31-12-2024', '01-01-2024')).toThrow('Invalid date range');
    });
  });
});
