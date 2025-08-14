"use client";
import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./Sidebar";
import ContextSidebar from "./ContextSidebar";
import SnapLayoutManager from "./SnapLayoutManager";
import GridLayoutManager from "./GridLayoutManager";

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




import ProjectsPage from "./ProjectsPage";
import DepartmentsPage from "./DepartmentsPage";
import TeamsPageSheet from "./TeamsPageSheet";
import SprintsPage from "./SprintsPage";
import StoriesPage from "./StoriesPage";
import TasksPageSheet from "./TasksPageSheet";
import TasksPage from "./TasksPage";
import TeamsPage from "./TeamsPage";
import CalendarPage from "./CalendarPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import NotificationsPage from "./NotificationsPage";
import CompaniesPage from "./CompaniesPage";
import DashboardPage from "./DashboardPage";
import { X, Pin, Plus } from "lucide-react";
import ProjectsAnalyticsPage from "./ProjectsAnalyticsPage";
import NewTabPage from "./NewTabPage";
import CreateProjectPage from "./CreateProjectPage";
import CreateTaskPage from "./CreateTaskPage";
import CreateTeamPage from "./CreateTeamPage";
import CreateSprintPage from "./CreateSprintPage";
import CreateDepartmentPage from "./CreateDepartmentPage";
import CreateStoryPage from "./CreateStoryPage";
import GridDashboard from "./GridDashboard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SHEET_COMPONENTS: Record<string, React.ComponentType<Record<string, unknown>>> = {
  project: ProjectsPage,
  departments: DepartmentsPage,
  teams: TeamsPageSheet,
  sprints: SprintsPage,
  stories: StoriesPage,
  tasks: TasksPageSheet,
  "company-teams": TeamsPageSheet,
  "company-tasks": TasksPage,
  "company-projects": ProjectsPage,
  "create-project": CreateProjectPage,
  "create-task": CreateTaskPage,
  "create-team": CreateTeamPage,
  "create-sprint": CreateSprintPage,
  "create-department": CreateDepartmentPage,
  "create-story": CreateStoryPage,
  "edit-project": CreateProjectPage,
  "edit-task": CreateTaskPage,
  "edit-team": CreateTeamPage,
  "edit-sprint": CreateSprintPage,
  "view-project": ProjectsPage,
  "view-task": TasksPageSheet,
  "view-team": TeamsPageSheet,
  "view-sprint": SprintsPage,
  "view-department": DepartmentsPage,
  "view-story": StoriesPage,
};

