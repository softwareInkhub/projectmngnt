'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { UserApiService, UserData, CreateUserRequest, UpdateUserRequest } from '../../utils/userApi';
import { CompanyApiService } from '../../utils/companyApi';
import { TeamApiService } from '../../utils/teamApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData> & { password?: string }>({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
    status: 'Active',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
    companyId: '',
    teamId: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, companiesRes, teamsRes] = await Promise.allSettled([
          UserApiService.getUsers(),
          CompanyApiService.getCompanies(),
          TeamApiService.getTeams()
        ]);

        // Always set users data (fallback data if API fails)
        if (usersRes.status === 'fulfilled') {
          setUsers(usersRes.value.data || []);
        } else {
          console.error('Users API failed:', usersRes.reason);
          setUsers([]);
        }
        
        // Set companies and teams data if available
        if (companiesRes.status === 'fulfilled' && companiesRes.value.success && companiesRes.value.data) {
          setCompanies(companiesRes.value.data);
        }
        if (teamsRes.status === 'fulfilled' && teamsRes.value.success && teamsRes.value.data) {
          setTeams(teamsRes.value.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays as fallback
        setUsers([]);
        setCompanies([]);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!editingUser && !formData.password?.trim()) {
      errors.password = 'Password is required for new users';
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.role?.trim()) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData: CreateUserRequest = {
        name: formData.name!,
        email: formData.email!,
        password: formData.password!,
        role: formData.role!,
        department: formData.department,
        phone: formData.phone,
        companyId: formData.companyId,
        teamId: formData.teamId
      };

      const response = await UserApiService.createUser(userData);
      
      if (response.success) {
        setSuccessMessage('User created successfully!');
        setShowCreateModal(false);
        resetForm();
        // Refresh users list
        try {
          const usersRes = await UserApiService.getUsers();
          setUsers(usersRes.data || []);
        } catch (error) {
          console.error('Error refreshing users list:', error);
          // Keep current users list if refresh fails
        }
      } else {
        setErrorMessage(response.error || 'Failed to create user');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!validateForm() || !editingUser) return;

    setFormLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData: UpdateUserRequest = {
        id: editingUser.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        department: formData.department,
        phone: formData.phone,
        companyId: formData.companyId,
        teamId: formData.teamId
      };

      const response = await UserApiService.updateUser(userData);
      
      if (response.success) {
        setSuccessMessage('User updated successfully!');
        setShowCreateModal(false);
        setEditingUser(null);
        resetForm();
        // Refresh users list
        try {
          const usersRes = await UserApiService.getUsers();
          setUsers(usersRes.data || []);
        } catch (error) {
          console.error('Error refreshing users list:', error);
          // Keep current users list if refresh fails
        }
      } else {
        setErrorMessage(response.error || 'Failed to update user');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await UserApiService.deleteUser(user.id);
      
      if (response.success) {
        setSuccessMessage('User deleted successfully!');
        // Refresh users list
        try {
          const usersRes = await UserApiService.getUsers();
          setUsers(usersRes.data || []);
        } catch (error) {
          console.error('Error refreshing users list:', error);
          // Keep current users list if refresh fails
        }
      } else {
        setErrorMessage(response.error || 'Failed to delete user');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the user');
    }
  };

  const handleAssignRole = async (userId: string, newRole: string) => {
    try {
      const response = await UserApiService.assignRole(userId, newRole);
      
      if (response.success) {
        setSuccessMessage('Role assigned successfully!');
        // Refresh users list
        try {
          const usersRes = await UserApiService.getUsers();
          setUsers(usersRes.data || []);
        } catch (error) {
          console.error('Error refreshing users list:', error);
          // Keep current users list if refresh fails
        }
      } else {
        setErrorMessage(response.error || 'Failed to assign role');
      }
    } catch (error) {
      setErrorMessage('An error occurred while assigning the role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Developer',
      status: 'Active',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      phone: '',
      companyId: '',
      teamId: ''
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Developer': return 'bg-green-100 text-green-800';
      case 'Designer': return 'bg-orange-100 text-orange-800';
      case 'Viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User Name',
      sortable: true,
      render: (value: string, row: UserData) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600">{row.avatar || value.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string, row: UserData) => (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(value)}`}>
            {value}
          </span>
          <select
            value={value}
            onChange={(e) => handleAssignRole(row.id, e.target.value)}
            className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-1" />
          {new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <Shield size={14} className="mr-1" />
          {new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Contact',
      sortable: false,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <Phone size={14} className="mr-1" />
          {value || 'Not provided'}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Register new users and manage roles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Total Users: <span className="font-semibold text-gray-900">{users.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        title="Users"
        onCreateNew={() => setShowCreateModal(true)}
        onEdit={(user) => {
          setEditingUser(user);
          setFormData({
            ...user,
            password: '' // Don't show password when editing
          });
          setShowCreateModal(true);
        }}
        onDelete={handleDeleteUser}
        searchPlaceholder="Search users by name, email, or role..."
      />

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
        >
          <CheckCircle size={20} />
          {successMessage}
          <button
            onClick={() => setSuccessMessage('')}
            className="ml-2 text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
        >
          <AlertCircle size={20} />
          {errorMessage}
          <button
            onClick={() => setErrorMessage('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </motion.div>
      )}

             {/* Create/Edit Sheet */}
       {showCreateModal && (
         <motion.div
           initial={{ x: '100%' }}
           animate={{ x: 0 }}
           exit={{ x: '100%' }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="fixed right-0 top-0 h-full w-96 md:w-[32rem] lg:w-[40rem] bg-white shadow-2xl overflow-y-auto z-50"
         >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.role ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={editingUser ? handleEditUser : handleCreateUser}
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formLoading && <Loader2 size={16} className="animate-spin" />}
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
                         </div>
           </motion.div>
       )}
     </div>
   );
 }
