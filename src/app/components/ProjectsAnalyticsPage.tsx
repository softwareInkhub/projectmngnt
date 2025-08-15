import { useState } from "react";
import { 
  X, 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
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
  ChevronUp
} from "lucide-react";

const initialCompanies = [
  {
    name: "Whapi Corp",
    projects: [
      {
        name: "Whapi Project Management",
        status: "Active",
        members: ["A", "B", "C"],
        description: "Comprehensive project management platform for enterprise teams",
        tasks: [
          { id: 1, title: "Design UI Components", status: "Completed", assignee: "A" },
          { id: 2, title: "Implement Authentication", status: "In Progress", assignee: "B" },
          { id: 3, title: "Database Schema Design", status: "Pending", assignee: "C" }
        ],
        sprints: [
          { id: 1, name: "Sprint 1", status: "Completed", tasks: 8 },
          { id: 2, name: "Sprint 2", status: "Active", tasks: 12 }
        ],
        progress: 65,
        startDate: "2024-01-15",
        endDate: "2024-06-30"
      },
      {
        name: "Client Portal",
        status: "Planning",
        members: ["A", "D"],
        description: "Customer-facing portal for client management",
        tasks: [
          { id: 1, title: "Requirements Gathering", status: "Completed", assignee: "A" },
          { id: 2, title: "Architecture Design", status: "In Progress", assignee: "D" }
        ],
        sprints: [
          { id: 1, name: "Planning Sprint", status: "Active", tasks: 5 }
        ],
        progress: 25,
        startDate: "2024-03-01",
        endDate: "2024-08-31"
      },
    ],
  },
  {
    name: "Inkhub",
    projects: [
      {
        name: "Inkhub Docs",
        status: "Active",
        members: ["E", "F"],
        description: "Documentation platform for development teams",
        tasks: [
          { id: 1, title: "API Documentation", status: "Completed", assignee: "E" },
          { id: 2, title: "User Guide Creation", status: "In Progress", assignee: "F" },
          { id: 3, title: "Integration Testing", status: "Pending", assignee: "E" }
        ],
        sprints: [
          { id: 1, name: "Sprint 1", status: "Completed", tasks: 6 },
          { id: 2, name: "Sprint 2", status: "Active", tasks: 8 }
        ],
        progress: 45,
        startDate: "2024-02-01",
        endDate: "2024-07-31"
      },
    ],
  },
];

const statusTabs = ["All", "Active", "Planning", "Completed", "Archived"];
const analytics = [
  { label: "Total Projects", value: 6 },
  { label: "Active", value: 4 },
  { label: "Planning", value: 2 },
  { label: "Completed", value: 1 },
  { label: "Overdue", value: 0 },
];
const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Status", value: "status" },
  { label: "Progress", value: "progress" },
  { label: "Start Date", value: "startDate" },
  { label: "End Date", value: "endDate" },
];

interface Project {
  name: string;
  status: string;
  members: string[];
  description: string;
  tasks: Array<{ id: number; title: string; status: string; assignee: string }>;
  sprints: Array<{ id: number; name: string; status: string; tasks: number }>;
  progress: number;
  startDate: string;
  endDate: string;
  company?: string;
  archived?: boolean;
}

