// Removed CognitoService import - using backend endpoints instead

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
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in';

  // Test method to check backend connectivity
  async testBackendConnectivity(): Promise<{connected: boolean, error?: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return { connected: response.ok, error: response.ok ? undefined : `HTTP ${response.status}` };
    } catch (error) {
      return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Extract user info from JWT token
  private getCurrentUserFromToken(token: string): UserData | null {
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid JWT token format');
        return null;
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      console.log('JWT payload:', payload);

      // Extract user information from the token
      const userData: UserData = {
        id: payload.sub || payload['cognito:username'] || payload.email?.split('@')[0] || 'user',
        name: payload.name || payload.given_name || payload['cognito:username'] || 'User',
        email: payload.email || '',
        role: payload['custom:role'] || 'User',
        status: payload.email_verified ? 'Active' : 'Inactive',
        department: payload['custom:department'] || 'General',
        phone: payload.phone_number || '',
        joinDate: payload.iat ? new Date(payload.iat * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString(),
        companyId: payload['custom:companyId'] || '',
        teamId: payload['custom:teamId'] || ''
      };

      return userData;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }

  async getUsers(): Promise<UserApiResponse> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found, returning empty users list');
        return {
          success: false,
          data: [],
          error: 'No access token found'
        };
      }

      // Try Next.js API route first to get all real users
      console.log('🔄 Trying Next.js API route to fetch all users...');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const cognitoResponse = await fetch('/api/cognito/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (cognitoResponse.ok) {
          const cognitoData = await cognitoResponse.json();
          console.log('✅ Next.js API route success, data:', cognitoData);
          
          const users = cognitoData.users || cognitoData;
          if (Array.isArray(users) && users.length > 0) {
            // Transform Cognito users to our UserData format
            const transformedUsers = this.transformCognitoUsers(users);
            console.log(`✅ Successfully fetched ${transformedUsers.length} real users from Cognito via Next.js API`);
            return {
              success: true,
              data: transformedUsers,
              message: `Fetched ${transformedUsers.length} real users from Cognito User Pool`
            };
          }
        } else {
          console.log('⚠️ Next.js API route failed:', cognitoResponse.status);
        }
      } catch (cognitoError) {
        console.log('⚠️ Next.js API route error:', cognitoError);
      }

      // Try to get current user info from token as fallback
      try {
        const currentUserInfo = this.getCurrentUserFromToken(token);
        if (currentUserInfo) {
          console.log('✅ Found current user from token:', currentUserInfo);
          return {
            success: true,
            data: [currentUserInfo],
            error: 'Backend unavailable - showing current user from token'
          };
        }
      } catch (tokenError) {
        console.log('Token parsing failed:', tokenError);
      }

      // Try multiple endpoints to get users
      const endpoints = [
        { url: `${this.baseUrl}/cognito/users`, name: 'Cognito' },
        { url: `${this.baseUrl}/users`, name: 'Database' },
        { url: `${this.baseUrl}/auth/users`, name: 'Auth' }
      ];

      const endpointErrors = [];

      // Quick backend connectivity check
      console.log('Backend URL:', this.baseUrl);
      try {
        const healthResponse = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        console.log('Backend health check status:', healthResponse.status);
      } catch (healthError) {
        console.warn('Backend health check failed:', healthError);
      }

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying ${endpoint.name} endpoint:`, endpoint.url);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout
          
          const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          console.log(`${endpoint.name} endpoint response status:`, response.status);

          if (response.ok) {
            const data = await response.json();
            console.log(`${endpoint.name} endpoint success, data:`, data);
            
            let users = data.users || data;
            
            // If this is Cognito data, transform it
            if (endpoint.name === 'Cognito') {
              users = this.transformCognitoUsers(users);
            }
            
            return { success: true, data: users };
          } else {
            const errorText = await response.text();
            const errorMsg = `${endpoint.name} endpoint failed: ${response.status} - ${errorText}`;
            console.log(errorMsg);
            endpointErrors.push(errorMsg);
          }
        } catch (error) {
          const errorMsg = `${endpoint.name} endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.log(errorMsg);
          endpointErrors.push(errorMsg);
          continue; // Try next endpoint
        }
      }

      // If all endpoints fail, try to get user info from localStorage/sessionStorage
      console.warn('All user endpoints failed. Trying to get user info from local storage...');
      
      const email = localStorage.getItem('user_email');
      const userInfo = localStorage.getItem('user_info');
      
      if (email || userInfo) {
        try {
          let userData;
          if (userInfo) {
            userData = JSON.parse(userInfo);
          } else if (email) {
            // Create user data from email
            userData = {
              id: email.split('@')[0],
              name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              email: email,
              role: 'User',
              status: 'Active',
              department: 'General',
              phone: '',
              joinDate: new Date().toISOString().split('T')[0],
              lastActive: new Date().toISOString(),
              companyId: '',
              teamId: ''
            };
          }
          
          if (userData) {
            console.log('✅ Found user data from local storage:', userData);
            return {
              success: true,
              data: [userData],
              error: 'Backend unavailable - showing user from local storage'
            };
          }
        } catch (parseError) {
          console.log('Failed to parse user info from local storage:', parseError);
        }
      }

      // Final fallback - return sample data with detailed error info
      console.warn('All user endpoints failed. Endpoint errors:', endpointErrors);
      return {
        success: false,
        data: [
          {
            id: 'testuser123',
            name: 'Test User 123',
            email: 'testuser123@example.com',
            role: 'Developer',
            status: 'Inactive',
            department: 'Engineering',
            phone: '+1-555-0123',
            joinDate: '2024-01-15',
            lastActive: '2024-01-20T10:30:00Z',
            companyId: 'demo-company',
            teamId: 'demo-team'
          },
          {
            id: 'influencerapp123',
            name: 'Influencer App',
            email: 'software.inkhub@gmail.com',
            role: 'Manager',
            status: 'Inactive',
            department: 'Marketing',
            phone: '+1-555-0124',
            joinDate: '2024-01-10',
            lastActive: '2024-01-18T14:20:00Z',
            companyId: 'demo-company',
            teamId: 'demo-team'
          },
          {
            id: 'influencer',
            name: 'Influencer',
            email: 'dead342pool@gmail.com',
            role: 'Developer',
            status: 'Active',
            department: 'Engineering',
            phone: '+1-555-0125',
            joinDate: '2024-01-05',
            lastActive: new Date().toISOString(),
            companyId: 'demo-company',
            teamId: 'demo-team'
          },
          {
            id: 'baba2',
            name: 'Baba 2',
            email: 'monty@gmail.com',
            role: 'Developer',
            status: 'Active',
            department: 'Engineering',
            phone: '+1-555-0126',
            joinDate: '2024-01-12',
            lastActive: new Date().toISOString(),
            companyId: 'demo-company',
            teamId: 'demo-team'
          },
          {
            id: 'baba',
            name: 'Baba',
            email: 'software.inkhub@gmail.com',
            role: 'Admin',
            status: 'Active',
            department: 'Management',
            phone: '+1-555-0127',
            joinDate: '2024-01-08',
            lastActive: new Date().toISOString(),
            companyId: 'demo-company',
            teamId: 'demo-team'
          }
        ],
        error: `Backend unavailable - showing sample Cognito users. Errors: ${endpointErrors.join('; ')}`
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Network error - trying to fetch from Cognito as fallback');
        try {
          return await this.getUsersFromCognito();
        } catch (cognitoError) {
          console.warn('Cognito fallback also failed, returning demo data');
          return {
            success: false,
            data: [
              {
                id: 'testuser123',
                name: 'Test User 123',
                email: 'testuser123@example.com',
                role: 'Developer',
                status: 'Inactive',
                department: 'Engineering',
                phone: '+1-555-0123',
                joinDate: '2024-01-15',
                lastActive: '2024-01-20T10:30:00Z',
                companyId: 'demo-company',
                teamId: 'demo-team'
              },
              {
                id: 'influencerapp123',
                name: 'Influencer App',
                email: 'software.inkhub@gmail.com',
                role: 'Manager',
                status: 'Inactive',
                department: 'Marketing',
                phone: '+1-555-0124',
                joinDate: '2024-01-10',
                lastActive: '2024-01-18T14:20:00Z',
                companyId: 'demo-company',
                teamId: 'demo-team'
              },
              {
                id: 'influencer',
                name: 'Influencer',
                email: 'dead342pool@gmail.com',
                role: 'Developer',
                status: 'Active',
                department: 'Engineering',
                phone: '+1-555-0125',
                joinDate: '2024-01-05',
                lastActive: new Date().toISOString(),
                companyId: 'demo-company',
                teamId: 'demo-team'
              },
              {
                id: 'baba2',
                name: 'Baba 2',
                email: 'monty@gmail.com',
                role: 'Developer',
                status: 'Active',
                department: 'Engineering',
                phone: '+1-555-0126',
                joinDate: '2024-01-12',
                lastActive: new Date().toISOString(),
                companyId: 'demo-company',
                teamId: 'demo-team'
              },
              {
                id: 'baba',
                name: 'Baba',
                email: 'software.inkhub@gmail.com',
                role: 'Admin',
                status: 'Active',
                department: 'Management',
                phone: '+1-555-0127',
                joinDate: '2024-01-08',
                lastActive: new Date().toISOString(),
                companyId: 'demo-company',
                teamId: 'demo-team'
              }
            ],
            error: 'Network error - showing sample Cognito users'
          };
        }
      }
      
      // Check if it's a timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Request timeout - backend may be slow or unavailable');
        return {
          success: false,
          data: [
            {
              id: 'testuser123',
              name: 'Test User 123',
              email: 'testuser123@example.com',
              role: 'Developer',
              status: 'Inactive',
              department: 'Engineering',
              phone: '+1-555-0123',
              joinDate: '2024-01-15',
              lastActive: '2024-01-20T10:30:00Z',
              companyId: 'demo-company',
              teamId: 'demo-team'
            },
            {
              id: 'influencer',
              name: 'Influencer',
              email: 'dead342pool@gmail.com',
              role: 'Developer',
              status: 'Active',
              department: 'Engineering',
              phone: '+1-555-0125',
              joinDate: '2024-01-05',
              lastActive: new Date().toISOString(),
              companyId: 'demo-company',
              teamId: 'demo-team'
            }
          ],
          error: 'Request timeout - showing sample Cognito users'
        };
      }
      
      // Return fallback data for other errors
      return {
        success: false,
        data: [
          {
            id: 'testuser123',
            name: 'Test User 123',
            email: 'testuser123@example.com',
            role: 'Developer',
            status: 'Inactive',
            department: 'Engineering',
            phone: '+1-555-0123',
            joinDate: '2024-01-15',
            lastActive: '2024-01-20T10:30:00Z',
            companyId: 'demo-company',
            teamId: 'demo-team'
          },
          {
            id: 'baba',
            name: 'Baba',
            email: 'software.inkhub@gmail.com',
            role: 'Admin',
            status: 'Active',
            department: 'Management',
            phone: '+1-555-0127',
            joinDate: '2024-01-08',
            lastActive: new Date().toISOString(),
            companyId: 'demo-company',
            teamId: 'demo-team'
          }
        ],
        error: error instanceof Error ? error.message : 'Failed to fetch users - showing sample Cognito users'
      };
    }
  }

  // Helper method to transform Cognito users to our UserData format
  private transformCognitoUsers(cognitoUsers: any[]): UserData[] {
    return cognitoUsers.map((cognitoUser: any) => ({
      id: cognitoUser.Username || cognitoUser.id,
      name: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'name')?.Value || 
            cognitoUser.Attributes?.find((attr: any) => attr.Name === 'given_name')?.Value ||
            cognitoUser.username || 
            cognitoUser.email?.split('@')[0] || 
            'User',
      email: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'email')?.Value || 
             cognitoUser.email || 
             '',
      role: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'custom:role')?.Value || 
            'Developer',
      status: cognitoUser.UserStatus === 'CONFIRMED' ? 'Active' : 'Inactive',
      department: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'custom:department')?.Value || 
                  'General',
      joinDate: cognitoUser.UserCreateDate ? new Date(cognitoUser.UserCreateDate).toISOString().split('T')[0] : 
                new Date().toISOString().split('T')[0],
      lastActive: cognitoUser.UserLastModifiedDate ? new Date(cognitoUser.UserLastModifiedDate).toISOString() : 
                  new Date().toISOString(),
      phone: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'phone_number')?.Value || 
             cognitoUser.Attributes?.find((attr: any) => attr.Name === 'phone')?.Value || 
             '',
      companyId: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'custom:companyId')?.Value || '',
      teamId: cognitoUser.Attributes?.find((attr: any) => attr.Name === 'custom:teamId')?.Value || ''
    }));
  }

  // Method to get users from Cognito as fallback
  private async getUsersFromCognito(): Promise<UserApiResponse> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      console.log('Fetching users from Cognito:', `${this.baseUrl}/cognito/users`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${this.baseUrl}/cognito/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Cognito users API success, data:', data);
      
      // Transform Cognito users to our UserData format
      const transformedUsers = this.transformCognitoUsers(data.users || data);
      return { success: true, data: transformedUsers };
    } catch (error) {
      console.error('Error fetching users from Cognito:', error);
      throw error;
    }
  }

  // Silent method to get Cognito users (doesn't throw errors)
  private async getCognitoUsersSilently(): Promise<UserData[] | null> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return null;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Shorter timeout for silent call
      
      const response = await fetch(`${this.baseUrl}/cognito/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return null; // Silently fail
      }

      const data = await response.json();
      const transformedUsers = this.transformCognitoUsers(data.users || data);
      return transformedUsers;
    } catch (error) {
      console.log('Silent Cognito fetch failed:', error);
      return null; // Silently fail
    }
  }

  async createUser(userData: CreateUserRequest): Promise<UserApiResponse> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${this.baseUrl}/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${this.baseUrl}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
