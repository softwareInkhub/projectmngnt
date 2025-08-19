"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { CompanyApiService, CompanyData } from "../utils/companyApi";
import { 
  X, 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Archive,
  Copy,
  Share2,
  Download,
  Eye,
  Clock,
  CheckCircle,
  CheckSquare,
  AlertCircle,
  Star,
  GitBranch,
  BarChart3,
  Zap,
  Award,
  TrendingDown,
  FilterX,
  SortAsc,
  Grid3X3,
  List,
  Bell,
  MessageSquare,
  Heart,
  ExternalLink,
  GitCommit,
  Activity,
  DollarSign,
  CalendarDays,
  UserCheck,
  Timer,
  Flag,
  Layers,
  ChevronDown,
  Save,
  ArrowLeft,
  Building,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Globe,
  UserPlus,
  Settings,
  FolderKanban,
  BarChart2,
  ChevronUp,
  MoreHorizontal
} from "lucide-react";

// Status and priority colors for cards
const statusColors = {
  "Planning": "bg-blue-100 text-blue-700",
  "Active": "bg-green-100 text-green-700",
  "On Hold": "bg-orange-100 text-orange-700",
  "Completed": "bg-emerald-100 text-emerald-700",
  "Cancelled": "bg-red-100 text-red-700"
};

const priorityColors = {
  "Low": "bg-green-100 text-green-700",
  "Medium": "bg-yellow-100 text-yellow-700",
  "High": "bg-red-100 text-red-700",
  "Critical": "bg-purple-100 text-purple-700"
};

interface ProjectsAnalyticsPageProps {
  onOpenTab?: (tabType: string, context?: Record<string, unknown>) => void;
  onViewProject?: (project: any) => void;
}

