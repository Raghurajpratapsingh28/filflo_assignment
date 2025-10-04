import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../types';
import apiService from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (email?: string, role?: 'manager' | 'employee') => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  // Employee management functions (Manager only)
  createEmployee: (employeeData: CreateEmployeeRequest) => Promise<Employee>;
  getEmployees: () => Promise<Employee[]>;
  updateEmployee: (id: number, employeeData: UpdateEmployeeRequest) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        apiService.getProfile()
          .then((response) => {
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          })
          .catch(() => {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login({ username, password });
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (email?: string, role?: 'manager' | 'employee') => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const response = await apiService.updateProfile({ email, role });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiService.changePassword({ currentPassword, newPassword });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      throw new Error(errorMessage);
    }
  };

  // Employee management functions (Manager only)
  const createEmployee = async (employeeData: CreateEmployeeRequest): Promise<Employee> => {
    if (!user || user.role !== 'manager') {
      throw new Error('Only managers can create employees');
    }
    
    try {
      const response = await apiService.createEmployee(employeeData);
      return response.employee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create employee';
      throw new Error(errorMessage);
    }
  };

  const getEmployees = async (): Promise<Employee[]> => {
    if (!user || user.role !== 'manager') {
      throw new Error('Only managers can view employees');
    }
    
    try {
      const response = await apiService.getEmployees();
      return response.employees;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employees';
      throw new Error(errorMessage);
    }
  };

  const updateEmployee = async (id: number, employeeData: UpdateEmployeeRequest): Promise<Employee> => {
    if (!user || user.role !== 'manager') {
      throw new Error('Only managers can update employees');
    }
    
    try {
      const response = await apiService.updateEmployee(id, employeeData);
      return response.employee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      throw new Error(errorMessage);
    }
  };

  const deleteEmployee = async (id: number): Promise<void> => {
    if (!user || user.role !== 'manager') {
      throw new Error('Only managers can delete employees');
    }
    
    try {
      await apiService.deleteEmployee(id);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete employee';
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut, 
      updateProfile, 
      changePassword,
      createEmployee,
      getEmployees,
      updateEmployee,
      deleteEmployee
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
