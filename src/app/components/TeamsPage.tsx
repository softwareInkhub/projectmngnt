import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UniversalDetailsModal from "./UniversalDetailsModal";
import ResizableTable, { 
  ResizableTableHeader, 
  ResizableTableHeaderCell, 
  ResizableTableBody, 
  ResizableTableCell 
} from "./ResizableTable";
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

const getInitials = (name: string) => {
  if (!name) return "";
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
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
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [originalTeams, setOriginalTeams] = useState<TeamData[]>([]); // Store original team data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState("");

  const [formData, setFormData] = useState({
    id: "", // Add ID field to preserve team ID when editing
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

  // Universal Details Modal state
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    itemType: 'team' as 'project' | 'task' | 'team' | 'company',
    itemId: ''
  });

  const whatsappGroups = [
    { id: "team-option-1", name: "Development Team" },
    { id: "team-option-2", name: "Design Team" },
    { id: "team-option-3", name: "Marketing Team" },
    { id: "team-option-4", name: "Sales Team" },
    { id: "team-option-5", name: "Support Team" }
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
          // Store original team data
          setOriginalTeams(teamsData);
          
          const transformedTeamsData = teamsData.map((team: TeamData) => transformTeamToUI(team));
          
          const transformedTeams: Team[] = transformedTeamsData.map((team, index) => ({
            id: index, // Use array index as ID for navigation
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

  // Open team details in UniversalDetailsModal
  const handleTeamClick = (team: Team) => {
    // Get the original team data using the index
    const originalTeam = originalTeams[team.id];
    if (!originalTeam || !originalTeam.id) {
      console.error('Invalid team ID:', team.id);
      return;
    }
    
    // Open the UniversalDetailsModal with team details
    setDetailsModal({
      isOpen: true,
      itemType: 'team',
      itemId: originalTeam.id
    });
  };

  // Close UniversalDetailsModal
  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      itemType: 'team',
      itemId: ''
    });
  };

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
          id: `team-item-${index + 1}`,
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
          id: `team-item-${index + 1}`,
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
      members: Array.isArray(team.members) ? team.members.map(m => m.name) : [],
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
          id: `team-item-${index + 1}`,
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
          id: "",
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
        members: JSON.stringify(Array.isArray(team.members) ? team.members : []),
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
        ? { ...team, members: Array.isArray(team.members) ? team.members.filter(member => member.id !== memberId) : [] }
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
                         (Array.isArray(team.members) ? team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase())) : false);
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
          id: `team-item-${index + 1}`,
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
          id: "",
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 px-3 md:px-8 py-1 md:py-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">Teams Management</h1>
              <p className="text-slate-600 mt-1 text-xl">Manage and organize your teams</p>
            </div>
          </div>
          
          {/* Actions (responsive) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop search/filters */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search teams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 text-xl" />
            </div>
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32">
              <option value="All">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <button onClick={() => setShowCreateForm(true)} className="hidden md:flex items-center gap-2 px-2 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200 hover:shadow-md text-xl">
              <Download size={18} />
              Export All
            </button>
            <button className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-xl" onClick={() => setShowCreateForm(true)}>
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              Create Team
            </button>
          </div>

          {/* Mobile compact actions */}
          <div className="flex md:hidden items-center gap-2 w-full justify-end">
            {/* Mobile search */}
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
            <button onClick={() => setShowCreateForm(true)} className="px-2 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md text-xl font-medium">Create</button>
            <button onClick={() => setShowCreateForm(true)} className="px-2 py-2 bg-white border border-slate-300 rounded-md text-xl">Export</button>
          </div>
        </div>
      </div>

      <div className="px-1 md:px-8 py-1 md:py-2 space-y-1 md:space-y-2">
        {/* View Mode Toggle - Mobile optimized positioning */}
        <div className="flex items-center justify-between mb-1 md:mb-2 mx-2 md:mx-0">
          {/* Left side - Grid/List toggle and team count */}
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
              {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Right side - Status and Priority filters (mobile only) */}
          <div className="flex md:hidden items-center gap-1.5">
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white w-16">
              <option value="All">All</option>
              {projects.slice(0, 3).map((project) => (
                <option key={project} value={project}>{project.substring(0, 8)}</option>
              ))}
            </select>
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
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
                          <option key={`whatsapp-${group.id}`} value={group.id}>{group.name}</option>
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

        {/* Team Grid/List View */}
        <div className="animate-fade-in">
          {viewMode === "grid" ? (
            <div className="grid gap-2 md:gap-3 mx-2 md:mx-0 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {uniqueTeams.map((team, index) => {
                const theme = { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-200', hoverBg: 'hover:from-blue-100 hover:to-blue-200', hoverBorder: 'hover:border-blue-300' };
                
                return (
                  <div
                    key={`${team.id}-grid-${index}`}
                    className={`relative ${theme.bg} border ${theme.border} rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${theme.hoverBorder} ${theme.hoverBg} flex flex-col h-full cursor-pointer p-3`}
                    onClick={() => handleTeamClick(team)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white text-base font-bold flex items-center justify-center">
                        {getInitials(team.name || '')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-slate-900 truncate">{team.name}</h3>
                        <p className="text-sm text-slate-600">{Array.isArray(team.members) ? team.members.length : 0} members</p>
                      </div>
                    </div>

                    <div className="absolute top-1 right-1 menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const menu = e.currentTarget.nextElementSibling as HTMLElement;
                          if (menu) {
                            menu.classList.toggle('hidden');
                          }
                        }}
                        className="inline-flex items-center justify-center p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110"
                        aria-label="Open menu"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      <div
                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200 hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTeamClick(team);
                            }}
                            className="w-full px-4 py-2 text-left text-base text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditTeam(team)}
                            className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <div className="border-t border-slate-200 my-1"></div>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-300 to-blue-400 h-2 rounded-full" style={{ width: `${team.performance || 0}%` }}></div>
                        </div>
                        <span className="text-base text-slate-600">{team.performance || 0}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mx-2 md:mx-0 overflow-visible">
              <ResizableTable 
                defaultColumnWidths={{
                  id: 80,
                  name: 250,
                  progress: 60,
                  project: 150,
                  members: 120,
                  health: 100,
                  budget: 100,
                  startDate: 120,
                  tags: 150,
                  actions: 100
                }}
                defaultRowHeight={55}
              >
                <table className="min-w-full bg-white border border-slate-200 rounded-xl shadow-sm resizable-table">
                  <ResizableTableHeader>
                    <tr>
                      <ResizableTableHeaderCell columnKey="id" className="text-lg font-bold text-slate-900">ID</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="name" className="text-lg font-bold text-slate-900">Team Name</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="progress" className="text-lg font-bold text-slate-900">%</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="project" className="text-lg font-bold text-slate-900">Project</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="members" className="text-lg font-bold text-slate-900">Members</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="health" className="text-lg font-bold text-slate-900">Health</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="budget" className="text-lg font-bold text-slate-900">Budget</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="startDate" className="text-lg font-bold text-slate-900">Start Date</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="tags" className="text-lg font-bold text-slate-900">Tags</ResizableTableHeaderCell>
                      <ResizableTableHeaderCell columnKey="actions" className="text-right text-lg font-bold text-slate-900">Actions</ResizableTableHeaderCell>
                    </tr>
                  </ResizableTableHeader>
                  <ResizableTableBody>
                    {uniqueTeams.map((team, idx) => {
                      const theme = { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200' };
                      return (
                        <tr key={`${team.id}-list-${idx}`} className={`cursor-pointer border ${theme.border} ${theme.bg} rounded-lg shadow-sm hover:shadow-md transition-all duration-200`} onClick={() => handleTeamClick(team)}>
                          <ResizableTableCell columnKey="id" className="text-slate-600 text-lg">{team.id || '-'}</ResizableTableCell>
                          <ResizableTableCell columnKey="name" className="align-middle">
                            <div className="text-slate-900 font-semibold text-2xl truncate">{team.name}</div>
                            <div className="text-lg text-slate-500 line-clamp-1 truncate">{team.description || 'No description'}</div>
                          </ResizableTableCell>
                          <ResizableTableCell columnKey="progress" className="text-slate-900 font-semibold text-2xl">{team.performance || 0}%</ResizableTableCell>
                          <ResizableTableCell columnKey="project" className="align-middle">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white text-base flex items-center justify-center font-bold flex-shrink-0">
                                {getInitials(team.project || '')}
                              </div>
                              <span className="text-slate-700 text-lg truncate">{team.project || '—'}</span>
                            </div>
                          </ResizableTableCell>
                          <ResizableTableCell columnKey="members" className="align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-300 to-blue-400 h-2 rounded-full" style={{ width: `${(Array.isArray(team.members) ? team.members.length : 0) / 10 * 100}%` }}></div>
                              </div>
                              <span className="text-lg text-slate-600 flex-shrink-0">{Array.isArray(team.members) ? team.members.length : 0}</span>
                            </div>
                          </ResizableTableCell>
                          <ResizableTableCell columnKey="health" className="align-middle">
                            <span className={`px-2 py-1 rounded-full text-lg font-medium ${
                              team.health === 'excellent' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300' :
                              team.health === 'good' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300' :
                              team.health === 'fair' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300' :
                              'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300'
                            }`}>{team.health || '—'}</span>
                          </ResizableTableCell>
                          <ResizableTableCell columnKey="budget" className="align-middle">
                            <span className="text-lg text-slate-600 font-medium">{team.budget || '—'}</span>
                          </ResizableTableCell>
                          <ResizableTableCell columnKey="startDate" className="text-slate-600 text-lg">{team.startDate || '—'}</ResizableTableCell>
                          <ResizableTableCell columnKey="tags" className="align-middle">
                            <div className="flex flex-nowrap gap-1.5 overflow-hidden">
                              {team.tags && team.tags.length > 0 ? team.tags.slice(0, 2).map((tag, idx) => (
                                <span key={`team-table-tag-${idx}`} className="px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300 rounded-full text-base font-medium flex-shrink-0">{tag}</span>
                              )) : (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300 rounded-full text-base font-medium">No tags</span>
                              )}
                            </div>
                          </ResizableTableCell>
                          <ResizableTableCell columnKey="actions" className="align-middle text-right relative menu-container overflow-visible">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const menu = e.currentTarget.nextElementSibling as HTMLElement;
                              if (menu) {
                                menu.classList.toggle('hidden');
                              }
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110"
                            aria-label="Open menu"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          <div
                            className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200 hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTeamClick(team);
                                }}
                                className="w-full px-4 py-2 text-left text-base text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 flex items-center gap-2"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEditTeam(team)}
                                className="w-full px-4 py-2 text-left text-base text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 flex items-center gap-2"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <div className="border-t border-slate-200 my-1"></div>
                              <button
                                onClick={() => handleDeleteTeam(team.id)}
                                className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </div>
                          </ResizableTableCell>
                        </tr>
                      );
                    })}
                  </ResizableTableBody>
                </table>
              </ResizableTable>
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