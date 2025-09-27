'use client';

import React from 'react';
// import ProjectsAnalyticsPage from './ProjectsAnalyticsPage'; // File is commented out
// import TasksPage from './TasksPage'; // File is commented out
// import TeamsPage from './TeamsPage'; // File is commented out
// DashboardPage removed - using ProjectsAnalyticsPage as placeholder
// import CalendarPage from './CalendarPage'; // File is commented out
// import ReportsPage from './ReportsPage'; // File is commented out
import GridTasksPage from './GridTasksPage';
// import GridLayoutDemo from './GridLayoutDemo'; // File is commented out

interface LayoutComponentRendererProps {
  componentId: string;
  className?: string;
  onOpenTab?: (tabType: string, context?: any) => void;
  onViewProject?: (project: any) => void;
}

export default function LayoutComponentRenderer({ 
  componentId, 
  className = '',
  onOpenTab,
  onViewProject 
}: LayoutComponentRendererProps) {
  const renderComponent = () => {
    switch (componentId) {
      case 'projects':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Projects component not available</p></div>;
      case 'tasks':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Tasks component not available</p></div>;
      case 'teams':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Teams component not available</p></div>;
      case 'analytics':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Analytics component not available</p></div>;
      case 'calendar':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Calendar component not available</p></div>;
      case 'reports':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Reports component not available</p></div>;
      case 'grid-tasks':
        return <GridTasksPage />;
      case 'grid-demo':
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Grid demo component not available</p></div>;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Component not found</p>
          </div>
        );
    }
  };

  return (
    <div className={`h-full overflow-hidden ${className}`}>
      <div className="h-full overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
} 