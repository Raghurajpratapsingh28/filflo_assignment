export interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
  created_at?: string;
}

export interface InventoryItem {
  id: number;
  jwl_part: string;
  customer_part: string;
  description: string;
  uom: string;
  batch: string;
  mfg_date: string;
  exp_date: string;
  qty: number;
  weight: number;
  ageing_days: number;
  days_to_expiry: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface ReceiptItem {
  jwl_part: string;
  description: string;
  qty: number;
  unit_price: number;
  total_price: number;
}

export interface Receipt {
  receipt_number: string;
  date: string;
  customer: Customer;
  items: ReceiptItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  company_name: string;
  company_address: string;
}

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

export interface InventoryKPIs {
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

export interface AgeingBucket {
  label: string;
  count: number;
  qty: number;
}

export interface ExpiryRisk {
  category: string;
  count: number;
  percentage: number;
}

export interface InventorySummary {
  jwl_part: string;
  description: string;
  available_qty: number;
}

export interface UniqueParts {
  jwl_parts: string[];
  customer_parts: string[];
}
