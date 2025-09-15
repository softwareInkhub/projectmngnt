"use client";
import { useState, useEffect, useCallback } from "react";
import { X, Edit, Trash2, Calendar, Users, Target, Building, CheckSquare, Clock, AlertCircle, Star, TrendingUp, BarChart3, User, Mail, Phone, MapPin, Globe, Briefcase, Tag, FileText, Activity, Award, Shield, Zap, Copy, Download, Share2, MoreVertical, Eye, EyeOff } from "lucide-react";
import { ProjectApiService, ProjectData } from "../utils/projectApi";
import { TaskApiService, TaskData, transformTaskToUI, TaskWithUI } from "../utils/taskApi";
import { TeamApiService, TeamData, transformTeamToUI, TeamWithUI } from "../utils/teamApi";
import { CompanyApiService, CompanyData } from "../utils/companyApi";

// Helper function to safely parse project tasks
const parseProjectTasks = (tasksString: string | number | undefined): string[] => {
  if (!tasksString) return [];
  if (typeof tasksString === 'number') return []; // Handle legacy number format
  if (typeof tasksString !== 'string') return [];
  
  try {
    const parsed = JSON.parse(tasksString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse project tasks:', error);
    return [];
  }
};

interface UniversalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'project' | 'task' | 'team' | 'company';
  itemId: string;
}

const getInitials = (name: string) => {
  if (!name) return "";
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
};

