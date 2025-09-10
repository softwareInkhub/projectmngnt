"use client";

import React, { useState, useEffect, createContext, useContext, useCallback } from "react";

// Create context for resizable table props
const ResizableTableContext = createContext<{
  columnWidths: Record<string, number>;
  rowHeight: number;
  onMouseDown: (e: React.MouseEvent, resizeType: string, key?: string) => void;
  isResizing: string | null;
}>({
  columnWidths: {},
  rowHeight: 60,
  onMouseDown: () => {},
  isResizing: null
});

interface ResizableTableProps {
  children: React.ReactNode;
  defaultColumnWidths?: Record<string, number>;
  defaultRowHeight?: number;
  className?: string;
}

export default function ResizableTable({ 
  children, 
  defaultColumnWidths = {},
  defaultRowHeight = 60,
  className = ""
}: ResizableTableProps) {
  // Resizable columns and rows state
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [rowHeight, setRowHeight] = useState(defaultRowHeight);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);

  // Resizable columns and rows handlers
  const handleMouseDown = (e: React.MouseEvent, resizeType: string, key?: string) => {
    e.preventDefault();
    setIsResizing(resizeType);
    setResizeStartX(e.clientX);
    setResizeStartY(e.clientY);
    
    if (resizeType.startsWith('column-') && key) {
      setResizeStartWidth(columnWidths[key] || 120);
    } else if (resizeType === 'row') {
      setResizeStartHeight(rowHeight);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    if (isResizing.startsWith('column-')) {
      const columnKey = isResizing.replace('column-', '');
      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(50, resizeStartWidth + deltaX); // Minimum width of 50px
      
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    } else if (isResizing === 'row') {
      const deltaY = e.clientY - resizeStartY;
      const newHeight = Math.max(40, resizeStartHeight + deltaY); // Minimum height of 40px
      setRowHeight(newHeight);
    }
  }, [isResizing, resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
  }, []);

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Set appropriate cursor based on resize type
      if (isResizing.startsWith('column-')) {
        document.body.style.cursor = 'col-resize';
      } else if (isResizing === 'row') {
        document.body.style.cursor = 'row-resize';
      }
      
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // No need to clone children since we're using context now

  return (
    <ResizableTableContext.Provider value={{
      columnWidths,
      rowHeight,
      onMouseDown: handleMouseDown,
      isResizing
    }}>
      <div className={`relative ${className}`}>
        {/* Row resize handle */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300 hover:bg-blue-500 cursor-row-resize opacity-0 hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleMouseDown(e, 'row')}
        />
        {children}
      </div>
    </ResizableTableContext.Provider>
  );
}

// Helper component for resizable table headers
export function ResizableTableHeader({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead className={`bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-lg border-b border-slate-300 relative ${className}`}>
      {children}
    </thead>
  );
}

// Helper component for resizable table headers
export function ResizableTableHeaderCell({ 
  children, 
  columnKey, 
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  columnKey: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { columnWidths, onMouseDown } = useContext(ResizableTableContext);
  
  return (
    <th 
      className={`text-left px-2 py-1.5 relative select-none ${className}`}
      style={{ width: `${columnWidths[columnKey] || 120}px`, ...style }}
    >
      {children}
      <div 
        className="absolute top-0 right-0 w-1 h-full bg-slate-300 hover:bg-blue-500 cursor-col-resize opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={(e) => onMouseDown(e, `column-${columnKey}`, columnKey)}
      />
    </th>
  );
}

// Helper component for resizable table body
export function ResizableTableBody({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { rowHeight } = useContext(ResizableTableContext);
  
  return (
    <tbody className={`text-lg overflow-visible ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'tr') {
          // Only pass style prop, not custom props
          const existingStyle = (child.props as any)?.style || {};
          return React.cloneElement(child as React.ReactElement<any>, {
            style: { height: `${rowHeight}px`, ...existingStyle }
          });
        }
        return child;
      })}
    </tbody>
  );
}

// Helper component for resizable table cells
export function ResizableTableCell({ 
  children, 
  columnKey, 
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  columnKey: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { columnWidths } = useContext(ResizableTableContext);
  
  return (
    <td 
      className={`px-2 py-2 align-middle overflow-hidden ${className}`}
      style={{ width: `${columnWidths[columnKey] || 120}px`, ...style }}
    >
      {children}
    </td>
  );
}
