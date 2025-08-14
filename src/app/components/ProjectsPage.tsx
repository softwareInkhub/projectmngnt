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
  Settings
} from "lucide-react";

// Sample project data
const initialProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Johnson",
    team: "Frontend Development",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 65,
    tasks: 48,
    completed: 31,
    budget: "$150K",
    description: "Modern e-commerce platform with advanced features and mobile optimization",
    created: "2024-01-01",
    lastActivity: "2 hours ago",
    archived: false,
    tags: ["Frontend", "E-commerce", "Mobile"],
    repository: "github.com/company/ecommerce-platform",
    likes: 24,
    comments: 8,
    views: 156,
    health: "excellent",
    velocity: 87,
    subprojects: [
      {
        id: 1,
        name: "User Interface",
        status: "Completed",
        progress: 100,
        tasks: 15,
        completed: 15,
        assignee: "Mike Chen"
      },
      {
        id: 2,
        name: "Payment Integration",
        status: "In Progress",
        progress: 75,
        tasks: 12,
        completed: 9,
        assignee: "David Kim"
      },
      {
        id: 3,
        name: "Mobile App",
        status: "Planning",
        progress: 0,
        tasks: 8,
        completed: 0,
        assignee: "Lisa Wang"
      }
    ]
  },
  {
    id: 2,
    name: "Data Analytics Dashboard",
    status: "Active",
    priority: "Medium",
    assignee: "Alex Rodriguez",
    team: "Data Science",
    startDate: "2024-02-15",
    endDate: "2024-05-30",
    progress: 45,
    tasks: 32,
    completed: 14,
    budget: "$200K",
    description: "Comprehensive analytics dashboard for business intelligence and reporting",
    created: "2024-02-15",
    lastActivity: "1 day ago",
    archived: false,
    tags: ["Data", "Analytics", "BI"],
    repository: "github.com/company/analytics-dashboard",
    likes: 18,
    comments: 12,
    views: 89,
    health: "good",
    velocity: 72,
    subprojects: [
      {
        id: 1,
        name: "Data Pipeline",
        status: "Completed",
        progress: 100,
        tasks: 8,
        completed: 8,
        assignee: "Alex Rodriguez"
      },
      {
        id: 2,
        name: "Visualization Layer",
        status: "In Progress",
        progress: 60,
        tasks: 15,
        completed: 9,
        assignee: "Maria Garcia"
      },
      {
        id: 3,
        name: "API Development",
        status: "Planning",
        progress: 0,
        tasks: 9,
        completed: 0,
        assignee: "James Wilson"
      }
    ]
  },
  {
    id: 3,
    name: "Mobile Banking App",
    status: "Planning",
    priority: "Critical",
    assignee: "Emily Chen",
    team: "Mobile Development",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    progress: 15,
    tasks: 56,
    completed: 8,
    budget: "$300K",
    description: "Secure mobile banking application with biometric authentication",
    created: "2024-03-01",
    lastActivity: "3 days ago",
    archived: false,
    tags: ["Mobile", "Banking", "Security"],
    repository: "github.com/company/mobile-banking",
    likes: 32,
    comments: 15,
    views: 203,
    health: "excellent",
    velocity: 85,
    subprojects: [
      {
        id: 1,
        name: "Security Framework",
        status: "In Progress",
        progress: 80,
        tasks: 12,
        completed: 10,
        assignee: "Emily Chen"
      },
      {
        id: 2,
        name: "UI/UX Design",
        status: "Planning",
        progress: 0,
        tasks: 20,
        completed: 0,
        assignee: "Sophie Lee"
      },
      {
        id: 3,
        name: "Backend API",
        status: "Planning",
        progress: 0,
        tasks: 24,
        completed: 0,
        assignee: "Ryan Thompson"
      }
    ]
  }
];

interface Project {
  id: number;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  team: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: number;
  completed: number;
  budget: string;
  description: string;
  created: string;
  lastActivity: string;
  archived: boolean;
  tags: string[];
  repository: string;
  likes: number;
  comments: number;
  views: number;
  health: string;
  velocity: number;
  subprojects: Array<{
    id: number;
    name: string;
    status: string;
    progress: number;
    tasks: number;
    completed: number;
    assignee: string;
  }>;
}

export default function ProjectsPage({ open, onClose, onOpenTab, context }: { 
  open: boolean, 
  onClose: () => void,
  onOpenTab?: (type: string, title?: string, context?: any) => void,
  context?: { company: string }
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!open) return null;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{context?.company ? `${context.company} Projects` : 'Projects'}</h1>
            <p className="text-slate-600">{context?.company ? `Manage and track projects for ${context.company}` : 'Manage and track all your projects'}</p>
          </div>
        </div>
        </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{project.description}</p>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{project.assignee}</span>
                <span>{project.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
      </div>
    </div>
  );
} 
