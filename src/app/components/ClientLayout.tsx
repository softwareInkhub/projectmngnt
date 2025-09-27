
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContextSidebar from "./ContextSidebar";
import SnapLayoutManager from "./SnapLayoutManager";
import GridLayoutManager from "./GridLayoutManager";
import { Menu, MoreHorizontal, User, LogOut, LayoutDashboard, Kanban, ListTodo, Landmark, Grid3X3, X, Pin, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Project {
  name: string;
  company?: string;
  status?: string;
  description?: string;
  tasks?: Array<{ title: string; status: string }>;
  sprints?: Array<{ name: string; start: string; end: string }>;
  members?: string[];
  activity?: Array<{ user: string; action: string; target: string; time: string }>;
  attachments?: Array<{ name: string; size: string; type: string }>;
}
import ProjectsAnalyticsPage from "../projects/page";
// import DepartmentsPage from "./DepartmentsPage";
import TeamsPageSheet from "../teams/components/TeamsPageSheet";
import SprintsPage from "./SprintsPage";
import StoriesPage from "./StoriesPage";
import TasksPageSheet from "../tasks/components/TasksPageSheet";
import TasksPage from "../tasks/components/EnhancedTaskModal";
import TeamsPage from "../teams/page";
import CalendarPage from "../calander/page";
import ReportsPage from "../reports/page";
import SettingsPageComponent from "../setting/page";
import NotificationsPage from "../notification/page";
import CompaniesPage from "../companies/page";
import NewTabPage from "./NewTabPage";
// import CreateProjectPage from "./CreateProjectPage";
// import CreateTaskPage from "./CreateTaskPage";
// import CreateTeamPage from "./CreateTeamPage";
import CreateSprintPage from "./CreateSprintPage";
// import CreateDepartmentPage from "./CreateDepartmentPage";
import CreateStoryPage from "./CreateStoryPage";
import { logout } from '../utils/auth';
import Image from 'next/image';
import { useUser } from '../contexts/UserContext';

// Dashboard UI removed; dashboard/page.tsx renders the real dashboard content.

const SHEET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  project: ProjectsAnalyticsPage,
  // departments: DepartmentsPage,
  teams: TeamsPageSheet,
  sprints: SprintsPage,
  stories: StoriesPage,
  tasks: TasksPage, // Changed from TasksPageSheet to TasksPage for proper table view
  "company-teams": TeamsPageSheet,
  "company-tasks": TasksPage,
  "company-projects": ProjectsAnalyticsPage,
  // "create-project": CreateProjectPage,
  // "create-task": CreateTaskPage,
  // "create-team": CreateTeamPage,
  "create-sprint": CreateSprintPage,
  // "create-department": CreateDepartmentPage,
  "create-story": CreateStoryPage,
  // "edit-project": CreateProjectPage,
  // "edit-task": CreateTaskPage,
  // "edit-team": CreateTeamPage,
  "edit-sprint": CreateSprintPage,
  "view-project": ProjectsAnalyticsPage,
  "view-task": TasksPageSheet,
  "view-team": TeamsPageSheet,
  "view-sprint": SprintsPage,
  // "view-department": DepartmentsPage,
  "view-story": StoriesPage,
};

function RoutePageWrapper(children?: React.ReactNode) {
  return function WrappedRoute() {
    return <>{children}</>;
  };
}

