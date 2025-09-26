"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Building, 
  Calendar, 
  BarChart3, 
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

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, type: "dashboard" },
    { label: "Projects", icon: FolderOpen, type: "projects" },
    { label: "Tasks", icon: CheckSquare, type: "tasks" },
    { label: "Teams", icon: Users, type: "teams" },
    { label: "Companies", icon: Building, type: "companies" },
    { label: "Calendar", icon: Calendar, type: "calendar" },
    { label: "Reports", icon: BarChart3, type: "reports" },
    { label: "Settings", icon: Settings, type: "settings" },
    { label: "Notifications", icon: Bell, type: "notifications" },
  ];

  const handleDragStart = (e: React.DragEvent, item: any) => {
    if (onDragStart) {
      onDragStart(e, item);
    }
  };

  // Fixed compact sidebar (no expandable behavior)

  // Desktop sidebar (existing code)
  return (
    <aside
      className={"sticky left-0 top-0 h-screen z-30 flex flex-col items-center bg-gradient-to-b from-white to-gray-50 border-r border-neutral-200 w-20 shadow-lg"}
    >
      {/* Brand badge */}
      <div className="mt-3 mb-4">
        <div className="w-10 h-10 rounded-xl text-[25px] bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center text-white font-bold shadow-md">
          B
        </div>
      </div>

      {/* Navigation Items - compact icons with labels */}
      <nav className="flex flex-col items-center gap-4 flex-1 w-full px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === idx;
          const isDraggable = isGridMode;
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-blue-600' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
              } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
              onClick={() => onNavClick(idx)}
              draggable={isDraggable}
              onDragStart={(e) => onDragStart && onDragStart(e, item)}
              aria-label={item.label}
            >
              <Icon size={24} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className={`leading-none ${isActive ? 'text-blue-600' : ''} text-[12px] font-semibold`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="mb-3 w-full px-2">
        <button
          onClick={async () => {
            try {
              await logout();
              window.location.href = '/authPage';
            } catch (error) {
              console.error('Logout failed:', error);
              window.location.href = '/authPage';
            }
          }}
          className="w-full flex flex-col items-center gap-1 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={20} />
          <span className="text-[12px] font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}