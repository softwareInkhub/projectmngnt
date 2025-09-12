'use client';

import React, { useState, useEffect } from 'react';
import { UserApiService, UserData } from '../../utils/userApi';
import { DataTable } from '../components/DataTable';
import { User, Mail, Phone, Calendar, Shield, MoreVertical, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    department: '',
    phone: '',
    status: 'Active'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching users data...');
      
      const response = await UserApiService.getUsers();
      console.log('📊 Users API response:', response);
      
      if (response.success && response.data) {
        setUsers(response.data);
        console.log(`✅ Loaded ${response.data.length} users`);
        
        // Show success message if we got real Cognito data
        if (response.message && response.message.includes('Cognito')) {
          console.log('🎉 Successfully loaded real Cognito users!');
        }
      } else {
        setError(response.error || 'Failed to fetch users');
        console.error('❌ Failed to fetch users:', response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'User',
      department: '',
      phone: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || '',
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const response = await UserApiService.updateUser({
          id: editingUser.id,
          ...formData
        });
        if (response.success) {
          await fetchData();
          setIsModalOpen(false);
        } else {
          setError(response.error || 'Failed to update user');
        }
      } else {
        const response = await UserApiService.createUser({
          ...formData,
          password: 'TempPassword123!' // Temporary password for new users
        });
        if (response.success) {
          await fetchData();
          setIsModalOpen(false);
        } else {
          setError(response.error || 'Failed to create user');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await UserApiService.deleteUser(userId);
        if (response.success) {
          await fetchData();
        } else {
          setError(response.error || 'Failed to delete user');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await UserApiService.assignRole(userId, newRole);
      if (response.success) {
        await fetchData();
      } else {
        setError(response.error || 'Failed to update role');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const columns = [
    {
      key: 'avatar',
      label: '',
      sortable: false,
      render: (value: any, user: UserData) => (
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
          <span className="text-lg font-semibold text-blue-600">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )
    },
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (value: string, user: UserData) => (
        <div className="flex flex-col">
          <span className="text-xl font-medium text-gray-900">{user.name}</span>
          <span className="text-lg text-gray-500">{user.email}</span>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string, user: UserData) => (
        <div className="flex items-center space-x-2">
          <Shield size={18} className="text-gray-400" />
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value)}
            className="text-lg px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="User">User</option>
          </select>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'Active' ? <UserCheck size={16} className="mr-1" /> : <UserX size={16} className="mr-1" />}
          {value}
        </span>
      )
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (value: string) => (
        <span className="text-lg text-gray-600">{value}</span>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-lg text-gray-600">
          <Calendar size={18} className="mr-2 text-gray-400" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-lg text-gray-600">
          <Calendar size={18} className="mr-2 text-gray-400" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      render: (value: string) => (
        <div className="flex items-center text-lg text-gray-600">
          <Phone size={18} className="mr-2 text-gray-400" />
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (value: any, user: UserData) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditUser(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit user"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete user"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-xl text-gray-600">Manage all users in your organization</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-base text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <DataTable
        title="Users"
        data={users}
        columns={columns}
        onCreateNew={handleCreateUser}
        searchPlaceholder="Search users by name, email, or department..."
      />

      {/* Create/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="User">User</option>
                </select>
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter department"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}