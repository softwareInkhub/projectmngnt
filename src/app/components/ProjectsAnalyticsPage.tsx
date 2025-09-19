"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { CompanyApiService, CompanyData } from "../utils/companyApi";
import { TaskApiService, TaskData, validateTaskData } from "../utils/taskApi";
import UniversalDetailsModal from "./UniversalDetailsModal";
import EditableTableCell from "./EditableTableCell";
import { useProjectUpdates } from "../hooks/useProjectUpdates";
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

// Helper function to safely parse project tasks
const parseProjectTasks = (tasksString: string | number | undefined): string[] => {
  if (!tasksString) return [];
  if (typeof tasksString === 'number') {
    console.warn('⚠️ Project tasks field is a number, not a JSON array. This indicates a database issue.');
    return []; // Handle legacy number format
  }
  if (typeof tasksString !== 'string') return [];
  
  try {
    const parsed = JSON.parse(tasksString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse project tasks:', error, 'Raw value:', tasksString);
    return [];
  }
};

export default function ProjectsAnalyticsPage({ onOpenTab, onViewProject }: ProjectsAnalyticsPageProps = {}) {
  const router = useRouter();
  
  // API state
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Project updates hook with fallback
  const { updateProjectField, isUpdating, retryFailedUpdates } = useProjectUpdates({
    onUpdate: (updatedProject) => {
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setError(null); // Clear any previous errors
    },
    onError: (error) => {
      console.error('Project update error:', error);
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 5000);
    },
    onLocalSave: (message) => {
      console.log('Project saved locally:', message);
      setNotification(message);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  });
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
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // Task dropdown state
  const [openTaskDropdownId, setOpenTaskDropdownId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [showAddTaskInput, setShowAddTaskInput] = useState<string | null>(null);
  const [projectTasks, setProjectTasks] = useState<{ [projectId: string]: TaskData[] }>({});
  const [loadingTasks, setLoadingTasks] = useState<{ [projectId: string]: boolean }>({});
  const [allTasks, setAllTasks] = useState<TaskData[]>([]);
  const [loadingAllTasks, setLoadingAllTasks] = useState(false);
  const [showAllTasksDropdown, setShowAllTasksDropdown] = useState(false);
  
  // Universal Details Modal state
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    itemType: 'project' as 'project' | 'task' | 'team' | 'company',
    itemId: ''
  });

  // Resizable columns and rows state
  const [columnWidths, setColumnWidths] = useState({
    id: 120,
    name: 250,
    progress: 80,
    owner: 150,
    status: 120,
    tasks: 120,
    phases: 100,
    issues: 100,
    startDate: 120,
    endDate: 120,
    tags: 150,
    actions: 80
  });
  const [rowHeight, setRowHeight] = useState(60); // Default row height
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);


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
      console.log('Projects fetched from API:', response);
      
      if (response.success) {
        const projectsData = response.data || [];
        console.log('Projects data:', projectsData);
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

  // Load projects, companies, and tasks on component mount
  useEffect(() => {
    fetchProjects();
    fetchCompanies();
    fetchAllTasks();
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
          tasks: '[]',
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
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setDropdownPosition(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
          tasks: editingProject ? editingProject.tasks : '[]',
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


  // Task dropdown functions
  const toggleTaskDropdown = async (projectId: string) => {
    if (openTaskDropdownId === projectId) {
      // Closing dropdown
      setOpenTaskDropdownId(null);
      setShowAddTaskInput(null);
      setNewTaskName("");
    } else {
      // Opening dropdown - fetch tasks
      setOpenTaskDropdownId(projectId);
      setShowAddTaskInput(null);
      setNewTaskName("");
      await fetchProjectTasks(projectId);
    }
  };

  const closeTaskDropdown = () => {
    setOpenTaskDropdownId(null);
    setShowAddTaskInput(null);
    setNewTaskName("");
  };

  // Fetch tasks for a specific project
  const fetchProjectTasks = async (projectId: string) => {
    if (projectTasks[projectId]) {
      return; // Already fetched
    }

    setLoadingTasks(prev => ({ ...prev, [projectId]: true }));
    
    try {
      const response = await TaskApiService.getTasks();
      if (response.success && response.data) {
        // Find the project to get its tasks field
        const project = projects.find(p => p.id === projectId);
        let projectSpecificTasks: TaskData[] = [];
        
        if (project) {
          // First, try to get tasks from the project's tasks field (JSON array of task IDs)
          const taskIds = parseProjectTasks(project.tasks);
          console.log(`🔍 Fetching tasks for project ${projectId}, task IDs:`, taskIds);
          
          if (taskIds.length > 0) {
            projectSpecificTasks = response.data.filter((task: TaskData) => 
              task.id && taskIds.includes(task.id)
            );
            console.log(`🔍 Tasks found by ID match:`, projectSpecificTasks.length);
          }
          
          // Fallback: if no tasks found in project's task list, use the old filtering method
          if (projectSpecificTasks.length === 0) {
            projectSpecificTasks = response.data.filter((task: TaskData) => task.project === projectId);
            console.log(`🔍 Tasks found by project field match:`, projectSpecificTasks.length);
          }
        } else {
          // If project not found, use the old filtering method
          projectSpecificTasks = response.data.filter((task: TaskData) => task.project === projectId);
        }
        
        console.log(`🔍 Final project tasks for ${projectId}:`, projectSpecificTasks.length);
        setProjectTasks(prev => ({ ...prev, [projectId]: projectSpecificTasks }));
      } else {
        setProjectTasks(prev => ({ ...prev, [projectId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching tasks for project:', error);
      setProjectTasks(prev => ({ ...prev, [projectId]: [] }));
    } finally {
      setLoadingTasks(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Fetch all tasks for the add task dropdown
  const fetchAllTasks = async (forceRefresh = false) => {
    if (allTasks.length > 0 && !forceRefresh) {
      return; // Already fetched
    }

    setLoadingAllTasks(true);
    
    try {
      const response = await TaskApiService.getTasks();
      if (response.success && response.data) {
        setAllTasks(response.data);
        console.log('✅ All tasks refreshed:', response.data.length, 'tasks');
      } else {
        setAllTasks([]);
      }
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      setAllTasks([]);
    } finally {
      setLoadingAllTasks(false);
    }
  };

  // Helper function to get task status color and label
  const getTaskStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
        return { color: 'bg-green-400', label: 'Completed' };
      case 'in progress':
      case 'active':
        return { color: 'bg-yellow-400', label: 'In Progress' };
      case 'pending':
      case 'todo':
        return { color: 'bg-slate-300', label: 'Pending' };
      case 'planning':
        return { color: 'bg-blue-400', label: 'Planning' };
      case 'blocked':
        return { color: 'bg-purple-400', label: 'Blocked' };
      case 'cancelled':
        return { color: 'bg-red-400', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-400', label: status || 'Unknown' };
    }
  };

  const handleAddTask = async (projectId: string) => {
    if (newTaskName.trim()) {
      try {
        const newTask: TaskData = {
          id: `task-${Date.now()}`,
          title: newTaskName.trim(),
          project: projectId,
          status: 'To Do',
          priority: 'Medium',
          assignee: 'Unassigned', // Fixed: Provide a default assignee
          description: `Task for project ${projectId}`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
          startDate: new Date().toISOString().split('T')[0], // Today
          progress: 0,
          estimatedHours: 0,
          timeSpent: '0',
          tags: '',
          subtasks: '[]',
          comments: '0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Validate task data before creating
        const validation = validateTaskData(newTask);
        if (!validation.isValid) {
          console.error('❌ Task validation failed:', validation.errors);
          alert(`Task validation failed: ${validation.errors.join(', ')}`);
          return;
        }

        console.log('🔄 Creating task with data:', newTask);
        const response = await TaskApiService.createTask(newTask);
        console.log('📝 Task creation response:', response);
        
        if (response.success && response.data) {
          console.log('✅ Task created successfully:', response.data);
          
          // Update local state
          setProjectTasks(prev => ({
            ...prev,
            [projectId]: [...(prev[projectId] || []), response.data!]
          }));

          // Update all tasks list
          setAllTasks(prev => [...prev, response.data!]);
          console.log('✅ New task added to allTasks list:', response.data!.id);

          // Clear the input field
          setNewTaskName('');

          // Update project task list with new task ID
          const currentProject = projects.find(p => p.id === projectId);
          if (currentProject) {
            const currentTasks = parseProjectTasks(currentProject.tasks);
            const updatedTasks = [...currentTasks, response.data!.id];
            
            // Update project in database with new task list
            try {
              console.log(`🔄 Updating project ${projectId} in database with new task:`, response.data!.id);
              const updateResponse = await ProjectApiService.updateProject(projectId, { tasks: JSON.stringify(updatedTasks) });
              if (updateResponse.success) {
                console.log(`✅ Project task list updated with new task in database successfully`);
              } else {
                console.warn(`⚠️ Failed to update project task list in database:`, updateResponse.error);
              }
            } catch (error) {
              console.warn(`⚠️ Error updating project task list:`, error);
            }
            
            // Update local state
            setProjects(prev => prev.map(project => {
              if (project.id === projectId) {
                return { ...project, tasks: JSON.stringify(updatedTasks) };
              }
              return project;
            }));
          }

          setNewTaskName("");
          setShowAddTaskInput(null);
          
          // Refresh all tasks and projects to ensure display updates
          await fetchAllTasks(true);
          fetchProjects();
        } else {
          console.error('❌ Task creation failed:', response.error);
          alert(`Failed to create task: ${response.error || 'Unknown error'}`);
        }
    } catch (error) {
      console.error('❌ Error creating task:', error);
      alert(`Error creating task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    }
  };

  // Add existing task to project
  const handleAddExistingTask = async (taskId: string, projectId: string) => {
    try {
      const taskToAdd = allTasks.find(task => task.id === taskId);
      if (!taskToAdd) return;

      console.log(`🔄 Adding task "${taskToAdd.title}" to project ${projectId}`);
      
      // Try to update the task in the database with only the project field
      try {
        // Create a minimal update object with only the project field
        const projectUpdate = { project: projectId };
        
        // Use a direct API call to update only the project field
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://brmh.in'}/crud?tableName=tasks&id=${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: { id: taskId },
            updates: projectUpdate
          }),
        });

        if (response.ok) {
          console.log(`✅ Task "${taskToAdd.title}" successfully added to project in database!`);
        } else {
          console.warn(`⚠️ Database update failed, but continuing with local update`);
        }
      } catch (dbError) {
        console.warn(`⚠️ Database update failed:`, dbError, `but continuing with local update`);
      }
      
      // Create the updated task object for local state
      const updatedTask = { ...taskToAdd, project: projectId };
      
      // Update local state immediately (optimistic update)
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), updatedTask]
      }));

      // Update all tasks list
      setAllTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Update project task list with actual task IDs
      const currentProject = projects.find(p => p.id === projectId);
      if (currentProject) {
        const currentTasks = parseProjectTasks(currentProject.tasks);
        const updatedTasks = [...currentTasks, taskId];
        
        // Update project in database with new task list
        try {
          console.log(`🔄 Updating project ${projectId} in database with tasks:`, JSON.stringify(updatedTasks));
          const updateResponse = await ProjectApiService.updateProject(projectId, { tasks: JSON.stringify(updatedTasks) });
          if (updateResponse.success) {
            console.log(`✅ Project task list updated in database successfully`);
          } else {
            console.warn(`⚠️ Failed to update project task list in database:`, updateResponse.error);
          }
        } catch (error) {
          console.warn(`⚠️ Error updating project task list:`, error);
        }
        
        // Update local state
        setProjects(prev => prev.map(project => {
          if (project.id === projectId) {
            return { ...project, tasks: JSON.stringify(updatedTasks) };
          }
          return project;
        }));
      }

      // Show success feedback
      console.log(`✅ Task "${taskToAdd.title}" successfully added to project!`);
      
      // Close the add task input
      setShowAddTaskInput(null);
      setNewTaskName("");
      
      // Refresh all tasks and projects to ensure display updates
      await fetchAllTasks(true);
      fetchProjects();
      
    } catch (error) {
      console.error('Error adding existing task to project:', error);
      // You could add a toast notification here for error feedback
    }
  };

  // Calculate dropdown position - positioned directly below the button
  const calculateDropdownPosition = (buttonElement: HTMLButtonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    const dropdownWidth = 192; // w-48 = 192px
    const viewportWidth = window.innerWidth;
    const buttonRight = rect.right + scrollLeft;
    const buttonLeft = rect.left + scrollLeft;
    
    // Calculate left position to keep dropdown in viewport
    let left = buttonLeft;
    
    // If dropdown would go off the right edge, align it to the right edge of the button
    if (buttonLeft + dropdownWidth > viewportWidth) {
      left = buttonRight - dropdownWidth;
    }
    
    // Ensure dropdown doesn't go off the left edge
    if (left < 0) {
      left = 8; // 8px margin from left edge
    }
    
    return {
      top: rect.bottom + scrollTop + 4, // 4px gap below button
      left: left
    };
  };


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setDropdownPosition(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
  };

  const handleDuplicateProject = async (project: ProjectData) => {
    try {
      const duplicatedProject = {
        ...project,
        name: `${project.name} (Copy)`,
        status: 'Planning',
        progress: 0,
        tasks: '[]',
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

  // Resizable columns and rows handlers
  const handleMouseDown = (e: React.MouseEvent, resizeType: string, key?: string) => {
    e.preventDefault();
    setIsResizing(resizeType);
    setResizeStartX(e.clientX);
    setResizeStartY(e.clientY);
    
    if (resizeType.startsWith('column-') && key) {
      setResizeStartWidth(columnWidths[key as keyof typeof columnWidths]);
    } else if (resizeType === 'row') {
      setResizeStartHeight(rowHeight);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    if (isResizing.startsWith('column-')) {
      const columnKey = isResizing.replace('column-', '');
      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(80, resizeStartWidth + deltaX); // Minimum width of 80px
      
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    } else if (isResizing === 'row') {
      const deltaY = e.clientY - resizeStartY;
      const newHeight = Math.max(50, resizeStartHeight + deltaY); // Minimum height of 50px
      setRowHeight(newHeight);
    }
  }, [isResizing, resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
  }, []);

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Set appropriate cursor based on resize type
      if (isResizing.startsWith('column-')) {
        document.body.style.cursor = 'col-resize';
      } else if (isResizing === 'row') {
        document.body.style.cursor = 'row-resize';
      }
      
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}
      
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Projects</h1>
              
              <p className="text-slate-600 mt-1 text-xl">Analytics and insights for your projects</p>
            </div>
          </div>
          
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop search/filters as before */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search projects..." value={searchTerm ?? ""} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 text-xl" />
            </div>
            <select value={statusFilter ?? ""} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="All">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter ?? ""} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
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
            <select value={statusFilter ?? ""} onChange={(e) => setStatusFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
              <option value="All">Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter ?? ""} onChange={(e) => setPriorityFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
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
                <p className="text-red-600 mb-4">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={fetchProjects}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Fetch
                  </button>
                  <button 
                    onClick={retryFailedUpdates}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retry Updates
                  </button>
                </div>
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
                  <div className="relative">
                    {/* Resize indicator */}
                    {isResizing && (
                      <div className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm font-medium">
                        {isResizing.startsWith('column-') ? 'Resizing Column' : 'Resizing Row'}
                      </div>
                    )}
                    {/* Row resize handle */}
                    <div 
                      className="resize-handle row-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'row')}
                    />
                    <table className={`min-w-full bg-white border border-slate-200 rounded-xl shadow-sm resizable-table ${isResizing ? 'resizing' : ''}`}>
                      <thead className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-lg border-b border-slate-300 relative">
                        <tr>
                        <th 
                          className="text-left px-2 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.id}px` }}
                        >
                          ID
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-id', 'id')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.name}px` }}
                        >
                          Project Name
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-name', 'name')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.progress}px` }}
                        >
                          %
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-progress', 'progress')}
                          />
                        </th>
                        <th 
                          className="text-left px-2 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.owner}px` }}
                        >
                          Owner
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-owner', 'owner')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.status}px` }}
                        >
                          Status
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-status', 'status')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.tasks}px` }}
                        >
                          Task List
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-tasks', 'tasks')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.phases}px` }}
                        >
                          Phases
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-phases', 'phases')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.issues}px` }}
                        >
                          Issues
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-issues', 'issues')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.startDate}px` }}
                        >
                          Start Date
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-startDate', 'startDate')}
                          />
                        </th>
                        <th 
                          className="text-left px-3 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.endDate}px` }}
                        >
                          End Date
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-endDate', 'endDate')}
                          />
                        </th>
                        <th 
                          className="text-left px-2 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.tags}px` }}
                        >
                          Tags
                          <div 
                            className="resize-handle column-resize"
                            onMouseDown={(e) => handleMouseDown(e, 'column-tags', 'tags')}
                          />
                        </th>
                        <th 
                          className="text-right px-2 py-1.5 relative select-none"
                          style={{ width: `${columnWidths.actions}px` }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-lg overflow-visible">
                      {filteredProjects.map((project, idx) => {
                        const theme = { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' };
                        return (
                        <tr 
                          key={project.id} 
                          className={`cursor-pointer border ${theme.border} ${theme.bg} rounded-lg shadow-sm hover:shadow-md transition-all duration-200`} 
                          onClick={(e) => {
                            // Only handle row click if not clicking on an editable cell or menu button
                            if (!(e.target as HTMLElement).closest('.editable-cell') && 
                                !(e.target as HTMLElement).closest('.menu-container')) {
                              handleProjectClick(project.id || '');
                            }
                          }}
                          style={{ height: `${rowHeight}px` }}
                        >
                          <td 
                            className="px-2 py-2 text-slate-600 align-middle text-lg overflow-hidden"
                            style={{ width: `${columnWidths.id}px` }}
                          >
                            {project.id || '-'}
                          </td>
                          <td 
                            className="px-3 py-2 align-middle overflow-hidden"
                            style={{ width: `${columnWidths.name}px` }}
                          >
                            <div 
                              className="text-slate-900 font-semibold text-2xl truncate editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditableTableCell
                                value={project.name || 'Untitled Project'}
                                onSave={(newValue) => updateProjectField(project.id || '', 'name', newValue)}
                                type="text"
                                className="text-slate-900 font-semibold text-2xl"
                                placeholder="Project name"
                              />
                            </div>
                            <div 
                              className="text-lg text-slate-500 line-clamp-1 truncate editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditableTableCell
                                value={project.description || ''}
                                onSave={(newValue) => updateProjectField(project.id || '', 'description', newValue)}
                                type="text"
                                className="text-lg text-slate-500"
                                placeholder="Project description"
                              />
                            </div>
                          </td>
                          <td 
                            className="px-3 py-2 text-slate-900 font-semibold align-middle text-2xl overflow-hidden"
                            style={{ width: `${columnWidths.progress}px` }}
                          >
                            <div 
                              className="editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditableTableCell
                                value={project.progress || 0}
                                onSave={(newValue) => updateProjectField(project.id || '', 'progress', newValue)}
                                type="number"
                                className="text-slate-900 font-semibold text-2xl"
                                placeholder="0"
                              />%
                            </div>
                          </td>
                          <td 
                            className="px-2 py-2 align-middle overflow-hidden"
                            style={{ width: `${columnWidths.owner}px` }}
                          >
                            <div 
                              className="flex items-center gap-2 editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-base flex items-center justify-center font-bold flex-shrink-0">
                                {getInitials(project.company || project.assignee || '')}
                              </div>
                              <EditableTableCell
                                value={project.company || project.assignee || ''}
                                onSave={(newValue) => updateProjectField(project.id || '', 'company', newValue)}
                                type="text"
                                className="text-slate-700 text-lg truncate"
                                placeholder="Company/Assignee"
                              />
                            </div>
                          </td>
                          <td 
                            className="px-3 py-2 align-middle overflow-hidden"
                            style={{ width: `${columnWidths.status}px` }}
                          >
                            <div 
                              className="editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditableTableCell
                                value={project.status || 'Planning'}
                                onSave={(newValue) => updateProjectField(project.id || '', 'status', newValue)}
                                type="select"
                                options={['Planning', 'Active', 'In Progress', 'Completed', 'On Hold', 'Cancelled']}
                                className={`px-2 py-1 rounded-full text-lg font-medium ${statusPillClass(project.status || '')}`}
                              />
                            </div>
                          </td>
                          <td 
                            className="px-3 py-2 align-middle overflow-visible relative"
                            style={{ width: `${columnWidths.tasks}px` }}
                          >
                            <div 
                              className="space-y-1 cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskDropdown(project.id || '');
                              }}
                            >
                              {/* Show real task data from project's task list */}
                              {(() => {
                                // Get tasks from project's task list
                                let projectTaskList: any[] = [];
                                const taskIds = parseProjectTasks(project.tasks);
                                console.log(`🔍 Project ${project.id} tasks field:`, project.tasks);
                                console.log(`🔍 Parsed task IDs:`, taskIds);
                                console.log(`🔍 All tasks available:`, allTasks.length);
                                
                                if (taskIds.length > 0) {
                                  projectTaskList = allTasks.filter(task => task.id && taskIds.includes(task.id));
                                  console.log(`🔍 Tasks found by ID match:`, projectTaskList.length);
                                }
                                
                                // Fallback to projectTasks if available
                                if (projectTaskList.length === 0 && projectTasks[project.id || '']?.length > 0) {
                                  projectTaskList = projectTasks[project.id || ''];
                                  console.log(`🔍 Using fallback projectTasks:`, projectTaskList.length);
                                }
                                
                                return projectTaskList.length > 0 ? (
                                  <>
                                    {projectTaskList.slice(0, 3).map((task, index) => {
                                      const statusInfo = getTaskStatusInfo(task.status || '');
                                      return (
                                        <div key={task.id || index} className="flex items-center gap-2">
                                          <div className={`w-2 h-2 ${statusInfo.color} rounded-full flex-shrink-0`}></div>
                                          <span className="text-base text-slate-700 truncate">{task.title || 'Untitled Task'}</span>
                                        </div>
                                      );
                                    })}
                                    {projectTaskList.length > 3 && (
                                      <div className="text-sm text-slate-500">
                                        +{projectTaskList.length - 3} more tasks
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-sm text-slate-500">No tasks assigned</div>
                                );
                              })()}
                            </div>

                            {/* Task Dropdown */}
                            {openTaskDropdownId === project.id && (
                              <div className="task-dropdown-container absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200">
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-semibold text-slate-900">Project Tasks</h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeTaskDropdown();
                                      }}
                                      className="text-slate-400 hover:text-slate-600"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                  
                                  {/* Task List */}
                                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                    {loadingTasks[project.id || ''] ? (
                                      <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-base text-slate-600">Loading tasks...</span>
                                      </div>
                                    ) : projectTasks[project.id || '']?.length > 0 ? (
                                      projectTasks[project.id || ''].map((task) => {
                                        const statusInfo = getTaskStatusInfo(task.status || '');
                                        return (
                                          <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                                            <div className={`w-3 h-3 ${statusInfo.color} rounded-full flex-shrink-0`}></div>
                                            <span className="text-base text-slate-700 truncate">{task.title || 'Untitled Task'}</span>
                                            <span className="text-xs text-slate-500 ml-auto">{statusInfo.label}</span>
                                          </div>
                                        );
                                      })
                                    ) : null}
                                  </div>

                                  {/* Add New Task */}
                                  <div className="border-t border-slate-200 pt-3">
                                    {showAddTaskInput === project.id ? (
                                      <div className="space-y-3">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={newTaskName}
                                            onChange={(e) => setNewTaskName(e.target.value)}
                                            placeholder="Enter task name..."
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autoFocus
                                            onKeyPress={(e) => {
                                              if (e.key === 'Enter') {
                                                handleAddTask(project.id || '');
                                              }
                                            }}
                                          />
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAddTask(project.id || '');
                                            }}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                          >
                                            <Plus size={16} />
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setShowAddTaskInput(null);
                                              setNewTaskName("");
                                            }}
                                            className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>

                                        {/* All Tasks Dropdown */}
                                        <div className="border border-slate-200 rounded-lg bg-slate-50">
                                          <div className="px-4 py-3 border-b border-slate-200">
                                            <h5 className="text-lg font-semibold text-slate-700">All Existing Tasks ({allTasks.length})</h5>
                                          </div>
                                          <div className="max-h-60 overflow-y-auto">
                                            {loadingAllTasks ? (
                                              <div className="flex items-center justify-center py-6">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                <span className="ml-3 text-base text-slate-600">Loading tasks...</span>
                                              </div>
                                            ) : allTasks.length > 0 ? (
                                              allTasks.map((task) => {
                                                const statusInfo = getTaskStatusInfo(task.status || '');
                                                const isAlreadyInProject = projectTasks[project.id || '']?.some(pt => pt.id === task.id);
                                                const isCurrentProject = task.project === project.id;
                                                
                                                return (
                                                  <div key={`project-task-list-${task.id}`} className={`flex items-center gap-4 p-3 hover:bg-white border-b border-slate-100 last:border-b-0 ${isAlreadyInProject || isCurrentProject ? 'bg-green-50' : ''}`}>
                                                    <div className={`w-3 h-3 ${statusInfo.color} rounded-full flex-shrink-0`}></div>
                                                    <div className="flex-1 min-w-0">
                                                      <div className="text-lg font-medium text-slate-800 truncate">{task.title || 'Untitled Task'}</div>
                                                      <div className="text-base text-slate-500">
                                                        {task.assignee && `Assignee: ${task.assignee}`}
                                                        {task.assignee && task.priority && ' • '}
                                                        {task.priority && `Priority: ${task.priority}`}
                                                      </div>
                                                    </div>
                                                    <div className="text-base text-slate-400">
                                                      {statusInfo.label}
                                                    </div>
                                                    {isAlreadyInProject || isCurrentProject ? (
                                                      <span className="px-3 py-2 text-base bg-green-100 text-green-700 rounded">
                                                        ✓ Added
                                                      </span>
                                                    ) : (
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleAddExistingTask(task.id || '', project.id || '');
                                                        }}
                                                        className="px-3 py-2 text-base bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                      >
                                                        Add
                                                      </button>
                                                    )}
                                                  </div>
                                                );
                                              })
                                            ) : (
                                              <div className="text-center py-4">
                                                <span className="text-sm text-slate-500">No tasks found</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          setShowAddTaskInput(project.id || '');
                                          await fetchAllTasks();
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                      >
                                        <Plus size={16} />
                                        <span className="text-base">Add new task</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                          <td 
                            className="px-3 py-2 align-middle overflow-hidden"
                            style={{ width: `${columnWidths.phases}px` }}
                          >
                            <span className="text-lg text-slate-600 font-medium">No Phases</span>
                          </td>
                          <td 
                            className="px-3 py-2 align-middle overflow-hidden"
                            style={{ width: `${columnWidths.issues}px` }}
                          >
                            <span className="text-lg text-slate-600 font-medium">No Issues</span>
                          </td>
                          <td 
                            className="px-3 py-2 text-slate-600 align-middle text-lg whitespace-nowrap overflow-hidden"
                            style={{ width: `${columnWidths.startDate}px` }}
                          >
                            <div 
                              className="editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditableTableCell
                                value={project.startDate || ''}
                                onSave={(newValue) => updateProjectField(project.id || '', 'startDate', newValue)}
                                type="date"
                                className="text-slate-600 text-lg"
                              />
                            </div>
                          </td>
                          <td 
                            className="px-3 py-2 text-slate-600 align-middle text-lg whitespace-nowrap overflow-hidden"
                            style={{ width: `${columnWidths.endDate}px` }}
                          >
                            <div 
                              className="editable-cell"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditableTableCell
                                value={project.endDate || ''}
                                onSave={(newValue) => updateProjectField(project.id || '', 'endDate', newValue)}
                                type="date"
                                className="text-slate-600 text-lg"
                              />
                            </div>
                          </td>
                          <td 
                            className="px-2 py-2 align-middle overflow-hidden"
                            style={{ width: `${columnWidths.tags}px` }}
                          >
                            <div className="flex flex-nowrap gap-1.5 overflow-hidden">
                              {parseTags(project.tags).slice(0, 2).map((tag, idx) => (
                                <span key={`project-tag-${idx}`} className="px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300 rounded-full text-base font-medium flex-shrink-0">{tag}</span>
                              ))}
                              {parseTags(project.tags).length > 2 && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300 rounded-full text-base font-medium flex-shrink-0">+{parseTags(project.tags).length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td 
                            className="px-2 py-2 align-middle text-right relative menu-container overflow-visible"
                            style={{ width: `${columnWidths.actions}px` }}
                          >
                            <button
                              ref={(el) => {
                                if (project.id) {
                                  buttonRefs.current[project.id] = el;
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent.stopImmediatePropagation();
                                console.log('🔍 Three dots clicked for project:', project.id);
                                
                                if (openMenuId === project.id) {
                                  setOpenMenuId(null);
                                  setDropdownPosition(null);
                                } else {
                                  setOpenMenuId(project.id || '');
                                  if (project.id && buttonRefs.current[project.id]) {
                                    const position = calculateDropdownPosition(buttonRefs.current[project.id]!);
                                    console.log('🔍 Calculated position:', position);
                                    setDropdownPosition(position);
                                  }
                                }
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                              }}
                              className="relative z-10 p-1 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                              data-menu-button="true"
                              aria-label="Open menu"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {openMenuId === project.id && dropdownPosition && createPortal(
                              <div
                                className="fixed w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[99999] transform transition-all duration-200 ease-in-out"
                                style={{
                                  top: `${dropdownPosition.top}px`,
                                  left: `${dropdownPosition.left}px`,
                                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      setDropdownPosition(null);
                                      handleEditProject(project);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                  >
                                    <Edit size={16} />
                                    Edit Project
                                  </button>
                                  <div className="border-t border-gray-100"></div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      setDropdownPosition(null);
                                      handleDeleteProject(project);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    Delete Project
                                  </button>
                                </div>
                              </div>,
                              document.body
                            )}
                          </td>
                        </tr>
                      );})}
                    </tbody>
                  </table>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2 md:gap-3 mx-2 md:mx-0 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 overflow-visible">
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
                  <div className="space-y-0.5 mt-1">
                    {(() => {
                      // Get tasks from project's task list
                      let projectTaskList: any[] = [];
                      const taskIds = parseProjectTasks(project.tasks);
                      console.log(`🔍 Grid - Project ${project.id} tasks field:`, project.tasks);
                      console.log(`🔍 Grid - Parsed task IDs:`, taskIds);
                      
                      if (taskIds.length > 0) {
                        projectTaskList = allTasks.filter(task => task.id && taskIds.includes(task.id));
                        console.log(`🔍 Grid - Tasks found by ID match:`, projectTaskList.length);
                      }
                      
                      // Fallback to projectTasks if available
                      if (projectTaskList.length === 0 && projectTasks[project.id || '']?.length > 0) {
                        projectTaskList = projectTasks[project.id || ''];
                        console.log(`🔍 Grid - Using fallback projectTasks:`, projectTaskList.length);
                      }
                      
                      return projectTaskList.length > 0 ? (
                        <>
                          {projectTaskList.slice(0, 2).map((task, index) => {
                            const statusInfo = getTaskStatusInfo(task.status || '');
                            return (
                              <div key={`project-task-${task.id || index}`} className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 ${statusInfo.color} rounded-full`}></div>
                                <span className="text-sm text-slate-600 truncate">{task.title || 'Untitled Task'}</span>
                              </div>
                            );
                          })}
                          {projectTaskList.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{projectTaskList.length - 2} more
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-slate-500">No tasks assigned</div>
                      );
                    })()}
                  </div>
                </div>
                      </div>

                      <div className="absolute top-0.5 right-0.5 menu-container">
                        <button
                          ref={(el) => {
                            if (project.id) {
                              buttonRefs.current[project.id] = el;
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            e.nativeEvent.stopImmediatePropagation();
                            console.log('🔍 Grid view three dots clicked for project:', project.id);
                            console.log('🔍 Current openMenuId:', openMenuId);
                            
                            if (openMenuId === project.id) {
                              console.log('🔍 Grid view closing menu');
                              setOpenMenuId(null);
                              setDropdownPosition(null);
                            } else {
                              console.log('🔍 Grid view opening menu');
                              setOpenMenuId(project.id || '');
                              if (project.id && buttonRefs.current[project.id]) {
                                const position = calculateDropdownPosition(buttonRefs.current[project.id]!);
                                setDropdownPosition(position);
                              }
                            }
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          aria-label="Open menu"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenuId === project.id && dropdownPosition && createPortal(
                          <div
                            className="fixed w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[99999] transform transition-all duration-200 ease-in-out"
                            style={{
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setDropdownPosition(null);
                                  handleEditProject(project);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <div className="border-t border-gray-100"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setDropdownPosition(null);
                                  handleDeleteProject(project);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </div>,
                          document.body
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