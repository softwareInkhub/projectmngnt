'use client';

import React, { useState } from 'react';
import { BarChart3, ChevronLeft, ChevronRight, Search, Settings, User, Users2, ChevronDown, Filter, MoreVertical, Grid3X3, List, Calendar, Clock, Plus, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List as ListIcon, ListOrdered, IndentDecrease, IndentIncrease, Superscript, Subscript, Image, Link, Code, Type, Sun, Moon, Maximize2 } from 'lucide-react';

export default function CalendarPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 8, 1), // September 1, 2025
    end: new Date(2025, 8, 30)   // September 30, 2025
  });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState<Date | null>(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');

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
  };

  const dateColumns = generateDateColumns();

  return (
    <div className="h-full w-full bg-white flex flex-col">
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
          {/* Left Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Open</option>
                </select>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700">Clear filter</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-1">
                  {/* Unassigned User */}
                  <div 
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem('unassigned')}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">Unassigned User</span>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded"></div>
                  </div>

                  {/* Inkhub Tattoos */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                        <Users2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-900">Inkhub Tattoos (2)</span>
                      </div>
                      <div className="w-16 h-2 bg-green-400 rounded"></div>
                    </div>
                    
                    {/* IN-1 Explore Zoho Projects */}
                    <div className="ml-6 space-y-1">
                      <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-2">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                          <div className="w-4 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">IN</div>
                          <span className="text-sm text-gray-900">IN-1 Explore Zoho Projects 2</span>
                        </div>
                        <div className="w-16 h-2 bg-green-400 rounded"></div>
                      </div>
                      
                      {/* Tasks */}
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">EZ</div>
                            <span className="text-sm text-gray-900">EZ1-T1 Task 1</span>
                          </div>
                          <div className="w-16 h-2 bg-gray-200 rounded"></div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">EZ</div>
                            <span className="text-sm text-gray-900">EZ1-T3 Task 3</span>
                          </div>
                          <div className="w-16 h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar Grid */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Calendar Header */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex">
                <div className="w-80 p-4 border-r border-gray-200 bg-yellow-50">
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
            <div className="flex-1 overflow-auto">
              <div className="flex">
                <div className="w-80 border-r border-gray-200">
                  {/* Inkhub Tattoos Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Inkhub Tattoos</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* IN-1 Explore Zoho Projects Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">IN</div>
                        <span className="text-sm font-medium text-gray-900">IN-1 Explore Zoho Projects 2</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* EZ1-T1 Task 1 Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">EZ</div>
                        <span className="text-sm font-medium text-gray-900">EZ1-T1 Task 1</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* EZ1-T3 Task 3 Row */}
                  <div className="border-b border-gray-100">
                    <div className="p-4">
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
                          <div className={`h-16 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                          </div>
                          
                          {/* IN-1 Explore Zoho Projects Bar */}
                          <div className={`h-16 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                          </div>
                          
                          {/* EZ1-T1 Task 1 Bar */}
                          <div className={`h-16 border-b border-gray-100 ${
                            isWeekend ? 'bg-blue-50' : 'bg-white'
                          }`}>
                          </div>
                          
                          {/* EZ1-T3 Task 3 Bar */}
                          <div className={`h-16 border-b border-gray-100 ${
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

          {/* Right Sidebar */}
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
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Availability:</span>
              <span className="text-sm font-medium text-gray-900">100% 8h 00m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Work Hours Assig...:</span>
              <span className="text-sm font-medium text-gray-900">0% 0h 00m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Free time:</span>
              <span className="text-sm font-medium text-gray-900">100% 8h 00m</span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Business Hours:</span>
              <span className="text-sm font-medium text-blue-600">Standard Business Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time Period:</span>
              <span className="text-sm font-medium text-gray-900">01 Sep 2025 - 30 Sep 2025</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Unallocated</span>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Unassigned User</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Availability:</span>
                <span className="text-sm font-medium text-gray-900">100% 8h 00m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Work Hours Assig...:</span>
                <span className="text-sm font-medium text-gray-900">0% 0h 00m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Free time:</span>
                <span className="text-sm font-medium text-gray-900">100% 8h 00m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Hours:</span>
                <span className="text-sm font-medium text-blue-600 cursor-pointer">Standard Business Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time Period:</span>
                <span className="text-sm font-medium text-gray-900">01 Sep 2025 - 30 Sep 2025</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Unallocated</span>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Slide-in Panel */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop with Blur */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-10"
            onClick={handleCloseTaskForm}
          ></div>
          
          {/* Form Panel */}
          <div className="relative bg-white w-96 h-full shadow-2xl transform transition-transform duration-300 ease-in-out">
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
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Project</option>
                      <option value="project1">Inkhub Tattoos</option>
                      <option value="project2">IN-1 Explore Zoho Projects 2</option>
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
                      className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Add
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium">
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
