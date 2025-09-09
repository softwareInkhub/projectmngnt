"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { CompanyApiService, CompanyData } from "../utils/companyApi";
import UniversalDetailsModal from "./UniversalDetailsModal";
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

// Professional status and priority colors with gradients
const statusColors = {
  "Planning": "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300",
  "Active": "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300",
  "On Hold": "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-300",
  "Completed": "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300",
  "Cancelled": "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300"
};

const priorityColors = {
  "Low": "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300",
  "Medium": "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-300",
  "High": "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300",
  "Critical": "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300"
};

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const letters = parts.slice(0, 2).map(p => p[0] || "");
  return letters.join("").toUpperCase();
};

const parseTags = (tags: unknown): string[] => {
  try {
    if (Array.isArray(tags)) return tags as string[];
    if (typeof tags === 'string') return JSON.parse(tags || '[]');
  } catch {}
  return [];
};

const formatDate = (date?: string) => (date ? date : "");

const statusPillClass = (status: string) =>
  (statusColors as Record<string, string>)[status] || 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300';

  // Blue gradient row themes for list view
  const rowThemes = [
    { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' },
    { bg: 'bg-gradient-to-r from-blue-100 to-blue-200', border: 'border-blue-300' },
    { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' },
    { bg: 'bg-gradient-to-r from-blue-100 to-blue-200', border: 'border-blue-300' },
    { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' }
  ];

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

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
  
  // Universal Details Modal state
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    itemType: 'project' as 'project' | 'task' | 'team' | 'company',
    itemId: ''
  });


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

  // Create test project if no projects exist
  useEffect(() => {
    const createTestProjectIfNeeded = async () => {
      if (projects.length === 0 && !loading) {
        console.log('No projects found, creating a test project...');
        const testProject = {
          name: 'Test Project for Navigation',
          description: 'This is a test project to verify navigation to project details works correctly.',
          company: 'Test Company',
          status: 'In Progress',
          priority: 'Medium',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          budget: '$25,000',
          team: 'John Doe, Jane Smith',
          assignee: 'John Doe',
          progress: 45,
          tasks: 8,
          tags: JSON.stringify(['test', 'demo', 'navigation']),
          notes: 'This project was created automatically for testing navigation functionality.'
        };
        
        try {
          const response = await ProjectApiService.createProject(testProject);
          if (response.success) {
            console.log('Test project created successfully:', response.data);
            console.log('Test project ID:', response.data?.id);
            fetchProjects(); // Refresh the projects list
          } else {
            console.error('Failed to create test project:', response.error);
          }
        } catch (error) {
          console.error('Error creating test project:', error);
        }
      }
    };

    createTestProjectIfNeeded();
  }, [projects.length, loading]);

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

  // Open Universal Details Modal
  const handleProjectClick = (projectId: string) => {
    console.log('=== PROJECT DETAILS MODAL DEBUG ===');
    console.log('Opening details modal for project:', projectId);
    console.log('Project type:', typeof projectId);
    console.log('Project ID length:', projectId?.length);
    console.log('Is project ID empty?', !projectId || projectId.trim() === '');
    console.log('Current projects:', projects.map(p => ({ id: p.id, name: p.name })));
    
    // Ensure we have a valid project ID
    if (!projectId || projectId.trim() === '') {
      console.error('Invalid project ID:', projectId);
      return;
    }
    
    // Open the Universal Details Modal
    setDetailsModal({
      isOpen: true,
      itemType: 'project',
      itemId: projectId
    });
  };

  // Close Universal Details Modal
  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      itemType: 'project',
      itemId: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Projects Analytics</h1>
              <p className="text-slate-600 mt-1 text-xl">Analytics and insights for your projects</p>
            </div>
          </div>
          
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop search/filters as before */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 text-xl" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="All">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <button onClick={handleExportAll} className="hidden md:flex items-center gap-2 px-2 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200 hover:shadow-md text-xl">
              <Download size={18} />
              Export All
          </button>
            <button className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl" onClick={() => setShowCreateForm(true)}>
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            Create Project
          </button>
          </div>

                      {/* Mobile compact actions - optimized for better fit */}
            <div className="flex md:hidden items-center gap-2 w-full justify-end">
              {/* Mobile search - moved to header area */}
              <div className="relative flex-1 max-w-28">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-7 pr-2 py-2 border border-slate-300 rounded-md text-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full" 
                />
              </div>
              <button onClick={() => setShowCreateForm(true)} className="px-2 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-md text-xl font-medium">Create</button>
              <button onClick={handleExportAll} className="px-2 py-2 bg-white border border-slate-300 rounded-md text-xl">Export</button>
            </div>
        </div>
      </div>




      <div className="px-1 md:px-8 py-2 md:py-8 space-y-2 md:space-y-6">
        {/* Analytics cards removed per request */}

        {/* View Mode Toggle - Mobile optimized positioning */}
        <div className="flex items-center justify-between mb-4 md:mb-6 mx-2 md:mx-0">
          {/* Left side - Grid/List toggle and project count */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 md:p-2 rounded-md transition-colors ${
                  viewMode === "grid" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid3X3 size={14} className="md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 md:p-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List size={14} className="md:w-4 md:h-4" />
              </button>
            </div>
            <span className="text-sm md:text-base text-slate-600">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Right side - Status and Priority filters (mobile only) */}
          <div className="flex md:hidden items-center gap-1.5">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
              <option value="All">Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
              <option value="All">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Professional Inline Create Project Form */}
      {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 md:p-8 mb-4 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-1">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-slate-500 text-sm md:text-base">
                  {editingProject ? 'Update the project details below' : 'Fill in the details below to create a new project'}
                </p>
              </div>
            <button 
              onClick={cancelCreate}
                className="p-1.5 md:p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={18} className="md:w-5 md:h-5" />
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
            }} className="space-y-4 md:space-y-8">
              {/* Project Information Section */}
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                  <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Project Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-lg">
              <div>
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Project Name *</label>
                <input 
                  value={projectName} 
                  onChange={e => setProjectName(e.target.value)} 
                      className="w-full px-1.5 md:px-2 py-2 md:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg"
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div>
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Company *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                        className={`w-full px-1.5 md:px-2 py-2 md:py-2.5 border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg ${
                          selectedCompany ? "border-slate-300 text-slate-900" : "border-red-300 text-slate-500"
                        }`}
                  >
                        <span className={selectedCompany ? "text-slate-900" : "text-slate-500"}>
                          {selectedCompany || "Select a company (required)"}
                    </span>
                        <ChevronDown size={14} className="md:w-4 md:h-4 text-slate-400" />
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
                                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 text-base transition-colors border-b border-slate-100 last:border-b-0"
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
                                  className="w-full text-left px-2 py-1.5 hover:bg-blue-50 text-base text-blue-600 font-medium transition-colors"
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
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={e => setProjectDescription(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base md:text-lg"
                    rows={2}
                    placeholder="Describe the project goals, objectives, and key deliverables..."
                  />
                </div>
              </div>

              {/* Project Details Section */}
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                  <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                    <Settings className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Project Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-lg">
                  <div>
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Status</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="w-full px-1.5 md:px-2 py-2 md:py-2.5 border border-slate-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg"
                  >
                        <span className="text-slate-900">{projectStatus}</span>
                        <ChevronDown size={14} className="md:w-4 md:h-4 text-slate-400" />
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
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Priority</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                        className="w-full px-1.5 md:px-2 py-2 md:py-2.5 border border-slate-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg"
                  >
                        <span className="text-slate-900">{projectPriority}</span>
                        <ChevronDown size={14} className="md:w-4 md:h-4 text-slate-400" />
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
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Budget</label>
                <input 
                      type="text"
                  value={budget} 
                  onChange={e => setBudget(e.target.value)} 
                      className="w-full px-1.5 md:px-2 py-2 md:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg"
                      placeholder="Enter budget amount"
                />
              </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-lg">
              <div>
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">Start Date</label>
                <input 
                  type="date"
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                      className="w-full px-1.5 md:px-2 py-2 md:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg"
                />
              </div>
              <div>
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-1.5 md:mb-2">End Date</label>
                <input 
                  type="date"
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                      className="w-full px-1.5 md:px-2 py-2 md:py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base md:text-lg"
                  />
                  </div>
              </div>
            </div>

              {/* Team Members Section */}
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                  <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Team Members</h3>
                </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 max-w-lg">
                  {availableMembers.map((member) => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleMember(member)}
                        className={`p-1 md:p-1.5 rounded-lg border-2 transition-all ${
                      selectedMembers.includes(member) 
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                          selectedMembers.includes(member) ? "bg-blue-500" : "bg-slate-300"
                        }`}></div>
                          <span className="text-sm md:text-base font-medium">{member}</span>
                        </div>
                  </button>
                ))}
              </div>
            </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200">
              <button 
                type="button"
                onClick={cancelCreate}
                  className="px-4 md:px-6 py-2.5 md:py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-base md:text-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base md:text-lg"
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

          
              {/* Projects Grid/List */}
              {viewMode === "list" ? (
                <div className="mx-2 md:mx-0 overflow-visible">
                  <table className="min-w-full bg-white border border-slate-200 rounded-xl shadow-sm">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-lg border-b border-slate-300">
                      <tr>
                        <th className="text-left px-2 py-1.5 w-16">ID</th>
                        <th className="text-left px-3 py-1.5">Project Name</th>
                        <th className="text-left px-3 py-1.5 w-12">%</th>
                        <th className="text-left px-2 py-1.5">Owner</th>
                        <th className="text-left px-3 py-1.5">Status</th>
                        <th className="text-left px-3 py-1.5">Tasks</th>
                        <th className="text-left px-3 py-1.5">Phases</th>
                        <th className="text-left px-3 py-1.5">Issues</th>
                        <th className="text-left px-3 py-1.5">Start Date</th>
                        <th className="text-left px-3 py-1.5">End Date</th>
                        <th className="text-left px-2 py-1.5">Tags</th>
                        <th className="text-right px-2 py-1.5 w-10">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-lg overflow-visible">
                      {filteredProjects.map((project, idx) => {
                        const theme = { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' };
                        return (
                        <tr key={project.id} className={`cursor-pointer border ${theme.border} ${theme.bg} rounded-lg shadow-sm hover:shadow-md transition-all duration-200`} onClick={() => handleProjectClick(project.id || '')}>
                          <td className="px-2 py-2 text-slate-600 align-middle text-lg">{project.id || '-'}</td>
                          <td className="px-3 py-2 align-middle">
                            <div className="text-slate-900 font-semibold text-2xl">{project.name}</div>
                            <div className="text-lg text-slate-500 line-clamp-1">{project.description}</div>
                          </td>
                          <td className="px-3 py-2 text-slate-900 font-semibold align-middle text-2xl">{project.progress || 0}%</td>
                          <td className="px-2 py-2 align-middle">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-base flex items-center justify-center font-bold">
                                {getInitials(project.company || project.assignee || '')}
                              </div>
                              <span className="text-slate-700 text-lg">{project.company || project.assignee || '—'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 align-middle">
                            <span className={`px-2 py-1 rounded-full text-lg font-medium ${statusPillClass(project.status || '')}`}>{project.status || '—'}</span>
                          </td>
                          <td className="px-3 py-2 align-middle">
                            <div className="flex items-center gap-2 w-32">
                                <div className="w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-full h-2">
                                  <div className="bg-gradient-to-r from-slate-600 to-slate-700 h-2 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                              </div>
                              <span className="text-lg text-slate-600">{project.tasks || 0}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 align-middle">
                            <span className="text-lg text-slate-600 font-medium">No Phases</span>
                          </td>
                          <td className="px-3 py-2 align-middle">
                            <span className="text-lg text-slate-600 font-medium">No Issues</span>
                          </td>
                          <td className="px-3 py-2 text-slate-600 align-middle text-lg whitespace-nowrap">{formatDate(project.startDate)}</td>
                          <td className="px-3 py-2 text-slate-600 align-middle text-lg whitespace-nowrap">{formatDate(project.endDate)}</td>
                          <td className="px-2 py-2 align-middle">
                            <div className="flex flex-nowrap gap-1.5 max-w-[200px] overflow-hidden">
                              {parseTags(project.tags).slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300 rounded-full text-base font-medium">{tag}</span>
                              ))}
                              {parseTags(project.tags).length > 2 && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300 rounded-full text-base font-medium">+{parseTags(project.tags).length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2 align-middle text-right relative menu-container overflow-visible">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(project.id || '');
                              }}
                              className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110"
                              aria-label="Open menu"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            {openMenuId === project.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => handleEditProject(project)}
                                    className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 flex items-center gap-2"
                                  >
                                    <Edit size={16} />
                                    Edit
                                  </button>
                                  <div className="border-t border-slate-200 my-1"></div>
                                  <button
                                    onClick={() => handleDeleteProject(project)}
                                    className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 flex items-center gap-2"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid gap-2 md:gap-3 mx-2 md:mx-0 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                    {filteredProjects.map((project, idx) => {
                      const theme = { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-200', hoverBg: 'hover:from-blue-100 hover:to-blue-200', hoverBorder: 'hover:border-blue-300' };
                    
                    return (
                    <div
                      key={project.id}
                      className={`relative ${theme.bg} border ${theme.border} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${theme.hoverBorder} ${theme.hoverBg} flex flex-col h-full cursor-pointer p-2`}
                      onClick={() => handleProjectClick(project.id || '')}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-bold flex items-center justify-center">
                          {getInitials(project.name || '')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">{project.name}</h3>
                          <p className="text-base text-slate-600">{(project.tasks || 0) === 1 ? '1 task' : `${project.tasks || 0} tasks`}</p>
                        </div>
                      </div>

                      <div className="absolute top-0.5 right-0.5 menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(project.id || '');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                          aria-label="Open menu"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenuId === project.id && (
                          <div
                            className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20 animate-in slide-in-from-top-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEditProject(project)}
                                className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 flex items-center gap-2"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <div className="border-t border-slate-200 my-1"></div>
                              <button
                                onClick={() => handleDeleteProject(project)}
                                className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </>
        )}
                  </div>
        </div>

                     {/* Floating Action Button (FAB) */}
             {!showCreateForm && (
               <button
                 onClick={() => setShowCreateForm(true)}
                 className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-50"
                 aria-label="Create Project"
               >
                 <Plus size={20} className="text-white" />
               </button>
             )}

        {/* Universal Details Modal */}
        <UniversalDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={closeDetailsModal}
          itemType={detailsModal.itemType}
          itemId={detailsModal.itemId}
        />
      </div>
    );
} 