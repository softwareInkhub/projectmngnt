import { useState, useEffect } from "react";
import {
  Building2, Building, ChevronRight, ChevronDown, Plus, Users, User, FolderKanban, Calendar, BarChart3, Settings, Search, MoreHorizontal, TrendingUp, Clock, CheckCircle, Mail, Phone, MapPin, Globe, Edit, Eye, Download, BookOpen, CheckSquare, Star, FilterX, Grid3X3, List, Heart, ExternalLink, GitCommit, DollarSign, UserCheck, Timer, Flag, Layers, Zap, SortAsc, Square, Play, Pause, StopCircle, RotateCcw, LineChart, Crown, Shield, Trophy, Medal, Users2, UserX, UserCheck2, UserMinus, UserPlus2, Briefcase, Video, MessageSquare, AlertCircle, Info, Award, Paperclip, FileText, BarChart, PieChart, ScatterChart, AreaChart, Gauge, Target, TrendingDown, Activity, Filter, Share2, Archive, Copy, Trash2, ArrowUpRight, ArrowDownRight, Minus, X, Save, ArrowLeft, Tag, AlertCircle as AlertCircleIcon, Calendar as CalendarIcon, Target as TargetIcon, MessageSquare as MessageSquareIcon, CheckSquare as CheckSquareIcon, UserPlus, FileText as FileTextIcon, Bell, Star as StarIcon, Eye as EyeIcon, Share2 as Share2Icon, Download as DownloadIcon, FilterX as FilterXIcon, Grid3X3 as Grid3X3Icon, List as ListIcon, Heart as HeartIcon, ExternalLink as ExternalLinkIcon, GitCommit as GitCommitIcon, DollarSign as DollarSignIcon, UserCheck as UserCheckIcon, Timer as TimerIcon, Flag as FlagIcon, Layers as LayersIcon, Zap as ZapIcon, TrendingDown as TrendingDownIcon, SortAsc as SortAscIcon, Square as SquareIcon, Play as PlayIcon, Pause as PauseIcon, StopCircle as StopCircleIcon, RotateCcw as RotateCcwIcon, LineChart as LineChartIcon, Crown as CrownIcon, Shield as ShieldIcon, Trophy as TrophyIcon, Medal as MedalIcon, Users2 as Users2Icon, UserX as UserXIcon, UserCheck2 as UserCheck2Icon, UserMinus as UserMinusIcon, UserPlus2 as UserPlus2Icon, Briefcase as BriefcaseIcon, Video as VideoIcon, MessageSquare as MessageSquareIcon2, AlertCircle as AlertCircleIcon2, Info as InfoIcon, Award as AwardIcon, Paperclip as PaperclipIcon, FileText as FileTextIcon2, BarChart as BarChartIcon, PieChart as PieChartIcon, ScatterChart as ScatterChartIcon, AreaChart as AreaChartIcon, Gauge as GaugeIcon, Target as TargetIcon2, TrendingDown as TrendingDownIcon2, Activity as ActivityIcon, Filter as FilterIcon, Share2 as Share2Icon2, Archive as ArchiveIcon, Copy as CopyIcon, Trash2 as Trash2Icon, ArrowUpRight as ArrowUpRightIcon, ArrowDownRight as ArrowDownRightIcon, Minus as MinusIcon
} from "lucide-react";
import { CompanyApiService, CompanyData } from "../utils/companyApi";

const companyTypes = [
  "Technology",
  "Research", 
  "Consulting",
  "Manufacturing",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Media",
  "Transportation"
];

const industries = [
  "Software Development",
  "IT Services",
  "R&D",
  "Consulting",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Media",
  "Transportation"
];

const priorities = ["Low", "Medium", "High", "Critical"];

