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
  Copy,
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

import { TeamApiService, TeamData, TeamWithUI, transformTeamToUI, transformUIToTeam } from "../utils/teamApi";

// Empty initial teams - will be populated from API
const initialTeams: any[] = [];

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
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState("");

  const [formData, setFormData] = useState({
    id: 0, // Add ID field to preserve team ID when editing
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
    notes: "",
    department: ""
  });

  const whatsappGroups = [
    { id: "1", name: "Development Team" },
    { id: "2", name: "Design Team" },
    { id: "3", name: "Marketing Team" },
    { id: "4", name: "Sales Team" },
    { id: "5", name: "Support Team" }
  ];

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await TeamApiService.getTeams();
      console.log('Teams API response:', response);
      
      if (response.success) {
        // Handle different response structures
        const teamsData = (response as any).items || response.data || [];
        console.log('Teams data:', teamsData);
        
        if (Array.isArray(teamsData)) {
          const transformedTeamsData = teamsData.map((team: TeamData) => transformTeamToUI(team));
          
          const transformedTeams: Team[] = transformedTeamsData.map(team => ({
            id: team.id ? parseInt(team.id) || 0 : 0,
            name: team.name,
            description: team.description,
            members: team.members,
            project: team.project,
            tasksCompleted: team.tasksCompleted,
            totalTasks: team.totalTasks,
            performance: team.performance,
            velocity: team.velocity,
            health: team.health,
            budget: team.budget,
            startDate: team.startDate,
            archived: team.archived,
            tags: team.tags,
            achievements: team.achievements,
            lastActivity: team.lastActivity
          }));
          
          setTeams(transformedTeams);
        } else {
          console.warn('Teams data is not an array:', teamsData);
          setTeams([]);
        }
      } else {
        console.error('Failed to fetch teams:', response.error);
        setError('Failed to fetch teams');
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // Load teams on component mount
  useEffect(() => {
    fetchTeams();
  }, [context?.company]);

  const handleCreateTeam = async (team: { 
    name: string; 
    description: string; 
    department: string;
    company: string;
    manager: string;
    whatsappGroupId?: string;
    whatsappGroupName?: string;
    startDate: string;
    teamMembers: string[];
  }) => {
    try {
      const teamData: TeamData = {
        name: team.name,
        description: team.description,
        members: JSON.stringify(team.teamMembers.map((member, index) => ({
          id: index + 1,
          name: member,
          role: "Member",
          avatar: member.split(' ').map(n => n[0]).join(''),
          email: `${member.toLowerCase().replace(' ', '.')}@company.com`,
          status: "Online",
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          skills: ["General"],
          experience: "1 year",
          projects: 1
        }))),
        project: team.company,
        tasksCompleted: 0,
        totalTasks: 0,
        performance: 85,
        velocity: 80,
        health: "good",
        budget: "$50K",
        startDate: team.startDate,
        archived: false,
        tags: JSON.stringify(["New Team"]),
        achievements: JSON.stringify([]),
        lastActivity: "Just now",
        department: team.department,
        manager: team.manager,
        whatsappGroupId: team.whatsappGroupId,
        whatsappGroupName: team.whatsappGroupName
      };

      // Optimistic update - add team to UI immediately
      const optimisticTeam: Team = {
        id: Date.now(), // Temporary ID
        name: team.name,
        description: team.description,
        members: team.teamMembers.map((member, index) => ({
          id: index + 1,
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
        project: team.company,
        tasksCompleted: 0,
        totalTasks: 0,
        performance: 85,
        velocity: 80,
        health: "good",
        budget: "$50K",
        startDate: team.startDate,
        archived: false,
        tags: ["New Team"],
        achievements: [],
        lastActivity: "Just now"
      };

      setTeams(prev => [optimisticTeam, ...prev]);
      setShowCreateForm(false);
      setSuccessMessage('Team created successfully!');

      // Make API call in background
      const response = await TeamApiService.createTeam(teamData);
      
      if (response.success) {
        // Replace optimistic team with real one
        const realTeam = transformTeamToUI(response.data as TeamData);
        setTeams(prev => prev.map(t => 
          t.id === optimisticTeam.id ? { ...realTeam, id: (realTeam as any).id || Date.now() } : t
        ));
        setSuccessMessage('Team created successfully!');
      } else {
        // Revert optimistic update on failure
        setTeams(prev => prev.filter(t => t.id !== optimisticTeam.id));
        console.error('Failed to create team:', response.error);
        setError('Failed to create team');
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Revert optimistic update on error
      setTeams(prev => prev.filter(t => t.id !== Date.now()));
      console.error('Error creating team:', error);
      setError('Failed to create team');
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId: number) => {
    try {
      // Optimistic update - remove team from UI immediately
      const deletedTeam = teams.find(t => t.id === teamId);
      setTeams(prev => prev.filter(t => t.id !== teamId));
      setSuccessMessage('Team deleted successfully!');

      // Make API call in background
      const response = await TeamApiService.deleteTeam(teamId.toString());
      
      if (response.success) {
        setSuccessMessage('Team deleted successfully!');
      } else {
        // Revert optimistic update on failure
        if (deletedTeam) {
          setTeams(prev => [...prev, deletedTeam]);
        }
        console.error('Failed to delete team:', response.error);
        setError('Failed to delete team');
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Revert optimistic update on error
      const deletedTeam = teams.find(t => t.id === teamId);
      if (deletedTeam) {
        setTeams(prev => [...prev, deletedTeam]);
      }
      console.error('Error deleting team:', error);
      setError('Failed to delete team');
    }
  };

  // Edit team
  const handleEditTeam = (team: Team) => {
    console.log('=== EDIT TEAM DEBUG ===');
    console.log('Team being edited:', team);
    console.log('Team ID:', team.id);
    
    setEditingTeam(team);
    setFormData({
      id: team.id, // Preserve the team ID
      name: team.name,
      description: team.description,
      project: team.project,
      members: team.members.map(m => m.name),
      roles: {} as Record<string, string>,
      budget: team.budget,
      startDate: team.startDate,
      tags: team.tags,
      whatsappGroupId: "",
      whatsappGroupName: "",
      goals: "",
      notes: "",
      department: ""
    });
    setShowEditForm(true);
    console.log('✅ Edit mode activated for team ID:', team.id);
  };

  // Update team
  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== handleUpdateTeam DEBUG ===');
    console.log('formData.id:', formData.id);
    console.log('editingTeam:', editingTeam);
    console.log('formData:', formData);
    
    if (!formData.id || formData.id === 0) {
      console.error('❌ No team ID found for update');
      setError('No team ID found for update');
      return;
    }

    try {
      const updateFields = {
        name: formData.name,
        description: formData.description,
        project: formData.project,
        members: JSON.stringify(formData.members.map((member, index) => ({
          id: index + 1,
          name: member,
          role: "Member",
          avatar: member.split(' ').map(n => n[0]).join(''),
          email: `${member.toLowerCase().replace(' ', '.')}@company.com`,
          status: "Online",
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          skills: ["General"],
          experience: "1 year",
          projects: 1
        }))),
        budget: formData.budget,
        startDate: formData.startDate,
        tags: JSON.stringify(formData.tags),
        updatedAt: new Date().toISOString()
      };

      console.log('Updating team with ID:', formData.id, 'updateFields:', updateFields);
      const response = await TeamApiService.updateTeam(formData.id.toString(), updateFields);
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ Team update successful, closing form...');
        setSuccessMessage('Team updated successfully!');
        fetchTeams(); // Refresh the list
        setShowEditForm(false);
        setEditingTeam(null);
        // Reset form data including ID
        setFormData({
          id: 0,
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
          notes: "",
          department: ""
        });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error('Failed to update team:', response.error);
        setError('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Failed to update team');
    }
    console.log('handleUpdateTeam completed, showEditForm should be false');
  };



  // Additional team action functions
  const handleDuplicateTeam = async (team: Team) => {
    try {
      const duplicatedTeamData: TeamData = {
        name: `${team.name} (Copy)`,
        description: team.description,
        members: JSON.stringify(team.members),
        project: team.project,
        tasksCompleted: team.tasksCompleted,
        totalTasks: team.totalTasks,
        performance: team.performance,
        velocity: team.velocity,
        health: team.health,
        budget: team.budget,
        startDate: team.startDate,
        archived: false,
        tags: JSON.stringify(team.tags),
        achievements: JSON.stringify(team.achievements),
        lastActivity: team.lastActivity,
        department: '',
        manager: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await TeamApiService.createTeam(duplicatedTeamData);
      
      if (response.success) {
        setSuccessMessage('Team duplicated successfully!');
        fetchTeams(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error('Failed to duplicate team:', response.error);
        setError('Failed to duplicate team');
      }
    } catch (error) {
      console.error('Error duplicating team:', error);
      setError('Failed to duplicate team');
    }
  };

  const handleArchiveTeam = async (team: Team) => {
    try {
      const response = await TeamApiService.updateTeam(team.id.toString(), {
        archived: true,
        updatedAt: new Date().toISOString()
      });
      
      if (response.success) {
        setSuccessMessage('Team archived successfully!');
        fetchTeams(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error('Failed to archive team:', response.error);
        setError('Failed to archive team');
      }
    } catch (error) {
      console.error('Error archiving team:', error);
      setError('Failed to archive team');
    }
  };

  const handleExportTeam = (team: Team) => {
    // Create a JSON file with team data
    const teamData = {
      ...team,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(teamData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${team.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
    link.click();
    
    setSuccessMessage('Team exported successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
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
    // Filter by company if context is provided
    if (context?.company && team.project !== context.company) {
      return false;
    }
    
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = projectFilter === "All" || team.project === projectFilter;
    
    return matchesSearch && matchesProject;
  });

  // Use filtered teams directly (no duplicates expected from API)
  const uniqueTeams = filteredTeams;

  // Debug: Check for duplicate team IDs
  const teamIds = uniqueTeams.map(team => team.id);
  const duplicateIds = teamIds.filter((id, index) => teamIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    console.warn('Duplicate team IDs found:', duplicateIds);
    console.log('All teams:', uniqueTeams.map(t => ({ id: t.id, name: t.name })));
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== CREATE TEAM DEBUG ===");
    console.log("handleSubmit called - Creating team:", formData);
    
    // Double-check: if we have an ID, we should be editing, not creating
    if (formData.id && formData.id !== 0) {
      console.log("❌ ERROR: handleSubmit called but we have a team ID, redirecting to handleUpdateTeam");
      handleUpdateTeam(e);
      return;
    }
    
    try {
      // Prepare team data for API
      const teamData: TeamData = {
        name: formData.name,
        description: formData.description,
        members: JSON.stringify(formData.members.map((member, index) => ({
          id: index + 1,
          name: member,
          role: formData.roles[member] || "Member",
          avatar: member.split(' ').map(n => n[0]).join(''),
          email: `${member.toLowerCase().replace(' ', '.')}@company.com`,
          status: "Online",
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          skills: ["General"],
          experience: "1 year",
          projects: 1
        }))),
        project: formData.project,
        tasksCompleted: 0,
        totalTasks: 0,
        performance: 85,
        velocity: 80,
        health: "good",
        budget: formData.budget || "$50K",
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        archived: false,
        tags: JSON.stringify(formData.tags),
        achievements: JSON.stringify([]),
        lastActivity: "Just now",
        department: "",
        manager: "",
        whatsappGroupId: formData.whatsappGroupId,
        whatsappGroupName: formData.whatsappGroupName
      };

      console.log('Team data being sent to API:', teamData);

      // Use API service to create team
      const response = await TeamApiService.createTeam(teamData);
      console.log("API response received:", response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create team');
      }

      console.log("Team created successfully:", response.data);
      
      // Show success message
      setSuccessMessage(`Team "${formData.name}" created successfully!`);
      
      // Refresh teams from API to show the newly created team
      await fetchTeams();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reset form and hide it
      setShowCreateForm(false);
              setFormData({
          id: 0,
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
          notes: "",
          department: ""
        });
      
    } catch (err) {
      console.error("Error creating team:", err);
      setError(err instanceof Error ? err.message : 'Failed to create team');
    }
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

      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg">
            <Users className="text-white mr-1" size={16} />
            <span className="text-sm sm:text-base">{context?.company ? `${context.company} Teams` : 'Teams'}</span>
          </div>
          {context?.company && (
            <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
              Managing teams for {context.company}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            className="hidden sm:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => {
              console.log('=== CREATE NEW TEAM DEBUG ===');
              setShowCreateForm(true);
              setShowEditForm(false);
              setEditingTeam(null);
              // Reset form data for new team creation (no ID)
              setFormData({
                id: 0, // No ID for new team
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
                notes: "",
                department: ""
              });
              console.log('✅ Create mode activated (no team ID)');
            }}
            className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring text-sm sm:text-base"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">New Team</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

        {/* Compact Search and Filters - Mobile Optimized */}
        <div className="space-y-3">
          {/* Search Bar - Compact */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search teams, members, or descriptions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Filters and View Toggle - Compact */}
          <div className="flex items-center justify-between">
            {/* Filters Button */}
            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            {/* View Toggle - Compact */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" 
                    ? "bg-white text-purple-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-white text-purple-600 shadow-sm" 
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="All">All Projects</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Team Health</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                    <option value="All">All Health</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setProjectFilter("All");
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

        {/* Team Creation/Edit Form */}
        {(showCreateForm || showEditForm) && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{showEditForm ? 'Edit Team' : 'Create New Team'}</h2>
                  <p className="text-xs sm:text-sm text-slate-600">{showEditForm ? 'Update the team details below.' : 'Fill in the details below to create a new team.'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('=== FORM SUBMISSION DEBUG ===');
              console.log('showEditForm:', showEditForm);
              console.log('formData.id:', formData.id);
              console.log('editingTeam:', editingTeam);
              console.log('formData:', formData);
              
              // Simple logic: if we have a team ID, we're editing
              if (formData.id && formData.id !== 0) {
                console.log('✅ EDIT MODE: Calling handleUpdateTeam for team ID:', formData.id);
                handleUpdateTeam(e);
              } else {
                console.log('✅ CREATE MODE: Calling handleSubmit for new team');
                handleSubmit(e);
              }
            }} className="space-y-6 sm:space-y-8">
              {/* Team Information */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Team Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter team name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Project *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.project}
                          onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
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
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 mt-1"
                      >
                        {showNewProject ? "Cancel" : "+ Add New Project"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the team's purpose, responsibilities, and objectives..."
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Budget
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="e.g., $50,000"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Team Members</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                      Selected Members ({formData.members.length})
                    </label>
                    <div className="space-y-2">
                      {formData.members.map(member => (
                        <div key={member} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-purple-600">
                                {member.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-slate-700">{member}</span>
                          </div>
                          <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">
                            {formData.roles[member] || "Member"}
                          </span>
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
                    <span>{showEditForm ? 'Update Team' : 'Create Team'}</span>
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



        {/* Team Grid/List View */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          {viewMode === "grid" ? (
            // Grid View - Mobile Optimized (2 cards side by side)
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {uniqueTeams.map((team, index) => (
                <div key={`${team.id}-grid-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group relative">
                  <div className="p-4 sm:p-6">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-purple-600 transition-colors truncate">
                          {team.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {team.description || "No description provided"}
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
                              onClick={() => handleEditTeam(team)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDuplicateTeam(team)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Copy size={14} />
                              Duplicate
                            </button>
                            <button
                              onClick={() => handleArchiveTeam(team)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Archive size={14} />
                              Archive
                            </button>
                            <button
                              onClick={() => handleExportTeam(team)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Download size={14} />
                              Export
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress and Tasks */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="text-xs sm:text-sm text-gray-600">
                        <span className="font-medium">{team.performance}%</span> Performance
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {team.tasksCompleted}/{team.totalTasks} Tasks
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(team.tasksCompleted / team.totalTasks) * 100}%` }}
                      ></div>
                    </div>

                    {/* Pill Badges */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
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

                    {/* Team Details - Compact */}
                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="truncate">{team.project}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span>{team.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span>{team.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span>{team.startDate}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View - Mobile Optimized
            <div className="space-y-3">
              {uniqueTeams.map((team, index) => (
                <div key={`${team.id}-list-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                  <div className="p-4">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Team Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        
                        {/* Team Title & Badges */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                team.health === 'excellent' ? 'bg-green-100 text-green-700' :
                                team.health === 'good' ? 'bg-blue-100 text-blue-700' :
                                team.health === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {team.health}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {team.budget}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team Details - Compact 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{team.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{team.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{team.project}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Target className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{team.performance}% performance</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{team.tasksCompleted}/{team.totalTasks} tasks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(team.tasksCompleted / team.totalTasks) * 100}%` }}
                        ></div>
                      </div>
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
        </div>

        {/* Empty State */}
        {uniqueTeams.length === 0 && (
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
    </div>
  );
} 