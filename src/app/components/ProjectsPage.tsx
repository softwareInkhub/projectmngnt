import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversalDetailsModal from "./UniversalDetailsModal";
import { 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Activity,
  Target,
  Clock,
  Star,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Archive,
  Copy,
  Share2,
  Download,
  FilterX,
  Grid3X3,
  List,
  Bell,
  Heart,
  ExternalLink,
  GitCommit,
  DollarSign,
  CalendarDays,
  UserCheck,
  Timer,
  Flag,
  Layers,
  Zap,
  Award,
  TrendingDown,
  SortAsc,
  CheckSquare,
  Square,
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  BarChart3,
  PieChart,
  LineChart,
  X,
  Building,
  Save,
  ArrowLeft,
  Folder
} from "lucide-react";
import { ProjectApiService, ProjectData, ProjectWithUI, transformProjectToUI, transformUIToProject } from "../utils/projectApi";

interface Project {
  id: string;
  name: string;
  description: string;
  assignee: string;
  progress: number;
  status: string;
  priority: string;
  endDate: string;
  team: string;
  tasks: string;
  budget: string;
  tags: string[];
}

export default function ProjectsPage({ context }: { context?: { company: string } }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Universal Details Modal state
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    itemType: 'project' as 'project' | 'task' | 'team' | 'company',
    itemId: ''
  });

  // Form data for creating new project
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    company: context?.company || "",
    status: "Planning",
    priority: "Medium",
    startDate: "",
    endDate: "",
    budget: "",
    team: "",
    assignee: "",
    progress: 0,
    tasks: '[]',
    tags: [] as string[],
    notes: ""
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company: context?.company || "",
    status: "Planning",
    priority: "Medium",
    startDate: "",
    endDate: "",
    budget: "",
    team: "",
    assignee: "",
    progress: 0,
    tasks: '[]',
    tags: [] as string[],
    notes: ""
  });

  const projectStats = [
    { label: "Total Projects", value: projects.length, icon: Folder, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Progress", value: projects.filter(p => p.status === "In Progress").length, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Completed", value: projects.filter(p => p.status === "Almost Done").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Budget", value: "$95,000", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Planning": return "bg-yellow-100 text-yellow-700";
      case "Almost Done": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProjectApiService.getProjects();
      console.log('Projects API response:', response);
      
      if (response.success) {
        // Handle different response structures
        const projectsData = (response as any).items || response.data || [];
        console.log('Projects data:', projectsData);
        
                if (Array.isArray(projectsData)) {
          const transformedProjectsData = projectsData.map((project: ProjectData) => transformProjectToUI(project));
          const filteredProjects = transformedProjectsData.filter(project => {
            // Filter by company if context is provided
            if (context?.company) {
              return project.company === context.company;
            }
            return true;
          });
          
          const transformedProjects: Project[] = filteredProjects.map(project => ({
            id: project.id || '',
            name: project.name,
            description: project.description || '',
            assignee: project.assignee,
            progress: project.progress,
            status: project.status,
            priority: project.priority,
            endDate: project.endDate,
            team: project.team,
            tasks: project.tasks,
            budget: project.budget,
            tags: project.tags
          }));
          
          console.log('Transformed projects with IDs:', transformedProjects.map(p => ({ id: p.id, name: p.name })));
          setProjects(transformedProjects);
        } else {
          console.warn('Projects data is not an array:', projectsData);
          setProjects([]);
        }
      } else {
        console.error('Failed to fetch projects:', response.error);
        setError('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.company]);

  // Create project
  const handleCreateProject = async (projectData: ProjectData) => {
    try {
      console.log('Creating project with data:', projectData);
      
      // Optimistic update - add project to UI immediately
      const optimisticProject: Project = {
        id: `temp-${Date.now()}`, // Temporary ID
        name: projectData.name,
        description: projectData.description || '',
        assignee: projectData.assignee,
        progress: projectData.progress,
        status: projectData.status,
        priority: projectData.priority,
        endDate: projectData.endDate,
        team: projectData.team,
        tasks: projectData.tasks,
        budget: projectData.budget,
        tags: typeof projectData.tags === 'string' ? JSON.parse(projectData.tags) : projectData.tags
      };
      
      setProjects(prev => [optimisticProject, ...prev]);
      setShowCreateForm(false);
      setSuccessMessage('Project created successfully!');
      
      // Reset form data
      setCreateFormData({
        name: "",
        description: "",
        company: context?.company || "",
        status: "Planning",
        priority: "Medium",
        startDate: "",
        endDate: "",
        budget: "",
        team: "",
        assignee: "",
        progress: 0,
        tasks: '[]',
        tags: [],
        notes: ""
      });
      
      // Make API call in background
      const response = await ProjectApiService.createProject(projectData);
      console.log('Project creation response:', response);
      
      if (response.success) {
        // Replace optimistic project with real one
        const realProject = transformProjectToUI(response.data as ProjectData);
        setProjects(prev => prev.map(p => 
          p.id === optimisticProject.id ? {
            ...realProject,
            description: realProject.description || '',
            id: realProject.id || response.data?.id || `real-${Date.now()}`
          } as Project : p
        ));
        setSuccessMessage('Project created successfully!');
      } else {
        // Revert optimistic update on failure
        setProjects(prev => prev.filter(p => p.id !== optimisticProject.id));
        console.error('Failed to create project:', response.error);
        setError('Failed to create project');
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Revert optimistic update on error
      setProjects(prev => prev.filter(p => !p.id.startsWith('temp-')));
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    try {
      // Optimistic update - remove project from UI immediately
      const deletedProject = projects.find(p => p.id === projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setOpenMenuId(null);
      setSuccessMessage('Project deleted successfully!');
      
      // Make API call in background
      const response = await ProjectApiService.deleteProject(projectId);
      
      if (response.success) {
        setSuccessMessage('Project deleted successfully!');
      } else {
        // Revert optimistic update on failure
        if (deletedProject) {
          setProjects(prev => [...prev, deletedProject]);
        }
        console.error('Failed to delete project:', response.error);
        setError('Failed to delete project');
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Revert optimistic update on error
      const deletedProject = projects.find(p => p.id === projectId);
      if (deletedProject) {
        setProjects(prev => [...prev, deletedProject]);
      }
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      company: context?.company || "",
      status: project.status,
      priority: project.priority,
      startDate: "",
      endDate: project.endDate,
      budget: project.budget,
      team: project.team,
      assignee: project.assignee,
      progress: project.progress,
      tasks: project.tasks,
      tags: project.tags,
      notes: ""
    });
    setShowEditForm(true);
    setOpenMenuId(null);
  };

  // Update project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const updateFields = {
        name: formData.name,
        description: formData.description,
        company: formData.company,
        status: formData.status,
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        team: formData.team,
        assignee: formData.assignee,
        progress: formData.progress,
        tasks: formData.tasks,
        tags: JSON.stringify(formData.tags),
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };

      // Optimistic update - update project in UI immediately
      const originalProject = projects.find(p => p.id === editingProject.id);
      const optimisticProject: Project = {
        ...editingProject,
        name: formData.name,
        description: formData.description || '',
        status: formData.status,
        priority: formData.priority,
        endDate: formData.endDate,
        budget: formData.budget,
        team: formData.team,
        assignee: formData.assignee,
        progress: formData.progress,
        tasks: formData.tasks,
        tags: formData.tags
      };
      
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id ? optimisticProject : p
      ));
      setShowEditForm(false);
      setEditingProject(null);
      setSuccessMessage('Project updated successfully!');
      
      // Make API call in background
      const response = await ProjectApiService.updateProject(editingProject.id, updateFields);
      
      if (response.success) {
        setSuccessMessage('Project updated successfully!');
      } else {
        // Revert optimistic update on failure
        if (originalProject) {
          setProjects(prev => prev.map(p => 
            p.id === editingProject.id ? originalProject : p
          ));
        }
        console.error('Failed to update project:', response.error);
        setError('Failed to update project');
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Revert optimistic update on error
      const originalProject = projects.find(p => p.id === editingProject.id);
      if (originalProject) {
        setProjects(prev => prev.map(p => 
          p.id === editingProject.id ? originalProject : p
        ));
      }
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
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

  // Menu toggle functions
  const toggleMenu = (projectId: string) => {
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg">
            <Folder className="text-white mr-1" size={20} />
            <span>{context?.company ? `${context.company} Projects` : 'Projects'}</span>
          </div>
          {context?.company && (
            <div className="text-sm text-slate-600">
              Managing projects for {context.company}
            </div>
          )}
          </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle - Mobile Only */}
          <div className="md:hidden flex items-center bg-slate-100 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <List size={16} />
            </button>
          </div>
          
          <button className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring">
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            New Project
          </button>

          </div>
        </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectStats.map((stat, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3' 
            : 'space-y-3'
        }`}>
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 group cursor-pointer ${
                viewMode === 'list' ? 'p-3' : 'p-4'
              }`}
              onClick={() => handleProjectClick(project.id)}
            >
              {viewMode === 'list' ? (
                <>
                  {/* List View Layout */}
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Folder size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {project.name}
                        </h3>
                        <p className="text-xs text-slate-600 truncate">
                          {project.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{project.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{project.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={12} />
                        <span>{project.tasks} tasks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>{project.budget}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    
                    <div className="w-20">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative menu-container ml-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(project.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {openMenuId === project.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectClick(project.id);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Eye size={12} />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(project, null, 2));
                              setSuccessMessage('Project copied to clipboard!');
                              setTimeout(() => setSuccessMessage(null), 2000);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Copy size={12} />
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              setSuccessMessage('Project archived!');
                              setTimeout(() => setSuccessMessage(null), 2000);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Archive size={12} />
                            Archive
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                {/* Grid View Layout */}
                <div className={`flex items-start justify-between ${
                  viewMode === 'list' ? 'mb-3' : 'mb-4'
                }`}>
                <div className="flex-1">
                    <h3 className={`font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors ${
                      viewMode === 'list' ? 'text-xl' : 'text-2xl'
                    }`}>
                    {project.name}
                  </h3>
                    <p className={`text-slate-600 ${
                      viewMode === 'list' ? 'text-base line-clamp-1' : 'text-lg line-clamp-2'
                    }`}>
                      {project.description}
                    </p>
                </div>
                <div className="relative menu-container">
                  <button 
                    onClick={() => toggleMenu(project.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {openMenuId === project.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectClick(project.id);
                            }}
                            className="w-full px-4 py-2 text-left text-base text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(project, null, 2));
                            setSuccessMessage('Project copied to clipboard!');
                            setTimeout(() => setSuccessMessage(null), 2000);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            // Archive functionality
                            setSuccessMessage('Project archived!');
                            setTimeout(() => setSuccessMessage(null), 2000);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <Archive size={14} />
                          Archive
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-lg mb-1">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-3 text-lg">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-slate-400" />
                    <span className="text-slate-600">{project.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-slate-600">{project.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-slate-400" />
                    <span className="text-slate-600">{project.tasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-slate-400" />
                    <span className="text-slate-600">{project.budget}</span>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-base font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-base font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-base">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-base">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
                          </div>
                </>
              ) : (
                <>
                  {/* Grid View Layout */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {project.description}
                      </p>
                        </div>
                    <div className="relative menu-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(project.id);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {openMenuId === project.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(project, null, 2));
                                setSuccessMessage('Project copied to clipboard!');
                                setTimeout(() => setSuccessMessage(null), 2000);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Copy size={14} />
                              Copy
                            </button>
                            <button
                              onClick={() => {
                                setSuccessMessage('Project archived!');
                                setTimeout(() => setSuccessMessage(null), 2000);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Archive size={14} />
                              Archive
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium text-slate-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className="text-slate-600">{project.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-slate-600">{project.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-slate-400" />
                        <span className="text-slate-600">{project.tasks} tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-slate-400" />
                        <span className="text-slate-600">{project.budget}</span>
                      </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>
          ))}
                    </div>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
                  <p className="text-slate-600">Enter the details for your new project.</p>
                </div>
              </div>
                             <button
                 onClick={() => {
                   setShowCreateForm(false);
                   // Reset form data
                   setCreateFormData({
                     name: "",
                     description: "",
                     company: context?.company || "",
                     status: "Planning",
                     priority: "Medium",
                     startDate: "",
                     endDate: "",
                     budget: "",
                     team: "",
                     assignee: "",
                     progress: 0,
                     tasks: '[]',
                     tags: [],
                     notes: ""
                   });
                 }}
                 className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 <X size={20} />
               </button>
            </div>

                         <form onSubmit={(e) => {
               e.preventDefault();
               console.log('Form submitted with createFormData:', createFormData);
               const projectData: ProjectData = {
                 ...createFormData,
                 tags: JSON.stringify(createFormData.tags),
                 createdAt: new Date().toISOString(),
                 updatedAt: new Date().toISOString()
               };
               console.log('Transformed projectData:', projectData);
               handleCreateProject(projectData);
             }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company *</label>
                  <input
                    type="text"
                    value={createFormData.company}
                    onChange={(e) => setCreateFormData({ ...createFormData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={createFormData.status}
                    onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Almost Done">Almost Done</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={createFormData.priority}
                    onChange={(e) => setCreateFormData({ ...createFormData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={createFormData.startDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={createFormData.endDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
                  <input
                    type="text"
                    value={createFormData.budget}
                    onChange={(e) => setCreateFormData({ ...createFormData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team</label>
                  <input
                    type="text"
                    value={createFormData.team}
                    onChange={(e) => setCreateFormData({ ...createFormData, team: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                  <input
                    type="text"
                    value={createFormData.assignee}
                    onChange={(e) => setCreateFormData({ ...createFormData, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={createFormData.progress}
                    onChange={(e) => setCreateFormData({ ...createFormData, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={createFormData.tags.join(', ')}
                  onChange={(e) => setCreateFormData({ ...createFormData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={createFormData.notes}
                  onChange={(e) => setCreateFormData({ ...createFormData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                 <button
                   type="button"
                   onClick={() => {
                     setShowCreateForm(false);
                     // Reset form data
                     setCreateFormData({
                       name: "",
                       description: "",
                       company: context?.company || "",
                       status: "Planning",
                       priority: "Medium",
                       startDate: "",
                       endDate: "",
                       budget: "",
                       team: "",
                       assignee: "",
                       progress: 0,
                       tasks: '[]',
                       tags: [],
                       notes: ""
                     });
                   }}
                   className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2"
                 >
                   <ArrowLeft className="w-4 h-4" />
                   <span>Cancel</span>
                 </button>
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Form */}
      {showEditForm && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Edit Project</h2>
                  <p className="text-slate-600">Update the project details below.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProject(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Almost Done">Almost Done</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                  <input
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProject(null);
                  }}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Project</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
