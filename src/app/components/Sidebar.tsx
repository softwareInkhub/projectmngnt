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
  X,
  LogOut
} from 'lucide-react';
import { logout } from '../utils/auth';

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
    { label: "Dashboard", icon: LayoutDashboard, type: "dashboard" },
    { label: "Projects", icon: FolderOpen, type: "projects" },
    { label: "Tasks", icon: CheckSquare, type: "tasks" },
    { label: "Teams", icon: Users, type: "teams" },
    { label: "Companies", icon: Building, type: "companies" },
    { label: "Calendar", icon: Calendar, type: "calendar" },
    { label: "Reports", icon: BarChart3, type: "reports" },
    { label: "Grid Layout", icon: Grid3X3, type: "grid-layout" },
    { label: "Settings", icon: Settings, type: "settings" },
    { label: "Notifications", icon: Bell, type: "notifications" },
  ];

  const handleDragStart = (e: React.DragEvent, item: any) => {
    if (onDragStart) {
      onDragStart(e, item);
    }
  };

  // Mobile sidebar - Enhanced
  if (isMobile) {
    return (
      <aside className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Enhanced Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose}
          style={{ zIndex: 49 }}
        />
        
        {/* Enhanced Sidebar Content */}
        <div className="relative h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col mobile-optimized" style={{ zIndex: 50 }}>
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Navigation</h2>
                <p className="text-xs text-gray-500">Menu</p>
              </div>
            </div>
            <button 
              onClick={onMobileClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 relative z-10 mobile-haptic"
              style={{ zIndex: 51 }}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Enhanced Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
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
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left font-medium group mobile-haptic ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-transparent hover:border-gray-200"
                  }`}
                  draggable={isDraggable}
                  onDragStart={(e) => handleDragStart(e, item)}
                  aria-label={item.label}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}>
                    <Icon size={16} className={isActive ? "text-white" : "text-gray-600"} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {isDraggable && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Enhanced Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Profile</div>
                <div className="text-xs text-gray-500">User</div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors mobile-haptic">
                <Settings size={14} className="text-gray-500" />
              </button>
            </div>
            
            {/* Enhanced Logout Button */}
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 mobile-haptic"
              aria-label="Sign Out"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-100 text-red-600">
                <LogOut size={16} />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium">Sign Out</span>
              </div>
            </button>
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
                isDraggable ? 'cursor-grab active:cursor-grabbing hover:shadow-lg' : ''
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
                {isDraggable && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
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

      {/* Logout Button */}
      <button
        onClick={logout}
        className={`group flex items-center w-full px-3 py-3 rounded-xl transition-all duration-300 hover:bg-red-50 hover:text-red-600 text-neutral-500 hover:shadow-md ${
          isExpanded ? 'justify-start gap-3' : 'justify-center'
        }`}
        aria-label="Sign Out"
      >
        <div className="flex items-center justify-center rounded-lg transition-all duration-300 p-1">
          <LogOut 
            className={`transition-all duration-300 ${
              isExpanded ? 'flex-shrink-0' : 'mx-auto'
            }`} 
            size={20} 
            strokeWidth={1.5} 
          />
        </div>
        {isExpanded && (
          <span className="text-sm font-medium truncate transition-all duration-300">
            Sign Out
          </span>
        )}
      </button>
    </aside>
  );
} 