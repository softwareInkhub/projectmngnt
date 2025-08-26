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
      // Responsive spacing - smaller on mobile
      const levelWidth = window.innerWidth < 768 ? 120 : 160; // Reduced from 200
      const nodeHeight = window.innerWidth < 768 ? 40 : 45; // Reduced from 50
      const verticalSpacing = window.innerWidth < 768 ? 40 : 50; // Reduced from 60
      
      taskList.forEach((task, index) => {
        const x = level * levelWidth + (window.innerWidth < 768 ? 20 : 30);
        const y = currentY;
        
        positions.set(task.id!, {
          x,
          y,
          width: window.innerWidth < 768 ? 140 : 160, // Reduced from 180
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
    "High": "bg-red-100 text-red-700 border-red-200",
    "Medium": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Low": "bg-green-100 text-green-700 border-green-200",
    "Critical": "bg-red-200 text-red-800 border-red-300"
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
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
            relative w-full h-full bg-white border border-slate-200 rounded-lg shadow-sm
            hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer
            ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 shadow-lg' : ''}
            ${task.status === 'Done' ? 'opacity-75' : ''}
          `}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Card Content */}
          <div className="p-2 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <StatusIcon className={`w-3 h-3 ${task.status === 'Done' ? 'text-green-600' : 'text-slate-400'}`} />
                <span className="text-xs font-medium text-slate-900 truncate">
                  {task.title}
                </span>
              </div>
              
              {/* Priority Badge */}
              {task.priority && (
                <span className={`
                  px-1.5 py-0.5 rounded text-xs font-medium border
                  ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700 border-slate-200'}
                `}>
                  {isMobile ? task.priority.charAt(0) : task.priority}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-1">
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
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-500" />
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
                  <Plus className="w-3 h-3 text-blue-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="p-0.5 hover:bg-slate-100 rounded transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id!);
                  }}
                  className="p-0.5 hover:bg-red-100 rounded transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
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
              transition={{ duration: 0.3 }}
            >
              {task.children!.map(child => renderTaskNode(child))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full relative overflow-auto bg-slate-50">
      {/* Container */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[500px] min-w-[600px] md:min-w-[800px] lg:min-w-[1000px]"
        style={{
          minHeight: window.innerWidth < 768 ? '400px' : '500px',
          minWidth: window.innerWidth < 768 ? '400px' : '600px'
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              d={`M ${connection.fromPos.x} ${connection.fromPos.y} L ${connection.toPos.x} ${connection.toPos.y}`}
              stroke="#cbd5e1"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,3"
            />
          ))}
        </svg>

        {/* Task Nodes */}
        <AnimatePresence>
          {tasks.map(task => renderTaskNode(task))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
        <div className="text-xs font-medium text-slate-700 mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Square className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-3 h-3 text-blue-500" />
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-slate-600">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
