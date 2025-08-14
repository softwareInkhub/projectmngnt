'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Layout, 
  Grid, 
  Columns, 
  Rows, 
  Square, 
  Maximize2, 
  X, 
  Move, 
  GripVertical,
  Monitor,
  Smartphone,
  Plus,
  CheckSquare,
  Users,
  BarChart2,
  Calendar,
  FileText
} from 'lucide-react';
import LayoutComponentRenderer from './LayoutComponentRenderer';

interface LayoutCell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  component: string | null;
  componentProps?: Record<string, unknown>;
}

interface LayoutPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  cells: LayoutCell[];
  description: string;
}

interface SnapLayoutManagerProps {
  children: React.ReactNode;
  onLayoutChange?: (layout: LayoutCell[]) => void;
  initialLayout?: LayoutCell[];
  onOpenTab?: (tabType: string, context?: Record<string, unknown>) => void;
}

const layoutPresets: LayoutPreset[] = [
  {
    id: 'single',
    name: 'Single',
    icon: Maximize2,
    description: 'Full width layout',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 1, height: 1, component: null }
    ]
  },
  {
    id: 'two-column',
    name: 'Two Column',
    icon: Columns,
    description: 'Split screen layout',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 0.5, height: 1, component: null },
      { id: 'cell-2', x: 0.5, y: 0, width: 0.5, height: 1, component: null }
    ]
  },
  {
    id: 'three-column',
    name: 'Three Column',
    icon: Grid,
    description: 'Three equal columns',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 0.33, height: 1, component: null },
      { id: 'cell-2', x: 0.33, y: 0, width: 0.34, height: 1, component: null },
      { id: 'cell-3', x: 0.67, y: 0, width: 0.33, height: 1, component: null }
    ]
  },
  {
    id: 'main-sidebar',
    name: 'Main + Sidebar',
    icon: Layout,
    description: 'Large main area with sidebar',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 0.7, height: 1, component: null },
      { id: 'cell-2', x: 0.7, y: 0, width: 0.3, height: 1, component: null }
    ]
  },
  {
    id: 'quadrant',
    name: 'Quadrant',
    icon: Square,
    description: 'Four equal quadrants',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 0.5, height: 0.5, component: null },
      { id: 'cell-2', x: 0.5, y: 0, width: 0.5, height: 0.5, component: null },
      { id: 'cell-3', x: 0, y: 0.5, width: 0.5, height: 0.5, component: null },
      { id: 'cell-4', x: 0.5, y: 0.5, width: 0.5, height: 0.5, component: null }
    ]
  },
  {
    id: 'stacked',
    name: 'Stacked',
    icon: Rows,
    description: 'Vertical stack layout',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 1, height: 0.5, component: null },
      { id: 'cell-2', x: 0, y: 0.5, width: 1, height: 0.5, component: null }
    ]
  }
];

const availableComponents: Array<{ id: string; name: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
  { id: 'projects', name: 'Projects', icon: Grid },
  { id: 'tasks', name: 'Tasks', icon: CheckSquare },
  { id: 'teams', name: 'Teams', icon: Users },
  { id: 'analytics', name: 'Analytics', icon: BarChart2 },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'reports', name: 'Reports', icon: FileText }
];

