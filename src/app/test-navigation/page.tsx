"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function TestNavigationPage() {
  const router = useRouter();

  const testNavigation = (projectId: string) => {
    console.log(`Testing navigation to: /projects/${projectId}`);
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Navigation Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => testNavigation('test-project-1')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Project 1
          </button>
          
          <button
            onClick={() => testNavigation('test-project-2')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Project 2
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
