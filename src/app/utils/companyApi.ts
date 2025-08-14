// API utility functions for company management

export interface CompanyData {
  id?: string;
  name: string;
  description?: string;
  type: string;
  industry: string;
  status: string;
  founded?: string;
  employees?: number;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  revenue?: string;
  priority: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API base URL with fallback options
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Use local API for now
  return 'http://54.85.164.84:5001/crud';
};

const API_BASE_URL = getApiBaseUrl();

export class CompanyApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}?tableName=${endpoint}`;
      
      console.log('Making API request to:', url);
      console.log('Request options:', {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.body
      });
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.text();
          console.log('Error response body:', errorData);
          errorMessage += ` - ${errorData}`;
        } catch (e) {
          console.log('Could not read error response body');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      // Handle the actual API response structure
      if (data.success && data.items) {
        return { success: true, data: data.items };
      } else if (data.success && data.data) {
        return { success: true, data: data.data };
      } else if (data.success) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async createCompany(companyData: CompanyData): Promise<ApiResponse> {
    // Generate a unique ID for the company
    const companyId = Date.now().toString();
    
    // Simplify the data structure for the API
    const simplifiedData = {
      id: companyId, // Add the required partition key
      name: companyData.name,
      description: companyData.description || '',
      type: companyData.type,
      industry: companyData.industry,
      status: companyData.status,
      founded: companyData.founded || '',
      employees: companyData.employees || 0,
      location: companyData.location || '',
      website: companyData.website || '',
      email: companyData.email || '',
      phone: companyData.phone || '',
      revenue: companyData.revenue || '',
      priority: companyData.priority,
      tags: companyData.tags ? companyData.tags.join(',') : '',
      notes: companyData.notes || '',
      createdAt: companyData.createdAt || new Date().toISOString(),
      updatedAt: companyData.updatedAt || new Date().toISOString()
    };

    console.log('Sending simplified data to API:', simplifiedData);

    // Wrap the data in an 'item' property as required by the API
    const requestBody = {
      item: simplifiedData
    };

    console.log('Final request body:', requestBody);

    return this.makeRequest('project-management-companies', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  static async getCompanies(): Promise<ApiResponse> {
    return this.makeRequest('project-management-companies', {
      method: 'GET',
    });
  }

  static async updateCompany(companyId: string, companyData: Partial<CompanyData>): Promise<ApiResponse> {
    return this.makeRequest(`project-management-companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  static async deleteCompany(companyId: string): Promise<ApiResponse> {
    return this.makeRequest(`project-management-companies/${companyId}`, {
      method: 'DELETE',
    });
  }
}

// Helper function to validate company data
export function validateCompanyData(data: Partial<CompanyData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Company name is required');
  }

  if (!data.type?.trim()) {
    errors.push('Company type is required');
  }

  if (!data.industry?.trim()) {
    errors.push('Industry is required');
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
