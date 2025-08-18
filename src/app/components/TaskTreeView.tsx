'use client';

import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Edit, Trash2 } from 'lucide-react';
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
        {/* Task Node */}
        <div
          className={`
            group flex items-start justify-between p-4 rounded-lg cursor-pointer transition-colors
            ${isSelected
              ? 'bg-blue-50 border border-blue-200'
              : 'hover:bg-gray-50 border border-transparent'
            }
          `}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Left side with expand icon and task info */}
          <div className="flex items-start flex-1" onClick={() => onTaskSelect(task)}>
            {/* Expand/Collapse Icon */}
            <div className="flex-shrink-0 mr-2">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(task.id!);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6" />
              )}
            </div>
            
            {/* Task Icon */}
            <div className="flex-shrink-0 mr-3">
              {hasChildren ? (
                <Folder size={18} className="text-blue-500" />
              ) : (
                <FileText size={18} className="text-gray-500" />
              )}
            </div>
            
            {/* Task Info - Clean sidebar layout */}
            <div className="flex-1 pr-4">
              <div className="font-medium text-sm text-gray-900 mb-2">
                {task.title || 'Untitled Task'}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>{task.assignee || 'Unassigned'} • {task.status || 'To Do'}</div>
                <div>{task.priority || 'Medium'} • {task.project || 'No Project'}</div>
                <div>Due: {task.dueDate || 'No due date'}</div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSubtask(task.id!);
              }}
              className="p-1 hover:bg-blue-100 rounded text-blue-600"
              title="Add Subtask"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task);
              }}
              className="p-1 hover:bg-gray-100 rounded text-gray-600"
              title="Edit Task"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task);
              }}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {task.children.map(child => renderTaskNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Task Hierarchy</h3>
        <div className="text-sm text-gray-500">
          {tasks.length} root tasks
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No tasks found</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        ) : (
          tasks.map(task => renderTaskNode(task))
        )}
      </div>
    </div>
  );
}
