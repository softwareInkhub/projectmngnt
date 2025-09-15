'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Download, X, ChevronLeft, ChevronRight, Users, FolderOpen, CheckSquare, UserPlus, Link } from 'lucide-react';
import { ProjectApiService } from '../utils/projectApi';
import { TaskApiService } from '../utils/taskApi';
import { TeamApiService } from '../utils/teamApi';

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
  const [events, setEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    endTime: '',
    type: 'meeting',
    priority: 'medium',
    location: '',
    attendees: '',
    description: '',
    recurring: 'none',
    reminder: 'none',
    allDay: false,
    sendNotifications: false,
    projectId: '',
    taskId: '',
    teamId: '',
    assignedMembers: [] as string[]
  });

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch projects, tasks, teams, and existing calendar events
      const [projectsRes, tasksRes, teamsRes, eventsData] = await Promise.all([
        ProjectApiService.getProjects(),
        TaskApiService.getTasks(),
        TeamApiService.getTeams(),
        fetchCalendarEvents()
      ]);

      // Handle projects response
      if (projectsRes.success) {
        const projectsData = projectsRes.items || projectsRes.data || [];
        console.log('📁 Projects fetched for calendar:', projectsData);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } else {
        console.error('Failed to fetch projects:', projectsRes.error);
        setProjects([]);
      }

      // Handle tasks response
      if (tasksRes.success) {
        const tasksData = tasksRes.data || [];
        console.log('✅ Tasks fetched for calendar:', tasksData);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } else {
        console.error('Failed to fetch tasks:', tasksRes.error);
        setTasks([]);
      }

      // Handle teams response
      if (teamsRes.success) {
        const teamsData = teamsRes.items || teamsRes.data || [];
        console.log('👥 Teams fetched for calendar:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        
        // Extract team members from teams
        const teamsArray = Array.isArray(teamsData) ? teamsData : [];
        const allMembers = teamsArray.flatMap(team => {
          try {
            // Ensure team has members property and it's a TeamData object
            if (team && typeof team === 'object' && 'members' in team) {
              const members = typeof team.members === 'string' ? JSON.parse(team.members) : team.members;
              return Array.isArray(members) ? members : [];
            }
            return [];
          } catch (error) {
            console.warn('Error parsing team members:', error);
            return [];
          }
        });
        console.log('👤 Team members extracted:', allMembers);
        setTeamMembers(allMembers);
      } else {
        console.error('Failed to fetch teams:', teamsRes.error);
        setTeams([]);
        setTeamMembers([]);
      }

      // Set calendar events
      setEvents(eventsData || []);
      
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setError('Failed to load calendar data');
      setProjects([]);
      setTasks([]);
      setTeams([]);
      setTeamMembers([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchCalendarEvents = async () => {
    try {
      // This would typically fetch from your calendar API
      // For now, return sample events that could be linked to projects/tasks
      return [
        {
          id: "sample-event-1",
          title: "Project Review Meeting",
          date: new Date(2024, 11, 15),
          time: "10:00 AM",
          endTime: "11:00 AM",
          type: "meeting",
          priority: "high",
          description: "Weekly project review and planning session",
          projectId: "proj-1",
          taskId: "task-1",
          teamId: "team-1",
          assignedMembers: ["user-1", "user-2"],
          location: "Conference Room A",
          attendees: "john@company.com, jane@company.com"
        }
      ];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleExport = () => {
    // Create a CSV export of all events
    const csvContent = [
      ['Title', 'Date', 'Time', 'Type', 'Description'],
      ...events.map(event => [
        event.title,
        event.date.toLocaleDateString(),
        event.time,
        event.type,
        event.description
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-events-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAddEvent = () => {
    setShowInlineForm(true);
  };

  const handleCloseModals = () => {
    setShowDayModal(false);
    setShowEventModal(false);
    setShowInlineForm(false);
    setSelectedDate(null);
    setNewEvent({
      title: '',
      time: '',
      endTime: '',
      type: 'meeting',
      priority: 'medium',
      location: '',
      attendees: '',
      description: '',
      recurring: 'none',
      reminder: 'none',
      allDay: false,
      sendNotifications: false,
      projectId: '',
      taskId: '',
      teamId: '',
      assignedMembers: []
    });
  };

  const handleCreateEvent = async () => {
    if (newEvent.title.trim()) {
      try {
        const event = {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: newEvent.title,
          date: selectedDate || new Date(),
          time: newEvent.time,
          endTime: newEvent.endTime,
          type: newEvent.type,
          priority: newEvent.priority,
          description: newEvent.description,
          location: newEvent.location,
          attendees: newEvent.attendees,
          projectId: newEvent.projectId,
          taskId: newEvent.taskId,
          teamId: newEvent.teamId,
          assignedMembers: newEvent.assignedMembers,
          recurring: newEvent.recurring,
          reminder: newEvent.reminder,
          allDay: newEvent.allDay,
          sendNotifications: newEvent.sendNotifications
        };

        // Save to database (you would implement this API call)
        await saveEventToDatabase(event);
        
        // Update local state (prevent duplicates)
        setEvents(prevEvents => {
          const exists = prevEvents.some(e => e.id === event.id);
          if (exists) {
            console.warn('Event with ID already exists:', event.id);
            return prevEvents;
          }
          return [...prevEvents, event];
        });
        
        // Show success message
        console.log('Event created successfully:', event);
        
        handleCloseModals();
      } catch (error) {
        console.error('Error creating event:', error);
        setError('Failed to create event');
      }
    }
  };

  const saveEventToDatabase = async (event: any) => {
    try {
      // This would be your actual API call to save the event
      // For now, we'll simulate the API call
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving event to database:', error);
      // For now, we'll just log the error and continue
      // In a real app, you might want to show a user-friendly error message
    }
  };

  if (!open) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
              </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
            <p className="text-sm text-slate-600">Manage your schedule and events</p>
            </div>
        </div>
         <div className="flex items-center gap-3">
           <button
             onClick={fetchAllData}
             disabled={loading}
             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
           >
             <Calendar className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             {loading ? 'Loading...' : 'Refresh'}
           </button>
           <button
             onClick={handleExport}
             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
           >
             <Download className="w-4 h-4" />
             Export
           </button>
           <button
             onClick={handleAddEvent}
             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
           >
             <Plus className="w-4 h-4" />
             Add Event
           </button>
         </div>
            </div>
            
       {/* Data Summary */}
       {!loading && (projects.length > 0 || tasks.length > 0 || teams.length > 0) && (
         <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
           <div className="flex items-center gap-4 text-sm text-slate-600">
             <span className="flex items-center gap-1">
               <FolderOpen className="w-4 h-4" />
               {projects.length} Projects
             </span>
             <span className="flex items-center gap-1">
               <CheckSquare className="w-4 h-4" />
               {tasks.length} Tasks
             </span>
             <span className="flex items-center gap-1">
               <Users className="w-4 h-4" />
               {teams.length} Teams
             </span>
             <span className="flex items-center gap-1">
               <UserPlus className="w-4 h-4" />
               {teamMembers.length} Members
             </span>
           </div>
         </div>
       )}

       {/* View Mode Selector */}
       <div className="p-4 border-b border-neutral-200">
         <div className="flex items-center gap-2">
                <button 
             onClick={() => setViewMode('month')}
             className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
               viewMode === 'month' 
                 ? 'text-white bg-blue-600' 
                 : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
             }`}
           >
             Month
                </button>
                <button 
             onClick={() => setViewMode('week')}
             className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
               viewMode === 'week' 
                 ? 'text-white bg-blue-600' 
                 : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
             }`}
           >
             Week
                </button>
              <button 
             onClick={() => setViewMode('day')}
             className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
               viewMode === 'day' 
                 ? 'text-white bg-blue-600' 
                 : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
             }`}
           >
             Day
              </button>
              <button
             onClick={() => setViewMode('agenda')}
             className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
               viewMode === 'agenda' 
                 ? 'text-white bg-blue-600' 
                 : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
             }`}
           >
             Agenda
              </button>
            </div>
          </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading calendar...</p>
        </div>
      </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-2">Error loading calendar</p>
              <p className="text-slate-600 text-sm">{error}</p>
              <button
                onClick={() => setLoading(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
         ) : (
           <div className="h-full p-6">
             {/* View Header */}
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold text-slate-900">
                 {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                 {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                 {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                 {viewMode === 'agenda' && 'Agenda View'}
               </h2>
               <div className="flex items-center gap-2">
              <button
                   onClick={() => {
                     if (viewMode === 'month') {
                       setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                     } else if (viewMode === 'week') {
                       setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
                     } else if (viewMode === 'day') {
                       setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
                     }
                   }}
                   className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button
                   onClick={() => setCurrentDate(new Date())}
                   className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                 >
                   Today
                 </button>
                 <button
                   onClick={() => {
                     if (viewMode === 'month') {
                       setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                     } else if (viewMode === 'week') {
                       setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                     } else if (viewMode === 'day') {
                       setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
                     }
                   }}
                   className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                 >
                   <ChevronRight className="w-5 h-5" />
              </button>
        </div>
      </div>

             {/* Inline Event Creation Form */}
             {showInlineForm && (
               <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-semibold text-slate-900">Create New Event</h3>
                   <button
                     onClick={handleCloseModals}
                     className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
            </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Event Title *</label>
                      <input
                        type="text"
                       value={newEvent.title}
                       onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Enter event title"
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                     <input
                       type="date"
                       value={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                       onChange={(e) => setSelectedDate(new Date(e.target.value))}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       required
                     />
                      </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                     <input
                       type="time"
                       value={newEvent.time}
                       onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                    <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                     <input
                       type="time"
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
                        <select
                       value={newEvent.type}
                       onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="meeting">Meeting</option>
                       <option value="deadline">Deadline</option>
                       <option value="presentation">Presentation</option>
                       <option value="appointment">Appointment</option>
                       <option value="reminder">Reminder</option>
                       <option value="other">Other</option>
                        </select>
              </div>

                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                     <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                       <option value="low">Low</option>
                       <option value="medium">Medium</option>
                       <option value="high">High</option>
                       <option value="urgent">Urgent</option>
                     </select>
                </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <input
                       type="text"
                       placeholder="Enter location or meeting link"
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Attendees</label>
                      <input
                       type="text"
                       placeholder="Enter attendee emails (comma separated)"
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                    </div>
                  </div>

                 {/* Project and Task Integration */}
                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                       <FolderOpen className="w-4 h-4 inline mr-1" />
                       Link to Project
                    </label>
                     <select 
                       value={newEvent.projectId}
                       onChange={(e) => setNewEvent({...newEvent, projectId: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       disabled={loading}
                     >
                       <option value="">
                         {loading ? 'Loading projects...' : 'Select a project (optional)'}
                       </option>
                       {projects.map(project => (
                         <option key={project.id} value={project.id}>
                           {project.name}
                         </option>
                       ))}
                     </select>
              </div>

                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">
                       <CheckSquare className="w-4 h-4 inline mr-1" />
                       Link to Task
                     </label>
                     <select 
                       value={newEvent.taskId}
                       onChange={(e) => setNewEvent({...newEvent, taskId: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       disabled={loading}
                     >
                       <option value="">
                         {loading ? 'Loading tasks...' : 'Select a task (optional)'}
                       </option>
                       {tasks.map(task => (
                         <option key={task.id} value={task.id}>
                           {task.title}
                         </option>
                       ))}
                     </select>
                  </div>
                </div>

                 {/* Team and Members Assignment */}
                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                       <Users className="w-4 h-4 inline mr-1" />
                       Assign Team
                    </label>
                     <select 
                       value={newEvent.teamId}
                       onChange={(e) => setNewEvent({...newEvent, teamId: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       disabled={loading}
                     >
                       <option value="">
                         {loading ? 'Loading teams...' : 'Select a team (optional)'}
                       </option>
                       {teams.map(team => (
                         <option key={`calendar-team-${team.id}`} value={team.id}>
                           {team.name}
                         </option>
                       ))}
                     </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                       <UserPlus className="w-4 h-4 inline mr-1" />
                       Assign Members
                    </label>
                     <select 
                       multiple
                       value={newEvent.assignedMembers}
                       onChange={(e) => {
                         const selectedMembers = Array.from(e.target.selectedOptions, option => option.value);
                         setNewEvent({...newEvent, assignedMembers: selectedMembers});
                       }}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                       disabled={loading}
                     >
                       {teamMembers.length === 0 && !loading ? (
                         <option disabled>No team members available</option>
                       ) : (
                         teamMembers.map(member => (
                           <option key={member.id || member.email} value={member.id || member.email}>
                             {member.name || member.email}
                           </option>
                         ))
                       )}
                     </select>
                     <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
                </div>
              </div>

                 <div className="mt-4">
                   <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                   <textarea
                     value={newEvent.description}
                     onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                     placeholder="Enter event description"
                     rows={3}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                   />
                </div>

                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Recurring</label>
                     <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                       <option value="none">No Recurrence</option>
                       <option value="daily">Daily</option>
                       <option value="weekly">Weekly</option>
                       <option value="monthly">Monthly</option>
                       <option value="yearly">Yearly</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Reminder</label>
                     <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                       <option value="none">No Reminder</option>
                       <option value="5min">5 minutes before</option>
                       <option value="15min">15 minutes before</option>
                       <option value="30min">30 minutes before</option>
                       <option value="1hour">1 hour before</option>
                       <option value="1day">1 day before</option>
                      </select>
                      </div>
                    </div>

                 <div className="mt-4">
                   <label className="flex items-center gap-2">
                     <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                     <span className="text-sm font-medium text-slate-700">All Day Event</span>
                   </label>
                </div>

                 <div className="mt-4">
                   <label className="flex items-center gap-2">
                     <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                     <span className="text-sm font-medium text-slate-700">Send notifications to attendees</span>
                  </label>
              </div>

                 <div className="flex gap-3 mt-6">
                <button
                     onClick={handleCloseModals}
                     className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                     Cancel
                </button>
                  <button
                     onClick={handleCreateEvent}
                     className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                     Create Event
                  </button>
          </div>
        </div>
      )}

             {/* Render Different Views */}
             {viewMode === 'month' && (
               <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
                {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                   <div key={day} className="bg-slate-50 p-3 text-center">
                     <span className="text-sm font-medium text-slate-600">{day}</span>
                    </div>
                  ))}

                {/* Calendar Days */}
                 {getDaysInMonth(currentDate).map((day, index) => {
                   if (!day) {
                     return <div key={`empty-${index}`} className="bg-white h-24"></div>;
                   }

                   const isToday = day.toDateString() === new Date().toDateString();
                   const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    
                    return (
                      <div 
                       key={day.toISOString()}
                       onClick={() => handleDayClick(day)}
                       className={`bg-white h-24 p-2 cursor-pointer hover:bg-slate-50 transition-colors ${
                         !isCurrentMonth ? 'text-slate-400' : ''
                       }`}
                     >
                       <div className="flex items-center justify-between mb-1">
                         <span className={`text-sm font-medium ${
                           isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                         }`}>
                           {day.getDate()}
                         </span>
                        </div>
                        <div className="space-y-1">
                           {/* Show events for this date */}
                           {getEventsForDate(day).slice(0, 2).map((event, eventIndex) => {
                             const project = projects.find(p => p.id === event.projectId);
                             const task = tasks.find(t => t.id === event.taskId);
                             
                             return (
                               <div key={`${event.id}-${eventIndex}`} className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{
                                      backgroundColor: event.type === 'meeting' ? '#dbeafe' : 
                                                     event.type === 'deadline' ? '#fecaca' :
                                                     event.type === 'presentation' ? '#dcfce7' :
                                                     event.priority === 'high' ? '#fef3c7' : '#e5e7eb',
                                      color: event.type === 'meeting' ? '#1e40af' : 
                                            event.type === 'deadline' ? '#dc2626' :
                                            event.type === 'presentation' ? '#16a34a' :
                                            event.priority === 'high' ? '#d97706' : '#374151'
                                    }}
                               >
                                 <div className="flex items-center gap-1">
                                   {event.projectId && <FolderOpen className="w-3 h-3" />}
                                   {event.taskId && <CheckSquare className="w-3 h-3" />}
                              <span className="truncate">{event.title}</span>
                            </div>
                                 {project && (
                                   <div className="text-xs opacity-75 truncate">
                                     📁 {project.name}
                            </div>
                          )}
                                 {task && (
                                   <div className="text-xs opacity-75 truncate">
                                     ✅ {task.title}
                        </div>
                                 )}
                      </div>
                    );
                  })}
                           {getEventsForDate(day).length > 2 && (
                             <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 truncate">
                               +{getEventsForDate(day).length - 2} more
            </div>
          )}
                            </div>
                          </div>
                    );
                  })}
            </div>
          )}

             {viewMode === 'week' && (
               <div className="bg-white rounded-lg border border-slate-200 p-4">
                 <div className="text-center py-12">
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Week View</h3>
                   <p className="text-slate-600">Week view is coming soon!</p>
                  </div>
                  </div>
          )}

             {viewMode === 'day' && (
               <div className="bg-white rounded-lg border border-slate-200 p-4">
                 <div className="text-center py-12">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Day View</h3>
                   <p className="text-slate-600">Day view is coming soon!</p>
                  </div>
                  </div>
          )}

             {viewMode === 'agenda' && (
               <div className="bg-white rounded-lg border border-slate-200 p-4">
                 <div className="text-center py-12">
                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Agenda View</h3>
                   <p className="text-slate-600">Agenda view is coming soon!</p>
                  </div>
                  </div>
          )}
            </div>
          )}
      </div>

      {/* Day Events Modal */}
      {showDayModal && selectedDate && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-50 p-4"
          style={{ 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          onClick={() => setShowDayModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden transform transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {getEventsForDate(selectedDate).length} event{getEventsForDate(selectedDate).length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
                <button
                  onClick={handleCloseModals}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
               {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                   {getEventsForDate(selectedDate).map((event, eventIndex) => {
                     const project = projects.find(p => p.id === event.projectId);
                     const task = tasks.find(t => t.id === event.taskId);
                     const team = teams.find(t => t.id === event.teamId);
                     
                     return (
                       <div key={`${event.id}-modal-${eventIndex}`} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">{event.title}</h4>
                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 event.priority === 'high' ? 'bg-red-100 text-red-800' :
                                 event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                 'bg-green-100 text-green-800'
                               }`}>
                                 {event.priority}
                                </span>
                            </div>
                             
                             <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                             
                             {/* Project and Task Links */}
                             {(project || task) && (
                               <div className="flex items-center gap-4 mb-3">
                                 {project && (
                                   <div className="flex items-center gap-1 text-sm text-blue-600">
                                     <FolderOpen className="w-4 h-4" />
                                     <span>Project: {project.name}</span>
                          </div>
                        )}
                                 {task && (
                                   <div className="flex items-center gap-1 text-sm text-green-600">
                                     <CheckSquare className="w-4 h-4" />
                                     <span>Task: {task.title}</span>
                      </div>
                                 )}
                               </div>
                             )}
                             
                             {/* Team and Members */}
                             {team && (
                               <div className="flex items-center gap-1 text-sm text-purple-600 mb-3">
                                 <Users className="w-4 h-4" />
                                 <span>Team: {team.name}</span>
                               </div>
                             )}
                             
                             <div className="flex items-center gap-4 text-sm text-slate-500">
                               <span className="flex items-center gap-1">
                                 <Calendar className="w-4 h-4" />
                                 {event.time} {event.endTime && `- ${event.endTime}`}
                               </span>
                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                                 event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                                 event.type === 'presentation' ? 'bg-green-100 text-green-800' :
                                 'bg-slate-100 text-slate-800'
                               }`}>
                        {event.type}
                      </span>
                               {event.location && (
                                 <span className="flex items-center gap-1">
                                   📍 {event.location}
                                 </span>
                               )}
                    </div>
                  </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-slate-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">No events scheduled</h4>
                  <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                    This day is free. Add an event to get started with your schedule.
                  </p>
                  </div>
                )}
              
               {/* Add Event Button */}
               <div className="mt-6 pt-6 border-t border-slate-200">
                 <button
                   onClick={handleAddEvent}
                   className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                 >
                   <Plus className="w-5 h-5" />
                   Add Event
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 