export default function ProjectsAnalyticsPage({ onOpenTab, onViewProject }: ProjectsAnalyticsPageProps = {}) {
  const router = useRouter();
  
  // API state
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [projectStatus, setProjectStatus] = useState("Planning");
  const [projectPriority, setProjectPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);


  const statuses = ["Planning", "Active", "Completed", "On Hold", "Cancelled"];
  const priorities = ["Low", "Medium", "High", "Critical"];
  const availableMembers = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Wilson", "Emma Chen", "Frank Miller"];

  const toggleMember = (member: string) => {
    setSelectedMembers(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member) 
        : [...prev, member]
    );
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProjectApiService.getProjects();
      
      if (response.success) {
        const projectsData = response.items || response.data || [];
        console.log('Projects fetched from API:', projectsData);
        setProjects(Array.isArray(projectsData) ? projectsData as ProjectData[] : []);
      } else {
        console.error('Failed to fetch projects:', response.error);
        setError('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      const response = await CompanyApiService.getCompanies();
      
      if (response.success) {
        const companiesData = response.items || response.data || [];
        console.log('Companies fetched from API:', companiesData);
        setCompanies(Array.isArray(companiesData) ? companiesData as CompanyData[] : []);
      } else {
        console.error('Failed to fetch companies:', response.error);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Load projects and companies on component mount
  useEffect(() => {
    fetchProjects();
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      (project.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (project.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
    company: string;
    status: string;
    priority: string;
    startDate: string;
    endDate: string;
    budget: string;
    teamMembers: string[];
  }) => {
      try {
        // Ensure description has a value
        const description = projectData.description?.trim() || 'No description provided';
        
        // Prepare project data for API
        const apiProjectData = {
          name: projectData.name,
          description: description,
          company: projectData.company,
          status: projectData.status,
          priority: projectData.priority,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          budget: projectData.budget,
          team: projectData.teamMembers.join(', '),
          assignee: projectData.teamMembers[0] || '',
          progress: editingProject ? editingProject.progress : 0,
          tasks: editingProject ? editingProject.tasks : 0,
          tags: editingProject ? editingProject.tags : JSON.stringify([]),
          notes: editingProject ? editingProject.notes : ''
        };

        let response;
        
        if (editingProject) {
          // Update existing project
          console.log('Updating project with API data:', apiProjectData);
          response = await ProjectApiService.updateProject(editingProject.id || '', {
            ...apiProjectData,
            updatedAt: new Date().toISOString()
          });
          console.log('Project update API response:', response);
        } else {
          // Create new project
          console.log('Creating project with API data:', apiProjectData);
          response = await ProjectApiService.createProject(apiProjectData);
        console.log('Project creation API response:', response);
        }

        if (response.success) {
          console.log(editingProject ? 'Project updated successfully in database:' : 'Project created successfully in database:', response.data);
          
          // Refresh projects from API to get the latest data
          await fetchProjects();
          
          setShowCreateForm(false);
          setEditingProject(null);
          console.log(editingProject ? 'Project updated successfully and data refreshed' : 'Project created successfully and data refreshed');
        } else {
          console.error(editingProject ? 'Failed to update project in database:' : 'Failed to create project in database:', response.error);
        }
      } catch (error) {
        console.error('Error saving project:', error);
      }
  };



  const cancelCreate = () => {
    setShowCreateForm(false);
    setEditingProject(null);
    setProjectName("");
    setProjectDescription("");
    setSelectedCompany("");
    setProjectStatus("Planning");
    setProjectPriority("Medium");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setSelectedMembers([]);
  };

  // Menu management functions
  const toggleMenu = (projectId: string) => {
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Project action functions
  const handleEditProject = (project: ProjectData) => {
    // Pre-fill the create form with project data for editing
    setProjectName(project.name || '');
    setProjectDescription(project.description || '');
    setSelectedCompany(project.company || '');
    setProjectStatus(project.status || 'Planning');
    setProjectPriority(project.priority || 'Medium');
    setStartDate(project.startDate || '');
    setEndDate(project.endDate || '');
    setBudget(project.budget || '');
    setSelectedMembers(project.team ? project.team.split(',').map(m => m.trim()) : []);
    
    // Store the project being edited
    setEditingProject(project);
    setShowCreateForm(true);
    closeMenu();
  };

  const handleDeleteProject = async (project: ProjectData) => {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        const response = await ProjectApiService.deleteProject(project.id || '');
        if (response.success) {
          console.log('Project deleted successfully');
          await fetchProjects(); // Refresh the list
        } else {
          console.error('Failed to delete project:', response.error);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
    closeMenu();
  };

  const handleArchiveProject = async (project: ProjectData) => {
    try {
      const response = await ProjectApiService.updateProject(project.id || '', {
        status: 'Archived',
        updatedAt: new Date().toISOString()
      });
      
      if (response.success) {
        console.log('Project archived successfully');
        await fetchProjects(); // Refresh the list
      } else {
        console.error('Failed to archive project:', response.error);
      }
    } catch (error) {
      console.error('Error archiving project:', error);
    }
    closeMenu();
  };

  const handleDuplicateProject = async (project: ProjectData) => {
    try {
      const duplicatedProject = {
        ...project,
        name: `${project.name} (Copy)`,
        status: 'Planning',
        progress: 0,
        tasks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Remove the ID so a new one is generated
      delete duplicatedProject.id;
      
      const response = await ProjectApiService.createProject(duplicatedProject);
      
      if (response.success) {
        console.log('Project duplicated successfully');
        await fetchProjects(); // Refresh the list
      } else {
        console.error('Failed to duplicate project:', response.error);
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
    }
    closeMenu();
  };

  const handleExportProject = (project: ProjectData) => {
    // Create a JSON file with project data
    const projectData = {
      ...project,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
    link.click();
    
    console.log('Project exported successfully');
    closeMenu();
  };

  const handleExportAll = () => {
    const data = filteredProjects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      company: p.company,
      status: p.status,
      priority: p.priority,
      startDate: p.startDate,
      endDate: p.endDate,
      budget: p.budget,
      progress: p.progress
    }));
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), items: data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'projects_export.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-4 md:px-8 md:py-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <BarChart2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
        <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Projects Analytics</h1>
              <p className="text-slate-600 mt-0.5 md:mt-1 text-xs md:text-base">Analytics and insights for your projects</p>
        </div>
          </div>
          
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop search/filters as before */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 md:px-4 py-2 md:py-2.5 border border-slate-300 rounded-lg text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="All">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-2 md:px-4 py-2 md:py-2.5 border border-slate-300 rounded-lg text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <button onClick={handleExportAll} className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200 hover:shadow-md">
              <Download size={16} />
              Export All
          </button>
            <button className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold" onClick={() => setShowCreateForm(true)}>
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            New Project
          </button>
          </div>

          {/* Mobile compact actions */}
          <div className="flex md:hidden items-center gap-2 w-full justify-end">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-2 border border-slate-300 rounded-lg text-xs">
              <option value="All">Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-2 py-2 border border-slate-300 rounded-lg text-xs">
              <option value="All">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <button onClick={() => setShowCreateForm(true)} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs">New</button>
            <button onClick={handleExportAll} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs">Export</button>
          </div>
        </div>
      </div>

      {/* Mobile Search - placed below header for a cleaner look */}
      <div className="md:hidden px-4 mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>


      <div className="px-4 md:px-8 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] md:text-xs text-slate-500">Total Projects</p>
                <p className="text-sm md:text-lg font-semibold text-slate-900">{projects.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <FolderKanban className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] md:text-xs text-slate-500">Active Projects</p>
                <p className="text-sm md:text-lg font-semibold text-slate-900">{projects.filter(p => p.status === "Active").length}</p>
              </div>
              <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] md:text-xs text-slate-500">Completed</p>
                <p className="text-sm md:text-lg font-semibold text-slate-900">{projects.filter(p => p.status === "Completed").length}</p>
              </div>
              <div className="p-2 md:p-3 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] md:text-xs text-slate-500">Avg Progress</p>
                <p className="text-sm md:text-lg font-semibold text-slate-900">{projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0}%</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Inline Create Project Form */}
      {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {editingProject ? 'Update the project details below' : 'Fill in the details below to create a new project'}
                </p>
              </div>
            <button 
              onClick={cancelCreate}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
          
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateProject({
                name: projectName,
                description: projectDescription,
                company: selectedCompany,
                status: projectStatus,
                priority: projectPriority,
                startDate: startDate,
                endDate: endDate,
                budget: budget,
                teamMembers: selectedMembers
              });
            }} className="space-y-8">
              {/* Project Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Project Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name *</label>
                <input 
                  value={projectName} 
                  onChange={e => setProjectName(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Company *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                        className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          selectedCompany ? "border-slate-300 text-slate-900" : "border-red-300 text-slate-500"
                        }`}
                  >
                        <span className={selectedCompany ? "text-slate-900" : "text-slate-500"}>
                          {selectedCompany || "Select a company (required)"}
                    </span>
                        <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  
                  {showCompanyDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {companies.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-slate-500">
                              No companies available. Please create a company first.
                          </div>
                          ) : (
                            <>
                          {companies.map((company) => (
                        <button
                                  key={company.id}
                          type="button"
                          onClick={() => {
                                setSelectedCompany(company.name);
                            setShowCompanyDropdown(false);
                          }}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors border-b border-slate-100 last:border-b-0"
                                >
                                  <div className="font-medium text-slate-900">{company.name}</div>
                                  {company.description && (
                                    <div className="text-xs text-slate-500 mt-1">{company.description}</div>
                                  )}
                        </button>
                      ))}
                          <div className="border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => {
                                    // Open companies page using the app's tab system
                                    if (onOpenTab) {
                                      onOpenTab("companies");
                                    } else {
                                      // Fallback to window location if onOpenTab is not available
                                      window.location.href = '/?tab=companies';
                                    }
                                setShowCompanyDropdown(false);
                              }}
                                  className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-blue-600 font-medium transition-colors"
                                >
                                  + Create New Company
                            </button>
                          </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                </div>
              </div>

              <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={e => setProjectDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Describe the project goals, objectives, and key deliverables..."
                  />
                </div>
              </div>

              {/* Project Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Settings className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Project Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                        <span className="text-slate-900">{projectStatus}</span>
                        <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  
                  {showStatusDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {statuses.map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => {
                            setProjectStatus(statusOption);
                            setShowStatusDropdown(false);
                          }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors"
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                        <span className="text-slate-900">{projectPriority}</span>
                        <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  
                  {showPriorityDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {priorities.map((priorityOption) => (
                        <button
                          key={priorityOption}
                          type="button"
                          onClick={() => {
                            setProjectPriority(priorityOption);
                            setShowPriorityDropdown(false);
                          }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors"
                        >
                          {priorityOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Budget</label>
                <input 
                      type="text"
                  value={budget} 
                  onChange={e => setBudget(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter budget amount"
                />
              </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                <input 
                  type="date"
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                <input 
                  type="date"
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                  </div>
              </div>
            </div>

              {/* Team Members Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
                </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableMembers.map((member) => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleMember(member)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                      selectedMembers.includes(member) 
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedMembers.includes(member) ? "bg-blue-500" : "bg-slate-300"
                        }`}></div>
                          <span className="text-sm font-medium">{member}</span>
                        </div>
                  </button>
                ))}
              </div>
            </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
              <button 
                type="button"
                onClick={cancelCreate}
                  className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                  {editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

        {/* Projects Cards */}
        <div className="p-0 bg-transparent border-0 shadow-none">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading projects...</p>
            </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={fetchProjects}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
          </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                <p className="text-slate-600 mb-4">Get started by creating your first project</p>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus size={20} />
                  Create Project
                </button>
            </div>
          </div>
          ) : (
            <>
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <List size={16} />
                    </button>
            </div>
                  <span className="text-sm text-slate-600">
                    {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                  </span>
            </div>
          </div>
          
              {/* Projects Grid/List */}
              <div className={`grid gap-3 md:gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`relative bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 flex flex-col h-full ${
                    viewMode === "list" ? "p-4" : "p-2 md:p-3"
                  }`}>
                    {viewMode === "list" ? (
                      <>
                        <div className="flex items-center gap-3 md:gap-4">
                          {/* Checkbox */}
                <input
                            type="checkbox"
                            className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          
                          {/* Project Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1 md:mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 text-sm md:text-base mb-0.5 truncate">{project.name}</h3>
                                <p className="text-[11px] md:text-sm text-slate-600 line-clamp-1">{project.description}</p>
              </div>
              
                              {/* Status and Priority Tags */}
                              <div className="flex items-center gap-1.5 md:gap-2 ml-2 md:ml-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700'}`}>
                                  {project.status}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${priorityColors[project.priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700'}`}>
                                  {project.priority}
                                </span>
                              </div>
                              
                              {/* Action Icons */}
                              <div className="flex items-center gap-1.5 md:gap-2 ml-2 md:ml-4">
                                <button className="p-0.5 md:p-1 text-slate-400 hover:text-red-500 transition-colors">
                                  <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                <div className="relative">
                <button
                                    onClick={() => toggleMenu(project.id || '')}
                                    className="p-0.5 md:p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
                
                                  {/* Dropdown Menu for List View */}
                                  {openMenuId === project.id && (
                                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px] menu-container">
                                      <div className="py-1">
          <button 
                                          onClick={() => handleEditProject(project)}
                                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
                                          <Edit className="w-4 h-4" />
                                          Edit Project
          </button>
                <button 
                                          onClick={() => handleDuplicateProject(project)}
                                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                                          <Copy className="w-4 h-4" />
                                          Duplicate
                </button>
                      <button
                                          onClick={() => handleArchiveProject(project)}
                                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                                          <Archive className="w-4 h-4" />
                                          Archive
                      </button>
                      <button
                                          onClick={() => handleExportProject(project)}
                                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                                          <Download className="w-4 h-4" />
                                          Export
                      </button>
                                        <div className="border-t border-slate-200 my-1"></div>
                                        <button
                                          onClick={() => handleDeleteProject(project)}
                                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          Delete
              </button>
      </div>
          </div>
          )}
                </div>
                </div>
              </div>
              
                            {/* Project Details Row */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 md:flex md:items-center md:gap-6 text-[11px] md:text-sm text-slate-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                                <span className="truncate">{project.assignee || 'Unassigned'}</span>
                </div>
                              <div className="flex items-center gap-1">
                                <Building className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                                <span className="truncate">{project.company}</span>
              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                                <span className="truncate">Due: {project.endDate}</span>
        </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                                <span>{project.tasks || 0}h</span>
          </div>
                        </div>
                      </div>
                    </div>
                      </>
                    ) : (
                      <>
                        {/* Header - Title and Menu */}
                        <div className="mb-1.5 md:mb-4">
                          <div className="flex items-start justify-between mb-1 md:mb-2">
                              <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                  <FolderKanban className="w-4 h-4 text-blue-600" />
                      </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-slate-900 text-xs md:text-lg mb-0.5 md:mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{project.name}</h3>
                                  <p className="text-[10px] md:text-sm text-slate-500 break-words">{project.description || "No description provided"}</p>
                    </div>
                    </div>
                              <div className="relative flex-shrink-0 ml-2">
                        <button 
                                  onClick={() => toggleMenu(project.id || '')}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                  aria-label="Open menu"
                                >
                                  <MoreHorizontal size={14} className="text-slate-400" />
                        </button>
                                {openMenuId === project.id && (
                                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[160px] menu-container">
                                    <div className="py-1">
                        <button 
                                        onClick={() => handleEditProject(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                                        <Edit className="w-4 h-4" />
                                        Edit Project
                        </button>
                        <button 
                                        onClick={() => handleDuplicateProject(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                                        <Copy className="w-4 h-4" />
                                        Duplicate
                        </button>
                        <button 
                                        onClick={() => handleArchiveProject(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                                        <Archive className="w-4 h-4" />
                                        Archive
                        </button>
                          <button 
                                        onClick={() => handleExportProject(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                                        <Download className="w-4 h-4" />
                                        Export
                        </button>
                                      <div className="border-t border-slate-200 my-1"></div>
                            <button 
                                        onClick={() => handleDeleteProject(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                            </button>
                                    </div>
                          </div>
                        )}
                      </div>
                    </div>
                          </div>
                          {/* Project Stats */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-1 md:mb-3">
                          <div className="text-center">
                            <div className="text-base md:text-2xl font-bold text-slate-900">{project.progress || 0}%</div>
                            <div className="text-[10px] text-slate-500 font-medium">Progress</div>
                    </div>
                          <div className="text-center">
                            <div className="text-base md:text-2xl font-bold text-slate-900">{project.tasks || 0}</div>
                            <div className="text-[10px] text-slate-500 font-medium">Tasks</div>
          </div>
        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 rounded-full h-1 md:h-2 mb-1 md:mb-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 md:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>

                        {/* Status and Priority Tags */}
                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 md:mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusColors[project.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700'}`}>
                            {project.status}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${priorityColors[project.priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700'}`}>
                            {project.priority}
                          </span>
                        </div>

                        {/* Details grid: desktop 2x2 (Company, Members | Start, End), mobile stacked */}
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 gap-y-1 md:gap-y-1.5 mb-1 md:mb-3">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-[10px] text-slate-700 font-medium break-words">{project.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-[10px] text-slate-700 font-medium">{project.team?.split(',').length || 0} members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-[10px] text-slate-700 font-medium">{project.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-[10px] text-slate-700 font-medium">{project.endDate}</span>
                          </div>
                        </div>

                                                {/* Action Link */}
                        <div className="mt-auto md:pt-4">
                          <button className="text-blue-600 hover:text-blue-700 text-[10px] md:text-xs font-medium transition-colors">
                            View Details
            </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
          </div>
            </>
        )}
        </div>
      </div>
    </div>
  );
} 