export default function ClientLayout() {
  // Set Dashboard as the default open tab
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [openTabs, setOpenTabs] = useState<{ type: string; key: string; title: string; component: React.ComponentType<any>; project?: Project; context?: any }[]>([
    { type: "dashboard", key: `dashboard-${Date.now()}`, title: "Dashboard", component: DashboardPage }
  ]);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [pinnedTabs, setPinnedTabs] = useState<Set<string>>(new Set());
  const [isGridMode, setIsGridMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  // Map sidebar index to tab type and title
  const sidebarTabMap = [
    { type: "dashboard", title: "Dashboard", component: DashboardPage },
    { type: "projects", title: "All Projects", component: ProjectsAnalyticsPage },
    { type: "tasks", title: "Tasks", component: TasksPage },
    { type: "teams", title: "Teams", component: TeamsPage },
    { type: "companies", title: "Companies", component: CompaniesPage },
    { type: "calendar", title: "Calendar", component: CalendarPage },
    { type: "reports", title: "Reports", component: ReportsPage },
    { type: "grid-dashboard", title: "Grid Dashboard", component: GridDashboard },
    { type: "settings", title: "Settings", component: SettingsPage },
    { type: "notifications", title: "Notifications", component: NotificationsPage },
  ];

  // Handlers to open new tabs
  const openTab = (type: string, context?: Record<string, unknown>) => {
    setOpenTabs((prev) => {
      // Create a unique key that includes context to allow multiple tabs of same type
      const uniqueKey = context ? `${type}-${JSON.stringify(context)}-${Date.now()}` : `${type}-${Date.now()}`;
      
      // Check if tab with same type and context already exists
      if (prev.some((tab) => tab.type === type && tab.context?.company === context?.company)) {
        const idx = prev.findIndex((tab) => tab.type === type && tab.context?.company === context?.company);
        setActiveTabIdx(idx);
        return prev;
      }
      
      // Find the component from SHEET_COMPONENTS first, then sidebarTabMap
      let component;
      let tabTitle = type.charAt(0).toUpperCase() + type.slice(1);
      
      // Check if it's a sheet component first (for company-specific types)
      if (SHEET_COMPONENTS[type]) {
        component = SHEET_COMPONENTS[type];
        tabTitle = type.charAt(0).toUpperCase() + type.slice(1);
      } else {
        // Check if it's a main sidebar tab
        const sidebarTab = sidebarTabMap.find(tab => tab.type === type);
        if (sidebarTab) {
          component = sidebarTab.component;
          tabTitle = sidebarTab.title;
        }
      }
      
      if (!component) {
        console.warn(`No component found for type: ${type}`);
        return prev;
      }
      
      // Add new tab at the end and set as active
      const newTabs = [...prev, { type, key: uniqueKey, title: tabTitle || type, component, context }];
      setActiveTabIdx(newTabs.length - 1);
      return newTabs;
    });
  };

  const closeTab = (idx: number) => {
    setOpenTabs((prev) => {
      const newTabs = prev.filter((_, i) => i !== idx);
      // If we're closing the active tab, switch to the previous tab or the first tab
      if (idx === activeTabIdx) {
        if (newTabs.length === 0) {
          // If no tabs left, open dashboard
          setActiveTabIdx(0);
          return [{ type: "dashboard", key: `dashboard-${Date.now()}`, title: "Dashboard", component: DashboardPage }];
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
      const newTabs = [...prev, { type: "new-tab", key: `new-tab-${Date.now()}`, title: "New Tab", component: NewTabPage }];
      setActiveTabIdx(newTabs.length - 1);
      return newTabs;
    });
  };

  const onSidebarNavClick = (idx: number) => {
    const tab = sidebarTabMap[idx];
    
    // Custom logic for projects and companies
    let customTitle = tab.title;
    if (tab.type === "projects") {
      customTitle = "All Projects";
    } else if (tab.type === "companies") {
      customTitle = "Companies";
    }
    
    setOpenTabs((prev) => {
      const existingIdx = prev.findIndex((t) => t.type === tab.type);
      if (existingIdx !== -1) {
        // If tab already exists, switch to it
        setActiveTabIdx(existingIdx);
        return prev;
      }
      // If tab doesn't exist, add it at the end and set as active
      const newTabs = [...prev, { ...tab, key: `${tab.type}-${Date.now()}`, title: customTitle }];
      setActiveTabIdx(newTabs.length - 1); // Set to the new tab
      return newTabs;
    });
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
          component: ProjectsPage,
        },
      ];
      setActiveTabIdx(newTabs.length - 1);
      return newTabs;
    });
  };

  const handleSidebarDragStart = (e: React.DragEvent, item: Record<string, unknown>) => {
    setDraggedItem(item);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
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
    "grid-dashboard": 7,
    settings: 8,
    notifications: 9,
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
  const sidebarActiveTab = sidebarIndexMap[openTabs[activeTabIdx]?.type] ?? 0;

  // Pass these handlers to ContextSidebar
  return (
    <div className={`flex h-screen w-screen overflow-hidden ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
      <Sidebar
        activeTab={sidebarActiveTab}
        onNavClick={onSidebarNavClick}
        onToggleGridMode={() => setIsGridMode(!isGridMode)}
        isGridMode={isGridMode}
        onDragStart={handleSidebarDragStart}
      />
      {/* Show ContextSidebar for all tabs */}
      {(sidebarActiveTab === 1 || sidebarActiveTab === 2 || sidebarActiveTab === 3 || sidebarActiveTab === 4 || sidebarActiveTab === 5 || sidebarActiveTab === 6) && (
        <ContextSidebar
          activeTab={sidebarActiveTab}
          onAddProject={() => openTab("company-projects", "Company Projects", { company: "whapi project management" })}
          onAddDepartments={() => openTab("departments", "Company Departments", { company: "whapi project management" })}
          onAddTeams={() => openTab("company-teams", "Company Teams", { company: "whapi project management" })}
          onAddSprints={() => openTab("sprints", "Company Sprints", { company: "whapi project management" })}
          onAddStories={() => openTab("stories", "Company Stories", { company: "whapi project management" })}
          onAddTasks={() => openTab("company-tasks", "Company Tasks", { company: "whapi project management" })}
          onOpenCompanyProjects={onOpenCompanyProjects}
        />
      )}
      <main className="flex-1 min-w-0 bg-background flex flex-col">
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
                  <span className="truncate max-w-[120px] text-sm">{tab.title}</span>
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
                  onClick={() => setActiveTabIdx(globalIdx)}
                  draggable={isGridMode}
                  onDragStart={(e) => handleTabDragStart(e, tab)}
                  style={{ 
                    borderRadius: 0,
                    borderBottom: isActive ? '4px solid #2563eb' : '2px solid transparent'
                  }}
                >
                  <span className="truncate max-w-[120px] text-sm">{tab.title}</span>
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
            <SnapLayoutManager onOpenTab={openTab}>
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