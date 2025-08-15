import React, { useState } from "react";
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
}

export default function ProjectsPage({ context }: { context?: { company: string } }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Modern e-commerce platform with advanced features",
      assignee: "Sarah Johnson",
      progress: 75,
      status: "In Progress",
      priority: "High",
      endDate: "2024-03-15",
      team: "Frontend Team",
      tasks: 24,
      budget: "$45,000",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Cross-platform mobile application",
      assignee: "Mike Chen",
      progress: 45,
      status: "Planning",
      priority: "Medium",
      endDate: "2024-04-20",
      team: "Mobile Team",
      tasks: 18,
      budget: "$32,000",
      tags: ["React Native", "Firebase"]
    },
    {
      id: "3",
      name: "API Integration",
      description: "Third-party API integration and optimization",
      assignee: "Alex Rodriguez",
      progress: 90,
      status: "Almost Done",
      priority: "High",
      endDate: "2024-02-28",
      team: "Backend Team",
      tasks: 12,
      budget: "$18,000",
      tags: ["Python", "Django", "PostgreSQL"]
    }
  ]);

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

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
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
          <button className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring">
            <Download size={16} />
            Export
          </button>
          <button className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal size={16} />
                </button>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
