import { useEffect, useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  TrendingUp,
  Activity,
  Target,
  Award,
  BarChart3,
  Edit,
  Trash2,
  Archive,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Star,
  Eye,
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
  TrendingDown,
  SortAsc,
  CheckCircle,
  Square,
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  PieChart,
  LineChart,
  Crown,
  Shield,
  Trophy,
  Medal,
  Users2,
  UserX,
  UserCheck2,
  UserMinus,
  UserPlus2,
  Settings,
  Globe,
  MapPin,
  Building,
  Briefcase,
  X,
  Save,
  ArrowLeft,
  ChevronDown,
  User,
  Tag,
  AlertCircle,
  Calendar,
  CheckSquare
} from "lucide-react";
import CreateTeamModal from "./CreateTeamModal";

// Sample team data
const initialTeams = [
  {
    id: 1,
    name: "Frontend Development",
    description: "Responsible for user interface and user experience with modern design patterns",
    members: [
      { id: 1, name: "Sarah Johnson", role: "Team Lead", avatar: "SJ", email: "sarah@company.com", status: "Online", phone: "+1-555-0123", skills: ["React", "TypeScript", "UI/UX"], experience: "5 years", projects: 12 },
      { id: 2, name: "Mike Chen", role: "Senior Developer", avatar: "MC", email: "mike@company.com", status: "Online", phone: "+1-555-0124", skills: ["Vue.js", "JavaScript", "CSS"], experience: "4 years", projects: 8 },
      { id: 3, name: "Emma Wilson", role: "UI/UX Designer", avatar: "EW", email: "emma@company.com", status: "Away", phone: "+1-555-0125", skills: ["Figma", "Adobe XD", "Prototyping"], experience: "3 years", projects: 15 }
    ],
    project: "Whapi Project Management",
    tasksCompleted: 45,
    totalTasks: 60,
    performance: 92,
    velocity: 87,
    health: "excellent",
    budget: "$85K",
    startDate: "2024-01-01",
    archived: false,
    tags: ["Frontend", "Design", "React"],
    achievements: ["Best Team Q1", "100% On-time Delivery"],
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    name: "Backend Development",
    description: "Server-side development and database management with scalable architecture",
    members: [
      { id: 4, name: "Alex Rodriguez", role: "Team Lead", avatar: "AR", email: "alex@company.com", status: "Online", phone: "+1-555-0126", skills: ["Node.js", "Python", "AWS"], experience: "6 years", projects: 18 },
      { id: 5, name: "David Kim", role: "Senior Developer", avatar: "DK", email: "david@company.com", status: "Offline", phone: "+1-555-0127", skills: ["Java", "Spring", "Docker"], experience: "5 years", projects: 10 }
    ],
    project: "Whapi Project Management",
    tasksCompleted: 38,
    totalTasks: 50,
    performance: 88,
    velocity: 75,
    health: "good",
    budget: "$120K",
    startDate: "2024-01-15",
    archived: false,
    tags: ["Backend", "API", "Database"],
    achievements: ["Performance Award", "Security Excellence"],
    lastActivity: "4 hours ago"
  },
  {
    id: 3,
    name: "Quality Assurance",
    description: "Testing and quality control for all projects with automated testing",
    members: [
      { id: 6, name: "Lisa Thompson", role: "QA Lead", avatar: "LT", email: "lisa@company.com", status: "Online", phone: "+1-555-0128", skills: ["Selenium", "Jest", "Cypress"], experience: "4 years", projects: 20 },
      { id: 7, name: "James Brown", role: "Test Engineer", avatar: "JB", email: "james@company.com", status: "Online", phone: "+1-555-0129", skills: ["Manual Testing", "API Testing", "Performance"], experience: "3 years", projects: 12 },
      { id: 8, name: "Maria Garcia", role: "Automation Engineer", avatar: "MG", email: "maria@company.com", status: "Away", phone: "+1-555-0130", skills: ["Playwright", "Python", "CI/CD"], experience: "5 years", projects: 16 }
    ],
    project: "Client Portal",
    tasksCompleted: 52,
    totalTasks: 65,
    performance: 95,
    velocity: 92,
    health: "excellent",
    budget: "$95K",
    startDate: "2024-02-01",
    archived: false,
    tags: ["Testing", "Automation", "Quality"],
    achievements: ["Zero Bug Release", "Test Coverage Award"],
    lastActivity: "1 hour ago"
  },
  {
    id: 4,
    name: "DevOps & Infrastructure",
    description: "Infrastructure management and deployment automation",
    members: [
      { id: 9, name: "Chris Lee", role: "DevOps Engineer", avatar: "CL", email: "chris@company.com", status: "Online", phone: "+1-555-0131", skills: ["Docker", "Kubernetes", "AWS"], experience: "4 years", projects: 14 },
      { id: 10, name: "Rachel Green", role: "Infrastructure Lead", avatar: "RG", email: "rachel@company.com", status: "Online", phone: "+1-555-0132", skills: ["Terraform", "Ansible", "Linux"], experience: "6 years", projects: 22 }
    ],
    project: "Analytics Platform",
    tasksCompleted: 28,
    totalTasks: 35,
    performance: 82,
    velocity: 78,
    health: "good",
    budget: "$110K",
    startDate: "2024-01-20",
    archived: false,
    tags: ["DevOps", "Infrastructure", "Cloud"],
    achievements: ["Infrastructure Award", "Uptime Excellence"],
    lastActivity: "30 minutes ago"
  }
];

