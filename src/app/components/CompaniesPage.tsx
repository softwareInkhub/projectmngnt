import { useState } from "react";
import {
  Building2, Building, ChevronRight, ChevronDown, Plus, Users, User, FolderKanban, Calendar, BarChart3, Settings, Search, MoreHorizontal, TrendingUp, Clock, CheckCircle, Mail, Phone, MapPin, Globe, Edit, Eye, Download, BookOpen, CheckSquare, Star, FilterX, Grid3X3, List, Heart, ExternalLink, GitCommit, DollarSign, UserCheck, Timer, Flag, Layers, Zap, SortAsc, Square, Play, Pause, StopCircle, RotateCcw, LineChart, Crown, Shield, Trophy, Medal, Users2, UserX, UserCheck2, UserMinus, UserPlus2, Briefcase, Video, MessageSquare, AlertCircle, Info, Award, Paperclip, FileText, BarChart, PieChart, ScatterChart, AreaChart, Gauge, Target, TrendingDown, Activity, Filter, Share2, Archive, Copy, Trash2, ArrowUpRight, ArrowDownRight, Minus, X, Save, ArrowLeft, Tag, AlertCircle as AlertCircleIcon, Calendar as CalendarIcon, Target as TargetIcon, MessageSquare as MessageSquareIcon, CheckSquare as CheckSquareIcon, UserPlus, FileText as FileTextIcon, Bell, Star as StarIcon, Eye as EyeIcon, Share2 as Share2Icon, Download as DownloadIcon, FilterX as FilterXIcon, Grid3X3 as Grid3X3Icon, List as ListIcon, Heart as HeartIcon, ExternalLink as ExternalLinkIcon, GitCommit as GitCommitIcon, DollarSign as DollarSignIcon, UserCheck as UserCheckIcon, Timer as TimerIcon, Flag as FlagIcon, Layers as LayersIcon, Zap as ZapIcon, TrendingDown as TrendingDownIcon, SortAsc as SortAscIcon, Square as SquareIcon, Play as PlayIcon, Pause as PauseIcon, StopCircle as StopCircleIcon, RotateCcw as RotateCcwIcon, LineChart as LineChartIcon, Crown as CrownIcon, Shield as ShieldIcon, Trophy as TrophyIcon, Medal as MedalIcon, Users2 as Users2Icon, UserX as UserXIcon, UserCheck2 as UserCheck2Icon, UserMinus as UserMinusIcon, UserPlus2 as UserPlus2Icon, Briefcase as BriefcaseIcon, Video as VideoIcon, MessageSquare as MessageSquareIcon2, AlertCircle as AlertCircleIcon2, Info as InfoIcon, Award as AwardIcon, Paperclip as PaperclipIcon, FileText as FileTextIcon2, BarChart as BarChartIcon, PieChart as PieChartIcon, ScatterChart as ScatterChartIcon, AreaChart as AreaChartIcon, Gauge as GaugeIcon, Target as TargetIcon2, TrendingDown as TrendingDownIcon2, Activity as ActivityIcon, Filter as FilterIcon, Share2 as Share2Icon2, Archive as ArchiveIcon, Copy as CopyIcon, Trash2 as Trash2Icon, ArrowUpRight as ArrowUpRightIcon, ArrowDownRight as ArrowDownRightIcon, Minus as MinusIcon
} from "lucide-react";

const companyTypes = [
  "Technology",
  "Research", 
  "Consulting",
  "Manufacturing",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Media",
  "Transportation"
];

const industries = [
  "Software Development",
  "IT Services",
  "R&D",
  "Consulting",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Media",
  "Transportation"
];

