"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Target, 
  Clock, 
  Tag, 
  FileText, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Folder, 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  Heart, 
  MoreHorizontal, 
  Plus, 
  Search, 
  X, 
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Award,
  Star,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import { CompanyApiService, CompanyData } from '../../utils/companyApi';
import { ProjectApiService } from '../../utils/projectApi';
import { TaskApiService, TaskData } from '../../utils/taskApi';
import { TeamApiService, TeamData } from '../../utils/teamApi';

// Status colors
const statusColors = {
  'Active': 'bg-green-100 text-green-700 border-green-200',
  'Inactive': 'bg-red-100 text-red-700 border-red-200',
  'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Suspended': 'bg-gray-100 text-gray-700 border-gray-200'
};

// Priority colors
const priorityColors = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDemoCompany, setIsDemoCompany] = useState(false);

  // Fetch company data
  const fetchCompany = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching company with ID:', companyId);
      const response = await CompanyApiService.getCompany(companyId);
      
      console.log('Company API response:', response);

      if (response.success) {
        let companyData: CompanyData | null = null;
        
        if (response.data) {
          companyData = response.data as CompanyData;
        } else if ((response as any).item) {
          companyData = (response as any).item as CompanyData;
        } else if (response.items && Array.isArray(response.items) && response.items.length > 0) {
          companyData = response.items[0] as CompanyData;
        }

        if (companyData) {
          console.log('Found real company data:', companyData);
          setCompany(companyData);
          setIsDemoCompany(false);
        } else {
          console.log('No company data found in response, checking if company exists...');
          // Try to get all companies to see if this company exists
          const allCompaniesResponse = await CompanyApiService.getCompanies();
          if (allCompaniesResponse.success && allCompaniesResponse.data) {
            const allCompanies = Array.isArray(allCompaniesResponse.data) ? allCompaniesResponse.data : [];
            const foundCompany = allCompanies.find(c => c.id === companyId);
            if (foundCompany) {
              console.log('Found company in all companies list:', foundCompany);
              setCompany(foundCompany);
              setIsDemoCompany(false);
            } else {
              throw new Error('Company not found');
            }
          } else {
            throw new Error('No company data found in response');
          }
        }
      } else {
        throw new Error(response.error || 'Failed to fetch company');
      }
    } catch (err) {
      console.error('Error fetching company:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company');
      // Don't create demo company - only show real data
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // Fetch company projects
  const fetchCompanyProjects = useCallback(async () => {
    try {
      const response = await ProjectApiService.getProjects();
      if (response.success && response.data) {
        const allProjects = Array.isArray(response.data) ? response.data : [];
        // Filter projects that belong to this company
        const companyProjects = allProjects.filter(p => p.company === company?.name);
        setProjects(companyProjects);
      }
    } catch (error) {
      console.error('Error fetching company projects:', error);
    }
  }, [company?.name]);

  // Fetch company tasks
  const fetchCompanyTasks = useCallback(async () => {
    try {
      const response = await TaskApiService.getTasks();
      if (response.success && response.data) {
        const allTasks = Array.isArray(response.data) ? response.data : [];
        // Filter tasks that belong to this company's projects
        const companyTasks = allTasks.filter(t => 
          projects.some(p => p.name === t.project)
        );
        setTasks(companyTasks);
      }
    } catch (error) {
      console.error('Error fetching company tasks:', error);
    }
  }, [projects]);

  // Fetch company teams
  const fetchCompanyTeams = useCallback(async () => {
    try {
      const response = await TeamApiService.getTeams();
      if (response.success && response.data) {
        const allTeams = Array.isArray(response.data) ? response.data : [];
        // Filter teams that belong to this company's projects
        const companyTeams = allTeams.filter(t => 
          projects.some(p => p.name === t.project)
        );
        setTeams(companyTeams);
      }
    } catch (error) {
      console.error('Error fetching company teams:', error);
    }
  }, [projects]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Add any dropdown handling if needed
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Main data fetching effect
  useEffect(() => {
    fetchCompany();
  }, [companyId, fetchCompany]);

  // Fetch related data when company is loaded
  useEffect(() => {
    if (company) {
      fetchCompanyProjects();
    }
  }, [company, fetchCompanyProjects]);

  // Fetch teams when projects are loaded
  useEffect(() => {
    if (projects.length > 0) {
      fetchCompanyTeams();
    }
  }, [projects, fetchCompanyTeams]);

  // Fetch tasks when projects are loaded
  useEffect(() => {
    if (projects.length > 0) {
      fetchCompanyTasks();
    }
  }, [projects, fetchCompanyTasks]);

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Company</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Company Not Found</h2>
          <p className="text-slate-600 mb-4">The company you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-b border-green-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Company Details</h1>
                <p className="text-sm text-slate-500">View and manage company information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Main Content */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
           {/* Main Content Area */}
           <div className="lg:col-span-3">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200">
               {/* Company Header */}
               <div className="p-4 sm:p-6 border-b border-slate-200">
                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                   <div className="flex items-center gap-2 sm:gap-3">
                     <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                     <div className="min-w-0 flex-1">
                       <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 truncate">{company.name}</h2>
                       <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                   <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(company.status || 'Active')}`}>
                            {company.status || 'Active'}
                          </span>
                                                   <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            {company.industry || 'Technology'}
                          </span>
                       </div>
                     </div>
                   </div>
                   
                   
                 </div>

                 <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">{company.description}</p>

                 {/* Company Stats */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                   <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                     <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{projects.length}</div>
                     <div className="text-xs text-slate-600">Projects</div>
                   </div>
                   <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                     <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{teams.length}</div>
                     <div className="text-xs text-slate-600">Teams</div>
                   </div>
                   <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                     <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{tasks.length}</div>
                     <div className="text-xs text-slate-600">Tasks</div>
                   </div>
                   <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-lg">
                     <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{company.employees}</div>
                     <div className="text-xs text-slate-600">Employees</div>
                   </div>
                 </div>
               </div>

                             {/* Tabs */}
               <div className="border-b border-slate-200">
                 <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 px-4 sm:px-6 overflow-x-auto">
                   {[
                     { id: 'overview', label: 'Overview', icon: FileText },
                     { id: 'projects', label: 'Projects', icon: Folder },
                     { id: 'teams', label: 'Teams', icon: Users },
                     { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                     { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                   ].map((tab) => {
                     const Icon = tab.icon;
                     return (
                       <button
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id)}
                         className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors whitespace-nowrap ${
                           activeTab === tab.id
                             ? 'border-blue-500 text-blue-600'
                             : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                         }`}
                       >
                         <Icon size={14} className="sm:w-4 sm:h-4" />
                         {tab.label}
                       </button>
                     );
                   })}
                 </nav>
               </div>

                             {/* Tab Content */}
               <div className="p-4 sm:p-6">
                 {activeTab === 'overview' && (
                   <div className="space-y-4 sm:space-y-6">
                     {/* Company Information */}
                     <div>
                       <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Company Information</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                         <div className="space-y-2 sm:space-y-3">
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <Building size={12} className="sm:w-3.5 sm:h-3.5" />
                               Industry
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">{company.industry}</p>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <Users size={12} className="sm:w-3.5 sm:h-3.5" />
                               Company Size
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">{company.size}</p>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                               Founded
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">{company.founded}</p>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <DollarSign size={12} className="sm:w-3.5 sm:h-3.5" />
                               Revenue
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">{company.revenue}</p>
                           </div>
                         </div>
                         
                         <div className="space-y-2 sm:space-y-3">
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <Globe size={12} className="sm:w-3.5 sm:h-3.5" />
                               Website
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">
                               <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                 {company.website}
                               </a>
                             </p>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
                               Email
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">
                               <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline break-all">
                                 {company.email}
                               </a>
                             </p>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                               Phone
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900">
                               <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">
                                 {company.phone}
                               </a>
                             </p>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1 sm:gap-2">
                               <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                               Address
                             </label>
                             <p className="text-xs sm:text-sm text-slate-900 break-words">{company.address}</p>
                           </div>
                         </div>
                       </div>
                     </div>

                                         {/* Tags */}
                     {company.tags && (
                       <div>
                         <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-1 sm:gap-2">
                           <Tag size={12} className="sm:w-3.5 sm:h-3.5" />
                           Tags
                         </h4>
                         <div className="flex flex-wrap gap-1 sm:gap-2">
                           {company.tags.split(',').map((tag, index) => (
                             <span
                               key={index}
                               className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                             >
                               {tag.trim()}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                  </div>
                )}

                                 {activeTab === 'projects' && (
                   <div>
                     <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Company Projects</h3>
                     {projects.length > 0 ? (
                       <div className="space-y-2 sm:space-y-3">
                         {projects.map((project) => (
                           <div
                             key={project.id}
                             className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200"
                           >
                             <div className="flex items-center justify-between">
                               <div className="min-w-0 flex-1">
                                 <h4 className="font-medium text-slate-900 truncate">{project.name}</h4>
                                 <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{project.description}</p>
                                 <div className="flex items-center gap-1 sm:gap-2 mt-2">
                                   <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                     {project.status}
                                   </span>
                                   <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                                     {project.priority}
                                   </span>
                                 </div>
                               </div>
                               <div className="text-right flex-shrink-0 ml-2">
                                 <div className="text-xs sm:text-sm font-medium text-slate-900">{project.progress}%</div>
                                 <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-1.5 sm:h-2 mt-1">
                                   <div 
                                     className="bg-blue-600 h-1.5 sm:h-2 rounded-full"
                                     style={{ width: `${project.progress}%` }}
                                   />
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-6 sm:py-8 text-slate-500">
                         <Folder className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300" />
                         <p className="text-sm sm:text-base">No projects found</p>
                         <p className="text-xs sm:text-sm">This company has no projects yet</p>
                       </div>
                     )}
                   </div>
                 )}

                                 {activeTab === 'teams' && (
                   <div>
                     <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Company Teams</h3>
                     {teams.length > 0 ? (
                       <div className="space-y-2 sm:space-y-3">
                         {teams.map((team) => (
                           <div
                             key={team.id}
                             className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200"
                           >
                             <div className="flex items-center justify-between">
                               <div className="min-w-0 flex-1">
                                 <h4 className="font-medium text-slate-900 truncate">{team.name}</h4>
                                 <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{team.description}</p>
                                                                   <div className="flex items-center gap-1 sm:gap-2 mt-2">
                                    <span className="text-xs text-slate-600">
                                      {(() => {
                                        try {
                                          const members = typeof team.members === 'string' ? JSON.parse(team.members) : team.members;
                                          return Array.isArray(members) ? members.length : 0;
                                        } catch {
                                          return 0;
                                        }
                                      })()} members
                                    </span>
                                    <span className="text-xs text-slate-600">
                                      • {team.project}
                                    </span>
                                  </div>
                               </div>
                                                               <div className="text-right flex-shrink-0 ml-2">
                                  <div className="text-xs sm:text-sm font-medium text-slate-900">
                                    {team.health || 'Good'}
                                  </div>
                                </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-6 sm:py-8 text-slate-500">
                         <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300" />
                         <p className="text-sm sm:text-base">No teams found</p>
                         <p className="text-xs sm:text-sm">This company has no teams yet</p>
                       </div>
                     )}
                   </div>
                 )}

                                 {activeTab === 'tasks' && (
                   <div>
                     <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Company Tasks</h3>
                     {tasks.length > 0 ? (
                       <div className="space-y-2 sm:space-y-3">
                         {tasks.map((task) => (
                           <div
                             key={task.id}
                             className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200"
                           >
                             <div className="flex items-center justify-between">
                               <div className="min-w-0 flex-1">
                                 <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                                 <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{task.description}</p>
                                 <div className="flex items-center gap-1 sm:gap-2 mt-2">
                                   <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                     {task.status}
                                   </span>
                                   <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                     {task.priority}
                                   </span>
                                   <span className="text-xs text-slate-600 truncate">
                                     • {task.project}
                                   </span>
                                 </div>
                               </div>
                               <div className="text-right flex-shrink-0 ml-2">
                                 <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                                   {task.assignee}
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-6 sm:py-8 text-slate-500">
                         <CheckSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300" />
                         <p className="text-sm sm:text-base">No tasks found</p>
                         <p className="text-xs sm:text-sm">This company has no tasks yet</p>
                       </div>
                     )}
                   </div>
                 )}

                                 {activeTab === 'analytics' && (
                   <div>
                     <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Company Analytics</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                       <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                         <h4 className="font-medium text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Project Status Distribution</h4>
                         <div className="space-y-1 sm:space-y-2">
                           <div className="flex justify-between text-xs sm:text-sm">
                             <span>Active</span>
                             <span>{projects.filter(p => p.status === 'Active').length}</span>
                           </div>
                           <div className="flex justify-between text-xs sm:text-sm">
                             <span>Completed</span>
                             <span>{projects.filter(p => p.status === 'Completed').length}</span>
                           </div>
                           <div className="flex justify-between text-xs sm:text-sm">
                             <span>On Hold</span>
                             <span>{projects.filter(p => p.status === 'On Hold').length}</span>
                           </div>
                         </div>
                       </div>
                       
                       <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                         <h4 className="font-medium text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Task Status Distribution</h4>
                         <div className="space-y-1 sm:space-y-2">
                           <div className="flex justify-between text-xs sm:text-sm">
                             <span>To Do</span>
                             <span>{tasks.filter(t => t.status === 'To Do').length}</span>
                           </div>
                           <div className="flex justify-between text-xs sm:text-sm">
                             <span>In Progress</span>
                             <span>{tasks.filter(t => t.status === 'In Progress').length}</span>
                           </div>
                           <div className="flex justify-between text-xs sm:text-sm">
                             <span>Done</span>
                             <span>{tasks.filter(t => t.status === 'Done').length}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>

                     {/* Sidebar */}
           <div className="lg:col-span-1">
             <div className="space-y-4 sm:space-y-6">
               {/* Quick Stats */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                 <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Quick Stats</h3>
                 <div className="space-y-3 sm:space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-xs sm:text-sm text-slate-600">Total Projects</span>
                     <span className="text-xs sm:text-sm font-medium text-slate-900">{projects.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs sm:text-sm text-slate-600">Active Projects</span>
                     <span className="text-xs sm:text-sm font-medium text-slate-900">
                       {projects.filter(p => p.status === 'Active').length}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs sm:text-sm text-slate-600">Total Teams</span>
                     <span className="text-xs sm:text-sm font-medium text-slate-900">{teams.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs sm:text-sm text-slate-600">Total Tasks</span>
                     <span className="text-xs sm:text-sm font-medium text-slate-900">{tasks.length}</span>
                   </div>
                 </div>
               </div>

               {/* Company Meta */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                 <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Company Meta</h3>
                 <div className="space-y-2 sm:space-y-3">
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Created</label>
                     <p className="text-xs sm:text-sm text-slate-900">{company.createdAt}</p>
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Last Updated</label>
                     <p className="text-xs sm:text-sm text-slate-900">{company.updatedAt}</p>
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Company ID</label>
                     <p className="text-xs sm:text-sm text-slate-900 font-mono break-all">{company.id}</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