const statusColors = {
  "Online": "bg-emerald-500",
  "Away": "bg-yellow-500",
  "Offline": "bg-slate-400",
  "Busy": "bg-red-500"
};

const healthColors = {
  "excellent": "text-emerald-600 bg-emerald-100",
  "good": "text-blue-600 bg-blue-100",
  "warning": "text-yellow-600 bg-yellow-100",
  "critical": "text-red-600 bg-red-100"
};

interface Team {
  id: number;
  name: string;
  description: string;
  members: Array<{
    id: number;
    name: string;
    role: string;
    avatar: string;
    email: string;
    status: string;
    phone: string;
    skills: string[];
    experience: string;
    projects: number;
  }>;
  project: string;
  tasksCompleted: number;
  totalTasks: number;
  performance: number;
  velocity: number;
  health: string;
  budget: string;
  startDate: string;
  archived: boolean;
  tags: string[];
  achievements: string[];
  lastActivity: string;
}

const members = [
  "Sarah Johnson",
  "Mike Chen", 
  "Alex Rodriguez",
  "Emily Davis",
  "David Wilson",
  "Lisa Thompson",
  "James Brown",
  "Maria Garcia",
  "Emma Wilson",
  "David Kim",
  "Anna Lee",
  "Tom Anderson"
];

const projects = [
  "Whapi Project Management",
  "E-commerce Platform", 
  "Client Portal",
  "Mobile App Development",
  "API Integration"
];

const roles = [
  "Team Lead",
  "Senior Developer", 
  "Developer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Data Analyst"
];

const tags = [
  "Frontend", "Backend", "Design", "Mobile", "DevOps", 
  "QA", "Marketing", "Sales", "Support", "Research"
];

