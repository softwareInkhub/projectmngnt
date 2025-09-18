'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, X, Users, ChevronRight } from 'lucide-react';
import { ProjectApiService, ProjectData } from '../utils/projectApi';

interface ProjectSelectorProps {
  onProjectSelect?: (project: ProjectData) => void;
  selectedProjectId?: string;
}

export default function ProjectSelector({ onProjectSelect, selectedProjectId }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Open');
  const [showClearFilter, setShowClearFilter] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectApiService.getProjects();
      if (response.success && response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Open' || 
      (statusFilter === 'Planning' && project.status === 'Planning') ||
      (statusFilter === 'In Progress' && project.status === 'In Progress') ||
      (statusFilter === 'Completed' && project.status === 'Completed');
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setShowClearFilter(status !== 'All Open');
  };

  const clearFilter = () => {
    setStatusFilter('All Open');
    setShowClearFilter(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'bg-yellow-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
      
      {/* Filter and Search Section */}
      <div className="mb-4 space-y-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Open">All Open</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          {showClearFilter && (
            <>
              <button
                onClick={clearFilter}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500">Clear filter</span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Users className="w-4 h-4" />
          <span>Existing Projects</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="space-y-1">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedProjectId === project.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onProjectSelect?.(project)}
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Users className="w-4 h-4 text-gray-500" />
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {project.name}
                </span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== 'All Open' 
                ? 'No projects match your filters' 
                : 'No projects found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

