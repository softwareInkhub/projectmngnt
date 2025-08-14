import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Share, 
  Archive, 
  Copy, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Building, 
  Globe, 
  Settings, 
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
  MapPin, 
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
  Users,
  Calendar,
  Folder
} from 'lucide-react';

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

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Mobile App Development",
    description: "Develop a cross-platform mobile application for iOS and Android",
    assignee: "John Doe",
    progress: 75,
    status: "In Progress",
    priority: "High",
    endDate: "2024-03-15",
    team: "Mobile Team",
    tasks: 24,
    budget: "$50,000",
    tags: ["mobile", "react-native", "ios", "android"]
  },
  {
    id: "2", 
    name: "Website Redesign",
    description: "Modernize the company website with new design and features",
    assignee: "Jane Smith",
    progress: 45,
    status: "In Progress", 
    priority: "Medium",
    endDate: "2024-04-20",
    team: "Web Team",
    tasks: 18,
    budget: "$25,000",
    tags: ["web", "design", "react", "ui/ux"]
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate legacy database to modern cloud infrastructure",
    assignee: "Mike Johnson", 
    progress: 90,
    status: "Completed",
    priority: "High",
    endDate: "2024-02-28",
    team: "DevOps Team",
    tasks: 12,
    budget: "$35,000",
    tags: ["database", "migration", "cloud", "devops"]
  }
];

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
            <Folder className="w-6 h-6" />
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
