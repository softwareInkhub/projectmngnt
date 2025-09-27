
'use client';

import React from 'react';
// DashboardPage removed - using ProjectsAnalyticsPage as placeholder
// import ProjectsAnalyticsPage from './ProjectsAnalyticsPage'; // File is commented out
// // import TeamsPageSheet from './TeamsPageSheet'; // File is commented out // File is commented out
// import TasksPage from './TasksPage'; // File is commented out
// import CalendarPage from './CalendarPage'; // File is commented out
// import ReportsPage from './ReportsPage'; // File is commented out
// import NotificationsPage from './NotificationsPage'; // File is commented out
// import SettingsPage from './SettingsPage'; // File is commented out
// import CompaniesPage from './CompaniesPage'; // File is commented out
// import DepartmentsPage from './DepartmentsPage'; // File is commented out
// import SprintsPage from './SprintsPage'; // File is commented out
import StoriesPage from './StoriesPage';

interface ResponsiveSheetContentProps {
  sheetType: string;
  sheetTitle: string;
  width: number;
  height: number;
  breakpoint: string;
  children?: React.ReactNode;
  onOpenTab?: (type: string, title?: string, context?: Record<string, unknown>) => void;
  project?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export default function ResponsiveSheetContent({
  sheetType,
  sheetTitle,
  width,
  height,
  breakpoint,
  onOpenTab,
  project,
  context
}: ResponsiveSheetContentProps) {
  // Calculate responsive class based on dimensions
  const getResponsiveClass = () => {
    const area = width * height;
    if (area <= 4) return 'responsive-compact';
    if (area <= 12) return 'responsive-medium';
    return 'responsive-large';
  };

  const responsiveClass = getResponsiveClass();

  // Render the original component with responsive wrapper
  const renderOriginalComponent = () => {
    switch (sheetType) {
      case 'dashboard':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
                        <div className="flex items-center justify-center h-full text-slate-500">
              <p>Projects component not available</p>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
                        <div className="flex items-center justify-center h-full text-slate-500">
              <p>Projects component not available</p>
            </div>
          </div>
        );
      case 'teams':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Teams component not available</p>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Tasks component not available</p>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Calendar component not available</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Reports component not available</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Notifications component not available</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Settings component not available</p>
            </div>
          </div>
        );
      case 'companies':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Companies component not available</p>
            </div>
          </div>
        );
      case 'projects-analytics':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Projects component not available</p>
            </div>
          </div>
        );
      case 'departments':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Departments component not available</p>
            </div>
          </div>
        );
      case 'sprints':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Sprints component not available</p>
            </div>
          </div>
        );
      case 'stories':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <StoriesPage 
              open={true}
              onClose={() => {}}
              onOpenTab={onOpenTab}
            />
          </div>
        );
      default:
        return (
          <div 
            className={`h-full w-full flex items-center justify-center text-gray-500 overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <div className="text-center">
              <div className="text-lg font-medium">{sheetTitle}</div>
              <div className="text-sm">Sheet Type: {sheetType}</div>
              <div className="text-xs mt-2">
                Size: {width}×{height} | Breakpoint: {breakpoint}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full overflow-auto">
      {renderOriginalComponent()}
    </div>
  );
} 