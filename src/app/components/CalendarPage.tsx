'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { BarChart3, ChevronLeft, ChevronRight, Search, Settings, User, Users2, ChevronDown, Filter, MoreVertical, Grid3X3, List, Calendar, Clock, Plus, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List as ListIcon, ListOrdered, IndentDecrease, IndentIncrease, Superscript, Subscript, Image, Link, Code, Type, Sun, Moon, Maximize2 } from 'lucide-react';
import { ProjectApiService, ProjectData } from '../utils/projectApi';
import { TaskApiService, TaskData } from '../utils/taskApi';

interface CalendarPageProps {
  onOpenTab?: (type: string, title?: string) => void;
}

export default function CalendarPage({ onOpenTab }: CalendarPageProps) {
  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 8, 1), // September 1, 2025
    end: new Date(2025, 8, 30)   // September 30, 2025
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState<Date | null>(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [taskName, setTaskName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [taskList, setTaskList] = useState<string>('');
  const [associatedTeam, setAssociatedTeam] = useState<string>('');
  const [workHours, setWorkHours] = useState<string>('8:00');
  const [startDate, setStartDate] = useState<string>('09-05-2025');
  const [dueDate, setDueDate] = useState<string>('09-05-2025');
  const [priority, setPriority] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [reminder, setReminder] = useState<string>('');
  const [recurrence, setRecurrence] = useState<string>('');
  const [billingType, setBillingType] = useState<string>('');
  const [isTaskInfoExpanded, setIsTaskInfoExpanded] = useState<boolean>(true);
  const [owner, setOwner] = useState<string>('Inkhub Tattoos');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState<boolean>(false);
  const [isWorkHoursDropdownOpen, setIsWorkHoursDropdownOpen] = useState<boolean>(false);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState<boolean>(false);
  
  // Refs for dropdowns
  const ownerDropdownRef = useRef<HTMLDivElement>(null);
  const workHoursDropdownRef = useRef<HTMLDivElement>(null);
  const tagsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target as Node)) {
        setIsOwnerDropdownOpen(false);
      }
      if (workHoursDropdownRef.current && !workHoursDropdownRef.current.contains(event.target as Node)) {
        setIsWorkHoursDropdownOpen(false);
      }
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
        setIsTagsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [projRes, taskRes] = await Promise.all([
          ProjectApiService.getProjects(),
          TaskApiService.getTasks()
        ]);
        if (mounted) {
          setProjects(projRes.success ? (projRes.data || []) : []);
          setTasks(taskRes.success ? (taskRes.data || []) : []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const projectIdToTasks = useMemo(() => {
    const map: Record<string, TaskData[]> = {};
    for (const t of tasks) {
      const key = t.project || 'unassigned';
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    return map;
  }, [tasks]);

  const navigateDateRange = (direction: 'prev' | 'next') => {
    const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setDateRange(prev => ({
      start: new Date(prev.start.getTime() + (direction === 'prev' ? -days : days) * 24 * 60 * 60 * 1000),
      end: new Date(prev.end.getTime() + (direction === 'prev' ? -days : days) * 24 * 60 * 60 * 1000)
    }));
  };

  const generateDateColumns = () => {
    const columns = [];
    const currentDate = new Date(dateRange.start);
    
    while (currentDate <= dateRange.end) {
      columns.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return columns;
  };

  const handleDateHover = (date: Date, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredDate(date);
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
  };

  const handleButtonHover = (date: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    setHoveredButton(date);
    const rect = (event.target as HTMLButtonElement).getBoundingClientRect();
    setButtonPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 5
    });
  };

  const handleButtonLeave = () => {
    setHoveredButton(null);
  };

  const handlePlusButtonClick = (date: Date) => {
    setSelectedDate(date);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setSelectedDate(null);
    // Reset form fields
    setSelectedProject('');
    setTaskName('');
    setDescription('');
    setTaskList('');
    setAssociatedTeam('');
    setWorkHours('8:00');
    setStartDate('09-05-2025');
    setDueDate('09-05-2025');
    setPriority('');
    setTags('');
    setReminder('');
    setRecurrence('');
    setBillingType('');
    setOwner('Inkhub Tattoos');
    setAttachments([]);
    setIsOwnerDropdownOpen(false);
    setIsWorkHoursDropdownOpen(false);
    setIsTagsDropdownOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 10 - attachments.length);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeOwner = () => {
    setOwner('');
  };

  const handleSubmitTask = () => {
    // Here you would typically submit the task data to your API
    console.log('Task submitted:', {
      project: selectedProject,
      taskName,
      description,
      taskList,
      associatedTeam,
      workHours,
      startDate,
      dueDate,
      priority,
      tags,
      reminder,
      recurrence,
      billingType,
      owner,
      attachments: attachments.map(f => f.name)
    });
    handleCloseTaskForm();
  };

  const dateColumns = generateDateColumns();

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-blue-600">Workload Report</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-lg font-semibold text-gray-600">Task Owner</span>
              </div>
            </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
                <button 
              onClick={() => navigateDateRange('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
                </button>
            <span className="text-sm font-medium text-gray-900 min-w-[200px] text-center">
              {dateRange.start.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} to {dateRange.end.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
                <button 
              onClick={() => navigateDateRange('next')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
                </button>
              </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-600">Heatmap</span>
            <Filter className="h-4 w-4 text-gray-600" />
          </div>
        </div>
              </div>
              
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">

          {/* Main Calendar Grid */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Calendar Header */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex">
                <div className="p-4 bg-yellow-50">
                  <div className="text-sm font-medium text-gray-700">Sep 1-Sep 30</div>
                  <div className="text-xs text-gray-500">176 hours</div>
                    </div>
                <div className="flex-1 overflow-x-auto">
                  <div className="flex min-w-max">
                    {dateColumns.map((date, index) => {
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      
                      return (
                        <div
                          key={`header-${index}`}
                          className={`w-16 p-2 text-center border-r border-gray-200 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}
                        >
                          <div className={`text-xs font-medium ${
                            isWeekend ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
            </div>
                          <div className="text-sm font-bold text-gray-900">
                            {date.getDate()}
                      </div>
                    </div>
                      );
                    })}
                    </div>
          </div>
        </div>
      </div>

            {/* Calendar Body - Gantt Chart */}
            <div className="flex-1 overflow-hidden">
              <div className="flex">
                <div className="border-r border-gray-200">
                  {/* Inkhub Tattoos Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Inkhub Tattoos</span>
                </div>
                    </div>
                </div>

                  {/* IN-1 Explore Zoho Projects Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">IN</div>
                        <span className="text-sm font-medium text-gray-900">IN-1 Explore Zoho Projects 2</span>
                </div>
              </div>
            </div>

                  {/* EZ1-T1 Task 1 Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">EZ</div>
                        <span className="text-sm font-medium text-gray-900">EZ1-T1 Task 1</span>
                  </div>
                    </div>
                </div>

                  {/* EZ1-T3 Task 3 Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">EZ</div>
                        <span className="text-sm font-medium text-gray-900">EZ1-T3 Task 3</span>
                      </div>
                    </div>
                  </div>
                    </div>

                <div className="flex-1 overflow-x-auto">
                  <div className="flex min-w-max">
                    {dateColumns.map((date, index) => {
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      
                      return (
                        <div 
                          key={`column-${index}`} 
                          className="w-16 border-r border-gray-200 relative"
                          onMouseEnter={(e) => handleDateHover(date, e)}
                          onMouseLeave={handleDateLeave}
                        >
                          {/* Add Task Button */}
                          <div className="absolute top-1 right-1 z-10">
                          <button
                              className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-700 transition-colors"
                              onMouseEnter={(e) => handleButtonHover(date, e)}
                              onMouseLeave={handleButtonLeave}
                              onClick={() => handlePlusButtonClick(date)}
                            >
                              <Plus className="h-3 w-3" />
                          </button>
                      </div>

                          {/* Inkhub Tattoos Bar */}
                          <div className={`h-20 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                    </div>
                          
                          {/* IN-1 Explore Zoho Projects Bar */}
                          <div className={`h-20 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                  </div>

                          {/* EZ1-T1 Task 1 Bar */}
                          <div className={`h-20 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                    </div>

                          {/* EZ1-T3 Task 3 Bar */}
                          <div className={`h-20 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                        </div>
                    </div>
                    );
                  })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          {/* Right Sidebar with toolbar icons */}
          <div className="w-16 border-l border-gray-200 bg-white flex flex-col items-center py-4 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
              <span className="text-xs text-gray-600">Heatmap</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>

            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <Filter className="h-4 w-4 text-gray-600" />
                      </div>

            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <MoreVertical className="h-4 w-4 text-gray-600" />
                    </div>
                
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-gray-600" />
                  </div>

            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <List className="h-4 w-4 text-gray-600" />
          </div>
                      </div>
                    </div>
                  </div>

      {/* Hover Tooltip */}
      {hoveredDate && (
        <div 
          className="fixed z-50 bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x - 30,
            top: tooltipPosition.y - 30,
            transform: 'translateX(-50%)'
          }}
        >
          Add Task
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                      </div>
      )}

      {/* Button Hover Dropdown */}
      {hoveredButton && (
        <div 
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 pointer-events-none"
          style={{
            left: buttonPosition.x - 120,
            top: buttonPosition.y,
            transform: 'translateX(-50%)',
            minWidth: '240px'
          }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Unassigned User</span>
                    </div>
          
          <div className="space-y-2 mb-3">
            <div className="text-sm text-gray-600 mb-2">Select a project to assign task:</div>
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-900">{project.name}</span>
                  </div>
            ))}
            {projects.length > 3 && (
              <div className="text-xs text-gray-500">
                +{projects.length - 3} more projects
                </div>
            )}
              </div>

          <div className="border-t border-gray-100 pt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Projects:</span>
              <span className="text-sm font-medium text-gray-900">{projects.length}</span>
                  </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time Period:</span>
              <span className="text-sm font-medium text-gray-900">01 Sep 2025 - 30 Sep 2025</span>
            </div>
                </div>

          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Click to assign task</span>
                          </div>
                        </div>
      )}


      {/* Task Form Slide-in Panel */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop with Blur (no dark overlay) */}
          <div 
            className="absolute inset-0 backdrop-blur-[2px] bg-transparent"
            onClick={handleCloseTaskForm}
          ></div>
          
          {/* Form Panel */}
          <div className="relative bg-white w-[720px] h-full shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Assign Task</h2>
              <button
                    onClick={handleCloseTaskForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                       </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'new'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    New Task
              </button>
                  <button
                    onClick={() => setActiveTab('existing')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'existing'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Existing Task
                </button>
                    </div>
                  </div>

              {/* Form Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Project Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project <span className="text-red-500">*</span>
                    </label>
                      <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                      </select>
                </div>

                  {/* Task Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Name <span className="text-red-500">*</span>
                  </label>
                    <input
                      type="text"
                      placeholder="Enter task name"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
              </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Description
                    </label>
                    
                    {/* Rich Text Editor Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2">
                            <div className="flex flex-wrap gap-1">
                        {/* Text Formatting */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Bold className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Italic className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Underline className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Strikethrough className="h-4 w-4" />
                </button>

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Font & Size */}
                        <select className="text-xs px-2 py-1 border border-gray-300 rounded">
                          <option>Puvi</option>
                        </select>
                        <select className="text-xs px-2 py-1 border border-gray-300 rounded">
                          <option>13</option>
                        </select>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Colors */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Type className="h-4 w-4" />
                  </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Type className="h-4 w-4" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Alignment */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <AlignLeft className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <AlignCenter className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <AlignRight className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <AlignJustify className="h-4 w-4" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Lists */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <ListIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <ListOrdered className="h-4 w-4" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Indentation */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <IndentDecrease className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <IndentIncrease className="h-4 w-4" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Special Formatting */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Superscript className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Subscript className="h-4 w-4" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Media & Links */}
                        <button className="p-1 hover:bg-gray-200 rounded" title="Insert image">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <Image className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Link className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Code className="h-4 w-4" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        {/* Other Tools */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Type className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Maximize2 className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Sun className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <span className="text-xs font-bold">Za</span>
                  </button>
                </div>
              </div>
                    
                    {/* Text Area */}
                    <textarea
                      placeholder="Add description..."
                      rows={8}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
          </div>

                  {/* Additional fields when project is selected */}
                  {selectedProject && (
                    <>
                      {/* Task List */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task List
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={taskList}
                          onChange={(e) => setTaskList(e.target.value)}
                        >
                          <option value="">General (General)</option>
                          <option value="list1">Development Tasks</option>
                          <option value="list2">Design Tasks</option>
                          <option value="list3">Testing Tasks</option>
                        </select>
        </div>

                      {/* Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attachments
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-gray-500">
                              <p className="text-sm">Drop files or add attachments here...</p>
                              <p className="text-xs text-gray-400 mt-1">Maximum 10 files</p>
                            </div>
                          </label>
                        </div>
                        {attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700">{file.name}</span>
              <button
                                  onClick={() => removeAttachment(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
              </button>
                              </div>
            ))}
          </div>
                        )}
        </div>

                      {/* Task Information Section */}
              <div>
                        <div 
                          className="flex items-center space-x-2 mb-3 cursor-pointer"
                          onClick={() => setIsTaskInfoExpanded(!isTaskInfoExpanded)}
                        >
                          <ChevronDown 
                            className={`h-4 w-4 text-gray-500 transition-transform ${
                              isTaskInfoExpanded ? 'rotate-0' : '-rotate-90'
                            }`} 
                          />
                          <label className="text-sm font-medium text-gray-700">
                            Task Information
                          </label>
                        </div>
                        
                        {isTaskInfoExpanded && (
                          <div className="space-y-4 pl-6">
                          {/* Associated Team */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Associated Team
                            </label>
                            <select 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={associatedTeam}
                              onChange={(e) => setAssociatedTeam(e.target.value)}
                            >
                              <option value="">Select</option>
                              <option value="team1">Development Team</option>
                              <option value="team2">Design Team</option>
                              <option value="team3">QA Team</option>
                            </select>
                        </div>

                          {/* Owner */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Owner
                            </label>
                            <div className="relative" ref={ownerDropdownRef}>
                              {owner ? (
                                <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm w-fit">
                                  <span>{owner}</span>
                                  <button 
                                    onClick={removeOwner}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                            </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Select owner"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onFocus={() => setIsOwnerDropdownOpen(true)}
                                  />
                                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          )}
                              {isOwnerDropdownOpen && !owner && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                  <div className="p-2">
                                    <div 
                                      className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                      onClick={() => {
                                        setOwner('Inkhub Tattoos');
                                        setIsOwnerDropdownOpen(false);
                                      }}
                                    >
                                      Inkhub Tattoos
                        </div>
                                    <div 
                                      className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                      onClick={() => {
                                        setOwner('Development Team');
                                        setIsOwnerDropdownOpen(false);
                                      }}
                                    >
                                      Development Team
                      </div>
                                    <div 
                                      className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                      onClick={() => {
                                        setOwner('Design Team');
                                        setIsOwnerDropdownOpen(false);
                                      }}
                                    >
                                      Design Team
                </div>
              </div>
            </div>
          )}
                            </div>
                          </div>

                          {/* Work Hours */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Work Hours
                            </label>
                            <div className="relative" ref={workHoursDropdownRef}>
                              <input
                                type="text"
                                value={workHours}
                                onChange={(e) => setWorkHours(e.target.value)}
                                onFocus={() => setIsWorkHoursDropdownOpen(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              {isWorkHoursDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                  <div className="p-2">
                                    {['1:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00'].map((hour) => (
                                      <div 
                                        key={hour}
                                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        onClick={() => {
                                          setWorkHours(hour);
                                          setIsWorkHoursDropdownOpen(false);
                                        }}
                                      >
                                        {hour}
                                      </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                          {/* Start Date and Due Date in same row */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
              </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
                              </label>
                              <div className="flex items-center space-x-2">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                                <button className="text-blue-600 text-sm hover:text-blue-800 whitespace-nowrap">
                                  Enter Duration
                                </button>
                  </div>
                  </div>
                </div>
                
                          {/* Priority */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Priority
                            </label>
                            <select 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={priority}
                              onChange={(e) => setPriority(e.target.value)}
                            >
                              <option value="">None</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                    </div>
                
                          {/* Tags */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tags
                            </label>
                            <div className="relative" ref={tagsDropdownRef}>
                              <input
                                type="text"
                                placeholder="Enter a tag name"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                onFocus={() => setIsTagsDropdownOpen(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              {isTagsDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                  <div className="p-2">
                                    {['Frontend', 'Backend', 'Design', 'Testing', 'Documentation', 'Bug Fix', 'Feature'].map((tag) => (
                                      <div 
                                        key={tag}
                                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        onClick={() => {
                                          setTags(tag);
                                          setIsTagsDropdownOpen(false);
                                        }}
                                      >
                                        {tag}
                  </div>
                                    ))}
                  </div>
                </div>
                              )}
                    </div>
                  </div>

                          {/* Reminder and Recurrence in same row */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reminder
                              </label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={reminder}
                                onChange={(e) => setReminder(e.target.value)}
                              >
                                <option value="">Select reminder</option>
                                <option value="15min">15 minutes before</option>
                                <option value="1hour">1 hour before</option>
                                <option value="1day">1 day before</option>
                              </select>
                </div>
                
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recurrence
                              </label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={recurrence}
                                onChange={(e) => setRecurrence(e.target.value)}
                              >
                                <option value="">Select recurrence</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                    </div>
                  </div>
                
                          {/* Billing Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Billing Type
                            </label>
                            <select 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={billingType}
                              onChange={(e) => setBillingType(e.target.value)}
                            >
                              <option value="">None</option>
                              <option value="hourly">Hourly</option>
                              <option value="fixed">Fixed Price</option>
                              <option value="milestone">Milestone</option>
                            </select>
                  </div>
                </div>
                        )}
              </div>
                    </>
          )}
        </div>
      </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                <button
                    onClick={handleSubmitTask}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => {
                      handleSubmitTask();
                      // Keep form open for adding more tasks
                      setShowTaskForm(true);
                    }}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Add More
                  </button>
                  <button 
                    onClick={handleCloseTaskForm}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Cancel
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 




