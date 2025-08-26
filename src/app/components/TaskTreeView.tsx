"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Edit, 
  Trash2, 
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
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
  onToggleStatus: (taskId: string, newStatus: string) => void;
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
      const levelWidth = 200; // Reduced from 300
      const nodeHeight = 50; // Reduced from 80
      const verticalSpacing = 60; // Reduced from 100
      
      taskList.forEach((task, index) => {
        const x = level * levelWidth + 50;
        const y = currentY;
        
        positions.set(task.id!, {
          x,
          y,
          width: 180, // Reduced from 250
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'in progress':
        return <Clock className="w-3 h-3 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  // Removed getPriorityColor function as we're using inline styles now

  const renderTaskNode = (task: TaskTreeNode) => {
    const position = nodePositions.get(task.id!);
    if (!position) return null;

    const isSelected = selectedTaskId === task.id;
    const hasChildren = task.children && task.children.length > 0;
    const isExpanded = expandedNodes.has(task.id!);

    return (
      <motion.div
        key={task.id}
        ref={(el) => {
          if (el) nodeRefs.current.set(task.id!, el);
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height
        }}
        className={`transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
      >
        <div
          className={`group relative p-2 rounded-md border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 ${
            isSelected ? 'ring-2 ring-blue-500 ring-offset-1 border-blue-500' : ''
          }`}
          onClick={() => onTaskSelect(task)}
        >
          {/* Compact Task Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(task.id!);
                  }}
                  className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  )}
                </button>
              )}
              
              <div className="flex-shrink-0">
                {getStatusIcon(task.status)}
              </div>
              
              <span className="font-medium text-xs text-gray-900 truncate flex-1">
                {task.title}
              </span>
            </div>
            
            {/* Compact Action Buttons */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubtask(task.id!);
                }}
                className="p-0.5 hover:bg-blue-50 rounded transition-colors"
                title="Add subtask"
              >
                <Plus className="w-2.5 h-2.5 text-blue-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                className="p-0.5 hover:bg-gray-50 rounded transition-colors"
                title="Edit task"
              >
                <Edit className="w-2.5 h-2.5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Compact Task Details */}
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <span className="truncate flex-1">{task.assignee}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
              {hasChildren && (
                <span className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {task.children?.length || 0}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderConnections = () => {
    return connections.map((connection, index) => {
      const dx = connection.toPos.x - connection.fromPos.x;
      const dy = connection.toPos.y - connection.fromPos.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const length = Math.sqrt(dx * dx + dy * dy);

      return (
        <svg
          key={`${connection.from}-${connection.to}`}
          style={{
            position: 'absolute',
            left: connection.fromPos.x,
            top: connection.fromPos.y,
            width: length,
            height: 2,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
            pointerEvents: 'none'
          }}
          className="z-0"
        >
          <defs>
            <marker
              id={`arrowhead-${index}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6b7280"
              />
            </marker>
          </defs>
          <line
            x1="0"
            y1="1"
            x2={length - 10}
            y2="1"
            stroke="#6b7280"
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${index})`}
          />
        </svg>
      );
    });
  };

  const renderAllNodes = (taskList: TaskTreeNode[]) => {
    const nodes: React.ReactNode[] = [];
    
    taskList.forEach(task => {
      nodes.push(renderTaskNode(task));
      
      if (expandedNodes.has(task.id!) && task.children && task.children.length > 0) {
        nodes.push(...renderAllNodes(task.children));
      }
    });
    
    return nodes;
  };

  const rootTasks = tasks.filter(task => !task.parentId);

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Tree View</h3>
        <p className="text-sm text-gray-600">
          Visual representation of task hierarchy and dependencies
        </p>
      </div>

             <div
         ref={containerRef}
         className="relative w-full min-h-[500px] bg-white rounded-lg border border-gray-200 overflow-auto"
         style={{ minWidth: '600px' }}
       >
        {/* Connections Layer */}
        <div className="absolute inset-0 z-0">
          {renderConnections()}
        </div>

        {/* Nodes Layer */}
        <div className="relative z-10">
          <AnimatePresence>
            {renderAllNodes(rootTasks)}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {rootTasks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm">Create your first task to get started</p>
            </div>
          </div>
        )}
      </div>

             {/* Compact Legend */}
       <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
         <h4 className="text-xs font-medium text-gray-900 mb-2">Legend</h4>
         <div className="flex flex-wrap gap-3 text-xs">
           <div className="flex items-center gap-1.5">
             <CheckCircle className="w-3 h-3 text-green-500" />
             <span>Done</span>
           </div>
           <div className="flex items-center gap-1.5">
             <Clock className="w-3 h-3 text-blue-500" />
             <span>In Progress</span>
           </div>
           <div className="flex items-center gap-1.5">
             <AlertCircle className="w-3 h-3 text-red-500" />
             <span>Blocked</span>
           </div>
           <div className="flex items-center gap-1.5">
             <Circle className="w-3 h-3 text-gray-400" />
             <span>To Do</span>
           </div>
         </div>
       </div>
    </div>
  );
}