export default function ProjectsAnalyticsPage({ onViewProject, onOpenTab }: { onViewProject: (project: Project) => void, onOpenTab?: (type: string, title?: string, project?: Project) => void }) {
  // State for all companies/projects
  const [companies, setCompanies] = useState(initialCompanies);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCompany, setFilterCompany] = useState<string>("");
  const [filterMember, setFilterMember] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const pageSize = 10;

  // Flatten all projects for filtering/sorting
  const allProjects: Project[] = [];
  companies.forEach(company => {
    company.projects.forEach(project => {
      allProjects.push({ ...project, company: company.name });
    });
  });

  // Filters
  let filtered = allProjects.filter(p =>
    (activeTab === "All" || p.status === activeTab) &&
    (!filterStatus || p.status === filterStatus) &&
    (!filterCompany || p.company === filterCompany) &&
    (!filterMember || p.members.includes(filterMember)) &&
    (!p.archived || activeTab === "Archived")
  );
  // Search
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.company?.toLowerCase().includes(search.toLowerCase()));
  }
  // Sort
  filtered = filtered.sort((a, b) => {
    if (sort === "progress") return sortAsc ? a.progress - b.progress : b.progress - a.progress;
    const aVal = a[sort as keyof Project];
    const bVal = b[sort as keyof Project];
    const aStr = aVal !== undefined && aVal !== null ? String(aVal) : "";
    const bStr = bVal !== undefined && bVal !== null ? String(bVal) : "";
    return sortAsc ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });
  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Bulk actions
  const bulkArchive = () => {
    setCompanies(prev => prev.map(company => ({
      ...company,
      projects: company.projects.map(p => selected[p.name] ? { ...p, archived: true } : p)
    })));
    setSelected({});
  };
  const bulkDelete = () => {
    setCompanies(prev => prev.map(company => ({
      ...company,
      projects: company.projects.filter(p => !selected[p.name])
    })));
    setSelected({});
  };
  
  // Single actions
  const archiveProject = (project: Project) => {
    setCompanies(prev => prev.map(company => ({
      ...company,
      projects: company.projects.map(p => p.name === project.name ? { ...p, archived: true } : p)
    })));
  };
  const deleteProject = (project: Project) => {
    setCompanies(prev => prev.map(company => ({
      ...company,
      projects: company.projects.filter(p => p.name !== project.name)
    })));
  };
  const duplicateProject = (project: Project) => {
    const newProject = {
      ...project,
      name: `${project.name} (Copy)`,
      progress: 0,
      status: "Planning"
    };
    setCompanies(prev => prev.map(company => 
      company.name === project.company 
        ? { ...company, projects: [...company.projects, newProject] }
        : company
    ));
  };
  const exportProject = (project: Project) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Unique companies and members for filters
  const allCompanies = Array.from(new Set(allProjects.map(p => p.company)));
  const allMembers = Array.from(new Set(allProjects.flatMap(p => p.members)));

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const all: Record<string, boolean> = {};
      paginated.forEach(p => all[p.name] = true);
      setSelected(all);
    } else {
      setSelected({});
    }
  };

  // Handle individual select
  const handleSelectProject = (projectName: string, checked: boolean) => {
    setSelected(prev => ({ ...prev, [projectName]: checked }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterStatus("");
    setFilterCompany("");
    setFilterMember("");
    setSearch("");
    setPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = filterStatus || filterCompany || filterMember;

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
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyDescription, setNewCompanyDescription] = useState("");

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
        const newProject: Project = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        members: projectData.teamMembers,
          tasks: [],
          sprints: [],
          progress: 0,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        company: projectData.company,
          archived: false
        };
        
        setCompanies(prev => prev.map(company => 
        company.name === projectData.company 
            ? { ...company, projects: [...company.projects, newProject] }
            : company
        ));
        
        setShowCreateForm(false);
      console.log('Project created successfully:', newProject);
      } catch (error) {
        console.error('Error creating project:', error);
      }
  };

  const handleCreateNewCompany = () => {
    if (newCompanyName.trim()) {
      const newCompany = {
        name: newCompanyName.trim(),
        projects: [],
      };
      setCompanies(prev => [...prev, newCompany]);
      setSelectedCompany(newCompanyName.trim());
      setShowNewCompanyModal(false);
      setNewCompanyName("");
      setNewCompanyDescription("");
    }
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
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

  const handleOpenCompanyProjects = (companyName: string) => {
    setFilterCompany(companyName);
    setPage(1);
    if (onOpenTab) {
      onOpenTab("projects", `Projects - ${companyName}`);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <BarChart2 className="w-6 h-6" />
            </div>
        <div>
              <h1 className="text-xl font-bold text-slate-900">Projects Analytics</h1>
              <p className="text-slate-600 mt-1">Analytics and insights for your projects</p>
        </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200 hover:shadow-md"
            >
              <Download size={16} />
              Export All
          </button>
            <button 
              className="flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            New Project
          </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Professional Inline Create Project Form */}
      {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Project</h2>
                <p className="text-slate-500 text-sm">Fill in the details below to create a new project</p>
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                        <span className={selectedCompany ? "text-slate-900" : "text-slate-500"}>
                      {selectedCompany || "Select a company"}
                    </span>
                        <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  
                  {showCompanyDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {/* Company Options */}
                          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Companies</span>
                          </div>
                          {companies.map((company) => (
                        <button
                              key={company.name}
                          type="button"
                          onClick={() => {
                                setSelectedCompany(company.name);
                            setShowCompanyDropdown(false);
                          }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                        >
                              <Building size={14} className="text-blue-500" />
                              {company.name}
                        </button>
                      ))}
                          
                          {/* Company Management Options */}
                          <div className="border-t border-slate-200">
                            <div className="px-3 py-2 bg-slate-50">
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Company Management</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open Projects page for selected company
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                            >
                              <FolderOpen size={14} className="text-green-500" />
                              Projects
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open Sprints page for selected company
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                            >
                              <Calendar size={14} className="text-purple-500" />
                              Sprints
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open Tasks page for selected company
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                            >
                              <CheckSquare size={14} className="text-orange-500" />
                              Tasks
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open Teams page for selected company
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                            >
                              <Users size={14} className="text-indigo-500" />
                              Teams
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open Departments page for selected company
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                            >
                              <Building size={14} className="text-teal-500" />
                              Departments
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open Stories page for selected company
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors flex items-center gap-3"
                            >
                              <BarChart3 size={14} className="text-pink-500" />
                              Stories
                            </button>
                          </div>

                          {/* Add New Company */}
                          <div className="border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => setShowNewCompanyModal(true)}
                              className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors flex items-center gap-3"
                            >
                              <Plus size={14} />
                              + Add New Company
                            </button>
                          </div>
                    </div>
                  )}

                      {/* Inline New Company Form */}
                      {showNewCompanyModal && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-slate-900">Add New Company</h4>
                            <button
                              onClick={() => setShowNewCompanyModal(false)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                              <input
                                type="text"
                                value={newCompanyName}
                                onChange={(e) => setNewCompanyName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter company name"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                              <textarea
                                value={newCompanyDescription}
                                onChange={(e) => setNewCompanyDescription(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                placeholder="Brief company description..."
                              />
                            </div>
                            <div className="flex gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setShowNewCompanyModal(false)}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleCreateNewCompany}
                                disabled={!newCompanyName.trim()}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Add Company
                              </button>
                            </div>
                          </div>
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
                  value={budget} 
                  onChange={e => setBudget(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., $50,000"
                />
                  </div>
              </div>
            </div>

              {/* Timeline Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date *</label>
                <input 
                  type="date"
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                />
              </div>
              
              <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">End Date *</label>
                <input 
                  type="date"
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                />
                  </div>
              </div>
            </div>

              {/* Team Members Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
                </div>

            <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Assign Team Members</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableMembers.map(member => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleMember(member)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                      selectedMembers.includes(member) 
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium">{member}</span>
                        </div>
                  </button>
                ))}
                  </div>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button 
                type="button"
                onClick={cancelCreate}
                  className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!projectName || !selectedCompany} 
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center mr-3">
              <FolderKanban className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Projects</p>
              <p className="text-lg font-semibold text-slate-900">{allProjects.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-green-50 rounded-md flex items-center justify-center mr-3">
              <TrendingUp className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Projects</p>
              <p className="text-lg font-semibold text-slate-900">{allProjects.filter(p => p.status === "Active").length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-purple-50 rounded-md flex items-center justify-center mr-3">
              <CheckCircle className="w-3 h-3 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Completed</p>
              <p className="text-lg font-semibold text-slate-900">{allProjects.filter(p => p.status === "Completed").length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-orange-50 rounded-md flex items-center justify-center mr-3">
              <BarChart2 className="w-3 h-3 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg Progress</p>
              <p className="text-lg font-semibold text-slate-900">{Math.round(allProjects.reduce((sum, p) => sum + p.progress, 0) / allProjects.length)}%</p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Filter size={16} />
                  Filters
        </button>
                
        <div className="relative">
          <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
          >
                    <SortAsc size={16} />
                    Sort
                    <ChevronDown size={16} />
          </button>
          
          {showSortDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[160px] z-10">
                <button 
                        onClick={() => { setSort("name"); setShowSortDropdown(false); }}
                        className="block w-full text-left px-4 py-3 hover:bg-slate-50 text-sm"
                      >
                        Name {sort === "name" && (sortAsc ? "↑" : "↓")}
                </button>
                      <button
                        onClick={() => { setSort("status"); setShowSortDropdown(false); }}
                        className="block w-full text-left px-4 py-3 hover:bg-slate-50 text-sm"
                      >
                        Status {sort === "status" && (sortAsc ? "↑" : "↓")}
                      </button>
                      <button
                        onClick={() => { setSort("progress"); setShowSortDropdown(false); }}
                        className="block w-full text-left px-4 py-3 hover:bg-slate-50 text-sm"
                      >
                        Progress {sort === "progress" && (sortAsc ? "↑" : "↓")}
                      </button>
            </div>
          )}
                </div>
              </div>
        </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all">
                <Archive size={16} />
                Bulk Archive
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 transition-all">
                <Trash2 size={16} />
                Bulk Delete
              </button>
      </div>
          </div>
          
      {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <select
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Companies</option>
                    {companies.map(company => (
                      <option key={company.name} value={company.name}>{company.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Member</label>
                  <select
                    value={filterMember}
                    onChange={(e) => setFilterMember(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Members</option>
                    {availableMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <FilterX size={16} />
                  Clear Filters
                </button>
                
                <div className="text-sm text-slate-500">
                  {filtered.length} of {allProjects.length} projects
                </div>
              </div>
        </div>
      )}
          </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox" 
                      checked={Object.keys(selected).length === paginated.length && paginated.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newSelected: Record<string, boolean> = {};
                          paginated.forEach(project => { newSelected[project.name] = true; });
                          setSelected(newSelected);
                        } else {
                          setSelected({});
                        }
                      }}
                      className="rounded border-slate-300"
                  />
                </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => { setSort("name"); setSortAsc(!sortAsc); }}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Project
                      {sort === "name" && (sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Members</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Dates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-slate-200">
              {paginated.map(project => (
                  <tr key={project.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={!!selected[project.name]} 
                      onChange={e => handleSelectProject(project.name, e.target.checked)} 
                        className="rounded border-slate-300"
                    />
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FolderKanban className="text-blue-500" size={20} />
                        <div>
                          <div className="font-semibold text-slate-900">{project.name}</div>
                          <div className="text-sm text-slate-500">{project.description}</div>
                        </div>
                      </div>
                  </td>
                    <td className="px-6 py-4">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                        onClick={(e) => { e.stopPropagation(); handleOpenCompanyProjects(project.company || ""); }}
                      >
                        {project.company}
                      </button>
                  </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Active" ? "bg-green-100 text-green-700" : 
                        project.status === "Planning" ? "bg-yellow-100 text-yellow-700" : 
                        project.status === "Completed" ? "bg-blue-100 text-blue-700" : 
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {project.status}
                      </span>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              project.progress === 100 ? "bg-green-500" : "bg-blue-500"
                            }`} 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                    </div>
                        <span className="text-sm font-medium text-slate-700">{project.progress}%</span>
                      </div>
                  </td>
                    <td className="px-6 py-4">
                    <div className="flex gap-1">
                        {project.members.map((member, i) => (
                          <button 
                            key={i} 
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm hover:bg-blue-200 transition-colors" 
                            title={member}
                            onClick={(e) => { e.stopPropagation(); setFilterMember(member); setPage(1); }}
                          >
                            {member.split(' ').map(n => n[0]).join('')}
                          </button>
                      ))}
                    </div>
                  </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        <div>Start: {project.startDate}</div>
                        <div>End: {project.endDate}</div>
                    </div>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" 
                          title="View"
                          onClick={() => onViewProject && onViewProject(project)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors" 
                          title="Edit"
                          onClick={() => onOpenTab && onOpenTab("edit-project", `Edit: ${project.name}`, project)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" 
                          title="Archive"
                          onClick={() => archiveProject(project)}
                        >
                          <Archive size={16} />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" 
                          title="Delete"
                          onClick={() => deleteProject(project)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" 
                          title="More" 
                          onClick={() => setShowMoreMenu(showMoreMenu === project.name ? null : project.name)}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {showMoreMenu === project.name && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[140px] z-10">
                            <button 
                                className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm" 
                              onClick={() => {
                                duplicateProject(project);
                                setShowMoreMenu(null);
                              }}
                            >
                              Duplicate
                            </button>
                            <button 
                                className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm" 
                              onClick={() => {
                                exportProject(project);
                                setShowMoreMenu(null);
                              }}
                            >
                              Export
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button 
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i} 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === i + 1 
                    ? "bg-blue-600 text-white" 
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`} 
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={page === totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 