// ========================================
// LEGACY API UTILITIES (DEPRECATED)
// ========================================
// 
// This file is kept for backward compatibility.
// New code should use the optimized apiService from './apiService'
// and the environment configuration from '../config/environment'

import { apiService, ApiResponse } from './apiService';
import { TABLE_NAMES } from '../config/environment';

// Re-export types for backward compatibility
export type { ApiResponse } from './apiService';

// Legacy CRUD operations - now delegate to the new service
export async function createItem<T>(tableName: string, item: T): Promise<ApiResponse<T>> {
  console.warn('createItem is deprecated. Use apiService.createItem instead.');
  return apiService.createItem<T>(tableName, item);
}

export async function getItems<T>(tableName: string): Promise<ApiResponse<T[]>> {
  console.warn('getItems is deprecated. Use apiService.getItems instead.');
  return apiService.getItems<T>(tableName);
}

export async function updateItem<T>(tableName: string, id: string, item: Partial<T>): Promise<ApiResponse<T>> {
  console.warn('updateItem is deprecated. Use apiService.updateItem instead.');
  return apiService.updateItem<T>(tableName, id, item);
}

export async function deleteItem<T>(tableName: string, id: string): Promise<ApiResponse<T>> {
  console.warn('deleteItem is deprecated. Use apiService.deleteItem instead.');
  return apiService.deleteItem<T>(tableName, id);
}

// Company-specific operations
export interface CompanyData {
  id?: string;
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  founded?: string;
  revenue?: string;
  employees?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class CompanyApiService {
  static async createCompany(company: CompanyData): Promise<ApiResponse<CompanyData>> {
    return createItem<CompanyData>('project-management-companies', company);
  }

  static async getCompanies(): Promise<ApiResponse<CompanyData[]>> {
    return getItems<CompanyData>('project-management-companies');
  }

  static async updateCompany(id: string, company: Partial<CompanyData>): Promise<ApiResponse<CompanyData>> {
    return updateItem<CompanyData>('project-management-companies', id, company);
  }

  static async deleteCompany(id: string): Promise<ApiResponse<CompanyData>> {
    return deleteItem<CompanyData>('project-management-companies', id);
  }
}
