import { useState } from "react";
import { 
  Bell, CheckCircle, AlertCircle, Info, Search, MoreHorizontal, Clock, User, Tag, Settings, Trash2, Star, FilterX, Grid3X3, List, Heart, ExternalLink, GitCommit, DollarSign, UserCheck, Timer, Flag, Layers, Zap, SortAsc, CheckSquare, Square, Play, Pause, StopCircle, RotateCcw, LineChart, Crown, Shield, Trophy, Medal, Users2, UserX, UserCheck2, UserMinus, UserPlus2, Briefcase, Video, Phone, MessageSquare, Mail, TrendingUp, Paperclip, FileText, BarChart, PieChart, ScatterChart, AreaChart, Gauge, Target, TrendingDown, Activity, Filter, Eye, Share2, Archive, Copy, ArrowUpRight, ArrowDownRight, Minus, Building, Globe, Download, Upload, Key, Lock, Unlock, Database, Server, Cloud, Wifi, WifiOff, Volume2, VolumeX, Languages, MapPin, Home, School, ThumbsUp, ThumbsDown, HelpCircle, BookOpen, Folder, HardDrive, Cpu, HardDriveIcon, Network, WifiIcon, Bluetooth, BluetoothSearching, SmartphoneIcon, Tablet
} from "lucide-react";

// Enhanced notifications data
const notifications = [
  {
    id: 1,
    title: "Task Completed Successfully",
    message: "Sarah Johnson completed the 'Design UI Components' task ahead of schedule. The design system is now ready for implementation.",
    type: "success",
    category: "task",
    timestamp: "2 hours ago",
    read: false,
    priority: "medium",
    sender: "Sarah Johnson",
    project: "Whapi Project Management",
    avatar: "SJ",
    action: "View Task",
    health: "excellent"
  },
  {
    id: 2,
    title: "Project Deadline Reminder",
    message: "Client Portal project deadline is approaching in 3 days. Please ensure all critical features are completed and tested.",
    type: "warning",
    category: "deadline",
    timestamp: "4 hours ago",
    read: false,
    priority: "high",
    sender: "System",
    project: "Client Portal",
    avatar: "S",
    action: "View Project",
    health: "good"
  },
  {
    id: 3,
    title: "New Team Member Added",
    message: "David Kim joined the Backend Development team as Senior Developer. Welcome to the team!",
    type: "info",
    category: "team",
    timestamp: "1 day ago",
    read: true,
    priority: "low",
    sender: "System",
    project: "Whapi Project Management",
    avatar: "DK",
    action: "View Profile",
    health: "excellent"
  },
  {
    id: 4,
    title: "Code Review Request",
    message: "Alex Rodriguez requested a review for the authentication system implementation. Please review the changes.",
    type: "info",
    category: "review",
    timestamp: "1 day ago",
    read: true,
    priority: "medium",
    sender: "Alex Rodriguez",
    project: "Whapi Project Management",
    avatar: "AR",
    action: "Review Code",
    health: "good"
  },
  {
    id: 5,
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes. All data will be backed up.",
    type: "warning",
    category: "system",
    timestamp: "2 days ago",
    read: true,
    priority: "medium",
    sender: "System",
    project: "System",
    avatar: "S",
    action: "View Details",
    health: "fair"
  },
  {
    id: 6,
    title: "Weekly Report Available",
    message: "Your weekly project progress report is ready to view. Key metrics show 15% improvement in team velocity.",
    type: "success",
    category: "report",
    timestamp: "3 days ago",
    read: true,
    priority: "low",
    sender: "System",
    project: "All Projects",
    avatar: "S",
    action: "View Report",
    health: "excellent"
  },
  {
    id: 7,
    title: "Sprint Planning Meeting",
    message: "Sprint 25 planning meeting starts in 30 minutes. Please prepare your task estimates and priorities.",
    type: "info",
    category: "meeting",
    timestamp: "5 hours ago",
    read: false,
    priority: "high",
    sender: "Emma Wilson",
    project: "Mobile App Development",
    avatar: "EW",
    action: "Join Meeting",
    health: "good"
  },
  {
    id: 8,
    title: "Bug Report Submitted",
    message: "Critical bug reported in user authentication flow. Users unable to log in with OAuth providers.",
    type: "warning",
    category: "bug",
    timestamp: "6 hours ago",
    read: false,
    priority: "high",
    sender: "Mike Chen",
    project: "Whapi Project Management",
    avatar: "MC",
    action: "Investigate",
    health: "poor"
  }
];

const notificationTypes = {
  success: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", border: "border-green-200" },
  warning: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" }
};

