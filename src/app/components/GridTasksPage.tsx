'use client';

import React, { useState } from 'react';
import GridLayoutWrapper from './GridLayoutWrapper';
import UniversalDetailsModal from './UniversalDetailsModal';
import { 
  CheckSquare, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Archive, 
  Copy, 
  Download, 
  Search, 
  Filter, 
  X, 
  Plus,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  FileText,
  Users,
  Clock,
  Tag,
  CheckCircle,
  AlertCircle,
  Grid3X3,
  Eye,
  EyeOff
} from 'lucide-react';

// Task card component
const TaskCard = ({ task, onEdit, onDelete, onArchive, onDuplicate, onTaskClick }: any) => (
  <div 
    className="bg-white rounded-lg border border-gray-200 p-4 h-full hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onTaskClick && onTaskClick(task)}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          task.priority === 'High' ? 'bg-red-500' :
          task.priority === 'Medium' ? 'bg-yellow-500' :
          'bg-green-500'
        }`} />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          task.status === 'Completed' ? 'bg-green-100 text-green-700' :
          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          task.status === 'To Do' ? 'bg-gray-100 text-gray-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {task.status}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDuplicate(task)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={() => onArchive(task)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <Archive size={14} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1 text-red-400 hover:text-red-600 rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
    
    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.name}</h3>
    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>
    
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Users size={12} />
        <span>{task.assignee}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Calendar size={12} />
        <span>Due {task.dueDate}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock size={12} />
        <span>{task.timeEstimate}</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Story:</span>
        <span className="text-xs font-medium text-gray-700">{task.story}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Points:</span>
        <span className="text-xs font-medium text-gray-700">{task.storyPoints}</span>
      </div>
    </div>
    
    {task.tags && task.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-3">
        {task.tags.slice(0, 3).map((tag: string, index: number) => (
          <span
            key={`tag-${index}`}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {task.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{task.tags.length - 3}
          </span>
        )}
      </div>
    )}
  </div>
);

// Task status filter component
const TaskStatusFilter = ({ selectedStatus, onStatusChange }: any) => (
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
    {['All', 'To Do', 'In Progress', 'Completed'].map((status) => (
      <button
        key={status}
        onClick={() => onStatusChange(status)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          selectedStatus === status
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {status}
      </button>
    ))}
  </div>
);

// Sample task data
const sampleTasks = [
  {
    id: "grid-task-1",
    name: "Implement User Authentication",
    status: "Completed",
    priority: "High",
    assignee: "Sarah Johnson",
    reporter: "Mike Chen",
    storyPoints: 3,
    story: "User Authentication System",
    sprint: "Sprint 1 - Q1 2024",
    epic: "User Management",
    description: "Create login and registration forms with JWT token authentication",
    dueDate: "2024-01-10",
    timeEstimate: "12h",
    tags: ["Authentication", "Frontend", "Security"]
  },
  {
    id: "grid-task-2",
    name: "Design Dashboard Layout",
    status: "In Progress",
    priority: "High",
    assignee: "Mike Chen",
    reporter: "Lisa Chen",
    storyPoints: 2,
    story: "Dashboard Layout",
    sprint: "Sprint 1 - Q1 2024",
    epic: "User Interface",
    description: "Create responsive dashboard layout with grid system and widgets",
    dueDate: "2024-01-15",
    timeEstimate: "10h",
    tags: ["Frontend", "UI/UX", "Dashboard"]
  },
  {
    id: "grid-task-3",
    name: "API Integration for Payment",
    status: "To Do",
    priority: "Medium",
    assignee: "Charlie Davis",
    reporter: "Bob Smith",
    storyPoints: 5,
    story: "Payment Integration",
    sprint: "Sprint 2 - Q1 2024",
    epic: "Payment System",
    description: "Integrate Stripe payment gateway with secure token handling",
    dueDate: "2024-01-25",
    timeEstimate: "16h",
    tags: ["Backend", "API", "Payment"]
  },
  {
    id: "grid-task-4",
    name: "Mobile App Testing",
    status: "In Progress",
    priority: "Medium",
    assignee: "Diana Wilson",
    reporter: "Alice Johnson",
    storyPoints: 2,
    story: "Mobile Testing",
    sprint: "Sprint 1 - Q1 2024",
    epic: "Quality Assurance",
    description: "Comprehensive testing of mobile app on iOS and Android devices",
    dueDate: "2024-01-20",
    timeEstimate: "8h",
    tags: ["Testing", "Mobile", "QA"]
  },
  {
    id: "grid-task-5",
    name: "Database Optimization",
    status: "To Do",
    priority: "Low",
    assignee: "Eve Chen",
    reporter: "Charlie Davis",
    storyPoints: 4,
    story: "Database Performance",
    sprint: "Sprint 2 - Q1 2024",
    epic: "Infrastructure",
    description: "Optimize database queries and add proper indexing for better performance",
    dueDate: "2024-01-30",
    timeEstimate: "12h",
    tags: ["Backend", "Database", "Performance"]
  },
  {
    id: "grid-task-6",
    name: "User Documentation",
    status: "Completed",
    priority: "Low",
    assignee: "Frank Miller",
    reporter: "Diana Wilson",
    storyPoints: 1,
    story: "Documentation",
    sprint: "Sprint 1 - Q1 2024",
    epic: "Documentation",
    description: "Create comprehensive user documentation and API guides",
    dueDate: "2024-01-12",
    timeEstimate: "6h",
    tags: ["Documentation", "User Guide"]
  }
];

// Default layout for task cards
const defaultTaskLayout = [
  { i: 'task-1', x: 0, y: 0, w: 4, h: 6, minW: 3, maxW: 6 },
  { i: 'task-2', x: 4, y: 0, w: 4, h: 6, minW: 3, maxW: 6 },
  { i: 'task-3', x: 8, y: 0, w: 4, h: 6, minW: 3, maxW: 6 },
  { i: 'task-4', x: 0, y: 6, w: 4, h: 6, minW: 3, maxW: 6 },
  { i: 'task-5', x: 4, y: 6, w: 4, h: 6, minW: 3, maxW: 6 },
  { i: 'task-6', x: 8, y: 6, w: 4, h: 6, minW: 3, maxW: 6 },
];

export default function GridTasksPage({ onOpenTab }: { onOpenTab?: (type: string) => void }) {
  const [tasks, setTasks] = useState(sampleTasks);
  const [isGridMode, setIsGridMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    itemType: 'task' as 'task' | 'project',
    itemId: ''
  });

  // Filter tasks based on status and search
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEditTask = (task: any) => {
    console.log('Edit task:', task);
    onOpenTab?.('edit-task');
  };

  const handleDeleteTask = (task: any) => {
    setTasks(tasks.filter(t => t.id !== task.id));
  };

  const handleTaskClick = (task: any) => {
    console.log('=== TASK DETAILS MODAL DEBUG ===');
    console.log('Opening details modal for task:', task.id);
    console.log('Task type:', typeof task.id);
    console.log('Task ID length:', task.id?.length);
    console.log('Is task ID empty?', !task.id || task.id.toString().trim() === '');
    
    // Ensure we have a valid task ID
    if (!task.id || task.id.toString().trim() === '') {
      console.error('Invalid task ID:', task.id);
      return;
    }
    
    // Open the Universal Details Modal
    setDetailsModal({
      isOpen: true,
      itemType: 'task',
      itemId: task.id.toString()
    });
  };

  // Close Universal Details Modal
  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      itemType: 'task',
      itemId: ''
    });
  };

  const handleArchiveTask = (task: any) => {
    console.log('Archive task:', task);
  };

  const handleDuplicateTask = (task: any) => {
    const newTask = {
      ...task,
      id: Math.max(...tasks.map(t => t.id)) + 1,
      name: `${task.name} (Copy)`,
      status: 'To Do'
    };
    setTasks([...tasks, newTask]);
  };

  const handleLayoutChange = (layout: any, layouts: any) => {
    console.log('Task layout changed:', layout, layouts);
  };

  const handleSaveLayout = (layouts: any) => {
    console.log('Task layout saved:', layouts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage and organize your tasks with customizable layouts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGridMode(!isGridMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isGridMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isGridMode ? 'Exit Grid Mode' : 'Grid Mode'}
            </button>
            {!isGridMode && (
              <button
                onClick={() => setIsGridMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Customize Layout
              </button>
            )}
            <button
              onClick={() => onOpenTab?.('create-task')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <TaskStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>
      </div>

      {/* Tasks Content */}
      {isGridMode ? (
        <GridLayoutWrapper
          title="Tasks Layout"
          defaultLayout={defaultTaskLayout}
          onLayoutChange={handleLayoutChange}
          onSaveLayout={handleSaveLayout}
          className="p-4"
        >
          {filteredTasks.map((task, index) => (
            <div key={`task-${task.id}`}>
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onArchive={handleArchiveTask}
                onDuplicate={handleDuplicateTask}
                onTaskClick={handleTaskClick}
              />
            </div>
          ))}
        </GridLayoutWrapper>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onArchive={handleArchiveTask}
                onDuplicate={handleDuplicateTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CheckSquare size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Universal Details Modal */}
      {detailsModal.isOpen && (
        <UniversalDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={closeDetailsModal}
          itemType={detailsModal.itemType}
          itemId={detailsModal.itemId}
        />
      )}
    </div>
  );
} 