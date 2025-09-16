"use client";
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
  ArrowLeft
} from "lucide-react";

export default function NewTabPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All", icon: Star, count: 12, description: "View all recent items" },
    { id: "companies", label: "Companies", icon: Building, count: 3, description: "Manage organizations" },
    { id: "projects", label: "Projects Analytics", icon: Tag, count: 4, description: "Track project progress and analytics" },
    { id: "teams", label: "Teams", icon: User, count: 2, description: "Team collaboration" },
    { id: "sprints", label: "Sprints", icon: Calendar, count: 3, description: "Agile development" }
  ];

  const quickActions = [
    {
      id: "new-company",
      title: "New Company",
      description: "Create a new company organization with departments and teams",
      icon: Building,
      color: "blue",
      category: "companies",
      priority: "high"
    },
    {
      id: "new-project",
      title: "New Project",
      description: "Start a new project with team collaboration and task management",
      icon: Tag,
      color: "green",
      category: "projects",
      priority: "high"
    },
    {
      id: "new-team",
      title: "New Team",
      description: "Create a new team with members and assign roles",
      icon: User,
      color: "purple",
      category: "teams",
      priority: "medium"
    },
    {
      id: "new-sprint",
      title: "New Sprint",
      description: "Plan a new sprint with tasks, stories, and deadlines",
      icon: Calendar,
      color: "pink",
      category: "sprints",
      priority: "medium"
    },
    {
      id: "new-department",
      title: "New Department",
      description: "Organize teams into departments with clear hierarchy",
      icon: Target,
      color: "indigo",
      category: "companies",
      priority: "low"
    },
    {
      id: "new-task",
      title: "New Task",
      description: "Create individual tasks and assignments with priorities",
      icon: CheckCircle,
      color: "orange",
      category: "projects",
      priority: "high"
    }
  ];

  const recentItems = [
    {
      id: "recent-1",
      title: "Whapi Project Management",
      type: "Company",
      icon: Building,
      lastModified: "2 hours ago",
      status: "Active",
      description: "Leading project management solutions for enterprise teams",
      priority: "high",
      health: "excellent"
    },
    {
      id: "recent-2",
      title: "Mobile App Development",
      type: "Project",
      icon: Tag,
      lastModified: "1 day ago",
      status: "In Progress",
      description: "Cross-platform mobile application development",
      priority: "high",
      health: "good"
    },
    {
      id: "recent-3",
      title: "Core Development Team",
      type: "Team",
      icon: User,
      lastModified: "3 hours ago",
      status: "Active",
      description: "Main development team for core features",
      priority: "medium",
      health: "excellent"
    },
    {
      id: "recent-4",
      title: "Sprint 24",
      type: "Sprint",
      icon: Calendar,
      lastModified: "5 hours ago",
      status: "Active",
      description: "Current sprint with 65% completion",
      priority: "high",
      health: "good"
    },
    {
      id: "recent-5",
      title: "TechCorp Solutions",
      type: "Company",
      icon: Building,
      lastModified: "1 week ago",
      status: "Active",
      description: "Innovative technology solutions provider",
      priority: "medium",
      health: "good"
    },
    {
      id: "recent-6",
      title: "UI/UX Redesign",
      type: "Project",
      icon: Tag,
      lastModified: "2 days ago",
      status: "Planning",
      description: "Complete user interface redesign project",
      priority: "medium",
      health: "fair"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "green":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "purple":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "pink":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "indigo":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "orange":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-br from-blue-500 to-blue-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-blue-800 bg-blue-200";
      case "medium":
        return "text-blue-700 bg-blue-100";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-blue-700 bg-blue-100";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-blue-800 bg-blue-200";
      case "good":
        return "text-blue-700 bg-blue-100";
      case "fair":
        return "text-blue-600 bg-blue-50";
      case "poor":
        return "text-blue-700 bg-blue-100";
      default:
        return "text-blue-700 bg-blue-100";
    }
  };

  const filteredQuickActions = quickActions.filter(action => 
    selectedCategory === "all" || action.category === selectedCategory
  );

  const filteredRecentItems = recentItems.filter(item => 
    selectedCategory === "all" || item.type.toLowerCase() === selectedCategory.slice(0, -1)
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg">
            <Plus className="text-white mr-1" size={20} />
            <span>New Tab</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
          >
            <Download size={16} />
            Export Template
          </button>
          <button 
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            Quick Create
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for actions, recent items, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-500" />
            Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group p-4 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category.id
                      ? "bg-emerald-100 border-2 border-emerald-500 shadow-lg"
                      : "bg-slate-50/50 border-2 border-white/20 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getColorClasses("blue")} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{category.label}</div>
                      <div className="text-xs text-slate-500">{category.count} items</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(action.color)} text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {action.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 capitalize">{action.category}</span>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Recent Items
          </h3>
          <div className="space-y-4">
            {filteredRecentItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getColorClasses("blue")} text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(item.health)}`}>
                            {item.health}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {item.lastModified}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target size={12} />
                            {item.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                        <Heart size={16} />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredQuickActions.length === 0 && filteredRecentItems.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No items found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or category filter</p>
            <button 
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 