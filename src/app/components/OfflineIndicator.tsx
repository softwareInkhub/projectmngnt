import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export default function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  console.log('📡 OfflineIndicator - isOnline:', isOnline);
  
  if (isOnline) {
    console.log('✅ Backend is ONLINE - hiding offline indicator');
    return null; // Don't show anything when online
  }

  console.log('⚠️ Backend is OFFLINE - showing offline indicator');
  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <WifiOff size={16} className="text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">
          Offline Mode
        </span>
      </div>
      <p className="text-xs text-yellow-700 mt-1">
        Using demo data
      </p>
    </div>
  );
}
