import React, { useState } from "react";
import { 
  Briefcase, 
  Building, 
  Users, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  MoreHorizontal,
  Edit,
  Trash2,
  Archive,
  Copy,
  Download, 
  Search, 
  Filter, 
  X, 
  Plus,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Target
} from "lucide-react";

// Sample department data
const initialDepartments = [
  {
    id: 1,
    name: "HR",
    manager: "Jennifer Davis",
    members: 6,
    projects: 2,
    budget: "$400K",
    status: "Active",
    location: "San Francisco",
    email: "hr@company.com",
    phone: "+1-555-0105",
    description: "HR operations and talent management",
    created: "2024-01-05",
    lastActivity: "5 hours ago",
    archived: false,
    subdepartments: [
      {
        id: 1,
        name: "Talent Acquisition",
        manager: "Jennifer Davis",
        members: 3,
        projects: 1,
        budget: "$200K",
        status: "Active"
      },
      {
        id: 2,
        name: "Employee Experience",
        manager: "Tom Anderson",
        members: 3,
        projects: 1,
        budget: "$200K",
        status: "Active"
      }
    ]
  },
  {
    id: 2,
    name: "Engineering",
    manager: "Sarah Johnson",
    members: 45,
    projects: 8,
    budget: "$1.2M",
    status: "Active",
    location: "San Francisco",
    email: "engineering@company.com",
    phone: "+1-555-0101",
    description: "Software development and technical operations",
    created: "2024-01-15",
    lastActivity: "2 hours ago",
    archived: false,
    subdepartments: [
      {
        id: 3,
        name: "Frontend Engineering",
        manager: "Mike Chen",
        members: 18,
        projects: 4,
        budget: "$500K",
        status: "Active"
      },
      {
        id: 4,
        name: "Backend Engineering",
        manager: "David Kim",
        members: 15,
        projects: 3,
        budget: "$400K",
        status: "Active"
      },
      {
        id: 5,
        name: "DevOps & Infrastructure",
        manager: "Emma Wilson",
        members: 8,
        projects: 2,
        budget: "$300K",
        status: "Active"
      },
      {
        id: 6,
        name: "Quality Assurance",
        manager: "Alex Rodriguez",
        members: 4,
        projects: 1,
        budget: "$100K",
        status: "Active"
      }
    ]
  },
  {
    id: 3,
    name: "Design",
    manager: "Alex Rodriguez",
    members: 8,
    projects: 4,
    budget: "$600K",
    status: "Active",
    location: "San Francisco",
    email: "design@company.com",
    phone: "+1-555-0103",
    description: "UI/UX design and creative services",
    created: "2024-02-01",
    lastActivity: "30 minutes ago",
    archived: false,
    subdepartments: [
      {
        id: 7,
        name: "UI/UX Design",
        manager: "Alex Rodriguez",
        members: 5,
        projects: 3,
        budget: "$400K",
        status: "Active"
      },
      {
        id: 8,
        name: "Visual Design",
        manager: "Rachel Green",
        members: 3,
        projects: 1,
        budget: "$200K",
        status: "Active"
      }
    ]
  }
];

interface Department {
  id: number;
  name: string;
  manager: string;
  members: number;
  projects: number;
  budget: string;
  status: string;
  location: string;
  email: string;
  phone: string;
  description: string;
  created: string;
  lastActivity: string;
  archived: boolean;
  subdepartments: Array<{
    id: number;
    name: string;
    manager: string;
    members: number;
    projects: number;
    budget: string;
    status: string;
  }>;
}

export default function DepartmentsPage({ open, onClose, onOpenTab }: { 
  open: boolean, 
  onClose: () => void,
  onOpenTab?: (type: string, title?: string) => void 
}) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company: "",
    location: "",
    manager: "",
    budget: "",
    startDate: "",
    teamMembers: [] as string[]
  });

  // Department actions
  const deleteDepartment = (deptId: number) => {
    setDepartments(prev => prev.filter(dept => dept.id !== deptId));
    setShowMoreMenu(null);
  };

  const archiveDepartment = (deptId: number) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === deptId ? { ...dept, archived: true } : dept
    ));
    setShowMoreMenu(null);
  };

  const duplicateDepartment = (dept: Department) => {
    const newDept = {
      ...dept,
      id: Math.max(...departments.map(d => d.id)) + 1,
      name: `${dept.name} (Copy)`,
      status: "Planning"
    };
    setDepartments(prev => [...prev, newDept]);
    setShowMoreMenu(null);
  };

  const exportDepartment = (dept: Department) => {
    const dataStr = JSON.stringify(dept, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dept.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Contact actions
  const contactDepartment = (dept: Department, method: 'email' | 'phone' | 'location') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${dept.email}`);
        break;
      case 'phone':
        window.open(`tel:${dept.phone}`);
        break;
      case 'location':
        window.open(`https://maps.google.com/?q=${encodeURIComponent(dept.location)}`);
        break;
    }
  };

  // Toggle expansion
  const toggleDepartment = (deptId: number) => {
    setExpandedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm;

  // Filter departments
  const filteredDepartments = departments.filter(dept => 
    !dept.archived && (
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Analytics
  const analytics = {
    totalDepartments: departments.filter(d => !d.archived).length,
    totalMembers: departments.filter(d => !d.archived).reduce((sum, dept) => sum + dept.members, 0),
    totalProjects: departments.filter(d => !d.archived).reduce((sum, dept) => sum + dept.projects, 0),
    totalBudget: departments.filter(d => !d.archived).reduce((sum, dept) => {
      const budget = parseFloat(dept.budget.replace(/[^0-9.]/g, ''));
      return sum + budget;
    }, 0)
  };

  const handleCreateDepartment = () => {
    if (formData.name && formData.company) {
      const newDepartment: Department = {
        id: Math.max(...departments.map(d => d.id)) + 1,
        name: formData.name,
        manager: formData.manager || "Unassigned",
        members: formData.teamMembers.length,
        projects: 0,
        budget: formData.budget || "$0",
        status: "Active",
        location: formData.location || "Remote",
        email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        phone: "+1 (555) 123-4567",
        description: formData.description,
        created: new Date().toISOString().split('T')[0],
        lastActivity: "Just now",
        archived: false,
        subdepartments: []
      };
      
      setDepartments(prev => [...prev, newDepartment]);
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        company: "",
        location: "",
        manager: "",
        budget: "",
        startDate: "",
        teamMembers: []
      });
    }
  };

  const toggleMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(member) 
        ? prev.teamMembers.filter(m => m !== member)
        : [...prev.teamMembers, member]
    }));
  };

  const availableMembers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller", "Grace Lee", "Henry Brown"];
  // Companies will be fetched from API
