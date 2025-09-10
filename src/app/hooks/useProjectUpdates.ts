import { useState } from 'react';
import { ProjectApiService, ProjectData } from '../utils/projectApi';

// Local storage fallback for when API is unavailable
const LOCAL_STORAGE_KEY = 'project_updates_fallback';

interface LocalUpdate {
  projectId: string;
  field: keyof ProjectData;
  value: string | number;
  timestamp: string;
}

const saveLocalUpdate = (projectId: string, field: keyof ProjectData, value: string | number) => {
  try {
    const updates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const newUpdate: LocalUpdate = {
      projectId,
      field,
      value,
      timestamp: new Date().toISOString()
    };
    updates.push(newUpdate);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updates));
    console.log('Saved update to local storage:', newUpdate);
  } catch (error) {
    console.error('Failed to save to local storage:', error);
  }
};

interface UseProjectUpdatesProps {
  onUpdate?: (project: ProjectData) => void;
  onError?: (error: string) => void;
  onLocalSave?: (message: string) => void;
}

export function useProjectUpdates({ onUpdate, onError, onLocalSave }: UseProjectUpdatesProps = {}) {
  const [updatingProjects, setUpdatingProjects] = useState<Set<string>>(new Set());

  const updateProjectField = async (
    projectId: string,
    field: keyof ProjectData,
    value: string | number
  ): Promise<boolean> => {
    if (!projectId) {
      onError?.('Project ID is required');
      return false;
    }

    setUpdatingProjects(prev => new Set(prev).add(projectId));

    try {
      const updateData: Partial<ProjectData> = {
        [field]: value,
        updatedAt: new Date().toISOString()
      };

      console.log('Attempting to update project:', { projectId, field, value, updateData });

      // Try the real API first, with timeout
      const apiTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 5000)
      );
      
      let response: any;
      
      try {
        response = await Promise.race([
          ProjectApiService.updateProject(projectId, updateData),
          apiTimeout
        ]);
        console.log('Update response:', response);
      } catch (apiError) {
        console.log('API not available, using local storage fallback for offline mode');
        
        // Save to local storage immediately
        saveLocalUpdate(projectId, field, value);
        
        // Create a mock successful response
        response = {
          success: true,
          data: {
            id: projectId,
            [field]: value,
            updatedAt: new Date().toISOString()
          } as unknown as ProjectData
        };
        console.log('Local storage fallback response:', response);
      }

      if (response.success && response.data) {
        onUpdate?.(response.data);
        return true;
      } else {
        const errorMessage = response.error || 'Failed to update project';
        console.log('API update failed, saving locally:', errorMessage);
        
        // Save to local storage as fallback
        saveLocalUpdate(projectId, field, value);
        
        // Still update the UI optimistically
        const mockUpdatedProject = {
          id: projectId,
          [field]: value,
          updatedAt: new Date().toISOString()
        } as unknown as ProjectData;
        onUpdate?.(mockUpdatedProject);
        
        onLocalSave?.(`Update saved locally. ${errorMessage}`);
        return true; // Return true since we saved locally
      }
    } catch (error) {
      console.log('Unexpected error, saving locally:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Save to local storage as fallback
      saveLocalUpdate(projectId, field, value);
      
      // Still update the UI optimistically
      const mockUpdatedProject = {
        id: projectId,
        [field]: value,
        updatedAt: new Date().toISOString()
      } as unknown as ProjectData;
      onUpdate?.(mockUpdatedProject);
      
      onLocalSave?.(`Update saved locally. ${errorMessage}`);
      return true; // Return true since we saved locally
    } finally {
      setUpdatingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const isUpdating = (projectId: string) => updatingProjects.has(projectId);

  // Function to retry failed updates
  const retryFailedUpdates = async () => {
    try {
      const updates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      if (updates.length === 0) return;

      console.log('Retrying failed updates:', updates);
      
      for (const update of updates) {
        try {
          const updateData: Partial<ProjectData> = {
            [update.field]: update.value,
            updatedAt: new Date().toISOString()
          };

          const response = await ProjectApiService.updateProject(update.projectId, updateData);
          
          if (response.success) {
            console.log('Successfully retried update:', update);
            // Remove from local storage
            const remainingUpdates = updates.filter((u: LocalUpdate) => 
              !(u.projectId === update.projectId && u.field === update.field && u.timestamp === update.timestamp)
            );
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remainingUpdates));
          }
        } catch (error) {
          console.error('Failed to retry update:', update, error);
        }
      }
    } catch (error) {
      console.error('Error retrying updates:', error);
    }
  };

  return {
    updateProjectField,
    isUpdating,
    retryFailedUpdates
  };
}
