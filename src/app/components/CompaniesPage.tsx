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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const availableTags = [
    "AI", "Enterprise", "SaaS", "Cloud", "Startup", 
    "Innovation", "Research", "Consulting", "Manufacturing", "Healthcare"
  ];

    const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
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
      size: company.size || "Small",
      status: company.status || "Active",
      founded: company.founded || "",
      employees: company.employees || 0,
      location: company.location || "",
      website: company.website || "",
      email: company.email || "",
      phone: company.phone || "",
      revenue: company.revenue || ""
    });
    setShowCreateForm(false);
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
        setShowCreateForm(false);
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
        console.log('=== COMPANY NAVIGATION DEBUG ===');
        console.log('Navigating to company:', company.id);
        console.log('Navigation URL:', `/companies/${company.id}`);
        console.log('Company type:', typeof company.id);
        console.log('Company ID length:', company.id?.length);
        console.log('Is company ID empty?', !company.id || company.id.trim() === '');
        
        // Ensure we have a valid company ID
        if (!company.id || company.id.trim() === '') {
          console.error('Invalid company ID:', company.id);
          return;
        }
        
        // Navigate to the company detail page
        router.push(`/companies/${company.id}`);
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
      <div className="space-y-4 md:space-y-6">
        {/* Enhanced Analytics Cards - 2x2 Format */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 animate-fade-in">
          <div className="bg-white rounded-xl border-2 border-slate-300 p-1 h-12 flex items-center shadow-sm">
            <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center mr-1">
              <Building2 className="w-3 h-3 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-slate-900">{analytics.totalCompanies}</h3>
              <p className="text-[8px] font-medium text-slate-600">Total Companies</p>
          </div>
            <div className="flex items-center gap-0.5 ml-0.5">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[8px] font-medium text-slate-500">+2</span>
            </div>
        </div>

          <div className="bg-white rounded-xl border-2 border-slate-300 p-1 h-12 flex items-center shadow-sm">
            <div className="w-5 h-5 bg-emerald-50 rounded-lg flex items-center justify-center mr-1">
              <FolderKanban className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-slate-900">{analytics.totalProjects}</h3>
              <p className="text-[8px] font-medium text-slate-600">Total Projects</p>
          </div>
            <div className="flex items-center gap-0.5 ml-0.5">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[8px] font-medium text-slate-500">+8</span>
            </div>
        </div>

          <div className="bg-white rounded-xl border-2 border-slate-300 p-1 h-12 flex items-center shadow-sm">
            <div className="w-5 h-5 bg-purple-50 rounded-lg flex items-center justify-center mr-1">
              <Users className="w-3 h-3 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-slate-900">{analytics.totalMembers}</h3>
              <p className="text-[8px] font-medium text-slate-600">Total Members</p>
          </div>
            <div className="flex items-center gap-0.5 ml-0.5">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[8px] font-medium text-slate-500">+12</span>
            </div>
        </div>

          <div className="bg-white rounded-xl border-2 border-slate-300 p-1 h-12 flex items-center shadow-sm">
            <div className="w-5 h-5 bg-orange-50 rounded-lg flex items-center justify-center mr-1">
              <Target className="w-3 h-3 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-slate-900">{analytics.avgSatisfaction}%</h3>
              <p className="text-[8px] font-medium text-slate-600">Avg Satisfaction</p>
          </div>
            <div className="flex items-center gap-0.5 ml-0.5">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[8px] font-medium text-slate-500">+3%</span>
            </div>
        </div>
      </div>

      {/* Companies Grid/List View */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        {viewMode === "grid" ? (
            // Grid View - Mobile Optimized (2 cards side by side)
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredCompanies.map((company, index) => (
              <div 
                key={company.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group relative cursor-pointer"
                  onClick={() => handleCompanyAction(company, 'view')}
              >
                  <div className="p-3 sm:p-4">
                {/* Company Header */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                        {company.name}
                      </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {company.industry || "No industry specified"}
                      </p>
                    </div>
                      {/* Three-dot menu */}
                      <div className="relative flex-shrink-0 ml-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const menu = e.currentTarget.nextElementSibling as HTMLElement;
                            if (menu) {
                              menu.classList.toggle('hidden');
                            }
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 hidden">
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
                    </div>
                  </div>

                    {/* Company Description */}
                    <p className="text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2">{company.description || "No description provided"}</p>
                    
                    {/* Pill Badges */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.status === "Active" ? "bg-green-100 text-green-700" :
                        company.status === "Inactive" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {company.status || "Active"}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {company.size || "Small"}
                      </span>
                  </div>
                      </div>
                                    </div>
              ))}
            </div>
          ) : (
            // List View - Mobile Optimized
            <div className="space-y-3">
              {filteredCompanies.map((company, index) => (
                <div key={`${company.id}-list-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group cursor-pointer" onClick={() => handleCompanyAction(company, 'view')}>
                  <div className="p-4">
                    {/* Company Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Company Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        
                        {/* Company Title & Badges */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {company.name}
                            </h3>
                            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                company.status === "Active" ? "bg-green-100 text-green-700" :
                                company.status === "Inactive" ? "bg-red-100 text-red-700" :
                                "bg-yellow-100 text-yellow-700"
                              }`}>
                                {company.status || "Active"}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {company.size || "Small"}
                              </span>
                            </div>
                          </div>
                            </div>
                        </div>
                      </div>
                      
                    {/* Company Details - Compact 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{company.industry || "N/A"}</span>
                              </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{company.employees || 0} employees</span>
                            </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{company.location || "N/A"}</span>
                        </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="truncate">Founded {company.founded || "N/A"}</span>
                      </div>
                    </div>
                    
                    {/* Company Description */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {company.description || "No description provided"}
                      </p>
                      </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        View Details
                      </button>
                        </div>
                  </div>
                </div>
              ))}
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg">
            <Building2 className="text-white mr-1" size={16} />
            <span className="text-sm sm:text-base">Companies</span>
            </div>
          </div>
                
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            className="hidden sm:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
                     <button
             onClick={() => setShowCreateForm(true)}
            className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring text-sm sm:text-base"
           >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">New Company</span>
            <span className="sm:hidden">Add</span>
           </button>
          
          {/* Small Hamburger Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 transition-all duration-200 focus-ring"
          >
            <div className="w-4 h-4 flex flex-col justify-center items-center gap-0.5">
              <div className={`w-3 h-0.5 bg-slate-600 transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-3 h-0.5 bg-slate-600 transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></div>
              <div className={`w-3 h-0.5 bg-slate-600 transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1' : ''}`}></div>
                </div>
          </button>
              </div>
            </div>

      {/* Small Hamburger Dropdown Menu */}
      {showMobileMenu && (
        <div className="absolute top-16 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in min-w-48">
          <div className="p-2 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "projects", label: "Projects", icon: FolderKanban },
              { id: "teams", label: "Teams", icon: Users },
              { id: "departments", label: "Departments", icon: Building },
              { id: "sprints", label: "Sprints", icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = view === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setView(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-auto"></div>
                  )}
                </button>
              );
            })}
                  </div>
                </div>
      )}

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

        {/* Compact Filters, Search, and View Toggle - Mobile Optimized */}
        <div className="space-y-3">
          {/* Filters, Search, and View Toggle - Compact */}
          <div className="flex items-center gap-3">
            {/* Filters Button */}
            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            {/* Search Bar - Compact */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search companies, industries, or descriptions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* View Toggle - Compact */}
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

          {/* Filters Panel - Compact */}
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

        {/* Inline Create Company Form */}
        {showCreateForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <h2 className="text-lg font-semibold mb-3">Create New Company</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Row: Name, Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        required
                      />
                      </div>
                    <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Industry</label>
                        <select
                          value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                          ))}
                        </select>
                    </div>
                  </div>

              {/* Row: Size, Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Size</label>
                  <select
                    value={(formData as any).size || "Small"}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    {companySizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                      </div>
                    <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                        <select
                    value={formData.status || "Active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    {companyStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                        </select>
                    </div>
                  </div>

              {/* Row: Founded, Employees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Founded</label>
                      <input
                        type="text"
                    value={formData.founded || ""}
                    onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="e.g., 2024"
                  />
                      </div>
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Employees</label>
                                             <input
                         type="number"
                    value={formData.employees ?? 0}
                    onChange={(e) => setFormData({ ...formData, employees: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    min={0}
                  />
                </div>
              </div>

              {/* Row: Location, Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                      </div>
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
                      <input
                        type="url"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="https://example.com"
                  />
                    </div>
                  </div>

              {/* Row: Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="name@company.com"
                  />
                      </div>
                  <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                      <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="+1-555-0123"
                  />
                    </div>
                  </div>

              {/* Row: Revenue */}
                  <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Revenue</label>
                      <input
                  type="text"
                  value={formData.revenue || ""}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  placeholder="$1M"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Cancel
                  </button>
                  <button
                    type="submit"
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                  Create
                  </button>
              </div>
            </form>
          </div>
        )}



        {/* View Tabs - Desktop */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
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

      {/* Create Company Modal removed in favor of inline form */}

      {/* Inline Edit Company Form */}
      {showEditForm && editingCompany && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-4">
          <h2 className="text-xl font-semibold mb-4">Edit Company</h2>
          <form onSubmit={handleUpdateCompany} className="space-y-6">
            {/* Row: Name, Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            {/* Row: Size, Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                <select
                  value={(formData as any).size || "Small"}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {companySizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                  {companyStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row: Founded, Employees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Founded</label>
                <input
                  type="text"
                  value={formData.founded || ""}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employees</label>
                <input
                  type="number"
                  value={formData.employees ?? 0}
                  onChange={(e) => setFormData({ ...formData, employees: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
              </div>
            </div>

            {/* Row: Location, Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Row: Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1-555-0123"
                />
              </div>
            </div>

            {/* Row: Revenue */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Revenue</label>
              <input
                type="text"
                value={formData.revenue || ""}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$1M"
              />
            </div>

            {/* Actions */}
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