export default function CompaniesPage({ context }: { context?: { company: string } }) {
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [view, setView] = useState("overview");
  const [expandedDepartments, setExpandedDepartments] = useState<number[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
  const [expandedSprints, setExpandedSprints] = useState<number[]>([]);
  const [expandedStories, setExpandedStories] = useState<number[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [expandedSubprojects, setExpandedSubprojects] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const availableTags = [
    "AI", "Enterprise", "SaaS", "Cloud", "Startup", 
    "Innovation", "Research", "Consulting", "Manufacturing", "Healthcare"
  ];

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyData>>({
    name: "",
    description: "",
    industry: industries[0],
    status: "Active",
    founded: "",
    employees: 0,
    location: "",
    website: "",
    email: "",
    phone: "",
    revenue: ""
  });

  // API Integration
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await CompanyApiService.getCompanies();
      
      if (response.success) {
        const companiesData = (response as any).items || response.data || [];
        if (Array.isArray(companiesData)) {
          setCompanies(companiesData);
        } else {
          console.warn('Companies data is not an array:', companiesData);
          setCompanies([]);
        }
      } else {
        console.error('Failed to fetch companies:', response.error);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Menu management functions
  const toggleMenu = (companyId: string) => {
    setOpenMenuId(openMenuId === companyId ? null : companyId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Company action functions
  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || "",
      description: company.description || "",
      industry: company.industry || industries[0],
      status: company.status || "Active",
      founded: company.founded || "",
      employees: company.employees || 0,
      location: company.location || "",
      website: company.website || "",
      email: company.email || "",
      phone: company.phone || "",
      revenue: company.revenue || ""
    });
    setShowEditForm(true);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        const response = await CompanyApiService.deleteCompany(companyId);
        if (response.success) {
          setCompanies(companies.filter(c => c.id !== companyId));
          setSuccessMessage('Company deleted successfully');
        } else {
          console.error('Failed to delete company:', response.error);
        }
      } catch (err) {
        console.error('Error deleting company:', err);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await CompanyApiService.createCompany(formData as CompanyData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          name: "",
          description: "",
          industry: industries[0],
          status: "Active",
          founded: "",
          employees: 0,
          location: "",
          website: "",
          email: "",
          phone: "",
          revenue: ""
        });
        fetchCompanies();
        setSuccessMessage('Company created successfully');
      } else {
        console.error('Failed to create company:', response.error);
      }
    } catch (err) {
      console.error('Error creating company:', err);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    
    try {
      const response = await CompanyApiService.updateCompany(editingCompany.id, formData as CompanyData);
      if (response.success) {
        setShowEditForm(false);
        setEditingCompany(null);
        setFormData({
          name: "",
          description: "",
          industry: industries[0],
          status: "Active",
          founded: "",
          employees: 0,
          location: "",
          website: "",
          email: "",
          phone: "",
          revenue: ""
        });
        fetchCompanies();
        setSuccessMessage('Company updated successfully');
      } else {
        console.error('Failed to update company:', response.error);
      }
    } catch (err) {
      console.error('Error updating company:', err);
    }
  };

  const handleCompanyAction = (company: any, action: string) => {
    switch (action) {
      case 'edit':
        handleEditCompany(company);
        break;
      case 'delete':
        handleDeleteCompany(company.id);
        break;
      case 'view':
        console.log('View company:', company);
        break;
      case 'website':
        if (company.website) {
          window.open(company.website, '_blank');
        }
        break;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
  };

  // Analytics data
  const analytics = {
    totalCompanies: companies.length,
    totalProjects: companies.reduce((sum, company) => sum + (company.projects?.length || 0), 0),
    totalMembers: companies.reduce((sum, company) => sum + (company.members?.length || 0), 0),
    avgSatisfaction: 92
  };

  const filteredCompanies = Array.isArray(companies) ? companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.tags || []).some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "All" || company.type === typeFilter;
    const matchesStatus = statusFilter === "All" || company.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  }) : [];

  const selectedCompanyData = Array.isArray(companies) ? companies.find(c => c.id === selectedCompany) : undefined;

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading companies...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalCompanies}</h3>
            <p className="text-slate-600 text-sm font-medium">Total Companies</p>
            <div className="mt-2 text-xs text-slate-500">+2 this quarter</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                <FolderKanban className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalProjects}</h3>
            <p className="text-slate-600 text-sm font-medium">Total Projects</p>
            <div className="mt-2 text-xs text-slate-500">+8 this month</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalMembers}</h3>
            <p className="text-slate-600 text-sm font-medium">Total Members</p>
            <div className="mt-2 text-xs text-slate-500">+12 this month</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.avgSatisfaction}%</h3>
            <p className="text-slate-600 text-sm font-medium">Avg Satisfaction</p>
            <div className="mt-2 text-xs text-slate-500">+3% from last month</div>
          </div>
        </div>

        {/* Companies Grid/List View */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          {viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCompanies.map((company, index) => (
                <div 
                  key={company.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{company.name}</h3>
                          <p className="text-sm text-slate-600">{company.industry}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(company.id)}
                          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {openMenuId === company.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                            <button
                              onClick={() => handleCompanyAction(company, 'view')}
                              className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleCompanyAction(company, 'edit')}
                              className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            {company.website && (
                              <button
                                onClick={() => handleCompanyAction(company, 'website')}
                                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Visit Website
                              </button>
                            )}
                            <button
                              onClick={() => handleCompanyAction(company, 'delete')}
                              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.status === "Active" ? "bg-green-100 text-green-700" :
                        company.status === "Inactive" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {company.status}
                      </span>
                      {company.employees && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {company.employees} employees
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location || 'Location not specified'}</span>
                      </div>
                      {company.founded && (
                        <span>Founded {company.founded}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Industry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{company.name}</div>
                              <div className="text-sm text-slate-500">{company.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{company.industry}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            company.status === "Active" ? "bg-green-100 text-green-700" :
                            company.status === "Inactive" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{company.employees || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{company.location || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCompanyAction(company, 'view')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCompanyAction(company, 'edit')}
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCompanyAction(company, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {filteredCompanies.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Building2 size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No companies found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Companies</h1>
            <p className="text-slate-600">Manage and monitor all your companies</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Company
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="group flex items-center gap-2 px-4 py-3 border border-white/20 rounded-xl hover:bg-white/50 transition-all duration-200 hover:scale-105 focus-ring"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Technology">Technology</option>
                  <option value="Research">Research</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>

                <select className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Industries</option>
                  <option>Software Development</option>
                  <option>IT Services</option>
                  <option>R&D</option>
                  <option>Consulting</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <FilterX size={16} />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
          <div className="flex space-x-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "projects", label: "Projects", icon: FolderKanban },
              { id: "teams", label: "Teams", icon: Users },
              { id: "departments", label: "Departments", icon: Building },
              { id: "sprints", label: "Sprints", icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    view === tab.id
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {view === "overview" && renderOverview()}
        {view === "projects" && <div className="text-center py-12 text-slate-600">Projects view coming soon...</div>}
        {view === "teams" && <div className="text-center py-12 text-slate-600">Teams view coming soon...</div>}
        {view === "departments" && <div className="text-center py-12 text-slate-600">Departments view coming soon...</div>}
        {view === "sprints" && <div className="text-center py-12 text-slate-600">Sprints view coming soon...</div>}
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Create New Company</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditForm && editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Edit Company</h2>
            <form onSubmit={handleUpdateCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingCompany(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
} 