export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  joinDate: string;
  lastActive: string;
  phone?: string;
  password?: string;
  avatar?: string;
  permissions?: string[];
  companyId?: string;
  teamId?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  phone?: string;
  companyId?: string;
  teamId?: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  department?: string;
  phone?: string;
  companyId?: string;
  teamId?: string;
}

export interface UserApiResponse {
  success: boolean;
  data?: UserData[];
  user?: UserData;
  message?: string;
  error?: string;
}

class UserApiServiceClass {
  private baseUrl = 'http://localhost:5001';

  async getUsers(): Promise<UserApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.users || data };
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return empty array if API is not available - no fallback data
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      };
    }
  }

  async createUser(userData: CreateUserRequest): Promise<UserApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, user: data.user || data };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  }

  async updateUser(userData: UpdateUserRequest): Promise<UserApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, user: data.user || data };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
  }

  async deleteUser(userId: string): Promise<UserApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }

  async assignRole(userId: string, role: string): Promise<UserApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, user: data.user || data };
    } catch (error) {
      console.error('Error assigning role:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign role'
      };
    }
  }

  async getUserById(userId: string): Promise<UserApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, user: data.user || data };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  }

  // Removed getFallbackUsers method - no more mock data
}

export const UserApiService = new UserApiServiceClass();
