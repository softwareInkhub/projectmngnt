"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  ArrowUpRight,
  User,
  Calendar,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw
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
  type: 'sequential' | 'parallel';
}

interface Viewport {
  x: number;
  y: number;
  scale: number;
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
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Calculate container bounds
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerBounds({ width: rect.width, height: rect.height });
    }
  }, []);

  // Calculate node positions and connections
  useEffect(() => {
    const positions = new Map<string, NodePosition>();
    const connections: Connection[] = [];
    
    const calculatePositions = (taskList: TaskTreeNode[], level: number = 0, startY: number = 0) => {
      let currentY = startY;
      // Optimized spacing for web view
      const levelWidth = isMobile ? 100 : 140;
      const nodeHeight = isMobile ? 28 : 32;
      const verticalSpacing = isMobile ? 16 : 20;
      const baseX = isMobile ? 16 : 20;
      
      taskList.forEach((task, index) => {
        const x = level * levelWidth + baseX;
        const y = currentY;
        
        positions.set(task.id!, {
          x,
          y,
          width: isMobile ? 90 : 110,
          height: nodeHeight
        });
        
        // Add connection to parent if exists
        if (task.parentId) {
          const parentPos = positions.get(task.parentId);
          if (parentPos) {
            // Determine if this is a sequential or parallel task
            const parent = taskList.find(t => t.id === task.parentId);
            const siblings = parent?.children || [];
            const isSequential = siblings.length === 1 || index === 0;
            
            connections.push({
              from: task.parentId,
              to: task.id!,
              fromPos: { x: parentPos.x + parentPos.width, y: parentPos.y + parentPos.height / 2 },
              toPos: { x: x, y: y + nodeHeight / 2 },
              type: isSequential ? 'sequential' : 'parallel'
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
  }, [tasks, expandedNodes, isMobile]);

  const toggleNode = (taskId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedNodes(newExpanded);
  };

  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (!isMobile) {
      setViewport(prev => ({
        ...prev,
        x: prev.x + info.delta.x,
        y: prev.y + info.delta.y
      }));
    }
  }, [isMobile]);

  const handleZoom = useCallback((delta: number) => {
    if (!isMobile) {
      setViewport(prev => ({
        ...prev,
        scale: Math.max(0.5, Math.min(2, prev.scale + delta * 0.1))
      }));
    }
  }, [isMobile]);

  const resetView = useCallback(() => {
    setViewport({ x: 0, y: 0, scale: 1 });
  }, []);

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
    const isHovered = hoveredTask === task.id;

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
          transform: isMobile ? 'none' : `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        }}
        className="group"
        onMouseEnter={() => setHoveredTask(task.id!)}
        onMouseLeave={() => setHoveredTask(null)}
      >
        {/* Task Card */}
        <motion.div
          className={`
            relative w-full h-full bg-white border border-slate-200 rounded-lg shadow-sm
            hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer
            ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 shadow-lg' : ''}
            ${task.status === 'Done' ? 'opacity-75' : ''}
            ${isHovered ? 'shadow-lg border-slate-400' : ''}
          `}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: isMobile ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Card Content */}
          <div className="p-1.5 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(task.id!, task.status === 'Done' ? 'To Do' : 'Done');
                  }}
                  className="flex-shrink-0"
                >
                  <StatusIcon className={`w-3 h-3 ${task.status === 'Done' ? 'text-green-600' : 'text-slate-400'}`} />
                </button>
                <span 
                  className="text-xs font-medium text-slate-900 truncate leading-tight"
                  onMouseEnter={() => setShowTooltip(task.id!)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
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
              <div className={`flex items-center gap-0.5 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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

          {/* Tooltip */}
          {showTooltip === task.id && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 mb-2 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap"
            >
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <div className="text-slate-300 mt-1">{task.description}</div>
              )}
              <div className="flex items-center gap-2 mt-1 text-slate-300">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-2 mt-1 text-slate-300">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                </div>
              )}
            </motion.div>
          )}
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
    <div className="w-full h-full relative bg-slate-50">
      {/* Zoom Controls - Desktop Only */}
      {!isMobile && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-sm">
          <button
            onClick={() => handleZoom(1)}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      )}

      {/* Scrollable Container with Scrollbars */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
      >
        {/* Inner Container - Draggable on desktop */}
        <motion.div
          className="relative"
          style={{
            minHeight: isMobile ? '300px' : '400px',
            minWidth: isMobile ? '300px' : '500px',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          drag={!isMobile}
          dragConstraints={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handlePan}
          onWheel={(e) => {
            if (!isMobile && e.ctrlKey) {
              e.preventDefault();
              handleZoom(e.deltaY > 0 ? -1 : 1);
            }
          }}
        >
          {/* Connection Lines with Arrows */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <marker
                id="arrowhead-sequential"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
              <marker
                id="arrowhead-parallel"
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
            {connections.map((connection, index) => (
              <motion.g
                key={`${connection.from}-${connection.to}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Curved connection line */}
                <path
                  d={`M ${connection.fromPos.x} ${connection.fromPos.y} Q ${(connection.fromPos.x + connection.toPos.x) / 2} ${connection.fromPos.y} ${connection.toPos.x} ${connection.toPos.y}`}
                  stroke={connection.type === 'sequential' ? '#3b82f6' : '#94a3b8'}
                  strokeWidth={connection.type === 'sequential' ? '2' : '1.5'}
                  fill="none"
                  markerEnd={`url(#arrowhead-${connection.type})`}
                  opacity={connection.type === 'sequential' ? 0.8 : 0.6}
                />
              </motion.g>
            ))}
          </svg>

          {/* Task Nodes */}
          <AnimatePresence>
            {tasks.map(task => renderTaskNode(task))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Compact Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-sm">
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
          <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-slate-200">
            <div className="w-3 h-0.5 bg-blue-500 rounded"></div>
            <span className="text-slate-600">Sequential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-slate-400 rounded"></div>
            <span className="text-slate-600">Parallel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
