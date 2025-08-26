"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square,
  Play,
  CheckCircle,
  Pause,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowDown,
  ArrowUpRight
} from 'lucide-react';
import { TaskTreeNode } from '../utils/taskApi';

interface TaskTreeViewProps {
  tasks: TaskTreeNode[];
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: string) => Promise<void>;
  selectedTaskId?: string | null;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Connection {
  from: string;
  to: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

export default function TaskTreeView({
  tasks,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  selectedTaskId
}: TaskTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const [connections, setConnections] = useState<Connection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Calculate node positions and connections
  useEffect(() => {
    const positions = new Map<string, NodePosition>();
    const connections: Connection[] = [];
    
    const calculatePositions = (taskList: TaskTreeNode[], level: number = 0, startY: number = 0) => {
      let currentY = startY;
      // Ultra-compact spacing for professional look
      const levelWidth = window.innerWidth < 768 ? 100 : 140; // Reduced from 120/160
      const nodeHeight = window.innerWidth < 768 ? 32 : 36; // Reduced from 40/45
      const verticalSpacing = window.innerWidth < 768 ? 24 : 32; // Reduced from 40/50
      
      taskList.forEach((task, index) => {
        const x = level * levelWidth + (window.innerWidth < 768 ? 15 : 20);
        const y = currentY;
        
        positions.set(task.id!, {
          x,
          y,
          width: window.innerWidth < 768 ? 110 : 130, // Reduced from 140/160
          height: nodeHeight
        });
        
        // Add connection to parent if exists
        if (task.parentId) {
          const parentPos = positions.get(task.parentId);
          if (parentPos) {
            connections.push({
              from: task.parentId,
              to: task.id!,
              fromPos: { x: parentPos.x + parentPos.width, y: parentPos.y + parentPos.height / 2 },
              toPos: { x: x, y: y + nodeHeight / 2 }
            });
          }
        }
        
        currentY += nodeHeight + verticalSpacing;
        
        // Calculate positions for children
        if (expandedNodes.has(task.id!) && task.children && task.children.length > 0) {
          const childStartY = currentY;
          calculatePositions(task.children, level + 1, childStartY);
          currentY = childStartY + (task.children.length * (nodeHeight + verticalSpacing));
        }
      });
    };
    
    const rootTasks = tasks.filter(task => !task.parentId);
    calculatePositions(rootTasks);
    
    setNodePositions(positions);
    setConnections(connections);
  }, [tasks, expandedNodes]);

  const toggleNode = (taskId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedNodes(newExpanded);
  };

  const statusIcons = {
    "To Do": Square,
    "In Progress": Play,
    "Done": CheckCircle,
    "On Hold": Pause,
    "Review": AlertCircle,
    "Blocked": AlertCircle
  };

  const priorityColors = {
    "High": "bg-red-50 text-red-700 border-red-200",
    "Medium": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Low": "bg-green-50 text-green-700 border-green-200",
    "Critical": "bg-red-100 text-red-800 border-red-300"
  };

  const renderTaskNode = (task: TaskTreeNode) => {
    const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
    const isSelected = selectedTaskId === task.id;
    const expanded = expandedNodes.has(task.id!);
    const hasChildren = task.children && task.children.length > 0;
    const position = nodePositions.get(task.id!);
    const isMobile = window.innerWidth < 768;

    if (!position) return null;

    return (
      <motion.div
        key={task.id}
        ref={(el) => {
          if (el) nodeRefs.current.set(task.id!, el);
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
        }}
        className="group"
      >
        {/* Task Card */}
        <motion.div
          className={`
            relative w-full h-full bg-white border border-slate-200 rounded-md shadow-sm
            hover:shadow-md hover:border-slate-300 transition-all duration-150 cursor-pointer
            ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 shadow-lg' : ''}
            ${task.status === 'Done' ? 'opacity-70' : ''}
          `}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Card Content */}
          <div className="p-1.5 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <StatusIcon className={`w-2.5 h-2.5 ${task.status === 'Done' ? 'text-green-600' : 'text-slate-400'}`} />
                <span className="text-xs font-medium text-slate-900 truncate leading-tight">
                  {task.title}
                </span>
              </div>
              
              {/* Priority Badge */}
              {task.priority && (
                <span className={`
                  px-1 py-0.5 rounded text-xs font-medium border
                  ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-50 text-slate-700 border-slate-200'}
                `}>
                  {isMobile ? task.priority.charAt(0) : task.priority}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-0.5">
              {/* Child count and expand button */}
              <div className="flex items-center gap-1">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(task.id!);
                    }}
                    className="p-0.5 hover:bg-slate-100 rounded transition-colors"
                  >
                    {expanded ? (
                      <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-2.5 h-2.5 text-slate-500" />
                    )}
                  </button>
                )}
                {hasChildren && (
                  <span className="text-xs text-slate-500">
                    {task.children!.length}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtask(task.id!);
                  }}
                  className="p-0.5 hover:bg-blue-100 rounded transition-colors"
                  title="Add subtask"
                >
                  <Plus className="w-2.5 h-2.5 text-blue-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="p-0.5 hover:bg-slate-100 rounded transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-2.5 h-2.5 text-slate-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id!);
                  }}
                  className="p-0.5 hover:bg-red-100 rounded transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-2.5 h-2.5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Render children */}
        <AnimatePresence>
          {expanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {task.children!.map(child => renderTaskNode(child))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full relative bg-slate-50">
      {/* Container - No scrollbars, fits in frame */}
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{
          minHeight: window.innerWidth < 768 ? '300px' : '400px',
          minWidth: window.innerWidth < 768 ? '300px' : '500px'
        }}
      >
        {/* Connection Lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {connections.map((connection, index) => (
            <motion.path
              key={`${connection.from}-${connection.to}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              d={`M ${connection.fromPos.x} ${connection.fromPos.y} L ${connection.toPos.x} ${connection.toPos.y}`}
              stroke="#e2e8f0"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="2,2"
            />
          ))}
        </svg>

        {/* Task Nodes */}
        <AnimatePresence>
          {tasks.map(task => renderTaskNode(task))}
        </AnimatePresence>
      </div>

      {/* Compact Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-md p-2 shadow-sm">
        <div className="text-xs font-medium text-slate-700 mb-1">Legend</div>
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5">
            <Square className="w-2.5 h-2.5 text-slate-400" />
            <span className="text-slate-600">To Do</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Play className="w-2.5 h-2.5 text-blue-500" />
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-2.5 h-2.5 text-green-600" />
            <span className="text-slate-600">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
