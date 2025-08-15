'use client';

import React from 'react';
import DashboardPage from './DashboardPage';
import ProjectsPage from './ProjectsPage';
import TeamsPage from './TeamsPage';
import TasksPage from './TasksPage';
import CalendarPage from './CalendarPage';
import ReportsPage from './ReportsPage';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';

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
                        <DashboardPage
              open={true}
              onClose={() => {}}
              onOpenTab={onOpenTab ? (type: string) => onOpenTab(type, sheetTitle, context) : (() => {})}
            />
          </div>
        );
      case 'projects':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
                        <ProjectsPage
              context={context as { company: string } | undefined}
            />
          </div>
        );
      case 'teams':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <TeamsPage 
              onOpenTab={onOpenTab}
              context={context as { company: string } | undefined}
            />
          </div>
        );
      case 'tasks':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <TasksPage 
              context={context as { company: string } | undefined}
            />
          </div>
        );
      case 'calendar':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <CalendarPage
              open={true}
              onClose={() => {}}
              onOpenTab={onOpenTab}
            />
          </div>
        );
      case 'reports':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <ReportsPage />
          </div>
        );
      case 'notifications':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <NotificationsPage />
          </div>
        );
      case 'settings':
        return (
          <div 
            className={`h-full w-full overflow-auto ${responsiveClass}`}
            data-sheet-width={width}
            data-sheet-height={height}
          >
            <SettingsPage />
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