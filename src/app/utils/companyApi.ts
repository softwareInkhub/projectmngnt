// ========================================
// OPTIMIZED COMPANY API SERVICE
// ========================================

import { apiService, ApiResponse } from './apiService';
import { TABLE_NAMES } from '../config/environment';

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
    // Ensure company has an ID
    const companyWithId = {
      ...company,
      id: company.id || `company-${Date.now()}`
    };
    return apiService.createItem<CompanyData>(TABLE_NAMES.companies, companyWithId);
  }

  static async getCompanies(): Promise<ApiResponse<CompanyData[]>> {
    return apiService.getItems<CompanyData>(TABLE_NAMES.companies);
  }

  static async getCompany(id: string): Promise<ApiResponse<CompanyData>> {
    return apiService.getItem<CompanyData>(TABLE_NAMES.companies, id);
  }

  static async updateCompany(id: string, company: Partial<CompanyData>): Promise<ApiResponse<CompanyData>> {
    return apiService.updateItem<CompanyData>(TABLE_NAMES.companies, id, company);
  }

  static async deleteCompany(id: string): Promise<ApiResponse<CompanyData>> {
    return apiService.deleteItem<CompanyData>(TABLE_NAMES.companies, id);
  }
}

// Helper function to validate company data
export function validateCompanyData(data: Partial<CompanyData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Company name is required');
  }

  if (!data.status?.trim()) {
    errors.push('Status is required');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.push('Website must start with http:// or https://');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