export default function UniversalDetailsModal({ isOpen, onClose, itemType, itemId }: UniversalDetailsModalProps) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [showRawData, setShowRawData] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRelatedItems = useCallback(async (itemData: any) => {
    try {
      switch (itemType) {
        case 'project':
          // Fetch project tasks from the project's task list
          console.log('🔍 UniversalDetailsModal: Fetching tasks for project:', itemData.id, itemData.name);
          console.log('🔍 Project tasks field:', itemData.tasks);
          
          const tasksResponse = await TaskApiService.getTasks();
          console.log('🔍 All tasks from API:', tasksResponse.data?.length || 0, 'tasks');
          
          if (tasksResponse.success && tasksResponse.data) {
            let projectTasks = [];
            
            // First, try to get tasks from the project's tasks field (JSON array of task IDs)
            const taskIds = parseProjectTasks(itemData.tasks);
            console.log('🔍 Parsed task IDs:', taskIds);
            
            if (taskIds.length > 0) {
              projectTasks = (tasksResponse.data as any[]).filter((task: any) => 
                task.id && taskIds.includes(task.id)
              );
              console.log('🔍 Tasks found by ID match:', projectTasks.length);
            }
            
            // Fallback: if no tasks found in project's task list, use the old filtering method
            if (projectTasks.length === 0) {
              projectTasks = (tasksResponse.data as any[]).filter((task: any) => 
                task.project === itemData.id || 
                task.project === itemData.name ||
                task.projectId === itemData.id ||
                task.projectId === itemData.name
              );
              console.log('🔍 Tasks found by project field match:', projectTasks.length);
            }
            
            console.log('🔍 Final project tasks to display:', projectTasks.length);
            setRelatedItems(projectTasks);
          }
          break;
        case 'team':
          // Fetch team tasks
          const teamTasksResponse = await TaskApiService.getTasks();
          if (teamTasksResponse.success && teamTasksResponse.data) {
            const teamTasks = (teamTasksResponse.data as any[]).filter((task: any) => 
              task.assignee && itemData.members && itemData.members.includes(task.assignee)
            );
            setRelatedItems(teamTasks);
          }
          break;
        case 'company':
          // Fetch company projects and teams
          const [projectsResponse, teamsResponse] = await Promise.all([
            ProjectApiService.getProjects(),
            TeamApiService.getTeams()
          ]);
          
          const companyProjects = projectsResponse.success ? 
            (projectsResponse.data as any[]).filter((project: any) => 
              project.company === itemData.id || project.company === itemData.name
            ) : [];
            
          const companyTeams = teamsResponse.success ? 
            (teamsResponse.data as any[]).filter((team: any) => 
              team.company === itemData.id || team.company === itemData.name
            ) : [];
            
          setRelatedItems([...companyProjects, ...companyTeams]);
          break;
      }
    } catch (err) {
      console.error('Error fetching related items:', err);
    }
  }, [itemType]);

  const fetchItem = useCallback(async () => {
    if (!itemId || !isOpen) return;

    try {
      setLoading(true);
      setError(null);

      let response;
      switch (itemType) {
        case 'project':
          console.log('🔍 UniversalDetailsModal: Fetching project data for ID:', itemId);
          response = await ProjectApiService.getProject(itemId);
          console.log('🔍 Project data fetched:', response);
          break;
        case 'task':
          response = await TaskApiService.getTaskById(itemId);
          break;
        case 'team':
          response = await TeamApiService.getTeam(itemId);
          break;
        case 'company':
          response = await CompanyApiService.getCompany(itemId);
          break;
        default:
          throw new Error('Invalid item type');
      }

      if (response.success) {
        let itemData = response.data || (response as any).item;
        
        if (itemType === 'task' && itemData) {
          itemData = transformTaskToUI(itemData);
        } else if (itemType === 'team' && itemData) {
          itemData = transformTeamToUI(itemData);
        }
        
        setItem(itemData);
        
        // Fetch related items
        await fetchRelatedItems(itemData);
      } else {
        throw new Error(response.error || 'Failed to fetch item');
      }
    } catch (err) {
      console.error(`Error fetching ${itemType}:`, err);
      setError(`Failed to fetch ${itemType} details`);
    } finally {
      setLoading(false);
    }
  }, [itemId, itemType, isOpen, fetchRelatedItems]);

  useEffect(() => {
    if (isOpen) {
      fetchItem();
    }
  }, [isOpen, fetchItem]);

  if (!isOpen) return null;

  const renderOverview = () => {
    if (!item) return null;

    switch (itemType) {
      case 'project':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Project Information</h4>
                <div className="space-y-2">
                  <div><span className="font-medium text-blue-800">Status:</span> <span className="text-blue-700">{item.status || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Priority:</span> <span className="text-blue-700">{item.priority || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Start Date:</span> <span className="text-blue-700">{item.startDate || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">End Date:</span> <span className="text-blue-700">{item.endDate || 'N/A'}</span></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Progress</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                      <span>Overall Progress</span>
                      <span>{item.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress || 0}%` }}></div>
                    </div>
                  </div>
                  <div><span className="font-medium text-blue-800">Tasks Completed:</span> <span className="text-blue-700">{item.tasksCompleted || 0}</span></div>
                  <div><span className="font-medium text-blue-800">Total Tasks:</span> <span className="text-blue-700">{item.totalTasks || 0}</span></div>
                </div>
              </div>
            </div>
            
            {item.description && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Description</h4>
                <p className="text-blue-700">{item.description}</p>
              </div>
            )}
          </div>
        );

      case 'task':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Task Information</h4>
                <div className="space-y-2">
                  <div><span className="font-medium text-blue-800">Status:</span> <span className="text-blue-700">{item.status || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Priority:</span> <span className="text-blue-700">{item.priority || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Assignee:</span> <span className="text-blue-700">{item.assignee || 'Unassigned'}</span></div>
                  <div><span className="font-medium text-blue-800">Due Date:</span> <span className="text-blue-700">{item.dueDate || 'No date'}</span></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Progress</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                      <span>Task Progress</span>
                      <span>{item.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress || 0}%` }}></div>
                    </div>
                  </div>
                  <div><span className="font-medium text-blue-800">Project:</span> <span className="text-blue-700">{item.project || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Estimated Hours:</span> <span className="text-blue-700">{item.estimatedHours || 'N/A'}</span></div>
                </div>
              </div>
            </div>
            
            {item.description && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Description</h4>
                <p className="text-blue-700">{item.description}</p>
              </div>
            )}
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Team Information</h4>
                <div className="space-y-2">
                  <div><span className="font-medium text-blue-800">Status:</span> <span className="text-blue-700">{item.status || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Health:</span> <span className="text-blue-700">{item.health || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Performance:</span> <span className="text-blue-700">{item.performance || 0}%</span></div>
                  <div><span className="font-medium text-blue-800">Members:</span> <span className="text-blue-700">{Array.isArray(item.members) ? item.members.length : 0}</span></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Performance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                      <span>Team Performance</span>
                      <span>{item.performance || 0}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.performance || 0}%` }}></div>
                    </div>
                  </div>
                  <div><span className="font-medium text-blue-800">Velocity:</span> <span className="text-blue-700">{item.velocity || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Budget:</span> <span className="text-blue-700">{item.budget || 'N/A'}</span></div>
                </div>
              </div>
            </div>
            
            {item.description && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Description</h4>
                <p className="text-blue-700">{item.description}</p>
              </div>
            )}
            
            {item.members && Array.isArray(item.members) && item.members.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Team Members</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.members.map((member: string, index: number) => (
                    <div key={`member-${index}`} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-blue-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(member)}
                      </div>
                      <span className="text-blue-800 font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Company Information</h4>
                <div className="space-y-2">
                  <div><span className="font-medium text-blue-800">Status:</span> <span className="text-blue-700">{item.status || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Industry:</span> <span className="text-blue-700">{item.industry || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Size:</span> <span className="text-blue-700">{item.size || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Location:</span> <span className="text-blue-700">{item.location || 'N/A'}</span></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div><span className="font-medium text-blue-800">Email:</span> <span className="text-blue-700">{item.email || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Phone:</span> <span className="text-blue-700">{item.phone || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Website:</span> <span className="text-blue-700">{item.website || 'N/A'}</span></div>
                  <div><span className="font-medium text-blue-800">Address:</span> <span className="text-blue-700">{item.address || 'N/A'}</span></div>
                </div>
              </div>
            </div>
            
            {item.description && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Description</h4>
                <p className="text-blue-700">{item.description}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderRelatedItems = () => {
    if (!relatedItems || relatedItems.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-blue-500 mb-2">
            {itemType === 'project' && <CheckSquare size={48} />}
            {itemType === 'team' && <Users size={48} />}
            {itemType === 'company' && <Building size={48} />}
          </div>
          <p className="text-blue-700">No related items found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedItems.map((relatedItem, index) => (
          <div key={`related-${index}`} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">{relatedItem.name || relatedItem.title}</h4>
                <p className="text-blue-700 text-sm mb-3">{relatedItem.description || 'No description available'}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                    {relatedItem.status || 'N/A'}
                  </span>
                  {relatedItem.priority && (
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                      {relatedItem.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Unified single-box renderer per user request
  const renderSingleBox = () => {
    if (!item) return null;

    const SectionRow = ({ label, value, isStatus = false, isPriority = false }: { label: string; value: any; isStatus?: boolean; isPriority?: boolean }) => {
      const getValueDisplay = () => {
        if (value === null || value === undefined) return 'N/A';
        if (isStatus) {
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
              {value}
            </span>
          );
        }
        if (isPriority) {
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(value)}`}>
              {value}
            </span>
          );
        }
        return <span className="text-blue-700 break-words">{value}</span>;
      };

      return (
        <div className="flex items-start gap-2">
          <span className="min-w-28 text-blue-800 font-medium">{label}:</span>
          {getValueDisplay()}
        </div>
      );
    };

    const toTitle = (key: string) =>
      key
        .replace(/_/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^./, (s) => s.toUpperCase());

    const formatValue = (val: any): any => {
      if (val === null || val === undefined) return '—';
      if (Array.isArray(val)) return val.length ? val.join(', ') : '[]';
      if (typeof val === 'object') return JSON.stringify(val, null, 2);
      return String(val);
    };

    const getOrganizedFields = (item: any) => {
      const entries = Object.entries(item);
      
      // Define field priority order for each item type
      const priorityFields = {
        project: ['id', 'name', 'title', 'description', 'status', 'priority', 'progress', 'startDate', 'endDate', 'createdAt', 'updatedAt', 'company', 'team', 'budget', 'tasksCompleted', 'totalTasks'],
        task: ['id', 'name', 'title', 'description', 'status', 'priority', 'progress', 'assignee', 'dueDate', 'createdAt', 'updatedAt', 'project', 'estimatedHours', 'actualHours', 'team'],
        team: ['id', 'name', 'title', 'description', 'status', 'health', 'performance', 'members', 'createdAt', 'updatedAt', 'company', 'budget', 'velocity', 'leader'],
        company: ['id', 'name', 'title', 'description', 'status', 'industry', 'size', 'location', 'createdAt', 'updatedAt', 'email', 'phone', 'website', 'address', 'contactPerson']
      };

      const currentPriority = priorityFields[itemType] || [];
      
      // Sort fields by priority
      const sortedEntries = entries.sort(([keyA], [keyB]) => {
        const indexA = currentPriority.indexOf(keyA);
        const indexB = currentPriority.indexOf(keyB);
        
        // If both fields are in priority list, sort by priority order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        // If only one field is in priority list, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        // If neither field is in priority list, sort alphabetically
        return keyA.localeCompare(keyB);
      });

      return sortedEntries;
    };

    return (
      <div className="space-y-8">
        {/* Raw Data Section - Clean professional design */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
          </div>
          
          <div className="space-y-0">
            {getOrganizedFields(item).map(([key, val], index) => (
              <div key={key} className={`flex items-start gap-4 py-2 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-100 last:border-b-0`}>
                <div className="min-w-36">
                  <span className="asana-label text-lg font-semibold text-slate-600 uppercase tracking-wide">{toTitle(key)}</span>
                </div>
                <div className="flex-1">
                  {(key.toLowerCase() === 'tasks' || key.toLowerCase() === 'task') && itemType === 'project' ? (
                    <div className="space-y-1">
                      {relatedItems.length > 0 ? (
                        <>
                          {relatedItems.slice(0, 3).map((task, index) => (
                            <div key={task.id || index} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                task.status === 'Completed' ? 'bg-green-400' :
                                task.status === 'In Progress' ? 'bg-yellow-400' :
                                task.status === 'Pending' ? 'bg-slate-300' :
                                'bg-gray-400'
                              }`}></div>
                              <span className="text-slate-800 font-medium text-base truncate">{task.title || 'Untitled Task'}</span>
                            </div>
                          ))}
                          {relatedItems.length > 3 && (
                            <div className="text-sm text-slate-500">
                              +{relatedItems.length - 3} more tasks
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-800 font-medium text-base">No tasks assigned</span>
                      )}
                    </div>
                  ) : (
                    <span className="asana-body text-slate-800 text-lg font-medium leading-relaxed">{formatValue(val)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section - Clean minimal design */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Quick Overview</h3>
          </div>
          
          <div className="space-y-3">
            {itemType === 'project' && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Status</span>
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Priority</span>
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Start Date</span>
                      <span className="text-slate-800 font-semibold text-base">{item.startDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">End Date</span>
                      <span className="text-slate-800 font-semibold text-base">{item.endDate}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-semibold text-slate-500">Progress</span>
                        <span className="text-base font-bold text-slate-800">{item.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${item.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Tasks</span>
                      <div className="flex-1">
                        {relatedItems.length > 0 ? (
                          <div className="space-y-1">
                            {relatedItems.slice(0, 3).map((task, index) => (
                              <div key={task.id || index} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  task.status === 'Completed' ? 'bg-green-400' :
                                  task.status === 'In Progress' ? 'bg-yellow-400' :
                                  task.status === 'Pending' ? 'bg-slate-300' :
                                  'bg-gray-400'
                                }`}></div>
                                <span className="text-slate-800 font-medium text-base truncate">{task.title || 'Untitled Task'}</span>
                              </div>
                            ))}
                            {relatedItems.length > 3 && (
                              <div className="text-sm text-slate-500">
                                +{relatedItems.length - 3} more tasks
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-800 font-semibold text-base">No tasks assigned</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Description</span>
                      <span className="text-slate-800 font-semibold text-base">{item.description ? 'Available' : 'None'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {itemType === 'task' && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Status</span>
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Priority</span>
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Assignee</span>
                      <span className="text-slate-800 font-semibold text-base">{item.assignee || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Due Date</span>
                      <span className="text-slate-800 font-semibold text-base">{item.dueDate || 'No date'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-semibold text-slate-500">Progress</span>
                        <span className="text-base font-bold text-slate-800">{item.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${item.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Project</span>
                      <span className="text-slate-800 font-semibold text-base">{item.project || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Hours</span>
                      <span className="text-slate-800 font-semibold text-base">{item.estimatedHours || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {itemType === 'team' && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Status</span>
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Health</span>
                      <span className="text-slate-800 font-semibold text-base">{item.health}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Members</span>
                      <span className="text-slate-800 font-semibold text-base">{Array.isArray(item.members) ? item.members.length : 0}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Velocity</span>
                      <span className="text-slate-800 font-semibold text-base">{item.velocity || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-semibold text-slate-500">Performance</span>
                        <span className="text-base font-bold text-slate-800">{item.performance || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${item.performance || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Budget</span>
                      <span className="text-slate-800 font-semibold text-base">{item.budget || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {itemType === 'company' && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Status</span>
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Industry</span>
                      <span className="text-slate-800 font-semibold text-base">{item.industry}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Size</span>
                      <span className="text-slate-800 font-semibold text-base">{item.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Location</span>
                      <span className="text-slate-800 font-semibold text-base">{item.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Email</span>
                      <span className="text-slate-800 font-semibold text-base">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Phone</span>
                      <span className="text-slate-800 font-semibold text-base">{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Website</span>
                      <span className="text-slate-800 font-semibold text-base">{item.website}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-slate-500 w-24">Address</span>
                      <span className="text-slate-800 font-semibold text-base">{item.address}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getItemIcon = () => {
    switch (itemType) {
      case 'project': return <Target size={24} />;
      case 'task': return <CheckSquare size={24} />;
      case 'team': return <Users size={24} />;
      case 'company': return <Building size={24} />;
      default: return <FileText size={24} />;
    }
  };

  const getItemTitle = () => {
    if (!item) return `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Details`;
    return item.name || item.title || `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Details`;
  };

  const copyToClipboard = async () => {
    if (!item) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(item, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planning':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on hold':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose}></div>

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 w-[420px] md:w-[560px] max-w-[95vw] shadow-2xl">
        <div className="relative h-full bg-white border-l border-blue-100 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg">
                  {getItemIcon()}
                </div>
                <div>
                  <h2 className="asana-heading text-3xl text-blue-900">{getItemTitle()}</h2>
                  <p className="asana-body text-blue-700 text-lg">View and manage details</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-blue-200 rounded-lg transition-colors text-blue-600"
                  title="Copy data"
                >
                  {copied ? <CheckSquare size={20} /> : <Copy size={20} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-200 rounded-lg transition-colors text-blue-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-blue-600">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              renderSingleBox()
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-base text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="asana-caption">Last updated: {item?.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="asana-label px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
              <button className="asana-label px-4 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Edit size={18} className="inline mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
