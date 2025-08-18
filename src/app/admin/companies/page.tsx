'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { CompanyApiService, CompanyData } from '../../utils/companyApi';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyData>>({
    name: '',
    description: '',
    industry: '',
    status: 'Active',
    location: '',
    website: '',
    email: '',
    phone: '',
    employees: 0,
    revenue: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await CompanyApiService.getCompanies();
      if (response.success) {
        const companiesData = response.items || response.data || [];
        setCompanies(Array.isArray(companiesData) ? companiesData as CompanyData[] : []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]); // Set empty array if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    try {
      const response = await CompanyApiService.createCompany(formData as CompanyData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          industry: '',
          status: 'Active',
          location: '',
          website: '',
          email: '',
          phone: '',
          employees: 0,
          revenue: ''
        });
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleEditCompany = async () => {
    if (!editingCompany?.id) return;
    
    try {
      const response = await CompanyApiService.updateCompany(editingCompany.id, formData);
      if (response.success) {
        setShowCreateModal(false);
        setEditingCompany(null);
        setFormData({
          name: '',
          description: '',
          industry: '',
          status: 'Active',
          location: '',
          website: '',
          email: '',
          phone: '',
          employees: 0,
          revenue: ''
        });
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleDeleteCompany = async (company: CompanyData) => {
    if (!company.id) return;
    
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        const response = await CompanyApiService.deleteCompany(company.id);
        if (response.success) {
          fetchCompanies();
        }
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Company Name',
      sortable: true,
      render: (value: string, row: CompanyData) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 size={16} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.industry}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={14} className="mr-1" />
          {value || 'Not specified'}
        </div>
      )
    },
    {
      key: 'employees',
      label: 'Employees',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm text-gray-900">{value || 0}</span>
      )
    },
    {
      key: 'email',
      label: 'Contact',
      sortable: false,
      render: (value: string, row: CompanyData) => (
        <div className="space-y-1">
          {value && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-1" />
              {value}
            </div>
          )}
          {row.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={14} className="mr-1" />
              {row.phone}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'website',
      label: 'Website',
      sortable: false,
      render: (value: string) => (
        value ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Globe size={14} className="mr-1" />
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-sm text-gray-400">Not specified</span>
        )
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage all companies in the system</p>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        data={companies}
        columns={columns}
        title="Companies"
        onCreateNew={() => setShowCreateModal(true)}
        onEdit={(company) => {
          setEditingCompany(company);
          setFormData(company);
          setShowCreateModal(true);
        }}
        onDelete={handleDeleteCompany}
        searchPlaceholder="Search companies..."
      />

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCompany ? 'Edit Company' : 'Create New Company'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCompany(null);
                  setFormData({
                    name: '',
                    description: '',
                    industry: '',
                    status: 'Active',
                    location: '',
                    website: '',
                    email: '',
                    phone: '',
                    employees: 0,
                    revenue: ''
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingCompany ? handleEditCompany : handleCreateCompany}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCompany ? 'Update Company' : 'Create Company'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