const priorities = ["Low", "Medium", "High", "Critical"];

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [view, setView] = useState("overview");
  const [expandedDepartments, setExpandedDepartments] = useState<number[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
  const [expandedSprints, setExpandedSprints] = useState<number[]>([]);
  const [expandedStories, setExpandedStories] = useState<number[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [expandedSubprojects, setExpandedSubprojects] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: companyTypes[0],
    industry: industries[0],
    status: "Active",
    founded: "",
    employees: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    revenue: "",
    priority: priorities[1],
    tags: [] as string[],
    notes: ""
  });

  const availableTags = [
    "AI", "Enterprise", "SaaS", "Cloud", "Startup", 
    "Innovation", "Research", "Consulting", "Manufacturing", "Healthcare"
  ];

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Whapi Project Management",
      description: "Leading project management solutions for enterprise teams with AI-powered insights and advanced collaboration features",
      status: "Active",
      type: "Technology",
      industry: "Software Development",
      founded: "2020",
      employees: 150,
      location: "San Francisco, CA",
      website: "https://whapi.com",
      email: "contact@whapi.com",
      phone: "+1 (555) 123-4567",
      totalProjects: 12,
      activeProjects: 8,
      completedProjects: 4,
      totalTeams: 6,
      members: 89,
      revenue: "$2.5M",
      growth: "+15%",
      lastActivity: "2 hours ago",
      tags: ["AI", "Enterprise", "SaaS", "Cloud"],
      archived: false,
      priority: "High",
      health: "Excellent",
      velocity: 85,
      satisfaction: 94,
      engagement: 92,
      retention: 88,
      projects: [
        {
          id: 1,
          name: "Whapi Project Management Platform",
          status: "Active",
          progress: 75,
          team: "Core Development",
          deadline: "2024-06-30",
          priority: "High",
          budget: "$500K",
          manager: "Sarah Johnson",
          description: "Enterprise-grade project management platform with advanced analytics and team collaboration features",
          health: "Good",
          velocity: 78,
          tasks: 45,
          completedTasks: 34,
          archived: false,
          subprojects: [
            {
              id: 1,
              name: "User Authentication Module",
              status: "Completed",
              progress: 100,
              team: "Core Development",
              deadline: "2024-03-15",
              priority: "High",
              budget: "$80K",
              manager: "David Kim",
              health: "Excellent",
              velocity: 95,
              totalTasks: 12,
              completedTasks: 12,
              archived: false,
              taskList: [
                {
                  id: 1,
                  name: "OAuth Integration",
                  status: "Completed",
                  assignee: "Mike Chen",
                  timeSpent: "40h",
                  timeEstimate: "35h",
                  priority: "High"
                },
                {
                  id: 2,
                  name: "Password Reset Flow",
                  status: "Completed",
                  assignee: "Alex Rodriguez",
                  timeSpent: "25h",
                  timeEstimate: "30h",
                  priority: "Medium"
                }
              ]
            }
          ]
        }
      ],
      teams: [
        {
          id: 1,
          name: "Core Development",
          members: 12,
          lead: "Sarah Johnson",
          status: "Active",
          performance: 92,
          velocity: 85,
          projects: 3,
          lastActivity: "1 hour ago"
        }
      ],
      departments: [
        {
          id: 1,
          name: "Engineering",
          employees: 45,
          manager: "David Kim",
          status: "Active",
          budget: "$1.2M",
          projects: 8
        }
      ],
      sprints: [
        {
          id: 1,
          name: "Sprint 24",
          status: "Active",
          startDate: "2024-02-01",
          endDate: "2024-02-14",
          progress: 65,
          tasks: 24,
          completedTasks: 16,
          team: "Core Development"
            }
          ]
        },
        {
          id: 2,
      name: "TechCorp Solutions",
      description: "Innovative technology solutions for modern businesses with focus on digital transformation",
      status: "Active",
      type: "Technology",
      industry: "IT Services",
      founded: "2018",
      employees: 85,
      location: "Austin, TX",
      website: "https://techcorp.com",
      email: "info@techcorp.com",
      phone: "+1 (555) 987-6543",
      totalProjects: 8,
      activeProjects: 5,
      completedProjects: 3,
      totalTeams: 4,
      members: 52,
      revenue: "$1.8M",
      growth: "+12%",
      lastActivity: "4 hours ago",
      tags: ["Digital", "Cloud", "Consulting"],
      archived: false,
      priority: "Medium",
      health: "Good",
      velocity: 72,
      satisfaction: 87,
      engagement: 89,
      retention: 85,
      projects: [],
      teams: [],
      departments: [],
      sprints: []
    },
    {
      id: 3,
      name: "InnovateLab",
      description: "Research and development company specializing in cutting-edge technologies and innovation",
      status: "Active",
      type: "Research",
      industry: "R&D",
      founded: "2021",
      employees: 65,
      location: "Boston, MA",
      website: "https://innovatelab.com",
      email: "hello@innovatelab.com",
      phone: "+1 (555) 456-7890",
      totalProjects: 15,
      activeProjects: 10,
      completedProjects: 5,
      totalTeams: 5,
      members: 38,
      revenue: "$3.2M",
      growth: "+25%",
      lastActivity: "30 minutes ago",
      tags: ["Research", "Innovation", "AI"],
      archived: false,
      priority: "High",
      health: "Excellent",
      velocity: 91,
      satisfaction: 96,
      engagement: 94,
      retention: 92,
      projects: [],
      teams: [],
      departments: [],
      sprints: []
    }
  ]);

  const analytics = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.status === "Active").length,
    totalProjects: companies.reduce((sum, c) => sum + c.totalProjects, 0),
    totalTeams: companies.reduce((sum, c) => sum + c.totalTeams, 0),
    totalMembers: companies.reduce((sum, c) => sum + c.members, 0),
    avgRevenue: "$2.5M",
    avgGrowth: "+17%",
    avgSatisfaction: Math.round(companies.reduce((sum, c) => sum + c.satisfaction, 0) / companies.length)
  };

  const deleteCompany = (companyId: number) => {
    setCompanies(companies.filter(company => company.id !== companyId));
  };

  const archiveCompany = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId ? { ...company, archived: !company.archived } : company
    ));
  };

  const duplicateCompany = (company: typeof companies[0]) => {
    const newCompany = {
      ...company,
      id: Math.max(...companies.map(c => c.id)) + 1,
      name: `${company.name} (Copy)`,
      lastActivity: "Just now"
    };
    setCompanies([...companies, newCompany]);
  };

  const exportCompany = (company: typeof companies[0]) => {
    const companyData = `
Company: ${company.name}
Status: ${company.status}
Type: ${company.type}
Industry: ${company.industry}
Employees: ${company.employees}
Location: ${company.location}
Revenue: ${company.revenue}
Growth: ${company.growth}
Projects: ${company.totalProjects}
Teams: ${company.totalTeams}
Members: ${company.members}
    `;
    
    const dataBlob = new Blob([companyData], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${company.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteProject = (companyId: number, projectId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, projects: company.projects.filter(p => p.id !== projectId) }
        : company
    ));
  };

  const archiveProject = (companyId: number, projectId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            projects: company.projects.map(p => 
              p.id === projectId ? { ...p, archived: !p.archived } : p
            )
          }
        : company
    ));
  };

  const toggleDepartment = (deptId: number) => {
    setExpandedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const toggleTeam = (teamId: number) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const toggleSprint = (sprintId: number) => {
    setExpandedSprints(prev => 
      prev.includes(sprintId) 
        ? prev.filter(id => id !== sprintId)
        : [...prev, sprintId]
    );
  };

  const toggleProject = (projectId: number) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleSubproject = (subprojectId: number) => {
    setExpandedSubprojects(prev => 
      prev.includes(subprojectId) 
        ? prev.filter(id => id !== subprojectId)
        : [...prev, subprojectId]
    );
  };

  const contactCompany = (company: typeof companies[0], method: 'email' | 'phone' | 'website') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${company.email}`);
        break;
      case 'phone':
        window.open(`tel:${company.phone}`);
        break;
      case 'website':
        window.open(company.website, '_blank');
        break;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "All" || company.type === typeFilter;
    const matchesStatus = statusFilter === "All" || company.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedCompanyData = companies.find(c => c.id === selectedCompany);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalCompanies}</h3>
          <p className="text-slate-600 text-sm font-medium">Total Companies</p>
          <div className="mt-2 text-xs text-slate-500">+2 this quarter</div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
              <FolderKanban className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalProjects}</h3>
          <p className="text-slate-600 text-sm font-medium">Total Projects</p>
          <div className="mt-2 text-xs text-slate-500">+8 this month</div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalMembers}</h3>
          <p className="text-slate-600 text-sm font-medium">Total Members</p>
          <div className="mt-2 text-xs text-slate-500">+12 this month</div>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.avgSatisfaction}%</h3>
          <p className="text-slate-600 text-sm font-medium">Avg Satisfaction</p>
          <div className="mt-2 text-xs text-slate-500">+3% from last month</div>
        </div>
      </div>

      {/* Companies Grid/List View */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        {viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <div 
                key={company.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {/* Company Header */}
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {company.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                        <Heart size={16} />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Company Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{company.totalProjects}</div>
                      <div className="text-xs text-slate-500">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{company.members}</div>
                      <div className="text-xs text-slate-500">Members</div>
                    </div>
                  </div>
                  
                  {/* Company Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {company.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {company.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        {company.growth}
                      </span>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {company.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {company.employees} employees
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {company.lastActivity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Company Actions */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setSelectedCompany(company.id)}
                >
                  <Eye size={14} />
                  View Details
                  </button>
                  </div>
                  <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                  <Edit size={14} />
                    </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                  <Share2 size={14} />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                  <ExternalLink size={14} />
                    </button>
                        </div>
                      </div>
                                    </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Company Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        
                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {company.name}
                            </h3>
                            <div className="flex items-center gap-2 ml-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                company.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                              }`}>
                                {company.status}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {company.type}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {company.description}
                          </p>
                          
                          <div className="flex items-center gap-6 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{company.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{company.employees} employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FolderKanban className="w-4 h-4" />
                              <span>{company.totalProjects} projects</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              <span>{company.growth} growth</span>
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
                    
                    {/* Company Stats for List View */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Company Overview</span>
                        <span>Last activity: {company.lastActivity}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{company.totalProjects}</div>
                          <div className="text-xs text-slate-500">Projects</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{company.members}</div>
                          <div className="text-xs text-slate-500">Members</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{company.totalTeams}</div>
                          <div className="text-xs text-slate-500">Teams</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{company.satisfaction}%</div>
                          <div className="text-xs text-slate-500">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-slate-400" />
        </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No companies found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
                  <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={clearFilters}
          >
            Clear Filters
                  </button>
                </div>
              )}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating company:", formData);
    
    // Create new company object
    const newCompany = {
      id: Date.now(), // Generate unique ID
      name: formData.name,
      description: formData.description,
      status: formData.status,
      type: formData.type,
      industry: formData.industry,
      founded: formData.founded,
      employees: formData.employees ? parseInt(formData.employees) : 0,
      location: formData.location,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      revenue: formData.revenue,
      growth: "+0%",
      lastActivity: "Just now",
      tags: formData.tags,
      archived: false,
      priority: formData.priority,
      health: "good",
      velocity: 0,
      satisfaction: 0,
      engagement: 0,
      retention: 0,
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalTeams: 0,
      members: 0,
      projects: [],
      teams: [],
      departments: [],
      sprints: []
    };

    // Add the new company to the companies array
    setCompanies(prevCompanies => [newCompany, ...prevCompanies]);
    
    // Reset form and hide it
    setShowCreateForm(false);
    setFormData({
      name: "",
      description: "",
      type: companyTypes[0],
      industry: industries[0],
      status: "Active",
      founded: "",
      employees: "",
      location: "",
      website: "",
      email: "",
      phone: "",
      revenue: "",
      priority: priorities[1],
      tags: [],
      notes: ""
    });
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg">
            <Building2 className="text-white mr-1" size={20} />
            <span>Companies</span>
            </div>
          </div>
        <div className="flex items-center gap-3">
          <button 
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Download size={16} />
            Export All
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            {showCreateForm ? 'Cancel' : 'New Company'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Company Creation Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Company</h2>
                  <p className="text-slate-600">Fill in the details below to create a new company.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Company Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter company name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Type *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          {companyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Industry *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Building className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
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
                        placeholder="Describe the company's business, mission, and key activities..."
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <CheckCircle className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Info className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Company Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Founded Year
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.founded}
                        onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                        placeholder="e.g., 2020"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Employees
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.employees}
                        onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
                        placeholder="e.g., 150"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Revenue
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.revenue}
                        onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                        placeholder="e.g., $2.5M"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <MapPin className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://company.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Globe className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="contact@company.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Phone className="w-4 h-4 text-slate-400" />
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
                  {availableTags.map(tag => (
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

              {/* Additional Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Additional Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes or special requirements..."
                      rows={3}
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
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Create Company</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search companies, descriptions, or industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                      ? "bg-blue-100 text-blue-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Technology">Technology</option>
                  <option value="Research">Research</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>

                <select className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Industries</option>
                  <option>Software Development</option>
                  <option>IT Services</option>
                  <option>R&D</option>
                  <option>Consulting</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <FilterX size={16} />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
          <div className="flex space-x-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "projects", label: "Projects", icon: FolderKanban },
              { id: "teams", label: "Teams", icon: Users },
              { id: "departments", label: "Departments", icon: Building },
              { id: "sprints", label: "Sprints", icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    view === tab.id
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {view === "overview" && renderOverview()}
        {view === "projects" && <div className="text-center py-12 text-slate-600">Projects view coming soon...</div>}
        {view === "teams" && <div className="text-center py-12 text-slate-600">Teams view coming soon...</div>}
        {view === "departments" && <div className="text-center py-12 text-slate-600">Departments view coming soon...</div>}
        {view === "sprints" && <div className="text-center py-12 text-slate-600">Sprints view coming soon...</div>}
      </div>
    </div>
  );
} 