export default function SnapLayoutManager({ 
  children, 
  onLayoutChange, 
  initialLayout,
  onOpenTab = () => {}
}: SnapLayoutManagerProps) {
  const [isLayoutMode, setIsLayoutMode] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<LayoutCell[]>(initialLayout || layoutPresets[0].cells);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [resizingCell, setResizingCell] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLayoutSelect = (preset: LayoutPreset) => {
    // Apply the layout and automatically add components to each cell
    const layoutWithComponents = preset.cells.map((cell, index) => ({
      ...cell,
      component: availableComponents[index]?.id || null
    }));
    setCurrentLayout(layoutWithComponents);
    setShowLayoutPicker(false);
    setIsLayoutMode(true);
    onLayoutChange?.(layoutWithComponents);
  };

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setShowComponentPicker(true);
  };

  const handleComponentSelect = (componentId: string) => {
    if (selectedCell) {
      const updatedLayout = currentLayout.map(cell => 
        cell.id === selectedCell 
          ? { ...cell, component: componentId }
          : cell
      );
      setCurrentLayout(updatedLayout);
      onLayoutChange?.(updatedLayout);
    }
    setShowComponentPicker(false);
    setSelectedCell(null);
  };

  const handleDragStart = (e: React.MouseEvent, cellId: string) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent, cellId: string) => {
    e.stopPropagation();
    setResizingCell(cellId);
    const cell = currentLayout.find(c => c.id === cellId);
    if (cell) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: cell.width,
        height: cell.height
      });
    }
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingCell || !resizeStart) return;
    
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const containerHeight = containerRef.current?.offsetHeight || 1;
    const deltaX = (e.clientX - resizeStart.x) / containerWidth;
    const deltaY = (e.clientY - resizeStart.y) / containerHeight;
    
    setCurrentLayout(prev => {
      const resizingCellIndex = prev.findIndex(cell => cell.id === resizingCell);
      if (resizingCellIndex === -1) return prev;
      
      const resizingCellData = prev[resizingCellIndex];
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      
      // Handle different resize directions
      if (deltaX !== 0) {
        newWidth = Math.max(0.1, Math.min(1, resizeStart.width + deltaX));
      }
      if (deltaY !== 0) {
        newHeight = Math.max(0.1, Math.min(1, resizeStart.height + deltaY));
      }
      
      // Calculate how much space the resizing cell is taking
      const widthChange = newWidth - resizingCellData.width;
      const heightChange = newHeight - resizingCellData.height;
      
      // Update the resizing cell
      const updatedLayout = [...prev];
      updatedLayout[resizingCellIndex] = {
        ...resizingCellData,
        width: newWidth,
        height: newHeight
      };
      
      // Adjust other cells to fill remaining space
      const otherCells = updatedLayout.filter((_, index) => index !== resizingCellIndex);
      if (otherCells.length > 0) {
        // Calculate total space taken by other cells
        const totalOtherWidth = otherCells.reduce((sum, cell) => sum + cell.width, 0);
        const totalOtherHeight = otherCells.reduce((sum, cell) => sum + cell.height, 0);
        
        // Distribute the space change proportionally among other cells
        otherCells.forEach((cell, index) => {
          const cellIndex = updatedLayout.findIndex(c => c.id === cell.id);
          if (cellIndex !== -1) {
            const widthRatio = totalOtherWidth > 0 ? cell.width / totalOtherWidth : 1 / otherCells.length;
            const heightRatio = totalOtherHeight > 0 ? cell.height / totalOtherHeight : 1 / otherCells.length;
            
            updatedLayout[cellIndex] = {
              ...cell,
              width: Math.max(0.1, cell.width - (widthChange * widthRatio)),
              height: Math.max(0.1, cell.height - (heightChange * heightRatio))
            };
          }
        });
      }
      
      return updatedLayout;
    });
  }, [resizingCell, resizeStart]);

  const handleResizeEnd = useCallback(() => {
    setResizingCell(null);
    onLayoutChange?.(currentLayout);
  }, [onLayoutChange, currentLayout]);

  // Add mouse event listeners for resize
  useEffect(() => {
    if (resizingCell) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingCell, handleResizeMove, handleResizeEnd]);

  const renderLayoutGrid = () => {
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-full min-h-[600px] bg-slate-50 rounded-lg overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(12, 1fr)',
          gap: '1px',
          background: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) calc(100% / 12)'
        }}
      >
        {currentLayout.map((cell) => (
          <div
            key={cell.id}
            className={`
              relative bg-white border-2 border-dashed border-slate-300 rounded-lg overflow-hidden
              ${cell.component ? 'border-solid border-blue-500 hover:border-blue-600' : 'hover:border-blue-400'}
              ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}
              ${resizingCell === cell.id ? 'border-blue-600 border-4 shadow-lg' : ''}
              transition-all duration-200 group
            `}
            style={{
              gridColumn: `${Math.floor(cell.x * 12) + 1} / span ${Math.floor(cell.width * 12)}`,
              gridRow: `${Math.floor(cell.y * 12) + 1} / span ${Math.floor(cell.height * 12)}`,
            }}
            onClick={() => !cell.component && handleCellClick(cell.id)}
            onMouseDown={(e) => handleDragStart(e, cell.id)}
            onMouseUp={handleDragEnd}
          >
            {cell.component ? (
              <div className="h-full w-full">
                <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(cell.id);
                    }}
                    className="p-1 bg-white/80 backdrop-blur-sm rounded text-slate-600 hover:text-slate-800 hover:bg-white transition-colors"
                    title="Change component"
                  >
                    <Grid size={12} />
                  </button>
                </div>
                <div className="h-full w-full">
                  <LayoutComponentRenderer 
                    componentId={cell.component} 
                    className="h-full w-full"
                    onOpenTab={onOpenTab}
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Plus size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Click to add</p>
                </div>
              </div>
            )}
            
            {/* Resize indicator */}
            {resizingCell === cell.id && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium z-20">
                {Math.round(cell.width * 100)}% × {Math.round(cell.height * 100)}%
              </div>
            )}
            
            {/* Subtle resize border indicator */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300/30 rounded-lg pointer-events-none transition-all duration-200" />
            
            {/* Resize tooltip */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              Drag edges or corners to resize
            </div>
            
            {/* Corner resize handles */}
            <div 
              className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            <div 
              className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            <div 
              className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            
            {/* Edge resize handles - Top */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-blue-500 rounded-full cursor-n-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            
            {/* Edge resize handles - Bottom */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-blue-500 rounded-full cursor-s-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            
            {/* Edge resize handles - Left */}
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-blue-500 rounded-full cursor-w-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
            
            {/* Edge resize handles - Right */}
            <div 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-blue-500 rounded-full cursor-e-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={(e) => handleResizeStart(e, cell.id)}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!isLayoutMode) {
    return (
      <div className="relative group">
        {/* Layout Button */}
        <div 
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setShowLayoutPicker(true)}
        >
          <button
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 opacity-0 hover:opacity-100 group-hover:opacity-100"
          >
            <Layout size={20} />
          </button>
        </div>
        
        {/* Original Content */}
        {children}
        
                {/* Layout Picker Modal */}
        {showLayoutPicker && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLayoutPicker(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Choose Layout</h2>
                  <button
                    onClick={() => setShowLayoutPicker(false)}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-slate-600 mt-2">Select a layout template to organize your workspace</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {layoutPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLayoutSelect(preset)}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <preset.icon size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{preset.name}</h3>
                          <p className="text-sm text-slate-500">{preset.description}</p>
                        </div>
                      </div>
                      
                      {/* Layout Preview */}
                      <div className="w-full h-20 bg-slate-100 rounded border-2 border-slate-200 relative overflow-hidden">
                        {preset.cells.map((cell, index) => (
                          <div
                            key={index}
                            className="absolute bg-blue-200 border border-blue-300"
                            style={{
                              left: `${cell.x * 100}%`,
                              top: `${cell.y * 100}%`,
                              width: `${cell.width * 100}%`,
                              height: `${cell.height * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile fallback - stack all components
  if (isMobile && isLayoutMode) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mobile Layout</h2>
          <button
            onClick={() => setIsLayoutMode(false)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>
        {currentLayout.map((cell) => (
          <div key={cell.id} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{cell.component || 'Empty Cell'}</h3>
              <Move size={16} className="text-slate-400" />
            </div>
            <div className="text-sm text-slate-500">
              {cell.component ? 'Component loaded' : 'Tap to add component'}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-slate-50">
      {/* Layout Mode Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Layout Mode</h1>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Monitor size={16} />
              <span>Desktop Layout</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLayoutPicker(true)}
              className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Change Layout
            </button>
            <button
              onClick={() => setIsLayoutMode(false)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Exit Layout
            </button>
          </div>
        </div>
      </div>
      
      {/* Layout Grid */}
      <div className="pt-16 h-full">
        {renderLayoutGrid()}
      </div>
      
      {/* Component Picker Modal */}
      {showComponentPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold">Add Component</h3>
              <p className="text-slate-600 mt-1">Choose a component to add to this layout cell</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {availableComponents.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => handleComponentSelect(component.id)}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <component.icon size={16} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">{component.name}</p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => setShowComponentPicker(false)}
                className="w-full px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Layout Picker Modal (reused) */}
      {showLayoutPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Change Layout</h2>
                <button
                  onClick={() => setShowLayoutPicker(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-slate-600 mt-2">Select a new layout template</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {layoutPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLayoutSelect(preset)}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <preset.icon size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{preset.name}</h3>
                        <p className="text-sm text-slate-500">{preset.description}</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-20 bg-slate-100 rounded border-2 border-slate-200 relative overflow-hidden">
                      {preset.cells.map((cell, index) => (
                        <div
                          key={index}
                          className="absolute bg-blue-200 border border-blue-300"
                          style={{
                            left: `${cell.x * 100}%`,
                            top: `${cell.y * 100}%`,
                            width: `${cell.width * 100}%`,
                            height: `${cell.height * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 