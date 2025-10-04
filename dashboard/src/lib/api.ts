import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
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
    role?: 'manager' | 'employee';
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  role?: 'manager' | 'employee';
}

export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  role?: 'manager' | 'employee';
  created_at?: string;
}

export interface Employee {
  id: number;
  username: string;
  email?: string;
  role: 'employee';
  created_at: string;
  updated_at: string;
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
  data: InventoryItem[];
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

export interface UniqueParts {
  jwl_parts: string[];
  customer_parts: string[];
}

export interface ReceiptRequest {
  customer: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  items: { jwl_part: string; qty: number; unit_price?: number }[];
  tax_rate?: number;
}

export interface ReceiptResponse {
  receipt_number: string;
  pdf_base64: string;
  totals: {
    subtotal: number;
    tax_amount: number;
    grand_total: number;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  email?: string;
  role?: 'manager' | 'employee';
}

// API Service Class
class ApiService {
  // Authentication APIs
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await api.post('/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<{ message: string; user: UserProfile }> {
    const response = await api.post('/register', userData);
    return response.data;
  }

  async getProfile(): Promise<{ user: UserProfile }> {
    const response = await api.get('/profile');
    return response.data;
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<{ message: string; user: UserProfile }> {
    const response = await api.put('/profile', profileData);
    return response.data;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.put('/change-password', passwordData);
    return response.data;
  }

  // Employee Management APIs (Manager only)
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<{ message: string; employee: Employee }> {
    const response = await api.post('/employees', employeeData);
    return response.data;
  }

  async getEmployees(): Promise<{ employees: Employee[] }> {
    const response = await api.get('/employees');
    return response.data;
  }

  async updateEmployee(id: number, employeeData: UpdateEmployeeRequest): Promise<{ message: string; employee: Employee }> {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  }

  async deleteEmployee(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  }

  // Inventory APIs
  async uploadCSV(file: File): Promise<{ message: string; insertedCount: number; totalRows: number }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getInventory(filters?: InventoryFilters): Promise<InventoryResponse> {
    const response: AxiosResponse<InventoryResponse> = await api.get('/inventory', {
      params: filters,
    });
    return response.data;
  }

  async getUniqueParts(): Promise<UniqueParts> {
    const response: AxiosResponse<UniqueParts> = await api.get('/unique-parts');
    return response.data;
  }

  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const response: AxiosResponse<DashboardKPIs> = await api.get('/dashboard-kpis');
    return response.data;
  }

  async getInventorySummary(): Promise<InventorySummary[]> {
    const response: AxiosResponse<InventorySummary[]> = await api.get('/inventory-summary');
    return response.data;
  }

  async getInventoryItem(id: number): Promise<InventoryItem> {
    const response: AxiosResponse<InventoryItem> = await api.get(`/inventory/${id}`);
    return response.data;
  }

  async createInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    const response: AxiosResponse<InventoryItem> = await api.post('/inventory', itemData);
    return response.data;
  }

  async updateInventoryItem(id: number, itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    const response: AxiosResponse<InventoryItem> = await api.put(`/inventory/${id}`, itemData);
    return response.data;
  }

  async deleteInventoryItem(id: number): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/inventory/${id}`);
    return response.data;
  }

  async generateReceipt(receiptData: ReceiptRequest): Promise<ReceiptResponse> {
    const response: AxiosResponse<ReceiptResponse> = await api.post('/receipt', receiptData);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response = await api.get('/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