export default function ClientLayout({ children }: { children?: React.ReactNode }) {
  const { currentUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Route mapping for tabs
  const routeMap: Record<string, string> = {
    dashboard: "/dashboard",
    projects: "/projects",
    tasks: "/tasks",
    teams: "/teams",
    companies: "/companies",
    calendar: "/calander",
    reports: "/reports",
    settings: "/setting",
    notifications: "/notification",
    TermsandServices: "/TermsandServices",
    PrivacyPolicy: "/PrivacyPolicy",
  };

  // Set Dashboard as the default open tab
  const [openTabs, setOpenTabs] = useState<{ type: string; key: string; title: string; component: React.ComponentType<any>; project?: Project; context?: any }[]>([]);
  
  // Initialize tabs after component mounts to avoid hydration mismatch
  useEffect(() => {
    if (openTabs.length === 0) {
      // Show route-provided page inside shell as the first tab
      const RoutePage = () => <>{children}</>;

      // Determine initial title from current path
      const initialType = (Object.entries(routeMap).find(([, p]) => pathname && pathname.startsWith(p))?.[0]) || "dashboard";
      const initialTitle = sidebarTabMap.find(t => t.type === initialType)?.title || "Dashboard";

      setOpenTabs([
        { type: initialType, key: `route-${Math.random().toString(36).substr(2, 9)}`, title: initialTitle, component: RoutePage }
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTabs.length, children]);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [pinnedTabs, setPinnedTabs] = useState<Set<string>>(new Set());
  const [isGridMode, setIsGridMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  
  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileContextSidebarOpen, setIsMobileContextSidebarOpen] = useState(false);

  // Check if device is mobile - only on client side to avoid hydration mismatch
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-sidebar') && !target.closest('.mobile-sidebar-toggle')) {
        setIsMobileSidebarOpen(false);
        setIsMobileContextSidebarOpen(false);
      }
    };

    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  // Map sidebar index to tab type and title
  const sidebarTabMap = [
    { type: "dashboard", title: "Dashboard", component: RoutePageWrapper(children) },
    { type: "projects", title: "All Projects", component: ProjectsAnalyticsPage },
    { type: "tasks", title: "Tasks", component: TasksPage },
    { type: "teams", title: "Teams", component: TeamsPage },
    { type: "companies", title: "Companies", component: CompaniesPage },
    { type: "calendar", title: "Calendar", component: CalendarPage },
    { type: "reports", title: "Reports", component: ReportsPage },
    { type: "settings", title: "Settings", component: SettingsPageComponent },
    { type: "notifications", title: "Notifications", component: NotificationsPage },
  ];

  // Derive active sidebar tab from current pathname
  const currentTypeFromPath = (Object.entries(routeMap).find(([, p]) => pathname && pathname.startsWith(p))?.[0]) || "dashboard";
  const sidebarActiveTab = Math.max(0, sidebarTabMap.findIndex(t => t.type === currentTypeFromPath));

  // Handlers to open new tabs
  const openTab = (type: string, title?: string, context?: Record<string, unknown>) => {
    const route = routeMap[type];

    // Check for existing tab first using current state
    const existingIdx = openTabs.findIndex((tab) => tab.type === type && tab.context?.company === context?.company);
    if (existingIdx !== -1) {
      setActiveTabIdx(existingIdx);
      if (route) router.push(route);
      return;
    }

    // Resolve component and title
    let component: React.ComponentType<any> | undefined;
      let tabTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
      
      if (SHEET_COMPONENTS[type]) {
        component = SHEET_COMPONENTS[type];
      if (!title) tabTitle = type.charAt(0).toUpperCase() + type.slice(1);
      } else {
        const sidebarTab = sidebarTabMap.find(tab => tab.type === type);
        if (sidebarTab) {
          component = sidebarTab.component;
        if (!title) tabTitle = sidebarTab.title;
        }
      }
      
      if (!component) {
        console.warn(`No component found for type: ${type}`);
      return;
      }
      
    const uniqueKey = context ? `${type}-${JSON.stringify(context)}-${Math.random().toString(36).substr(2, 9)}` : `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const newTabs = [...openTabs, { type, key: uniqueKey, title: tabTitle || type, component, context }];
    setOpenTabs(newTabs);
      setActiveTabIdx(newTabs.length - 1);

    // Navigate after state updates scheduled
    if (route) router.push(route);
  };

  const closeTab = (idx: number) => {
    setOpenTabs((prev) => {
      const newTabs = prev.filter((_, i) => i !== idx);
      // If we're closing the active tab, switch to the previous tab or the first tab
      if (idx === activeTabIdx) {
        if (newTabs.length === 0) {
          // If no tabs left, open dashboard
          setActiveTabIdx(0);
          return [{ type: "dashboard", key: `dashboard-${Math.random().toString(36).substr(2, 9)}`, title: "Dashboard", component: RoutePageWrapper(children) } as any];
        } else {
          setActiveTabIdx(Math.max(0, idx - 1));
        }
      } else if (idx < activeTabIdx) {
        // If we're closing a tab before the active tab, adjust the active index
        setActiveTabIdx(activeTabIdx - 1);
      }
      return newTabs;
    });
  };

  const togglePinTab = (tabKey: string) => {
    setPinnedTabs((prev) => {
      const newPinned = new Set(prev);
      if (newPinned.has(tabKey)) {
        newPinned.delete(tabKey);
      } else {
        newPinned.add(tabKey);
      }
      return newPinned;
    });
  };

  const openNewTab = () => {
    setOpenTabs((prev) => {
      const newTabs = [...prev, { type: "new-tab", key: `new-tab-${Math.random().toString(36).substr(2, 9)}`, title: "New Tab", component: NewTabPage }];
      setActiveTabIdx(newTabs.length - 1);
      return newTabs;
    });
  };

  const onSidebarNavClick = (idx: number) => {
    const tab = sidebarTabMap[idx];
    const route = routeMap[tab.type];
    
    let customTitle = tab.title;
    if (tab.type === "projects") customTitle = "All Projects";
    if (tab.type === "companies") customTitle = "Companies";

    const existingIdx = openTabs.findIndex((t) => t.type === tab.type);
      if (existingIdx !== -1) {
        setActiveTabIdx(existingIdx);
      if (route) router.push(route);
      return;
    }

    const newTabs = [...openTabs, { ...tab, key: `${tab.type}-${Math.random().toString(36).substr(2, 9)}`, title: customTitle }];
    setOpenTabs(newTabs);
    setActiveTabIdx(newTabs.length - 1);
    if (route) router.push(route);
  };

  // Handler to open company-specific projects
  const onOpenCompanyProjects = (companyName: string) => {
    setOpenTabs((prev) => {
      const tabKey = `company-projects-${companyName}`;
      const existingIdx = prev.findIndex((t) => t.key === tabKey);
      if (existingIdx !== -1) {
        setActiveTabIdx(existingIdx);
        return prev;
      }
      // Add company projects tab at the end
      const newTabs = [
        ...prev,
        {
          type: "company-projects",
          key: tabKey,
          title: `${companyName} Projects`,
          component: ProjectsAnalyticsPage,
        },
      ];
      setActiveTabIdx(newTabs.length - 1);
      return newTabs;
    });
  };

  const handleSidebarDragStart = (e: React.DragEvent, item: Record<string, unknown>) => {
    // Create proper drag data structure for grid layout
    const dragData = {
      type: item.type,
      label: item.label,
      title: item.label,
      source: 'sidebar'
    };
    setDraggedItem(dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleTabDragStart = (e: React.DragEvent, tab: Record<string, unknown>) => {
    setDraggedItem({
      type: tab.type,
      label: tab.title,
      component: tab.component,
      project: tab.project,
      context: tab.context
    });
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: tab.type,
      label: tab.title,
      component: tab.component,
      project: tab.project,
      context: tab.context
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Map tab type to sidebar index
  const sidebarIndexMap: Record<string, number> = {
    dashboard: 0,
    projects: 1,
    tasks: 2,
    teams: 3,
    companies: 4,
    calendar: 5,
    reports: 6,
    settings: 7,
    notifications: 8,
    // Add missing types that are opened from the sidebar
    project: 1, // Maps to Projects tab
    departments: 4, // Maps to Companies tab (since departments are in companies)
    sprints: 4, // Maps to Companies tab (since sprints are in companies)
    stories: 4, // Maps to Companies tab (since stories are in companies)
    // Company-specific types - keep sidebar on Companies tab
    "company-teams": 4, // Maps to Companies tab
    "company-tasks": 4, // Maps to Companies tab
    "company-projects": 4, // Maps to Companies tab
  };

  // Mobile navigation items
  const mobileNavItems = [
    { label: "Dashboard", icon: "📊", type: "dashboard" },
    { label: "All Projects", icon: "📁", type: "projects" },
    { label: "Tasks", icon: "✅", type: "tasks" },
    { label: "Teams", icon: "👥", type: "teams" },
    { label: "Companies", icon: "🏢", type: "companies" },
    { label: "Calendar", icon: "📅", type: "calendar" },
    { label: "Reports", icon: "📈", type: "reports" },
  ];

  // Mobile layout
  if (isMobile) {
    return (
      <div className="mobile-page antialiased bg-background text-foreground">
        {/* Enhanced Mobile Header */}
        <header className="mobile-header">
          <button 
            onClick={() => {
              console.log('Hamburger clicked, current state:', isMobileSidebarOpen);
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            }}
            className="p-3 text-gray-600 hover:text-gray-800 transition-colors mobile-haptic rounded-xl hover:bg-gray-100"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
          <h1 className="mobile-h3 mobile-flex-1 mobile-text-center mobile-font-semibold">
            {sidebarActiveTab === 0 && "Dashboard"}
            {sidebarActiveTab === 1 && "All Projects"}
            {sidebarActiveTab === 2 && "Tasks"}
            {sidebarActiveTab === 3 && "Teams"}
            {sidebarActiveTab === 4 && "Companies"}
            {sidebarActiveTab === 5 && "Calendar"}
            {sidebarActiveTab === 6 && "Reports"}
            {sidebarActiveTab === 7 && "Settings"}
            {sidebarActiveTab === 8 && "Notifications"}
          </h1>
          <button 
            onClick={() => {
              console.log('Context button clicked, current state:', isMobileContextSidebarOpen);
              setIsMobileContextSidebarOpen(!isMobileContextSidebarOpen);
            }}
            className="p-3 text-gray-600 hover:text-gray-800 transition-colors ml-auto mobile-haptic rounded-xl hover:bg-gray-100"
            aria-label="Open context menu"
          >
            <MoreHorizontal size={18} />
          </button>
        </header>

        {/* Mobile Main Sidebar (left) */}
        <Sidebar
          activeTab={sidebarActiveTab}
          onNavClick={onSidebarNavClick}
          onToggleGridMode={() => setIsGridMode(!isGridMode)}
          isGridMode={isGridMode}
          onDragStart={() => {}}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Mobile Context Sidebar (right) */}
        <ContextSidebar
          activeTab={sidebarActiveTab}
          onOpenTab={(tabName) => openTab(tabName, undefined, {})}
          onClose={() => setIsMobileContextSidebarOpen(false)}
          isMobile={true}
          isMobileOpen={isMobileContextSidebarOpen}
          onMobileClose={() => setIsMobileContextSidebarOpen(false)}
        />

        {/* Mobile Overlay */}
        <div 
          className={`mobile-overlay ${(isMobileSidebarOpen || isMobileContextSidebarOpen) ? 'open' : ''}`}
          onClick={() => {
            setIsMobileSidebarOpen(false);
            setIsMobileContextSidebarOpen(false);
          }}
        />

        {/* Mobile Content */}
        <main className="mobile-content pb-20">
          {openTabs[activeTabIdx] && (() => {
            const TabComponent = openTabs[activeTabIdx].component;
            return (
              <div className="mobile-animate-fade-in">
                <TabComponent
                  open={true}
                  onClose={() => closeTab(activeTabIdx)}
                  onOpenTab={openTab}
                  project={openTabs[activeTabIdx].project}
                  context={openTabs[activeTabIdx].context}
                />
              </div>
            );
          })()}
        </main>

        {/* Mobile Footer Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40">
          <div className="flex items-center justify-around py-1.5">
            {/* Home */}
            <button 
              onClick={() => onSidebarNavClick(0)}
              className={`flex flex-col items-center gap-0 p-1 rounded-lg transition-colors hover:bg-slate-50 ${
                sidebarActiveTab === 0 ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              <LayoutDashboard size={16} className={sidebarActiveTab === 0 ? 'text-blue-600' : 'text-slate-600'} />
              <span className={`text-[9px] font-medium ${sidebarActiveTab === 0 ? 'text-blue-600' : 'text-slate-600'}`}>Home</span>
            </button>

            {/* Projects */}
            <button 
              onClick={() => onSidebarNavClick(1)}
              className={`flex flex-col items-center gap-0 p-1 rounded-lg transition-colors hover:bg-slate-50 ${
                sidebarActiveTab === 1 ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              <Kanban size={16} className={sidebarActiveTab === 1 ? 'text-blue-600' : 'text-slate-600'} />
              <span className={`text-[9px] font-medium ${sidebarActiveTab === 1 ? 'text-blue-600' : 'text-slate-600'}`}>Projects</span>
            </button>

            {/* Tasks */}
            <button 
              onClick={() => onSidebarNavClick(2)}
              className={`flex flex-col items-center gap-0 p-1 rounded-lg transition-colors hover:bg-slate-50 ${
                sidebarActiveTab === 2 ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              <ListTodo size={16} className={sidebarActiveTab === 2 ? 'text-blue-600' : 'text-slate-600'} />
              <span className={`text-[9px] font-medium ${sidebarActiveTab === 2 ? 'text-blue-600' : 'text-slate-600'}`}>Tasks</span>
            </button>

            {/* Companies */}
            <button 
              onClick={() => onSidebarNavClick(4)}
              className={`flex flex-col items-center gap-0 p-1 rounded-lg transition-colors hover:bg-slate-50 ${
                sidebarActiveTab === 4 ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              <Landmark size={16} className={sidebarActiveTab === 4 ? 'text-blue-600' : 'text-slate-600'} />
              <span className={`text-[9px] font-medium ${sidebarActiveTab === 4 ? 'text-blue-600' : 'text-slate-600'}`}>Companies</span>
            </button>

            {/* Logout */}
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
              className="flex flex-col items-center gap-0 p-1 rounded-lg transition-colors hover:bg-red-50 text-red-600"
            >
              <LogOut size={16} className="text-red-600" />
              <span className="text-[9px] font-medium text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (existing code)
  return (
    <div className="flex h-screen w-screen overflow-hidden antialiased bg-background text-foreground">
      <Sidebar
        activeTab={sidebarActiveTab}
        onNavClick={onSidebarNavClick}
        onToggleGridMode={() => setIsGridMode(!isGridMode)}
        isGridMode={isGridMode}
        onDragStart={handleSidebarDragStart}
      />
      {/* Show ContextSidebar for all tabs except Dashboard, Grid Dashboard, Settings, and Notifications */}
      {(sidebarActiveTab === 1 || sidebarActiveTab === 2 || sidebarActiveTab === 3 || sidebarActiveTab === 4 || sidebarActiveTab === 5 || sidebarActiveTab === 6) && (
        <ContextSidebar
          activeTab={sidebarActiveTab}
          onOpenTab={(tabName) => openTab(tabName, undefined, {})}
          onClose={() => {}}
          isMobile={isMobile}
          isMobileOpen={false}
        />
      )}
      <main className="flex-1 min-w-0 bg-background flex flex-col">
        {/* Header removed per request; branding moved to Sidebar */}

        {/* Tab Bar Container */}
        <div className={`flex items-center bg-white border-b border-neutral-200 h-10 ${
          isGridMode ? 'border-blue-200 bg-blue-50' : ''
        }`}>
          {/* Pinned Tabs (fixed, always visible) */}
          <div className="flex items-center gap-0 pl-2">
            {openTabs.filter(tab => pinnedTabs.has(tab.key)).map((tab) => {
              const globalIdx = openTabs.findIndex(t => t.key === tab.key);
              const isActive = activeTabIdx === globalIdx;
              return (
                <div
                  key={tab.key}
                  className={`group flex items-center h-10 px-4 border-r border-neutral-200 cursor-pointer transition-all whitespace-nowrap min-w-max select-none
                    ${isActive ? "font-bold text-neutral-900 bg-white" : "font-normal text-neutral-700 bg-white hover:bg-neutral-100"}
                    ${isGridMode ? "cursor-grab active:cursor-grabbing" : ""}
                  `}
                  onClick={() => setActiveTabIdx(globalIdx)}
                  draggable={isGridMode}
                  onDragStart={(e) => handleTabDragStart(e, tab)}
                  style={{ 
                    borderRadius: 0,
                    borderBottom: isActive ? '4px solid #2563eb' : '2px solid transparent'
                  }}
                >
                  <span className="truncate max-w-[120px] text-lg">{tab.title}</span>
                  {isGridMode && (
                    <div className="ml-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  {/* Pin Button - Always visible for pinned, gold color */}
                  <button
                    onClick={e => { e.stopPropagation(); togglePinTab(tab.key); }}
                    className="ml-1 p-1 rounded transition-colors text-yellow-400 hover:text-yellow-500"
                    aria-label="Pin tab"
                  >
                    <Pin size={12} className={pinnedTabs.has(tab.key) ? "fill-current" : ""} />
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={e => { e.stopPropagation(); closeTab(globalIdx); }}
                    className="ml-1 p-1 rounded transition-colors text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                    aria-label="Close tab"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Scrollable Tabs (non-pinned) */}
          <div className="flex items-center gap-0 flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
            {openTabs.filter(tab => !pinnedTabs.has(tab.key)).map((tab) => {
              const globalIdx = openTabs.findIndex(t => t.key === tab.key);
              const isActive = activeTabIdx === globalIdx;
              return (
                <div
                  key={tab.key}
                  className={`group flex items-center h-10 px-4 border-r border-neutral-200 cursor-pointer transition-all whitespace-nowrap min-w-max select-none
                    ${isActive ? "font-bold text-neutral-900 bg-white" : "font-normal text-neutral-700 bg-white hover:bg-neutral-100"}
                    ${isGridMode ? "cursor-grab active:cursor-grabbing" : ""}
                  `}
                  onClick={() => {
                    setActiveTabIdx(globalIdx);
                    const route = routeMap[openTabs[globalIdx].type as keyof typeof routeMap];
                    if (route) router.push(route);
                  }}
                  draggable={isGridMode}
                  onDragStart={(e) => handleTabDragStart(e, tab)}
                  style={{ 
                    borderRadius: 0,
                    borderBottom: isActive ? '4px solid #2563eb' : '2px solid transparent'
                  }}
                >
                  <span className="truncate max-w-[120px] text-lg">{tab.title}</span>
                  {isGridMode && (
                    <div className="ml-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  {/* Pin Button - Show on hover */}
                  <button
                    onClick={e => { e.stopPropagation(); togglePinTab(tab.key); }}
                    className="ml-1 p-1 rounded transition-colors text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100"
                    aria-label="Pin tab"
                  >
                    <Pin size={12} />
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={e => { e.stopPropagation(); closeTab(globalIdx); }}
                    className="ml-1 p-1 rounded transition-colors text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                    aria-label="Close tab"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* New Tab Button */}
          <div className="flex items-center px-2 border-l border-neutral-200">
            <button
              onClick={openNewTab}
              className="p-1 rounded transition-colors text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              aria-label="New tab"
            >
              <Plus size={14} />
            </button>
            {isGridMode && (
              <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Drag to Grid
              </div>
            )}
          </div>

          {/* Grid View Button */}
          <div className="flex items-center px-2 border-l border-neutral-200">
              <button
              onClick={() => setIsGridMode(!isGridMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isGridMode 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25" 
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 border border-neutral-200 hover:border-neutral-300"
              }`}
              aria-label="Toggle grid view"
            >
              <Grid3X3 size={16} />
              <span className="text-lg font-medium">Grid View</span>
              </button>
          </div>

          {/* Invite Button */}
          <div className="flex items-center px-2 border-l border-neutral-200">
            <button
              onClick={() => {
                // Trigger invite modal from dashboard
                const event = new CustomEvent('open-invite-modal');
                window.dispatchEvent(event);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
              aria-label="Invite user"
            >
              <span>Invite User</span>
            </button>
          </div>

          {/* User Profile Display */}
          <div className="flex items-center px-4 border-l border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <User size={20} className="text-white" />
              </div>
              <span className="text-lg font-semibold text-neutral-800 hidden md:block">
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {isGridMode ? (
            <GridLayoutManager 
              onOpenTab={openTab} 
              draggedItem={draggedItem}
              onDropItem={(item) => setDraggedItem(null)}
            />
          ) : (
            <SnapLayoutManager onOpenTab={(tabType, context) => openTab(tabType, undefined, context)}>
              {openTabs[activeTabIdx] && (() => {
                const TabComponent = openTabs[activeTabIdx].component;
                return (
                  <div className="h-full">
                    <TabComponent
                      open={true}
                      onClose={() => closeTab(activeTabIdx)}
                      onOpenTab={openTab}
                      project={openTabs[activeTabIdx].project}
                      context={openTabs[activeTabIdx].context}
                    />
                  </div>
                );
              })()}
            </SnapLayoutManager>
          )}
        </div>
      </main>
    </div>
  );
} 

// Inline header logo component with graceful fallback
function HeaderLogo() {
  // We rely on the browser to attempt to load /brand.png; if it fails, we render a fallback SVG
  // Using a small trick: render the image and overlay fallback hidden behind; on error, swap state
  const [error, setError] = React.useState(false);
  if (!error) {
    return (
      <Image
        src="/Screenshot_2025-09-24_131002-removebg-preview.png"
        alt="App logo"
        fill
        sizes="32px"
        className="object-contain"
        priority
        onError={() => setError(true)}
      />
    );
  }
  // Fallback simple shield-like SVG if /brand.png is missing
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M32 2c8 3 16 3 24 0v26c0 12-9.5 22.3-24 34C17.5 50.3 8 40 8 28V2c8 3 16 3 24 0z" fill="url(#g)"/>
      <g fill="#fff" opacity="0.9">
        <rect x="18" y="18" width="10" height="10" rx="1.5"/>
        <polygon points="42,18 50,26 42,34 34,26" fill="#fff"/>
        <circle cx="30" cy="36" r="4"/>
        <rect x="18" y="42" width="4" height="8" rx="1"/>
        <rect x="24" y="40" width="4" height="10" rx="1"/>
        <rect x="30" y="38" width="4" height="12" rx="1"/>
        <rect x="36" y="36" width="4" height="14" rx="1"/>
      </g>
    </svg>
  );
}