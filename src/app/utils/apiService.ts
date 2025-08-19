// ========================================
// OPTIMIZED API SERVICE BASE CLASS
// ========================================

import { env } from '../config/environment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  items?: T[];
  count?: number;
  pagesFetched?: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private debugMode: boolean;

  private constructor() {
    this.baseUrl = env.apiBaseUrl;
    this.debugMode = env.debugMode;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private log(message: string, data?: any): void {
    if (this.debugMode || env.isDevelopment) {
      console.log(`[API Service] ${message}`, data || '');
    }
  }

  private logError(message: string, error?: any): void {
    if (this.debugMode || env.isDevelopment) {
      console.error(`[API Service Error] ${message}`, error || '');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    this.log(`Making request to: ${url}`, {
      method: options.method || 'GET',
      headers: options.headers
    });

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      this.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        this.logError(`HTTP error ${response.status}`, errorText);
        
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      this.log('Response data received', data);

      // Handle different response structures
      if (data.success !== undefined) {
        return data;
      } else {
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Request failed', errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Generic CRUD operations
  public async createItem<T>(tableName: string, item: T): Promise<ApiResponse<T>> {
    this.log(`Creating item in table: ${tableName}`, item);
    
    return this.makeRequest<T>(`/crud?tableName=${tableName}`, {
      method: 'POST',
      body: JSON.stringify({ item }),
    });
  }

  public async getItems<T>(tableName: string): Promise<ApiResponse<T[]>> {
    this.log(`Fetching items from table: ${tableName}`);
    
    return this.makeRequest<T[]>(`/crud?tableName=${tableName}`, {
      method: 'GET',
    });
  }

  public async getItem<T>(tableName: string, id: string): Promise<ApiResponse<T>> {
    this.log(`Fetching item from table: ${tableName} with id: ${id}`);
    
    return this.makeRequest<T>(`/crud?tableName=${tableName}&id=${id}`, {
      method: 'GET',
    });
  }

  public async updateItem<T>(
    tableName: string,
    id: string,
    updates: Partial<T>
  ): Promise<ApiResponse<T>> {
    this.log(`Updating item in table: ${tableName} with id: ${id}`, updates);
    
    return this.makeRequest<T>(`/crud?tableName=${tableName}&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        key: { id },
        updates
      }),
    });
  }

  public async deleteItem<T>(tableName: string, id: string): Promise<ApiResponse<T>> {
    this.log(`Deleting item from table: ${tableName} with id: ${id}`);
    
    return this.makeRequest<T>(`/crud?tableName=${tableName}&id=${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }

  // Health check
  public async healthCheck(): Promise<ApiResponse<any>> {
    this.log('Performing health check');
    
    return this.makeRequest<any>('/health', {
      method: 'GET',
    });
  }

  // Get API configuration
  public getConfig() {
    return {
      baseUrl: this.baseUrl,
      debugMode: this.debugMode,
      environment: env.isDevelopment ? 'development' : 'production'
    };
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();
