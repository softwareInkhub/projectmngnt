'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '../components/ClientLayout';
import { UserProvider } from '../contexts/UserContext';
import InviteUserForm from '../components/InviteUserForm';
import { ProjectApiService } from '../utils/projectApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const idToken = localStorage.getItem('id_token');
        const uid = localStorage.getItem('user_id') || 'demo-user-123';
        const uname = localStorage.getItem('user_name') || 'Demo User';
        
        console.log('Auth check - User ID:', uid);
        console.log('Auth check - User Name:', uname);
        
        setCurrentUserId(uid);
        setCurrentUserName(uname);
        
        // Check if user has valid tokens (not mock tokens)
        if (accessToken && idToken && accessToken !== 'mock-token-disabled') {
          setIsAuthenticated(true);
        } else {
          router.push('/authPage');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/authPage');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  // Listen for auth success events from auth page
  useEffect(() => {
    const handleAuthSuccess = () => {
      console.log('Auth success event received, redirecting to dashboard...');
      setIsAuthenticated(true);
    };

    window.addEventListener('auth-success', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess);
    };
  }, []);

  // Listen for invite modal events from ClientLayout
  useEffect(() => {
    const handleOpenInviteModal = () => {
      console.log('Opening invite modal...');
      console.log('Current user ID:', currentUserId);
      console.log('Selected project ID:', selectedProjectId);
      console.log('Projects available:', projects.length);
      setShowInvite(true);
    };

    window.addEventListener('open-invite-modal', handleOpenInviteModal);
    
    return () => {
      window.removeEventListener('open-invite-modal', handleOpenInviteModal);
    };
  }, [currentUserId, selectedProjectId, projects.length]);

  // Fetch projects for selector (when authenticated)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects for invite selector...');
        const response = await ProjectApiService.getProjects();
        console.log('Projects API response:', response);
        
        if (response.success) {
          const items: any[] = (response as any).data || (response as any).items || [];
          console.log('Projects loaded:', items.length, 'items');
          setProjects(items);
          
          if (items.length > 0) {
            const first = items[0];
            const projectId = first.id || `project-${Date.now()}`;
            const projectName = first.name || 'Demo Project';
            
            console.log('Setting default project:', { projectId, projectName });
            setSelectedProjectId(projectId);
            setSelectedProjectName(projectName);
          } else {
            // Create a default project if none exist
            const defaultProjectId = `default-project-${Date.now()}`;
            const defaultProjectName = 'Default Project';
            
            console.log('No projects found, using default:', { defaultProjectId, defaultProjectName });
            setSelectedProjectId(defaultProjectId);
            setSelectedProjectName(defaultProjectName);
          }
        } else {
          console.warn('Failed to fetch projects:', response.error);
          // Use default project
          const defaultProjectId = `default-project-${Date.now()}`;
          const defaultProjectName = 'Default Project';
          setSelectedProjectId(defaultProjectId);
          setSelectedProjectName(defaultProjectName);
        }
      } catch (e) {
        console.warn('Failed to load projects for invite selector:', e);
        // Use default project
        const defaultProjectId = `default-project-${Date.now()}`;
        const defaultProjectName = 'Default Project';
        setSelectedProjectId(defaultProjectId);
        setSelectedProjectName(defaultProjectName);
      }
    };
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

  return (
    <UserProvider>
      <ClientLayout />

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200">
            {/* Project selector header */}
            <div className="p-4 border-b border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  const pid = e.target.value;
                  setSelectedProjectId(pid);
                  const proj = projects.find((p) => (p.id || '') === pid);
                  setSelectedProjectName(proj?.name || '');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                {projects.map((p, idx) => (
                  <option key={p.id || `proj-${idx}`} value={p.id || ''}>{p.name || p.id}</option>
                ))}
              </select>
            </div>

            {/* Invite Form */}
            {selectedProjectId && currentUserId ? (
              <InviteUserForm
                projectId={selectedProjectId}
                projectName={selectedProjectName}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onInviteSent={() => setShowInvite(false)}
                onClose={() => setShowInvite(false)}
                className="border-0"
              />
            ) : (
              <div className="p-6 text-center text-slate-600">
                <p>Loading project data...</p>
                <p className="text-sm mt-2">Please wait while we prepare the invite form.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </UserProvider>
  );
}