export default function TeamsPage({ onOpenTab, context }: { onOpenTab?: (type: string, title?: string, context?: any) => void; context?: { company: string } }) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project: context?.company || projects[0],
    members: [] as string[],
    roles: {} as Record<string, string>,
    budget: "",
    startDate: "",
    tags: [] as string[],
    whatsappGroupId: "",
    whatsappGroupName: "",
    goals: "",
    notes: ""
  });

  const whatsappGroups = [
    { id: "1", name: "Development Team" },
    { id: "2", name: "Design Team" },
    { id: "3", name: "Marketing Team" },
    { id: "4", name: "Sales Team" },
    { id: "5", name: "Support Team" }
  ];

  const handleCreateTeam = async (team: { 
    name: string; 
    description: string; 
    members: string[];
    whatsappGroupId?: string;
    whatsappGroupName?: string;
  }) => {
    try {
      // Create the team locally
      const newTeam: Team = {
        id: Math.max(...teams.map(t => t.id)) + 1,
        name: team.name,
        description: team.description,
        members: team.members.map((member, index) => ({
          id: Math.max(...teams.flatMap(t => t.members.map(m => m.id))) + index + 1,
          name: member,
          role: "Member",
          avatar: member.split(' ').map(n => n[0]).join(''),
          email: `${member.toLowerCase().replace(' ', '.')}@company.com`,
          status: "Online",
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          skills: ["General"],
          experience: "1 year",
          projects: 1
        })),
        project: "Whapi Project Management",
        tasksCompleted: 0,
        totalTasks: 0,
        performance: 85,
        velocity: 80,
        health: "good",
        budget: "$50K",
        startDate: new Date().toISOString().split('T')[0],
        archived: false,
        tags: ["New Team"],
        achievements: [],
        lastActivity: "Just now"
      };
      
      setTeams([...teams, newTeam]);
      setShowCreateModal(false);
      
      console.log('Team created successfully:', newTeam);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const analytics = {
    totalTeams: Array.isArray(teams) ? teams.length : 0,
    totalMembers: Array.isArray(teams) ? teams.reduce((sum, team) => sum + (Array.isArray(team.members) ? team.members.length : 0), 0) : 0,
    avgPerformance: Array.isArray(teams) && teams.length > 0 ? Math.round(teams.reduce((sum, team) => sum + (typeof team.performance === 'number' ? team.performance : 0), 0) / teams.length) : 0,
    avgVelocity: Array.isArray(teams) && teams.length > 0 ? Math.round(teams.reduce((sum, team) => sum + (typeof team.velocity === 'number' ? team.velocity : 0), 0) / teams.length) : 0,
    totalTasks: Array.isArray(teams) ? teams.reduce((sum, team) => sum + (typeof team.totalTasks === 'number' ? team.totalTasks : 0), 0) : 0,
    completedTasks: Array.isArray(teams) ? teams.reduce((sum, team) => sum + (typeof team.tasksCompleted === 'number' ? team.tasksCompleted : 0), 0) : 0,
    totalBudget: Array.isArray(teams) ? teams.reduce((sum, team) => sum + (typeof team.budget === 'string' ? parseFloat(team.budget.replace('$', '').replace(',', '')) : 0), 0) : 0
  };

  const deleteTeam = (teamId: number) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const archiveTeam = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, archived: !team.archived } : team
    ));
  };

  const duplicateTeam = (team: Team) => {
    const newTeam = {
      ...team,
      id: Math.max(...teams.map(t => t.id)) + 1,
      name: `${team.name} (Copy)`,
      archived: false,
      lastActivity: "Just now"
    };
    setTeams([...teams, newTeam]);
  };

  const contactMember = (member: Team['members'][0], method: 'email' | 'phone' | 'message') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${member.email}`);
        break;
      case 'phone':
        window.open(`tel:${member.phone}`);
        break;
      case 'message':
        // Open messaging interface
        console.log(`Open messaging for ${member.name}`);
        break;
    }
  };

  const removeMember = (teamId: number, memberId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: team.members.filter(member => member.id !== memberId) }
        : team
    ));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setProjectFilter("All");
  };

  const toggleTeam = (teamId: number) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = projectFilter === "All" || team.project === projectFilter;
    
    return matchesSearch && matchesProject;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating team:", formData);
    
    // Create new team object
    const newTeam = {
      id: Date.now(), // Generate unique ID
      name: formData.name,
      description: formData.description,
      project: formData.project,
      members: formData.members.map((member, index) => ({
        id: index + 1,
        name: member,
        role: formData.roles[member] || "Member",
        avatar: member.split(' ').map(n => n[0]).join(''),
        email: `${member.toLowerCase().replace(' ', '.')}@company.com`,
        status: "Online",
        phone: "+1-555-0000",
        skills: ["General"],
        experience: "1 year",
        projects: 1
      })),
      tasksCompleted: 0,
      totalTasks: 0,
      performance: 0,
      velocity: 0,
      health: "good",
      budget: formData.budget || "$0",
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      archived: false,
      tags: formData.tags,
      achievements: [],
      lastActivity: "Just now"
    };

    // Add the new team to the teams array
    setTeams(prevTeams => [newTeam, ...prevTeams]);
    
    // Reset form and hide it
    setShowCreateForm(false);
    setFormData({
      name: "",
      description: "",
      project: context?.company || projects[0],
      members: [],
      roles: {},
      budget: "",
      startDate: "",
      tags: [],
      whatsappGroupId: "",
      whatsappGroupName: "",
      goals: "",
      notes: ""
    });
  };

  const toggleMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(member) 
        ? prev.members.filter(m => m !== member)
        : [...prev.members, member]
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const updateMemberRole = (member: string, role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [member]: role
      }
    }));
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg">
            <Users className="text-white mr-1" size={20} />
            <span>{context?.company ? `${context.company} Teams` : 'Teams'}</span>
          </div>
          {context?.company && (
            <div className="text-sm text-slate-600">
              Managing teams for {context.company}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            {showCreateForm ? 'Cancel' : 'New Team'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Team Creation Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Team</h2>
                  <p className="text-slate-600">Fill in the details below to create a new team.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Team Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Team Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter team name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.project}
                          onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          {projects.map(project => (
                            <option key={project} value={project}>{project}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Building className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      {showNewProject && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                            placeholder="Enter new project name"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowNewProject(!showNewProject)}
                        className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                      >
                        {showNewProject ? "Cancel" : "+ Add New Project"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the team's purpose, responsibilities, and objectives..."
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Budget
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="e.g., $50,000"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Members
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                      {members.map(member => (
                        <div key={member} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={formData.members.includes(member)}
                              onChange={() => toggleMember(member)}
                              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-slate-700">{member}</span>
                          </div>
                          {formData.members.includes(member) && (
                            <select
                              value={formData.roles[member] || ""}
                              onChange={(e) => updateMemberRole(member, e.target.value)}
                              className="text-xs border border-slate-200 rounded px-2 py-1"
                            >
                              <option value="">Select Role</option>
                              {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Selected Members ({formData.members.length})
                    </label>
                    <div className="space-y-2">
                      {formData.members.map(member => (
                        <div key={member} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{member}</div>
                            <div className="text-xs text-slate-500">
                              {formData.roles[member] || "No role assigned"}
                            </div>
                          </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleMember(member)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Team Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      WhatsApp Group
                    </label>
                    <div className="relative">
                      <select
                        value={formData.whatsappGroupId}
                        onChange={(e) => {
                          const group = whatsappGroups.find(g => g.id === e.target.value);
                          setFormData(prev => ({ 
                            ...prev, 
                            whatsappGroupId: e.target.value,
                            whatsappGroupName: group?.name || ""
                          }));
                        }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select WhatsApp Group</option>
                        {whatsappGroups.map(group => (
                          <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Tags</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.tags.includes(tag)
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goals and Notes */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Goals & Notes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Team Goals
                    </label>
                    <textarea
                      value={formData.goals}
                      onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                      placeholder="Define the team's key objectives and goals..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes or special requirements..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cancel</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Create Team</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 animate-fade-in">
          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-purple-50 rounded-md flex items-center justify-center mr-3">
              <Users className="w-3 h-3 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{analytics.totalTeams}</h3>
              <p className="text-xs text-slate-500">Total Teams</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-slate-400">+1</span>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center mr-3">
              <UserPlus className="w-3 h-3 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{analytics.totalMembers}</h3>
              <p className="text-xs text-slate-500">Team Members</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-slate-400">+3</span>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-green-50 rounded-md flex items-center justify-center mr-3">
              <Award className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{analytics.avgPerformance}%</h3>
              <p className="text-xs text-slate-500">Avg Performance</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-slate-400">+5%</span>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 p-2.5 h-20 flex items-center">
            <div className="w-6 h-6 bg-orange-50 rounded-md flex items-center justify-center mr-3">
              <Trophy className="w-3 h-3 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{analytics.totalBudget}</h3>
              <p className="text-xs text-slate-500">Total Budget</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-slate-400">+12%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search teams, members, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
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
                      ? "bg-purple-100 text-purple-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-purple-100 text-purple-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project</label>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="All">All Projects</option>
                    <option value="Whapi Project Management">Whapi Project Management</option>
                    <option value="E-commerce Platform">E-commerce Platform</option>
                    <option value="Client Portal">Client Portal</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team Health</label>
                  <select className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm">
                    <option value="All">All Health</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FilterX className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Team Grid/List View */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          {viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <div key={team.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 group">
                  <div className="p-6">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {team.name}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {team.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{team.members.length}</div>
                        <div className="text-xs text-slate-500">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{team.performance}%</div>
                        <div className="text-xs text-slate-500">Performance</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(team.tasksCompleted / team.totalTasks) * 100}%` }}
                      ></div>
                    </div>

                    {/* Team Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          team.health === 'excellent' ? 'bg-green-100 text-green-700' :
                          team.health === 'good' ? 'bg-blue-100 text-blue-700' :
                          team.health === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {team.health}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {team.budget}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-xs">{team.tasksCompleted}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs">{team.totalTasks}</span>
                        </div>
                      </div>
                    </div>

                    {/* Project and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{team.project}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{team.startDate}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        View Team
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredTeams.map((team) => (
                <div key={team.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Team Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        
                        {/* Team Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-2 ml-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                team.health === 'excellent' ? 'bg-green-100 text-green-700' :
                                team.health === 'good' ? 'bg-blue-100 text-blue-700' :
                                team.health === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {team.health}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {team.budget}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {team.description}
                          </p>
                          
                          <div className="flex items-center gap-6 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{team.members.length} members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              <span>{team.project}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Started: {team.startDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>{team.performance}% performance</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Bar for List View */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Task Progress</span>
                        <span>{team.tasksCompleted}/{team.totalTasks} tasks</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(team.tasksCompleted / team.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No teams found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or create a new team.</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create First Team
            </button>
          </div>
        )}
      </div>

      {/* Keep the existing modal for backward compatibility */}
      <CreateTeamModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTeam}
      />
    </div>
  );
} 