const companies: string[] = [];
  const locations = ["New York", "San Francisco", "London", "Berlin", "Tokyo", "Remote"];
  const managers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen"];

  if (!open) return null;

  return (
    <div className="w-full h-full bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-t-lg bg-blue-50 text-blue-700 font-semibold">
            <Briefcase className="text-blue-500 mr-1" size={20} />
            <span>Departments</span>
          </div>
          <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-red-500" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={16} />
          {showCreateForm ? 'Cancel' : 'New Department'}
        </button>
      </div>

      <div className="p-6">
        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Create New Department</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Department Information */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-3 h-3 text-purple-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Department Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Department Name *</label>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="Enter department name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Company *</label>
                  <select
                    value={formData.company}
                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all resize-none"
                  rows={2}
                  placeholder="Describe the department's role and responsibilities..."
                />
              </div>

              {/* Department Details */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Department Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Location</label>
                  <select
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Manager</label>
                  <select
                    value={formData.manager}
                    onChange={e => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50"
                  >
                    <option value="">Select manager</option>
                    {managers.map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Budget</label>
                  <input
                    value={formData.budget}
                    onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-neutral-50/50 placeholder:text-neutral-400 transition-all"
                    placeholder="e.g., $500,000"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-orange-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Timeline</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  value={formData.startDate} 
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))} 
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-neutral-50/50 transition-all"
                />
              </div>

              {/* Team Members */}
              <div className="flex items-center space-x-2 mb-4 mt-6">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Team Members</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Department Members</label>
                <div className="flex flex-wrap gap-1">
                  {availableMembers.map(member => (
                    <button
                      key={member}
                      type="button"
                      onClick={() => toggleMember(member)}
                      className={`px-2 py-1 rounded-md border text-xs font-medium transition-all ${
                        formData.teamMembers.includes(member) 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300'
                      }`}
                    >
                      {member}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleCreateDepartment}
                  disabled={!formData.name || !formData.company}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Create Department
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Departments</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.totalDepartments}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Members</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.totalMembers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Projects</p>
                <p className="text-2xl font-bold text-neutral-900">{analytics.totalProjects}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+15% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Budget</p>
                <p className="text-2xl font-bold text-neutral-900">${(analytics.totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+5% from last month</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search departments, managers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
            >
              <Filter className="w-4 h-4" />
              More Filters
            </button>
        </div>

        {/* Departments List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              All Departments ({filteredDepartments.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDepartment(dept.id)}
                      className="text-neutral-400 hover:text-neutral-600"
                      >
                        {expandedDepartments.includes(dept.id) ? (
                        <ChevronDown className="w-4 h-4" />
                        ) : (
                        <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-neutral-900">{dept.name}</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {dept.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{dept.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => onOpenTab && onOpenTab("edit-department", `Edit: ${dept.name}`)}
                      title="Edit Department"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={() => setShowMoreMenu(showMoreMenu === dept.id ? null : dept.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {/* Department Actions Menu */}
                    {showMoreMenu === dept.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700 text-left"
                          onClick={() => duplicateDepartment(dept)}
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate Department
                        </button>
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700 text-left"
                          onClick={() => exportDepartment(dept)}
                        >
                          <Download className="w-4 h-4" />
                          Export Department
                        </button>
                        <hr className="my-1" />
                        <button 
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 text-left"
                          onClick={() => deleteDepartment(dept.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Department
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Department Details */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{dept.members} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{dept.projects} projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{dept.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">{dept.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">Created {dept.created}</span>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
                  <button 
                    className="flex items-center gap-1 px-3 py-1 text-xs text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={() => contactDepartment(dept, 'email')}
                  >
                    <Mail className="w-3 h-3" />
                    Email
                  </button>
                  <button 
                    className="flex items-center gap-1 px-3 py-1 text-xs text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={() => contactDepartment(dept, 'phone')}
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </button>
                  <button 
                    className="flex items-center gap-1 px-3 py-1 text-xs text-neutral-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                    onClick={() => contactDepartment(dept, 'location')}
                  >
                    <MapPin className="w-3 h-3" />
                    Location
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDepartments.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No departments found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search or create a new department.</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Department
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 