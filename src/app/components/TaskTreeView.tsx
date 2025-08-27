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
  RotateCcw,
  GitBranch,
  GitMerge
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
  level: number;
  index: number;
}

interface Connection {
  from: string;
  to: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  type: 'sequential' | 'parallel' | 'merge';
  path: string;
}

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

interface TreeLayoutNode {
  task: TaskTreeNode;
  children: TreeLayoutNode[];
  x: number;
  y: number;
  width: number;
  height: number;
  level: number;
  index: number;
  parent?: TreeLayoutNode;
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
  console.log('TaskTreeView render:', { 
    tasksCount: tasks.length, 
    selectedTaskId,
    tasksWithChildren: tasks.filter(t => t.children && t.children.length > 0).length,
    allTasksWithChildren: tasks.flatMap(t => t.children || []).length
  });
  
  // Debug: Log all tasks and their children
  tasks.forEach(task => {
    if (task.children && task.children.length > 0) {
      console.log(`Task "${task.title}" has ${task.children.length} children:`, 
        task.children.map(child => child.title));
    }
  });
  
  // Debug: Log the first few tasks to see their structure
  if (tasks.length > 0) {
    console.log('Sample task structure:', tasks.slice(0, 2).map(t => ({
      id: t.id,
      title: t.title,
      parentId: t.parentId,
      childrenCount: t.children?.length || 0,
      hasChildren: t.children && t.children.length > 0
    })));
  }
  