const categories = [
  { id: "all", label: "All", count: notifications.length, description: "View all notifications" },
  { id: "task", label: "Tasks", count: notifications.filter(n => n.category === "task").length, description: "Task-related updates" },
  { id: "deadline", label: "Deadlines", count: notifications.filter(n => n.category === "deadline").length, description: "Project deadlines" },
  { id: "team", label: "Team", count: notifications.filter(n => n.category === "team").length, description: "Team changes" },
  { id: "review", label: "Reviews", count: notifications.filter(n => n.category === "review").length, description: "Code reviews" },
  { id: "system", label: "System", count: notifications.filter(n => n.category === "system").length, description: "System updates" },
  { id: "report", label: "Reports", count: notifications.filter(n => n.category === "report").length, description: "Progress reports" },
  { id: "meeting", label: "Meetings", count: notifications.filter(n => n.category === "meeting").length, description: "Meeting reminders" },
  { id: "bug", label: "Bugs", count: notifications.filter(n => n.category === "bug").length, description: "Bug reports" }
];

const analytics = {
  totalNotifications: notifications.length,
  unreadNotifications: notifications.filter(n => !n.read).length,
  highPriorityNotifications: notifications.filter(n => n.priority === "high").length,
  todayNotifications: notifications.filter(n => n.timestamp.includes("hours ago") || n.timestamp.includes("hour ago")).length
};

export default function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "fair":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const markAsRead = (id: number) => {
    // Implementation for marking notification as read
    console.log(`Marked notification ${id} as read`);
  };

  const deleteNotification = (id: number) => {
    // Implementation for deleting notification
    console.log(`Deleted notification ${id}`);
  };

  const clearAllNotifications = () => {
    // Implementation for clearing all notifications
    console.log("Cleared all notifications");
  };

  const markAllAsRead = () => {
    // Implementation for marking all notifications as read
    console.log("Marked all notifications as read");
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || notification.category === selectedCategory;
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "unread" && !notification.read) ||
                         (statusFilter === "read" && notification.read);
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-lg">
            <Bell className="text-white mr-1" size={20} />
            <span>Notifications</span>
            {analytics.unreadNotifications > 0 && (
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                {analytics.unreadNotifications}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 hover:bg-white/90 text-slate-700 font-medium transition-all duration-200 hover:scale-105 focus-ring"
            onClick={markAllAsRead}
          >
            <CheckCircle size={16} />
            Mark All Read
          </button>
          <button 
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus-ring"
            onClick={clearAllNotifications}
          >
            <Trash2 size={20} className="group-hover:rotate-12 transition-transform duration-200" />
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                <Bell className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.totalNotifications}</h3>
            <p className="text-slate-600 text-sm font-medium">Total Notifications</p>
            <div className="mt-2 text-xs text-slate-500">+5 this week</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.unreadNotifications}</h3>
            <p className="text-slate-600 text-sm font-medium">Unread</p>
            <div className="mt-2 text-xs text-slate-500">Requires attention</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                <Flag className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.highPriorityNotifications}</h3>
            <p className="text-slate-600 text-sm font-medium">High Priority</p>
            <div className="mt-2 text-xs text-slate-500">Urgent attention needed</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{analytics.todayNotifications}</h3>
            <p className="text-slate-600 text-sm font-medium">Today</p>
            <div className="mt-2 text-xs text-slate-500">Recent activity</div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications, senders, or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-orange-100 text-orange-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-orange-100 text-orange-600" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>

                <select className="px-3 py-2 border border-white/20 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Projects</option>
                  <option>Whapi Project Management</option>
                  <option>Client Portal</option>
                  <option>Mobile App Development</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriorityFilter("all");
                    setStatusFilter("all");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <FilterX size={16} />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-orange-500" />
            Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group p-4 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-orange-100 border-2 border-orange-500 shadow-lg"
                    : "bg-slate-50/50 border-2 border-white/20 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{category.label}</div>
                    <div className="text-xs text-slate-500">{category.count} items</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => {
              const TypeIcon = notificationTypes[notification.type as keyof typeof notificationTypes].icon;
              return (
                <div
                  key={notification.id}
                  className={`group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in ${
                    !notification.read ? "ring-2 ring-orange-200" : ""
                  }`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${notificationTypes[notification.type as keyof typeof notificationTypes].bg} ${notificationTypes[notification.type as keyof typeof notificationTypes].color} shadow-lg`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {notification.avatar}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {notification.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(notification.health)}`}>
                            {notification.health}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {notification.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {notification.sender}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={12} />
                            {notification.project}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-orange-600 hover:text-orange-700 text-sm font-medium hover:bg-orange-50 rounded-lg transition-all duration-200">
                        {notification.action}
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                        <Heart size={16} />
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

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
              <button 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriorityFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 