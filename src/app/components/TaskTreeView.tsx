'use client';

import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Edit, Trash2, Calendar, User, Tag, Clock, Circle } from 'lucide-react';
import { TaskTreeNode } from '../utils/taskApi';

interface TaskTreeViewProps {
  tasks: TaskTreeNode[];
  selectedTaskId?: string;
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (task: TaskTreeNode) => void;
  onToggleExpand: (taskId: string) => void;
}

export function TaskTreeView({
  tasks,
  selectedTaskId,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onToggleExpand
}: TaskTreeViewProps) {
  
  const renderTaskNode = (task: TaskTreeNode, depth: number = 0) => {
    const hasChildren = task.children.length > 0;
    const isExpanded = task.isExpanded || false;
    const isSelected = selectedTaskId === task.id;
    
    return (
      <div key={task.id} className="w-full">
        {/* Task Node - Optimized spacing */}
        <div
          className={`
            group relative flex items-start p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200
            ${isSelected
              ? 'bg-blue-50 border-l-4 border-l-blue-500'
              : 'hover:bg-gray-50 border-l-4 border-l-transparent hover:border-l-gray-300'
            }
          `}
          style={{ marginLeft: `${Math.min(depth * 16, 64)}px` }}
          onClick={() => onTaskSelect(task)}
        >
          {/* Bullet Point */}
          <div className="flex-shrink-0 mr-2.5 mt-0.5">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(task.id!);
                }}
                className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={10} className="text-blue-600" />
                ) : (
                  <ChevronRight size={10} className="text-blue-600" />
                )}
              </button>
            ) : (
              <div className="flex items-center justify-center w-4 h-4">
                <Circle size={6} className="text-gray-400 fill-current" />
              </div>
            )}
          </div>
          
          {/* Task Content - Full width utilization */}
          <div className="flex-1 min-w-0 w-full">
            {/* Task Header */}
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center flex-1 min-w-0">
                {/* Task Icon */}
                <div className="flex-shrink-0 mr-2">
                  {hasChildren ? (
                    <Folder size={14} className="text-blue-500" />
                  ) : (
                    <FileText size={14} className="text-gray-500" />
                  )}
                </div>
                
                {/* Task Title */}
                <h4 className="font-semibold text-sm text-gray-900 truncate leading-tight flex-1">
                  {task.title || 'Untitled Task'}
                </h4>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-0.5 flex-shrink-0 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtask(task.id!);
                  }}
                  className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                  title="Add Subtask"
                >
                  <Plus size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  title="Edit Task"
                >
                  <Edit size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task);
                  }}
                  className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
            
            {/* Task Details - Compact point-wise layout */}
            <div className="space-y-1 ml-4">
              {/* Assignee */}
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-1.5"></div>
                <User size={10} className="mr-1 text-gray-400" />
                <span className="truncate">{task.assignee || 'Unassigned'}</span>
              </div>
              
              {/* Status */}
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-1.5"></div>
                <span className="font-medium text-gray-700">{task.status || 'To Do'}</span>
              </div>
              
              {/* Priority */}
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-1.5"></div>
                <Tag size={10} className="mr-1 text-gray-400" />
                <span className="truncate">{task.priority || 'Medium'}</span>
              </div>
              
              {/* Project */}
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-1.5"></div>
                <span className="truncate">{task.project || 'No Project'}</span>
              </div>
              
              {/* Due Date */}
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-1.5"></div>
                <Calendar size={10} className="mr-1 text-gray-400" />
                <span>Due: {task.dueDate || 'No due date'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {task.children.map(child => renderTaskNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Task Hierarchy</h3>
          <div className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
            <span className="text-xs font-medium text-gray-600">
              {tasks.length} root tasks
            </span>
          </div>
        </div>
      </div>
      
      {/* Task List - Optimized spacing */}
      <div className="space-y-0.5">
        {tasks.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <FileText size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium mb-1">No tasks found</p>
            <p className="text-xs text-gray-400">Create your first task to get started</p>
          </div>
        ) : (
          tasks.map(task => renderTaskNode(task))
        )}
      </div>
    </div>
  );
}
