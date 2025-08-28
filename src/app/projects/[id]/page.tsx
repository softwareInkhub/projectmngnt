"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  console.log('=== PROJECT DETAIL PAGE DEBUG ===');
  console.log('ProjectDetailPage rendered with projectId:', projectId);
  console.log('Params:', params);
  console.log('Project ID type:', typeof projectId);
  console.log('Project ID length:', projectId?.length);
  console.log('Is project ID empty?', !projectId || projectId.trim() === '');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Loading...</h1>
          <p className="text-slate-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Project Details</h1>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Navigation Working!</h2>
              <p className="text-green-700">The project detail page is loading correctly.</p>
            </div>
            
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Project Information:</h3>
              <p className="text-blue-700"><strong>Project ID:</strong> {projectId || 'No ID'}</p>
              <p className="text-blue-700"><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Unknown'}</p>
            </div>
            
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
              <p className="text-yellow-700"><strong>Params:</strong> {JSON.stringify(params)}</p>
              <p className="text-yellow-700"><strong>Project ID Type:</strong> {typeof projectId}</p>
              <p className="text-yellow-700"><strong>Project ID Length:</strong> {projectId?.length || 0}</p>
            </div>
            
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
