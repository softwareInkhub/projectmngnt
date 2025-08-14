"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Building, 
  Calendar, 
  BarChart3, 
  Grid3X3, 
  Settings, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: number;
  onNavClick: (idx: number) => void;
  onToggleGridMode?: () => void;
  isGridMode?: boolean;
  onDragStart?: (e: React.DragEvent, item: any) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  onNavClick, 
  onToggleGridMode, 
  isGridMode, 
  onDragStart, 
  isMobileOpen, 
  onMobileClose 
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Projects", icon: FolderOpen },
    { label: "Tasks", icon: CheckSquare },
    { label: "Teams", icon: Users },
    { label: "Companies", icon: Building },
    { label: "Calendar", icon: Calendar },
    { label: "Reports", icon: BarChart3 },
    { label: "Grid Layout", icon: Grid3X3 },
    { label: "Settings", icon: Settings },
    { label: "Notifications", icon: Bell },
  ];

  const handleDragStart = (e: React.DragEvent, item: any) => {
    if (onDragStart) {
      onDragStart(e, item);
    }
  };

  // Mobile sidebar
  if (isMobile) {
    return (
      <aside className={`mobile-sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="mobile-flex mobile-items-center mobile-justify-between p-4 border-b border-neutral-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="mobile-h3 text-blue-900 font-semibold">Navigation</h2>
          <button 
            onClick={onMobileClose}
            className="mobile-btn mobile-btn-secondary mobile-text-xs hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <nav className="mobile-space-y-2 p-4 flex-1 overflow-y-auto bg-white">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isGridLayoutItem = item.label === "Grid Layout";
            const isDraggable = !isGridLayoutItem && isGridMode;
            const isActive = activeTab === index;
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (isGridLayoutItem && onToggleGridMode) {
                    onToggleGridMode();
                  } else {
                    onNavClick(index);
                  }
                  // Close mobile sidebar after navigation
                  if (onMobileClose) {
                    onMobileClose();
                  }
                }}
                className={`mobile-w-full mobile-flex mobile-items-center mobile-gap-4 mobile-p-3 mobile-rounded-xl mobile-transition-all mobile-duration-300 mobile-text-left mobile-font-medium ${
                  isActive
                    ? "mobile-bg-gradient-to-r mobile-from-blue-500 mobile-to-indigo-600 mobile-text-white mobile-shadow-lg mobile-shadow-blue-500/25"
                    : "mobile-bg-white mobile-text-neutral-600 hover:mobile-bg-neutral-50 hover:mobile-text-neutral-800 mobile-border mobile-border-transparent hover:mobile-border-neutral-200"
                }`}
                draggable={isDraggable}
                onDragStart={(e) => handleDragStart(e, item)}
              >
                <div className={`mobile-w-8 mobile-h-8 mobile-rounded-lg mobile-flex mobile-items-center mobile-justify-center mobile-transition-all mobile-duration-300 ${
                  isActive 
                    ? "mobile-bg-white/20 mobile-backdrop-blur-sm" 
                    : "mobile-bg-neutral-100 mobile-text-neutral-500"
                }`}>
                  <Icon size={18} className={isActive ? "mobile-text-white" : "mobile-text-neutral-600"} />
                </div>
                <span className={`mobile-text-sm mobile-font-medium mobile-transition-colors mobile-duration-300 ${
                  isActive ? "mobile-text-white" : "mobile-text-neutral-700"
                }`}>
                  {item.label}
                </span>
                {isDraggable && (
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={12} className="mobile-text-neutral-400" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="mobile-absolute mobile-bottom-6 mobile-left-4 flex-shrink-0">
          <div className="mobile-w-10 mobile-h-10 mobile-rounded-full mobile-bg-gradient-to-r mobile-from-blue-600 mobile-to-indigo-700 mobile-flex mobile-items-center mobile-justify-center mobile-shadow-lg">
            <span className="mobile-text-white mobile-text-sm mobile-font-bold">N</span>
          </div>
        </div>
      </aside>
    );
  }

  // Desktop sidebar (existing code)
  return (
    <aside
      className={`sticky left-0 top-0 h-screen z-30 flex flex-col items-center bg-gradient-to-b from-white to-gray-50 border-r border-neutral-200 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } py-4 shadow-lg`}
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-6 p-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 text-neutral-500 hover:shadow-md"
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-3 flex-1 w-full items-center px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isGridLayoutItem = item.label === "Grid Layout";
          const isDraggable = !isGridLayoutItem && isGridMode;
          const isActive = activeTab === idx;
          
          return (
            <button
              key={item.label}
              className={`group flex items-center w-full px-3 py-3 rounded-xl transition-all duration-300 ${
                isGridLayoutItem && isGridMode
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25" 
                  : isActive 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                  : "hover:bg-neutral-100 hover:text-neutral-700 text-neutral-500 hover:shadow-md"
              } ${isExpanded ? 'justify-start gap-3' : 'justify-center'} ${
                isDraggable ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              onClick={() => {
                if (isGridLayoutItem && onToggleGridMode) {
                  onToggleGridMode();
                } else {
                  onNavClick(idx);
                }
              }}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, item)}
              aria-label={item.label}
            >
              <div className={`flex items-center justify-center rounded-lg transition-all duration-300 ${
                isActive || (isGridLayoutItem && isGridMode)
                  ? "bg-white/20 backdrop-blur-sm p-1"
                  : "p-1"
              }`}>
                <Icon 
                  className={`transition-all duration-300 ${
                    isExpanded ? 'flex-shrink-0' : 'mx-auto'
                  }`} 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />
              </div>
              {isExpanded && (
                <span className="text-sm font-medium truncate transition-all duration-300">
                  {item.label}
                </span>
              )}
              {isDraggable && isExpanded && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="mt-4 mb-2 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">
          B
        </div>
        {isExpanded && (
          <span className="text-xs text-neutral-500 mt-1">User</span>
        )}
      </div>
    </aside>
  );
} 