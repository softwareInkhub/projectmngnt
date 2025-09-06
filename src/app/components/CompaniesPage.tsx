import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// Additional company metadata options
const companySizes = ["Small", "Medium", "Large"];
const companyStatuses = ["Active", "Inactive", "On Hold"];

export default function CompaniesPage({ context }: { context?: { company: string } }) {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [view, setView] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyData>>({
    name: "",
    description: "",
    industry: industries[0],
    size: "Small",
    status: "Active",
    founded: "",
    employees: 0,
    location: "",
    website: "",
    email: "",
    phone: "",
    revenue: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await CompanyApiService.getCompanies();
      
      if (response.success) {
        const companiesData = (response as any).items || response.data || [];
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      } else {
        console.error('Failed to fetch companies:', response.error);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyAction = (company: any, action: string) => {
    switch (action) {
      case 'view':
        if (!company.id || company.id.trim() === '') return;
        router.push(`/companies/${company.id}`);
        break;
      case 'edit':
        setEditingCompany(company);
        setFormData({ ...company });
        setShowEditForm(true);
        setShowCreateForm(false);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this company?')) {
          CompanyApiService.deleteCompany(company.id).then(response => {
            if (response.success) {
              setCompanies(companies.filter(c => c.id !== company.id));
              setSuccessMessage('Company deleted successfully');
            }
          });
        }
        break;
      case 'website':
        company.website && window.open(company.website, '_blank');
        break;
    }
  };

  const filteredCompanies = companies.filter(company =>
    (company.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    && (typeFilter === "All" || company.type === typeFilter)
    && (statusFilter === "All" || company.status === statusFilter)
  );

  // Helper function to get company initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Colorful themes for company cards
  const companyThemes = [
    { bg: 'bg-blue-100', avatar: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    { bg: 'bg-green-100', avatar: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    { bg: 'bg-purple-100', avatar: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    { bg: 'bg-yellow-100', avatar: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    { bg: 'bg-pink-100', avatar: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    { bg: 'bg-indigo-100', avatar: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    { bg: 'bg-cyan-100', avatar: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
    { bg: 'bg-rose-100', avatar: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' }
  ];

  const renderOverview = () => (
    <div className="space-y-4 md:space-y-6">
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCompanies.map((company, index) => {
            const theme = companyThemes[index % companyThemes.length];
            return (
              <div 
                key={company.id} 
                className={`${theme.bg} ${theme.border} rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 group relative cursor-pointer p-4`}
                onClick={() => handleCompanyAction(company, 'view')}
              >
                {/* Company Header with Avatar and Menu */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Company Avatar */}
                    <div className={`w-10 h-10 ${theme.avatar} rounded-full flex items-center justify-center border-2 border-white shadow-sm`}>
                      {company.name.toLowerCase().includes('fabglue') ? (
                        // Special Fabglue logo representation
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">FG</span>
                        </div>
                      ) : (
                        <span className={`text-sm font-bold ${theme.text}`}>
                          {getInitials(company.name)}
                        </span>
                      )}
                    </div>
                    
                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold ${theme.text} truncate group-hover:underline transition-colors`}>
                        {company.name}
                      </h3>
                      <p className="text-base text-gray-600 truncate">
                        {company.industry || "No industry specified"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Three-dot Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenMenuId(openMenuId === company.id ? null : company.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openMenuId === company.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleCompanyAction(company, 'view')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                          <button
                            onClick={() => handleCompanyAction(company, 'edit')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          {company.website && (
                            <button
                              onClick={() => handleCompanyAction(company, 'website')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <ExternalLink size={14} />
                              Visit Website
                            </button>
                          )}
                          <button
                            onClick={() => handleCompanyAction(company, 'delete')}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Company Description */}
                <p className="text-base text-gray-600 mb-3 line-clamp-2">
                  {company.description || "No description provided"}
                </p>
                
                {/* Status and Size Tags */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                    company.status === "Active" ? "bg-green-100 text-green-700" :
                    company.status === "Inactive" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {company.status || "Active"}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-base font-medium bg-blue-100 text-blue-700">
                    {company.size || "Small"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Building2 size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No companies found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-100 border-b border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Companies</h1>
              <p className="text-slate-600 mt-1 text-xl">Manage your companies and organizations</p>
            </div>
          </div>
          
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-2 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200 hover:shadow-md text-xl">
              <Download size={18} />
              Export
            </button>
            <button className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl" onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              New Company
            </button>
          </div>
        </div>
        
        {/* Search and Filters Section */}
        <div className="px-3 md:px-8 pb-2">
          <div className="flex items-center gap-3">
            {/* Filters Button */}
            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm bg-white shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search companies, industries, or descriptions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="All">All Types</option>
                    {companyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="All">All Status</option>
                    {companyStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("All");
                    setStatusFilter("All");
                    setShowFilters(false);
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                >
                  <FilterX className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Mobile Create Button */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-base"
          >
            <Plus size={16} />
            Create Company
          </button>
        </div>

        {/* Create Company Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Create New Company</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              CompanyApiService.createCompany(formData as CompanyData).then(response => {
                if (response.success) {
                  fetchCompanies();
                  setShowCreateForm(false);
                  setSuccessMessage('Company created successfully');
                  setFormData({
                    name: "",
                    description: "",
                    industry: industries[0],
                    size: "Small",
                    status: "Active",
                    founded: "",
                    employees: 0,
                    location: "",
                    website: "",
                    email: "",
                    phone: "",
                    revenue: ""
                  });
                }
              });
            }}>
              {/* Row 1: Company Name, Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input 
                    type="text"
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Size, Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                  <select
                    value={formData.size || "Small"}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status || "Active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {companyStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Founded, Employees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Founded</label>
                  <input 
                    type="text"
                    value={formData.founded || ""} 
                    onChange={(e) => setFormData({ ...formData, founded: e.target.value })} 
                    placeholder="e.g., 2024"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employees</label>
                  <input 
                    type="number"
                    value={formData.employees || 0} 
                    onChange={(e) => setFormData({ ...formData, employees: Number(e.target.value) })} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
              </div>

              {/* Row 4: Location, Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input 
                    type="text"
                    value={formData.location || ""} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <input 
                    type="url"
                    value={formData.website || ""} 
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 5: Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email"
                    value={formData.email || ""} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text"
                    value={formData.phone || ""} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="+1-555-0123"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 6: Revenue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Revenue</label>
                  <input 
                    type="text"
                    value={formData.revenue || ""} 
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} 
                    placeholder="$1M"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {renderOverview()}
      </div>
    </div>
  );
} 

