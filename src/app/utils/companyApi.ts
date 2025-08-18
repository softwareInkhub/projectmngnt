// Company API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  // Additional properties from your API response
  items?: T[];
  count?: number;
  pagesFetched?: number;
}

async function makeRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Handle different response structures
    if (data.success !== undefined) {
      // Return the response as-is - let components handle the structure
      return data;
    } else {
      return { success: true, data };
    }
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

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
    return makeRequest<CompanyData>('/crud?tableName=project-management-companies', {
      method: 'POST',
      body: JSON.stringify({ item: companyWithId }),
    });
  }

  static async getCompanies(): Promise<ApiResponse<CompanyData[]>> {
    return makeRequest<CompanyData[]>('/crud?tableName=project-management-companies', {
      method: 'GET',
    });
  }

  static async updateCompany(id: string, company: Partial<CompanyData>): Promise<ApiResponse<CompanyData>> {
    return makeRequest<CompanyData>(`/crud?tableName=project-management-companies&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        key: { id },
        updates: company 
      }),
    });
  }

  static async deleteCompany(id: string): Promise<ApiResponse<CompanyData>> {
    return makeRequest<CompanyData>(`/crud?tableName=project-management-companies&id=${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
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
