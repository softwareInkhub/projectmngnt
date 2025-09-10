import { useState, useCallback } from 'react';
import { TaskApiService, TaskData } from '../utils/taskApi';

interface UseTaskUpdatesProps {
  onUpdate?: (task: TaskData) => void;
  onError?: (error: string) => void;
  onLocalSave?: (message: string) => void;
}

export function useTaskUpdates({ onUpdate, onError, onLocalSave }: UseTaskUpdatesProps = {}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [failedUpdates, setFailedUpdates] = useState<Array<{
    taskId: string;
    field: keyof TaskData;
    value: string | number;
    timestamp: number;
  }>>([]);

  // Save update to local storage for retry later
  const saveLocalUpdate = useCallback((taskId: string, field: keyof TaskData, value: string | number) => {
    const update = {
      taskId,
      field,
      value,
      timestamp: Date.now()
    };
    
    const existingUpdates = JSON.parse(localStorage.getItem('failedTaskUpdates') || '[]');
    const updatedUpdates = [...existingUpdates, update];
    localStorage.setItem('failedTaskUpdates', JSON.stringify(updatedUpdates));
    
    setFailedUpdates(updatedUpdates);
  }, []);

  // Retry failed updates
  const retryFailedUpdates = useCallback(async () => {
    const storedUpdates = JSON.parse(localStorage.getItem('failedTaskUpdates') || '[]');
    
    if (storedUpdates.length === 0) {
      console.log('No failed task updates to retry');
      return;
    }

    console.log(`Retrying ${storedUpdates.length} failed task updates...`);
    
    const successfulUpdates: number[] = [];
    
    for (let i = 0; i < storedUpdates.length; i++) {
      const update = storedUpdates[i];
      try {
        const response = await TaskApiService.updateTask(update.taskId, {
          [update.field]: update.value,
          updatedAt: new Date().toISOString()
        });
        
        if (response.success && response.data) {
          successfulUpdates.push(i);
          onUpdate?.(response.data);
        }
      } catch (error) {
        console.log(`Retry failed for task ${update.taskId}:`, error);
      }
    }
    
    // Remove successful updates from storage
    const remainingUpdates = storedUpdates.filter((_: any, index: number) => 
      !successfulUpdates.includes(index)
    );
    
    localStorage.setItem('failedTaskUpdates', JSON.stringify(remainingUpdates));
    setFailedUpdates(remainingUpdates);
    
    console.log(`Retry completed: ${successfulUpdates.length} successful, ${remainingUpdates.length} still failed`);
  }, [onUpdate]);

  const updateTaskField = useCallback(async (
    taskId: string,
    field: keyof TaskData,
    value: string | number
  ): Promise<boolean> => {
    if (!taskId) {
      console.log('useTaskUpdates: Calling onError for missing Task ID');
      onError?.('Task ID is required');
      return false;
    }

    setIsUpdating(true);
    
    try {
      console.log(`useTaskUpdates: Updating task ${taskId}, field: ${field}, value:`, value);
      
      const response = await TaskApiService.updateTask(taskId, {
        [field]: value,
        updatedAt: new Date().toISOString()
      });
      
      if (response.success && response.data) {
        console.log('useTaskUpdates: Calling onUpdate with:', response.data);
        onUpdate?.(response.data);
        return true;
      } else {
        const errorMessage = response.error || 'Failed to update task';
        console.log('useTaskUpdates: API update failed, saving locally:', errorMessage);
        
        saveLocalUpdate(taskId, field, value);
        
        const mockUpdatedTask = {
          id: taskId,
          [field]: value,
          updatedAt: new Date().toISOString()
        } as unknown as TaskData;
        onUpdate?.(mockUpdatedTask); // Optimistic UI update
        
        console.log('useTaskUpdates: Calling onLocalSave with:', `Update saved locally. ${errorMessage}`);
        onLocalSave?.(`Update saved locally. ${errorMessage}`);
        return true;
      }
    } catch (error) {
      console.log('useTaskUpdates: Unexpected error in updateTaskField, saving locally:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      saveLocalUpdate(taskId, field, value);
      
      const mockUpdatedTask = {
        id: taskId,
        [field]: value,
        updatedAt: new Date().toISOString()
      } as unknown as TaskData;
      onUpdate?.(mockUpdatedTask); // Optimistic UI update
      
      console.log('useTaskUpdates: Calling onLocalSave with:', `Update saved locally. ${errorMessage}`);
      onLocalSave?.(`Update saved locally. ${errorMessage}`);
      return true;
    } finally {
      setIsUpdating(false);
    }
  }, [onUpdate, onError, onLocalSave, saveLocalUpdate]);

  return {
    updateTaskField,
    isUpdating,
    retryFailedUpdates,
    failedUpdates
  };
}
