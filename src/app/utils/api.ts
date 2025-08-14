// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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
    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Generic CRUD operations
export async function createItem<T>(tableName: string, item: T): Promise<ApiResponse<T>> {
  return makeRequest<T>(`/crud?tableName=${tableName}`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function getItems<T>(tableName: string): Promise<ApiResponse<T[]>> {
  return makeRequest<T[]>(`/crud?tableName=${tableName}`, {
    method: 'GET',
  });
}

export async function updateItem<T>(tableName: string, id: string, item: Partial<T>): Promise<ApiResponse<T>> {
  return makeRequest<T>(`/crud?tableName=${tableName}&id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

export async function deleteItem<T>(tableName: string, id: string): Promise<ApiResponse<T>> {
  return makeRequest<T>(`/crud?tableName=${tableName}&id=${id}`, {
    method: 'DELETE',
  });
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
