'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Building2, FolderOpen, CheckSquare, Users } from 'lucide-react';

interface Activity {
  id: string;
  type: 'company' | 'project' | 'task' | 'team' | 'user';
  action: string;
  entity: string;
  user: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons = {
  company: Building2,
  project: FolderOpen,
  task: CheckSquare,
  team: Users,
  user: User,
};

const activityColors = {
  company: 'text-blue-600 bg-blue-100',
  project: 'text-green-600 bg-green-100',
  task: 'text-purple-600 bg-purple-100',
  team: 'text-orange-600 bg-orange-100',
  user: 'text-red-600 bg-red-100',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activityColors[activity.type]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  <span className="mx-1">{activity.action}</span>
                  <span className="font-medium">{activity.entity}</span>
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {activity.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}
