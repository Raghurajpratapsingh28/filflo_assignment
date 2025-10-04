export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function calculateDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateAgeingDays(mfgDate: string): number {
  const today = new Date().toISOString().split('T')[0];
  return calculateDaysBetween(mfgDate, today);
}

export function calculateDaysToExpiry(expDate: string): number {
  const today = new Date().toISOString().split('T')[0];
  return calculateDaysBetween(today, expDate);
}

export function isNearExpiry(expDate: string, thresholdDays: number = 30): boolean {
  const daysToExpiry = calculateDaysToExpiry(expDate);
  return daysToExpiry <= thresholdDays && daysToExpiry >= 0;
}

export function isExpired(expDate: string): boolean {
  const daysToExpiry = calculateDaysToExpiry(expDate);
  return daysToExpiry < 0;
}

export function getExpiryRiskLevel(expDate: string): 'high' | 'medium' | 'low' {
  const days = calculateDaysToExpiry(expDate);
  if (days < 30) return 'high';
  if (days < 90) return 'medium';
  return 'low';
}

export function getAgeingBucket(mfgDate: string): string {
  const days = calculateAgeingDays(mfgDate);
  if (days <= 30) return '0-30 days';
  if (days <= 60) return '30-60 days';
  if (days <= 90) return '60-90 days';
  return '90+ days';
}
