'use client';

import React, { useState } from 'react';
import GridLayoutManager from './GridLayoutManager';
import { 
  BarChart3, 
  Folder, 
  Users, 
  CheckCircle, 
  Calendar, 
  Bell, 
  Settings,
  Info,
  ArrowLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function ResponsiveGridDemo() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenTab = (type: string, title?: string, context?: Record<string, unknown>) => {
    console.log('Opening tab:', type, title, context);
    // In a real app, this would open a new tab
  };

  return (
    <div className={`h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Responsive Grid Layout Demo</h1>
              <p className="text-gray-600">Drag, resize, and watch sheets adapt to their dimensions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Responsive Sheet Features:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>Small sheets</strong> (3×4 or smaller): Show compact view with expand/collapse</li>
              <li>• <strong>Medium sheets</strong> (4×6 or smaller): Show essential content with basic actions</li>
              <li>• <strong>Large sheets</strong> (6×4 or larger): Show full content with all features</li>
              <li>• <strong>Auto-adaptation</strong>: Content automatically adjusts based on available space</li>
              <li>• <strong>Breakpoint awareness</strong>: Different layouts for mobile, tablet, and desktop</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grid Layout Manager */}
      <div className="flex-1 overflow-hidden">
        <GridLayoutManager
          onOpenTab={handleOpenTab}
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quick Tips:</span>
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <BarChart3 size={12} />
                <span>Drag sheets to rearrange</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize2 size={12} />
                <span>Resize to see content adapt</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>Small sheets show compact view</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Breakpoint:</span>
            <span className="px-2 py-1 bg-gray-100 rounded font-medium">LG</span>
            <span>•</span>
            <span>Sheets:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">3</span>
          </div>
        </div>
      </div>
    </div>
  );
} 