  // Add error boundary for this component
  const [hasError, setHasError] = useState(false);
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
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({ width: rect.width, height: rect.height });
      }
    };
    
    updateBounds();
    
    // Update bounds on window resize
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Professional Tree Layout Algorithm
  const calculateTreeLayout = useCallback((taskList: TaskTreeNode[]): TreeLayoutNode[] => {
    const nodeWidth = isMobile ? 160 : 200;
    const nodeHeight = isMobile ? 80 : 100;
    const horizontalSpacing = isMobile ? 120 : 160;
    const verticalSpacing = isMobile ? 80 : 120; // Increased vertical spacing to prevent overlapping
    const startX = isMobile ? 80 : 120; // Increased left margin to prevent cutoff
    const startY = isMobile ? 40 : 60;
    
    // Calculate the total width needed for the entire tree
    const calculateTreeWidth = (nodes: TaskTreeNode[]): number => {
      if (nodes.length === 0) return 0;
      
      let totalWidth = 0;
      nodes.forEach((node, index) => {
        let nodeWidth = horizontalSpacing;
        if (expandedNodes.has(node.id!) && node.children && node.children.length > 0) {
          // If node has expanded children, use the width of its children
          const childrenWidth = calculateTreeWidth(node.children);
          nodeWidth = Math.max(childrenWidth, nodeWidth);
        }
        totalWidth += nodeWidth;
      });
      
      return totalWidth;
    };

    const buildTreeNodes = (tasks: TaskTreeNode[], level: number = 0, parent?: TreeLayoutNode): TreeLayoutNode[] => {
      return tasks.map((task, index) => {
        const treeNode: TreeLayoutNode = {
          task,
          children: [],
          x: 0,
          y: 0,
          width: nodeWidth,
          height: nodeHeight,
          level,
          index,
          parent
        };

        // Add children if expanded
        if (expandedNodes.has(task.id!) && task.children && task.children.length > 0) {
          treeNode.children = buildTreeNodes(task.children, level + 1, treeNode);
        }

        return treeNode;
      });
    };

    const rootNodes = buildTreeNodes(taskList);
    
    // Calculate positions using a hierarchical layout
    const calculatePositions = (nodes: TreeLayoutNode[], startX: number, startY: number): { width: number; height: number } => {
      if (nodes.length === 0) return { width: 0, height: 0 };

      let currentX = startX;
      const currentY = startY;
      let maxHeight = 0;
      let totalWidth = 0;

      nodes.forEach((node, index) => {
        // Position current node with bounds checking
        node.x = currentX;
        node.y = currentY;
        
        // Ensure node doesn't go off the left edge
        if (node.x < startX) {
          node.x = startX;
        }

        // Calculate children positions if expanded
        let childrenWidth = 0;
        let childrenHeight = 0;
        
        if (node.children.length > 0) {
          // Calculate the total width needed for all children
          const childrenTotalWidth = node.children.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
          
          // Center the children under the parent
          let childrenStartX = currentX - (childrenTotalWidth / 2) + (nodeWidth / 2);
          
          // Ensure children don't go off the left edge
          const minChildrenX = startX;
          if (childrenStartX < minChildrenX) {
            childrenStartX = minChildrenX;
          }
          
          // Position children with proper spacing
          const childrenResult = calculatePositions(node.children, childrenStartX, currentY + nodeHeight + verticalSpacing);
          childrenWidth = childrenResult.width;
          childrenHeight = childrenResult.height;
          
          // Update max height to account for children
          maxHeight = Math.max(maxHeight, currentY + nodeHeight + verticalSpacing + childrenHeight);
          
          // Ensure enough horizontal space for children
          const requiredWidth = Math.max(nodeWidth, childrenTotalWidth);
          totalWidth = Math.max(totalWidth, currentX + requiredWidth);
        } else {
          // Update total width and height for nodes without children
          totalWidth = Math.max(totalWidth, currentX + nodeWidth);
        }

        maxHeight = Math.max(maxHeight, currentY + nodeHeight);

        // Move to next node at same level with increased spacing if this node has children
        const spacingMultiplier = node.children.length > 0 ? 2 : 1;
        const nextX = currentX + nodeWidth + (horizontalSpacing * spacingMultiplier);
        
        // Ensure minimum spacing to prevent overlapping
        const minSpacing = nodeWidth + horizontalSpacing;
        currentX = Math.max(nextX, currentX + minSpacing);
      });

      return { width: totalWidth - startX, height: maxHeight - startY };
    };

    calculatePositions(rootNodes, startX, startY);
    
    // Debug: Log the final positions
    console.log('Tree layout calculated:');
    const logNodePositions = (nodes: TreeLayoutNode[], level: number = 0) => {
      nodes.forEach(node => {
        const indent = '  '.repeat(level);
        console.log(`${indent}${node.task.title}: (${node.x}, ${node.y}) - ${node.children.length} children`);
        if (node.children.length > 0) {
          logNodePositions(node.children, level + 1);
        }
      });
    };
    logNodePositions(rootNodes);
    
    return rootNodes;
  }, [tasks, expandedNodes, isMobile]);

  // Calculate node positions and connections
  useEffect(() => {
    try {
      console.log('Recalculating layout. Tasks:', tasks.length, 'Expanded nodes:', Array.from(expandedNodes));
      console.log('Tasks with children:', tasks.filter(t => t.children && t.children.length > 0).length);
      
      const positions = new Map<string, NodePosition>();
      const connections: Connection[] = [];
      
      // Flatten the task tree to include all visible tasks (including subtasks when expanded)
      const flattenTasks = (taskList: TaskTreeNode[]): TaskTreeNode[] => {
        const result: TaskTreeNode[] = [];
        taskList.forEach(task => {
          result.push(task);
          // If this task is expanded and has children, include them
          if (expandedNodes.has(task.id!) && task.children && task.children.length > 0) {
            result.push(...flattenTasks(task.children));
          }
        });
        return result;
      };
      
      // Get all tasks that should be visible
      const visibleTasks = flattenTasks(tasks);
      console.log('Visible tasks (including expanded subtasks):', visibleTasks.length);
      
      // Process the entire task tree structure
      console.log('Processing entire task tree with', tasks.length, 'root tasks');
      
      const treeNodes = calculateTreeLayout(tasks);
      console.log('Tree nodes calculated:', treeNodes.length);
    
    // Extract positions from tree nodes
    const extractPositions = (nodes: TreeLayoutNode[]) => {
      nodes.forEach(node => {
        console.log(`Positioning node ${node.task.id} at (${node.x}, ${node.y}) with ${node.children.length} children`);
        
        positions.set(node.task.id!, {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          level: node.level,
          index: node.index
        });

        // Add connections to children
        node.children.forEach(child => {
          // Only create connections for children that are positioned within reasonable bounds
          if (child.x >= 0 && child.y >= 0 && child.x < 2000 && child.y < 2000) {
            // Connection from bottom center of parent to top center of child
            const fromPos = { x: node.x + node.width / 2, y: node.y + node.height };
            const toPos = { x: child.x + child.width / 2, y: child.y };
            
            // Determine connection type
            let type: 'sequential' | 'parallel' | 'merge' = 'sequential';
            if (node.children.length > 1) {
              type = child.index === 0 ? 'parallel' : 'merge';
            }

            // Create path for connection
            const path = createConnectionPath(fromPos, toPos, type);
            
            connections.push({
              from: node.task.id!,
              to: child.task.id!,
              fromPos,
              toPos,
              type,
              path
            });
            
            console.log(`Added connection from ${node.task.id} to ${child.task.id} (${type}) at path: ${path}`);
          } else {
            console.log(`Skipping connection for child ${child.task.id} at invalid position (${child.x}, ${child.y})`);
          }
        });

        // Recursively process children
        if (node.children.length > 0) {
          extractPositions(node.children);
        }
      });
    };

    extractPositions(treeNodes);
    
    console.log('Final positions:', positions.size, 'connections:', connections.length);
    console.log('Connection details:', connections.map(c => `${c.from} -> ${c.to}: ${c.path}`));
    setNodePositions(positions);
    setConnections(connections);
    } catch (error) {
      console.error('Error calculating layout:', error);
      setHasError(true);
    }
  }, [expandedNodes, calculateTreeLayout]);

  // Create professional connection paths
  const createConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }, type: string): string => {
    // For vertical layout, all connections are straight vertical lines
    // The from point is the bottom center of the parent node
    // The to point is the top center of the child node
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  const toggleNode = (taskId: string) => {
    try {
      console.log('Toggling node:', taskId, 'Current expanded nodes:', Array.from(expandedNodes));
      
      // Find the task to check if it has children using recursive search
      const findTaskInTree = (taskList: TaskTreeNode[], targetId: string): TaskTreeNode | null => {
        for (const task of taskList) {
          if (task.id === targetId) {
            return task;
          }
          if (task.children && task.children.length > 0) {
            const found = findTaskInTree(task.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };
      
      const task = findTaskInTree(tasks, taskId);
      
      if (task) {
        console.log('Task found:', task.title, 'Has children:', task.children?.length || 0);
      } else {
        console.log('Task not found:', taskId);
      }
      
      const newExpanded = new Set(expandedNodes);
      if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
        console.log('Collapsing node:', taskId);
      } else {
        newExpanded.add(taskId);
        console.log('Expanding node:', taskId);
      }
      setExpandedNodes(newExpanded);
    } catch (error) {
      console.error('Error toggling node:', error);
      setHasError(true);
    }
  };

  const handlePan = useCallback((event: any, info?: PanInfo) => {
    if (!isMobile) {
      let deltaX = 0;
      let deltaY = 0;
      
      if (info) {
        // Handle Framer Motion PanInfo
        deltaX = info.delta.x;
        deltaY = info.delta.y;
      } else if (event.movementX !== undefined) {
        // Handle mouse movement events
        deltaX = event.movementX;
        deltaY = event.movementY;
      }
      
      setViewport(prev => {
        const newX = prev.x + deltaX;
        const newY = prev.y + deltaY;
        
        // Calculate bounds to keep content inside the container
        const containerWidth = containerBounds.width;
        const containerHeight = containerBounds.height;
        
        // Estimate content bounds based on viewport scale
        const contentWidth = Math.max(800, containerWidth * 2);
        const contentHeight = Math.max(600, containerHeight * 2);
        
        // Calculate maximum allowed movement to keep content visible
        const maxX = Math.max(0, contentWidth - containerWidth);
        const maxY = Math.max(0, contentHeight - containerHeight);
        
        // Constrain the viewport to keep content inside
        const constrainedX = Math.max(-maxX, Math.min(0, newX));
        const constrainedY = Math.max(-maxY, Math.min(0, newY));
        
        return {
          ...prev,
          x: constrainedX,
          y: constrainedY
        };
      });
    }
  }, [isMobile, containerBounds]);

  const handleZoom = useCallback((delta: number) => {
    if (!isMobile) {
      setViewport(prev => ({
        ...prev,
        scale: Math.max(0.3, Math.min(2, prev.scale + delta * 0.1))
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
    try {
      const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Square;
    const isSelected = selectedTaskId === task.id;
      const expanded = expandedNodes.has(task.id!);
      
      // Simple logic: Show arrow ONLY if task has actual children (subtasks)
      const hasChildren = task.children && task.children.length > 0;
      const shouldShowArrow = hasChildren;
      
      // Debug logging for tasks with potential subtasks
      if (task.title.includes('pinea') || task.title.includes('apple') || task.title.includes('mango')) {
        console.log('Task debug:', {
          id: task.id,
          title: task.title,
          children: task.children,
          childrenLength: task.children?.length || 0,
          hasChildren: hasChildren,
          shouldShowArrow: shouldShowArrow,
          expanded: expanded
        });
      }
      
      // Debug logging for tasks with potential subtasks
      if (task.title.includes('pinea') || task.title.includes('apple') || task.title.includes('mango')) {
        console.log('Task debug:', {
          id: task.id,
          title: task.title,
          children: task.children,
          childrenLength: task.children?.length || 0,
          hasChildren: hasChildren,
          shouldShowArrow: shouldShowArrow,
          expanded: expanded
        });
      }
      
      const position = nodePositions.get(task.id!);
      const isHovered = hoveredTask === task.id;

      if (!position) return null;
    
    return (
      <motion.div
        key={task.id}
        ref={(el) => {
          if (el) nodeRefs.current.set(task.id!, el);
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
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
        {/* Professional Task Card */}
        <motion.div
          className={`
            relative w-full h-full bg-white border-2 border-slate-200 rounded-xl shadow-lg
            hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer
            ${isSelected ? 'ring-4 ring-blue-500 border-blue-400 shadow-2xl' : ''}
            ${task.status === 'Done' ? 'opacity-80 bg-green-50' : ''}
            ${isHovered ? 'shadow-xl border-slate-400 scale-105' : ''}

          `}
          onClick={() => onTaskSelect(task)}
          whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Card Content */}
          <div className="p-3 h-full flex flex-col justify-between">
                        {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await onToggleStatus(task.id!, task.status === 'Done' ? 'To Do' : 'Done');
                    } catch (error) {
                      console.error('Error toggling task status:', error);
                    }
                  }}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <StatusIcon className={`w-4 h-4 ${task.status === 'Done' ? 'text-green-600' : 'text-slate-400'}`} />
                </button>
                <span 
                  className="text-sm font-semibold text-slate-900 truncate leading-tight"
                  onMouseEnter={() => setShowTooltip(task.id!)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  {task.title}
                </span>
                {shouldShowArrow && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                      toggleNode(task.id!);
                }}
                    className="flex-shrink-0 p-1 hover:bg-blue-100 rounded-md transition-colors bg-blue-50 border border-blue-200"
                    title={expanded ? "Collapse subtasks" : "Expand subtasks"}
              >
                    {expanded ? (
                      <ChevronDown className="w-3 h-3 text-blue-600" />
                ) : (
                      <ChevronRight className="w-3 h-3 text-blue-600" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Priority Badge */}
              <div className="flex items-center gap-1">
                {task.priority && (
                  <span className={`
                    px-2 py-0.5 rounded-md text-xs font-medium border
                    ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-slate-50 text-slate-700 border-slate-200'}
                  `}>
                    {isMobile ? task.priority.charAt(0) : task.priority}
                  </span>
                )}
              </div>
          </div>
          
            {/* Middle Section - Assignee and Due Date */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <div className="flex items-center gap-1 truncate">
                <User className="w-3 h-3" />
                <span className="truncate">{task.assignee}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                </div>
              )}
              </div>
              
            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Child count */}
              {hasChildren && (
                <span className="text-xs text-slate-500 font-medium">
                  {task.children!.length} subtask{task.children!.length !== 1 ? 's' : ''}
                </span>
              )}

              {/* Action buttons */}
              <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtask(task.id!);
                  }}
                  className="p-1 hover:bg-blue-100 rounded-md transition-colors"
                  title="Add subtask"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id!);
                  }}
                  className="p-1 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            </div>
              </div>
              
          {/* Tooltip */}
          {showTooltip === task.id && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 mb-2 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 whitespace-nowrap max-w-xs"
            >
              <div className="font-semibold mb-1">{task.title}</div>
              {task.description && (
                <div className="text-slate-300 mb-2">{task.description}</div>
              )}
              <div className="flex items-center gap-2 mb-1 text-slate-300">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
          </div>
        )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
    } catch (error) {
      console.error('Error rendering task node:', error);
      setHasError(true);
      return null;
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">Something went wrong</div>
          <button 
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Container with Bounded Drag */}
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
        style={{
          cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'grab')
        }}
        onMouseDown={(e) => {
          if (!isMobile) {
            setIsDragging(true);
          }
        }}
        onMouseUp={() => {
          if (!isMobile) {
            setIsDragging(false);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setIsDragging(false);
          }
        }}
        onMouseMove={(e) => {
          if (!isMobile && isDragging) {
            handlePan(e);
          }
        }}
        onWheel={(e) => {
          if (!isMobile && e.ctrlKey) {
            e.preventDefault();
            handleZoom(e.deltaY > 0 ? -1 : 1);
          }
        }}
      >
        {/* Content Container with Bounds */}
        <motion.div
          className="relative"
          style={{
            minHeight: isMobile ? '400px' : '600px',
            minWidth: isMobile ? '400px' : '800px',
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Professional Connection Lines with Arrows */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <marker
                id="arrowhead-sequential"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#3b82f6"
                  stroke="#2563eb"
                  strokeWidth="1"
                />
              </marker>
              <marker
                id="arrowhead-parallel"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="1"
                />
              </marker>
              <marker
                id="arrowhead-merge"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1"
                />
              </marker>
            </defs>
            {connections.map((connection, index) => (
              <motion.g
                key={`${connection.from}-${connection.to}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Professional connection line */}
                <path
                  d={connection.path}
                  stroke={connection.type === 'sequential' ? '#3b82f6' : connection.type === 'parallel' ? '#10b981' : '#f59e0b'}
                  strokeWidth={connection.type === 'sequential' ? '3' : '2.5'}
                  fill="none"
                  markerEnd={`url(#arrowhead-${connection.type})`}
                  opacity={connection.type === 'sequential' ? 0.9 : 0.8}
                  strokeLinecap="round"
                />
              </motion.g>
            ))}
          </svg>

          {/* Task Nodes */}
          <AnimatePresence>
            {Array.from(nodePositions.keys()).map(taskId => {
              // Create a function to find task in the entire tree hierarchy
              const findTaskInTree = (taskList: TaskTreeNode[], targetId: string): TaskTreeNode | null => {
                for (const task of taskList) {
                  if (task.id === targetId) {
                    return task;
                  }
                  if (task.children && task.children.length > 0) {
                    const found = findTaskInTree(task.children, targetId);
                    if (found) return found;
                  }
                }
                return null;
              };
              
              const task = findTaskInTree(tasks, taskId);
              return task ? renderTaskNode(task) : null;
            })}
          </AnimatePresence>
        </motion.div>
      </div>
      

    </div>
  );
}
