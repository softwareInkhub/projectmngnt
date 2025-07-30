'use client';

import React from 'react';
import ProjectsAnalyticsPage from './ProjectsAnalyticsPage';
import TasksPage from './TasksPage';
import TeamsPage from './TeamsPage';
import DashboardPage from './DashboardPage';
import CalendarPage from './CalendarPage';
import ReportsPage from './ReportsPage';
import GridDashboard from './GridDashboard';
import GridTasksPage from './GridTasksPage';
import GridLayoutDemo from './GridLayoutDemo';

interface LayoutComponentRendererProps {
  componentId: string;
  className?: string;
  onOpenTab?: (tabType: string, context?: any) => void;
}

export default function LayoutComponentRenderer({ 
  componentId, 
  className = '',
  onOpenTab 
}: LayoutComponentRendererProps) {
  const renderComponent = () => {
    switch (componentId) {
      case 'projects':
        return <ProjectsAnalyticsPage onOpenTab={onOpenTab} />;
      case 'tasks':
        return <TasksPage onOpenTab={onOpenTab} />;
      case 'teams':
        return <TeamsPage onOpenTab={onOpenTab} />;
      case 'analytics':
        return <DashboardPage onOpenTab={onOpenTab} />;
      case 'calendar':
        return <CalendarPage onOpenTab={onOpenTab} />;
      case 'reports':
        return <ReportsPage onOpenTab={onOpenTab} />;
      case 'grid-dashboard':
        return <GridDashboard onOpenTab={onOpenTab} />;
      case 'grid-tasks':
        return <GridTasksPage onOpenTab={onOpenTab} />;
      case 'grid-demo':
        return <GridLayoutDemo />;
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