'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  Archive,
  Copy,
  Share2,
  Download,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  Bell,
  MessageSquare,
  Heart,
  ExternalLink,
  GitCommit,
  Activity,
  DollarSign,
  UserCheck,
  Timer,
  Flag,
  Layers,
  Zap,
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
  Building,
  Briefcase,
  Video,
  Phone,
  User,
  MapPin,
  MessageSquare as MessageSquareIcon,
  AlertCircle as AlertCircleIcon,
  Info,
  Award,
  Paperclip,
  FileText as FileTextIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ScatterChart,
  AreaChart,
  Gauge,
  Target,
  TrendingDown as TrendingDownIcon,
  Activity as ActivityIcon,
  Filter as FilterIcon,
  Share2 as Share2Icon,
  Download as DownloadIcon,
  FilterX as FilterXIcon,
  Grid3X3 as Grid3X3Icon,
  List as ListIcon,
  Heart as HeartIcon,
  ExternalLink as ExternalLinkIcon,
  GitCommit as GitCommitIcon,
  DollarSign as DollarSignIcon,
  UserCheck as UserCheckIcon,
  Timer as TimerIcon,
  Flag as FlagIcon,
  Layers as LayersIcon,
  Zap as ZapIcon,
  TrendingDown as TrendingDownIcon2,
  SortAsc as SortAscIcon,
  Square as SquareIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  StopCircle as StopCircleIcon,
  RotateCcw as RotateCcwIcon,
  LineChart as LineChartIcon,
  Crown as CrownIcon,
  Shield as ShieldIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Users2 as Users2Icon,
  UserX as UserXIcon,
  UserCheck2 as UserCheck2Icon,
  UserMinus as UserMinusIcon,
  UserPlus2 as UserPlus2Icon,
  Briefcase as BriefcaseIcon,
  Video as VideoIcon,
  MessageSquare as MessageSquareIcon2,
  AlertCircle as AlertCircleIcon2,
  Info as InfoIcon,
  Award as AwardIcon,
  Paperclip as PaperclipIcon,
  FileText as FileTextIcon2,
  BarChart as BarChartIcon2,
  PieChart as PieChartIcon3,
  ScatterChart as ScatterChartIcon,
  AreaChart as AreaChartIcon,
  Gauge as GaugeIcon,
  Target as TargetIcon2,
  TrendingDown as TrendingDownIcon3,
  Activity as ActivityIcon2,
  Filter as FilterIcon2,
  Share2 as Share2Icon2,
  Archive as ArchiveIcon,
  Copy as CopyIcon,
  Trash2 as Trash2Icon,
  ArrowUpRight as ArrowUpRightIcon,
  ArrowDownRight as ArrowDownRightIcon,
  Minus as MinusIcon,
  X,
  Building as BuildingIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  Upload,
  Key,
  Lock,
  Unlock,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Languages,
  Home,
  School,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  BookOpen,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  ArrowLeft,
  Save,
  CalendarDays
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
  attendees?: string[];
  description?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Project Review Meeting',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'meeting',
            attendees: [],
    description: 'Review progress on E-commerce Platform project'
  },
  {
    id: '2',
    title: 'Client Portal Deadline',
    date: '2024-01-20',
    time: '5:00 PM',
    type: 'deadline',
    description: 'Final delivery of Client Portal features'
  },
  {
    id: '3',
    title: 'Team Standup',
    date: '2024-01-16',
    time: '9:00 AM',
    type: 'meeting',
    attendees: ['All Team Members']
  }
];

const attendees = [
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

const eventTypes = [
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'deadline', label: 'Deadline', icon: Clock },
  { value: 'reminder', label: 'Reminder', icon: Bell }
];

const projects = [
  "Whapi Project Management",
  "E-commerce Platform", 
  "Client Portal",
  "Mobile App Development",
  "API Integration"
];

