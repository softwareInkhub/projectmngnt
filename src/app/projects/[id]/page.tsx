"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Calendar,
  User,
  Target,
  DollarSign,
  Building,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Tag,
  Edit,
  Share2,
  Download,
  MoreHorizontal,
  Folder,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Layers,
  GitCommit,
  Timer,
  Flag,
  Heart,
  ExternalLink,
  MessageSquare,
  Bell,
  Settings,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Loader
} from "lucide-react";
import { ProjectApiService, ProjectData, transformProjectToUI } from "../../utils/projectApi";
import { TABLE_NAMES } from "../../config/environment";

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
  tasks: number;
  budget: string;
  tags: string[];
  company: string;
  startDate: string;
  notes: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  console.log('=== PROJECT DETAIL PAGE DEBUG ===');
  console.log('ProjectDetailPage rendered with projectId:', projectId);
  console.log('Params:', params);
  console.log('Project ID type:', typeof projectId);
  console.log('Project ID length:', projectId?.length);
  console.log('Is project ID empty?', !projectId || projectId.trim() === '');
  console.log('Navigation source:', typeof window !== 'undefined' ? window.location.pathname : 'Unknown');
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDemoProject, setIsDemoProject] = useState(false);

  // Fetch project details
  const fetchProject = useCallback(async () => {
    try {
      console.log('=== PROJECT DETAIL PAGE DEBUG ===');
      console.log('Fetching project with ID:', projectId);
      console.log('Project ID type:', typeof projectId);
      console.log('Project ID length:', projectId?.length);
      console.log('Table name being used:', TABLE_NAMES.projects);
      setLoading(true);
      setError(null);
      
      const response = await ProjectApiService.getProject(projectId);
      console.log('Project API response:', response);
      console.log('Response data:', response.data);
      console.log('Response success:', response.success);
      console.log('Response error:', response.error);
      
      // Handle different API response structures
      let projectData: ProjectData | null = null;
      
      if (response.success) {
        // Check for different possible response structures
        if (response.data) {
          projectData = response.data as ProjectData;
        } else if ((response as any).item) {
          projectData = (response as any).item as ProjectData;
        } else if (response.items && Array.isArray(response.items) && response.items.length > 0) {
          projectData = response.items[0] as ProjectData;
        }
      }
      
      if (projectData) {
        console.log('Project data before transform:', projectData);
        
        const transformedProject = transformProjectToUI(projectData);
        console.log('Transformed project:', transformedProject);
        
        setProject({
          id: transformedProject.id || projectId,
          name: transformedProject.name,
          description: transformedProject.description || '',
          assignee: transformedProject.assignee,
          progress: transformedProject.progress,
          status: transformedProject.status,
          priority: transformedProject.priority,
          endDate: transformedProject.endDate,
          team: transformedProject.team,
          tasks: transformedProject.tasks,
          budget: transformedProject.budget,
          tags: transformedProject.tags,
          company: transformedProject.company || '',
          startDate: transformedProject.startDate || '',
          notes: transformedProject.notes || ''
        });
        setIsDemoProject(false);
      } else {
        // Project not found in database - let's check what projects are available
        console.log(`Project with ID "${projectId}" not found in database.`);
        console.log('Attempting to fetch all projects to see what IDs are available...');
        
        try {
          const allProjectsResponse = await ProjectApiService.getProjects();
          console.log('All projects response:', allProjectsResponse);
          if (allProjectsResponse.success && allProjectsResponse.data) {
            console.log('Available project IDs:', allProjectsResponse.data.map(p => ({ id: p.id, name: p.name })));
          }
        } catch (error) {
          console.error('Error fetching all projects:', error);
        }
        
        // Create a demo project for display purposes
        const demoProject: Project = {
          id: projectId,
          name: `Demo Project ${projectId}`,
          description: 'This is a demo project created for testing purposes. The actual project data could not be loaded from the API.',
          assignee: 'Demo User',
          progress: 65,
          status: 'In Progress',
          priority: 'Medium',
          endDate: '2024-12-31',
          team: 'Demo Team, Test User, Sample Member',
          tasks: 12,
          budget: '$50,000',
          tags: ['demo', 'test', 'sample'],
          company: 'Demo Company',
          startDate: '2024-01-01',
          notes: 'This is a demo project created when the API could not fetch the actual project data.'
        };
        
        setProject(demoProject);
        setIsDemoProject(true);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Project Not Found</h2>
            <p className="text-slate-600 mb-4">{error || 'The project you are looking for does not exist.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

             {/* Header */}
       <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm sticky top-0 z-40">
         <div className="px-3 md:px-6 py-3 md:py-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 md:gap-4">
               <button
                 onClick={() => router.back()}
                 className="p-1.5 md:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 <ArrowLeft size={18} className="md:w-5 md:h-5" />
               </button>
               <div>
                 <h1 className="text-lg md:text-2xl font-bold text-slate-900">{project.name}</h1>
                 <p className="text-xs md:text-sm text-slate-600 hidden md:block">
                   Project Details
                   {isDemoProject && (
                     <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                       Demo
                     </span>
                   )}
                 </p>
               </div>
             </div>
             
             <div className="flex items-center gap-1.5 md:gap-2">
               {/* Mobile View Toggle */}
               <div className="md:hidden flex items-center bg-slate-100 rounded-lg p-1 shadow-sm">
                 <button 
                   onClick={() => setActiveTab('overview')}
                   className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                     activeTab === 'overview' 
                       ? 'bg-blue-500 text-white shadow-sm' 
                       : 'text-slate-600 hover:text-slate-800'
                   }`}
                 >
                   <Grid3X3 size={14} />
                 </button>
                 <button 
                   onClick={() => setActiveTab('team')}
                   className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                     activeTab === 'team' 
                       ? 'bg-blue-500 text-white shadow-sm' 
                       : 'text-slate-600 hover:text-slate-800'
                   }`}
                 >
                   <Users size={14} />
                 </button>
               </div>
               
               <button className="p-1.5 md:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                 <Share2 size={18} className="md:w-5 md:h-5" />
               </button>
               <button className="p-1.5 md:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                 <MoreHorizontal size={18} className="md:w-5 md:h-5" />
               </button>
             </div>
           </div>
         </div>
       </div>

             <div className="p-3 md:p-6 space-y-4 md:space-y-6">
         {/* Desktop Tabs */}
         <div className="hidden md:block">
           <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
             {[
               { id: 'overview', label: 'Overview', icon: Eye },
               { id: 'team', label: 'Team', icon: Users },
               { id: 'progress', label: 'Progress', icon: BarChart3 }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                   activeTab === tab.id
                     ? 'bg-blue-500 text-white shadow-sm'
                     : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                 }`}
               >
                 <tab.icon size={16} />
                 <span className="font-medium">{tab.label}</span>
               </button>
             ))}
           </div>
         </div>

         {/* Content Area - Form Style */}
         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 md:p-6">
                     {activeTab === 'overview' && (
             <div className="space-y-6 md:space-y-8">
               {/* Project Header */}
               <div className="mb-6 md:mb-8">
                 <div className="flex items-center gap-2 mb-1">
                   <Folder size={20} className="text-blue-600" />
                   <h2 className="text-xl md:text-2xl font-bold text-slate-900">{project.name}</h2>
                 </div>
                 <p className="text-sm text-slate-600">{project.description || 'No description provided'}</p>
                 {isDemoProject && (
                   <p className="text-xs text-yellow-600 mt-1">
                     ⚠️ Demo project
                   </p>
                 )}
               </div>

                             {/* Project Information - Form Style */}
               <div className="space-y-3 md:space-y-4">
                 <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Project Information</h3>
                 
                 {/* Form-style layout */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   {/* Left Column */}
                   <div className="space-y-3 md:space-y-4">
                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Folder size={14} className="md:w-4 md:h-4" />
                         Project Name
                       </label>
                       <p className="text-sm md:text-base text-slate-900 font-medium">{project.name}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <FileText size={14} className="md:w-4 md:h-4" />
                         Description
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.description || 'No description provided'}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Building size={14} className="md:w-4 md:h-4" />
                         Company
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.company}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <User size={14} className="md:w-4 md:h-4" />
                         Team Member
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.assignee}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Users size={14} className="md:w-4 md:h-4" />
                         Team Members
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.team}</p>
                     </div>
                   </div>

                   {/* Right Column */}
                   <div className="space-y-3 md:space-y-4">
                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Calendar size={14} className="md:w-4 md:h-4" />
                         Start Date
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.startDate || 'Not set'}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Target size={14} className="md:w-4 md:h-4" />
                         End Date
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.endDate}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <DollarSign size={14} className="md:w-4 md:h-4" />
                         Budget
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.budget}</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Target size={14} className="md:w-4 md:h-4" />
                         Total Tasks
                       </label>
                       <p className="text-sm md:text-base text-slate-900">{project.tasks} tasks</p>
                     </div>

                     <div className="form-group">
                       <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                         <Tag size={14} className="md:w-4 md:h-4" />
                         Project Tags
                       </label>
                       <div className="flex flex-wrap gap-1.5 md:gap-2">
                         {project.tags.map((tag, idx) => (
                           <span key={idx} className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm">
                             {tag}
                           </span>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Full Width Notes */}
                 <div className="form-group">
                   <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-1.5 flex items-center gap-1.5 md:gap-2">
                     <FileText size={14} className="md:w-4 md:h-4" />
                     Additional Notes
                   </label>
                   <div className="bg-slate-50 rounded-lg p-2 md:p-2.5 border border-slate-200">
                     <p className="text-sm md:text-base text-slate-900">{project.notes || 'No additional notes available.'}</p>
                   </div>
                 </div>
               </div>
            </div>
          )}



                     {activeTab === 'team' && (
             <div className="space-y-4 md:space-y-6">
               <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Project Team</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                 {project.team.split(',').map((member, idx) => (
                   <div key={idx} className="bg-slate-50 rounded-lg p-3 md:p-4 border border-slate-200">
                     <div className="flex items-center gap-2.5 md:gap-3">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                         <User size={20} className="md:w-6 md:h-6 text-blue-600" />
                       </div>
                       <div>
                         <h4 className="text-sm md:text-base font-medium text-slate-900">{member.trim()}</h4>
                         <p className="text-xs md:text-sm text-slate-600">Team Member</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

                     {activeTab === 'progress' && (
             <div className="space-y-4 md:space-y-6">
               <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Project Progress</h3>
               
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6">
                 <div className="flex items-center justify-between mb-3 md:mb-4">
                   <h3 className="text-lg md:text-xl font-semibold text-slate-900">Overall Progress</h3>
                   <span className="text-2xl md:text-3xl font-bold text-blue-600">{project.progress}%</span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-3 md:h-4 mb-3 md:mb-4">
                   <div 
                     className={`h-3 md:h-4 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                     style={{ width: `${project.progress}%` }}
                   />
                 </div>
                 <p className="text-sm md:text-base text-slate-600">
                   {project.progress < 100 ? `${100 - project.progress}% remaining to complete this project` : 'Project completed successfully!'}
                 </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="bg-slate-50 rounded-lg p-4 md:p-6">
                   <h4 className="font-medium text-slate-900 mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                     <CheckCircle size={18} className="md:w-5 md:h-5" />
                     Task Completion
                   </h4>
                   <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1.5 md:mb-2">{project.tasks}</div>
                   <p className="text-sm md:text-base text-slate-600">Total tasks assigned</p>
                 </div>
                 
                 <div className="bg-slate-50 rounded-lg p-4 md:p-6">
                   <h4 className="font-medium text-slate-900 mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                     <Users size={18} className="md:w-5 md:h-5" />
                     Team Size
                   </h4>
                   <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1.5 md:mb-2">{project.team.split(',').length}</div>
                   <p className="text-sm md:text-base text-slate-600">Team members working</p>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

