"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Circle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Flag,
  Edit,
  Trash2,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { TaskTreeNode } from '../utils/taskApi';

interface TaskTreeViewProps {
  tasks: TaskTreeNode[];
  onTaskSelect: (task: TaskTreeNode) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: TaskTreeNode) => void;
  onDeleteTask: (taskId: string) => void;
  selectedTaskId?: string | null;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const statusIcons = {
  "To Do": Circle,
  "In Progress": Clock,
  "Done": CheckCircle,
  "On Hold": AlertCircle,
  "Review": Clock,
  "Blocked": AlertCircle
};

const priorityColors = {
  "High": "text-red-500",
  "Medium": "text-yellow-500", 
  "Low": "text-green-500",
  "Critical": "text-red-600"
};

const statusColors = {
  "To Do": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Done": "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-orange-100 text-orange-700",
  "Review": "bg-purple-100 text-purple-700",
  "Blocked": "bg-red-100 text-red-700"
};

export default function TaskTreeView({
  tasks,
  onTaskSelect,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  selectedTaskId
}: TaskTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleNode = (taskId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedNodes(newExpanded);
  };

  const isExpanded = (taskId: string) => expandedNodes.has(taskId);
  const hasChildren = (task: TaskTreeNode) => task.children && task.children.length > 0;

  // Calculate node positions for arrow rendering
  useEffect(() => {
    const positions = new Map<string, NodePosition>();
    let currentY = 0;
    const levelWidth = 300;
    const nodeHeight = 80;
    const verticalSpacing = 20;

    const calculatePositions = (taskList: TaskTreeNode[], level: number = 0) => {
      taskList.forEach((task, index) => {
        const x = level * levelWidth;
        const y = currentY;
        
        positions.set(task.id!, { x, y, width: 280, height: nodeHeight });
        currentY += nodeHeight + verticalSpacing;

        if (isExpanded(task.id!) && hasChildren(task)) {
          calculatePositions(task.children, level + 1);
        }
      });
    };

    calculatePositions(tasks);
    setNodePositions(positions);
  }, [tasks, expandedNodes]);

  const renderArrow = (fromTask: TaskTreeNode, toTask: TaskTreeNode) => {
    const fromPos = nodePositions.get(fromTask.id!);
    const toPos = nodePositions.get(toTask.id!);
    
    if (!fromPos || !toPos) return null;

    const fromX = fromPos.x + fromPos.width;
    const fromY = fromPos.y + fromPos.height / 2;
    const toX = toPos.x;
    const toY = toPos.y + toPos.height / 2;

    // Calculate arrow path
    const midX = (fromX + toX) / 2;
    const path = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;

    return (
      <motion.path
        d={path}
        stroke="#94a3b8"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    );
  };

  const renderTaskNode = (task: TaskTreeNode, level: number = 0) => {
    const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle;
    const isSelected = selectedTaskId === task.id;
    const isHovered = hoveredTask === task.id;
    const expanded = isExpanded(task.id!);
    const children = task.children || [];

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
        style={{ 
          position: 'absolute',
          left: `${level * 300}px`,
          top: `${nodePositions.get(task.id!)?.y || 0}px`,
          width: '280px'
        }}
      >
        {/* Task Node */}
        <motion.div
          className={`
            group relative bg-white border-2 rounded-lg shadow-md cursor-pointer transition-all duration-200
            ${isSelected 
              ? 'border-blue-500 shadow-lg scale-105' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
            }
            ${isHovered ? 'z-10' : 'z-1'}
          `}
          onMouseEnter={() => setHoveredTask(task.id!)}
          onMouseLeave={() => setHoveredTask(null)}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Node Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {hasChildren(task) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(task.id!);
                  }}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: expanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </button>
              )}
              
              <StatusIcon className={`w-4 h-4 ${task.status === 'Done' ? 'text-green-500' : 'text-slate-400'}`} />
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[task.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700'
              }`}>
                {task.status}
              </span>
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
              {(isHovered || isSelected) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSubtask(task.id!);
                    }}
                    className="p-1 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                    title="Add subtask"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Edit task"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id!);
                    }}
                    className="p-1 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Node Content */}
          <div className="p-3">
            <h4 className={`font-medium text-sm mb-2 truncate ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate">{task.assignee}</span>
              </div>
              
              {task.priority && (
                <Flag className={`w-3 h-3 ${priorityColors[task.priority as keyof typeof priorityColors] || 'text-slate-400'}`} />
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Calendar className="w-3 h-3" />
                <span>{task.dueDate}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Render children with arrows */}
        <AnimatePresence>
          {expanded && hasChildren(task) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children.map(child => renderTaskNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Render arrows between connected nodes
  const renderArrows = () => {
    const arrows: React.ReactElement[] = [];
    
    const addArrows = (taskList: TaskTreeNode[]) => {
      taskList.forEach(task => {
        if (isExpanded(task.id!) && hasChildren(task)) {
          task.children.forEach(child => {
            arrows.push(
              <g key={`arrow-${task.id}-${child.id}`}>
                {renderArrow(task, child)}
              </g>
            );
          });
          addArrows(task.children);
        }
      });
    };

    addArrows(tasks);
    return arrows;
  };

  return (
    <div className="w-full h-full relative overflow-auto" ref={containerRef}>
      {/* SVG for arrows */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ minHeight: `${Math.max(800, nodePositions.size * 100)}px` }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#94a3b8"
            />
          </marker>
        </defs>
        {renderArrows()}
      </svg>

      {/* Task Nodes */}
      <div className="relative" style={{ minHeight: `${Math.max(800, nodePositions.size * 100)}px` }}>
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Circle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No tasks available</p>
          </div>
        ) : (
          tasks.map(task => renderTaskNode(task))
        )}
      </div>
    </div>
  );
}