export default function CalendarPage({ 
  open, 
  onClose, 
  onOpenTab 
}: { 
  open: boolean; 
  onClose: () => void; 
  onOpenTab?: (type: string, title?: string, context?: Record<string, unknown>) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meeting",
    attendees: [] as string[],
    project: projects[0],
    location: "",
    duration: "",
    priority: "medium",
    date: "",
    time: "",
    startDate: new Date(),
    endDate: new Date(),
    notes: "",
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => event.date === date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating event:", formData);
    
    // Create new event object
    const newEvent = {
      id: Date.now().toString(), // Generate unique ID
      title: formData.title,
      date: formData.startDate.toISOString().split('T')[0], // Convert Date to string
      time: formData.startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: formData.type as 'meeting' | 'deadline' | 'reminder',
      attendees: formData.attendees,
      description: formData.description
    };

    // Add the new event to the mockEvents array
    mockEvents.push(newEvent);
    
    // Reset form and hide it
    setShowCreateForm(false);
    setFormData({
      title: "",
      description: "",
      type: "meeting",
      attendees: [],
      project: projects[0],
      location: "",
      duration: "",
      priority: "medium",
      date: "",
      time: "",
      startDate: new Date(),
      endDate: new Date(),
      notes: "",
    });
  };

  const toggleAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(attendee) 
        ? prev.attendees.filter(a => a !== attendee)
        : [...prev.attendees, attendee]
    }));
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDay }, (_, i) => i);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-700 border-red-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users size={12} />;
      case 'deadline': return <Clock size={12} />;
      case 'reminder': return <Bell size={12} />;
      default: return <Calendar size={12} />;
    }
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Calendar</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-1 rounded hover:bg-slate-100"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-1 rounded hover:bg-slate-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>{showCreateForm ? 'Cancel' : 'Add Event'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Event Creation Form */}
      {showCreateForm && (
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Event</h2>
                  <p className="text-slate-600">Fill in the details below to create a new calendar event.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Event Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Type *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {eventTypes.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                            className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                              formData.type === type.value
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {getEventTypeIcon(type.value)}
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        ))}
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
                        placeholder="Describe the event details..."
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project
                      </label>
                      <div className="relative">
                        <select
                          value={formData.project}
                          onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          {projects.map(project => (
                            <option key={project} value={project}>{project}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <BuildingIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Date & Time</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
                      Time *
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration
                    </label>
                    <div className="relative">
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Duration</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                        <option value="180">3 hours</option>
                        <option value="240">4 hours</option>
                        <option value="480">All day</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Timer className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendees */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Attendees</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Attendees
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                      {attendees.map(attendee => (
                        <div key={attendee} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={formData.attendees.includes(attendee)}
                              onChange={() => toggleAttendee(attendee)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">{attendee}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Selected Attendees ({formData.attendees.length})
                    </label>
                    <div className="space-y-2">
                      {formData.attendees.map(attendee => (
                        <div key={attendee} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-medium text-slate-900">{attendee}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleAttendee(attendee)}
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

              {/* Additional Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Additional Details</h3>
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
                        placeholder="Enter location or meeting link"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                         <MapPin className="w-4 h-4 text-slate-400" />
                       </div>
                    </div>
                  </div>

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
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                      </div>
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
                    placeholder="Add any additional notes or special instructions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
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
                    <Calendar className="w-4 h-4" />
                    <span>Create Event</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty days at start */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-24 bg-slate-50 rounded-lg" />
          ))}
          
          {/* Actual days */}
          {days.map(day => {
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = getEventsForDate(dateString);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            
            return (
              <div 
                key={day}
                className={`h-24 border border-slate-200 rounded-lg p-1 cursor-pointer hover:bg-slate-50 transition-colors ${
                  isToday ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              >
                <div className="text-xs font-medium mb-1">
                  {day}
                </div>
                <div className="space-y-1">
                  {events.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded border ${getEventTypeColor(event.type)} flex items-center space-x-1`}
                    >
                      {getEventTypeIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-slate-500 px-1">
                      +{events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {getEventsForDate(selectedDate.toISOString().split('T')[0]).map(event => (
                  <div key={event.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{event.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{event.time}</p>
                        {event.description && (
                          <p className="text-sm text-slate-500 mt-2">{event.description}</p>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-1">Attendees:</p>
                            <div className="flex flex-wrap gap-1">
                              {event.attendees.map((attendee, index) => (
                                <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                  {attendee}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
                {getEventsForDate(selectedDate.toISOString().split('T')[0]).length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p>No events scheduled for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 