import { useState, useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onRevert?: () => void;
}

export function useOptimisticUpdates<T extends { id: string }>() {
  const [isUpdating, setIsUpdating] = useState(false);

  const optimisticCreate = useCallback(async <TData>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    createData: TData,
    apiCall: (data: TData) => Promise<any>,
    transformToItem: (data: any) => T,
    options?: OptimisticUpdateOptions<T>
  ) => {
    try {
      // Create optimistic item
      const optimisticItem: T = {
        ...transformToItem(createData),
        id: `temp-${Date.now()}`
      };

      // Add to UI immediately
      setItems([optimisticItem, ...items]);

      // Make API call
      const response = await apiCall(createData);

      if (response.success) {
        // Replace with real item
        const realItem = transformToItem(response.data || response);
                setItems((prev: T[]) => prev.map(item =>
          item.id === optimisticItem.id ? { ...realItem, id: (realItem as any).id || `real-${Date.now()}` } : item
        ));
        options?.onSuccess?.(realItem);
      } else {
        // Revert on failure
        setItems(prev => prev.filter(item => item.id !== optimisticItem.id));
        options?.onRevert?.();
        throw new Error(response.error || 'Failed to create item');
      }
    } catch (error) {
      // Revert on error
      setItems(prev => prev.filter(item => !item.id.startsWith('temp-')));
      options?.onRevert?.();
      options?.onError?.(error as Error);
      throw error;
    }
  }, []);

  const optimisticUpdate = useCallback(async <TData>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    itemId: string,
    updateData: TData,
    apiCall: (id: string, data: TData) => Promise<any>,
    transformToItem: (data: any) => T,
    options?: OptimisticUpdateOptions<T>
  ) => {
    try {
      // Find original item
      const originalItem = items.find(item => item.id === itemId);
      if (!originalItem) throw new Error('Item not found');

      // Create optimistic item
      const optimisticItem: T = {
        ...originalItem,
        ...transformToItem(updateData)
      };

      // Update in UI immediately
            setItems(prev => prev.map(item =>
        item.id === itemId ? optimisticItem : item
      ));

      // Make API call
      const response = await apiCall(itemId, updateData);

      if (response.success) {
        // Keep optimistic update or replace with real data
        const realItem = transformToItem(response.data || response);
                setItems(prev => prev.map(item =>
          item.id === itemId ? { ...realItem, id: itemId } : item
        ));
        options?.onSuccess?.(realItem);
      } else {
        // Revert on failure
        setItems(prev => prev.map(item => 
          item.id === itemId ? originalItem : item
        ));
        options?.onRevert?.();
        throw new Error(response.error || 'Failed to update item');
      }
    } catch (error) {
      // Revert on error
      const originalItem = items.find(item => item.id === itemId);
      if (originalItem) {
        setItems(prev => prev.map(item => 
          item.id === itemId ? originalItem : item
        ));
      }
      options?.onRevert?.();
      options?.onError?.(error as Error);
      throw error;
    }
  }, []);

  const optimisticDelete = useCallback(async (
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    itemId: string,
    apiCall: (id: string) => Promise<any>,
    options?: OptimisticUpdateOptions<T>
  ) => {
    try {
      // Find item to delete
      const deletedItem = items.find(item => item.id === itemId);
      if (!deletedItem) throw new Error('Item not found');

      // Remove from UI immediately
      setItems(prev => prev.filter(item => item.id !== itemId));

      // Make API call
      const response = await apiCall(itemId);

      if (response.success) {
        options?.onSuccess?.(deletedItem);
      } else {
        // Revert on failure
        setItems(prev => [...prev, deletedItem]);
        options?.onRevert?.();
        throw new Error(response.error || 'Failed to delete item');
      }
    } catch (error) {
      // Revert on error
      const deletedItem = items.find(item => item.id === itemId);
      if (deletedItem) {
        setItems(prev => [...prev, deletedItem]);
      }
      options?.onRevert?.();
      options?.onError?.(error as Error);
      throw error;
    }
  }, []);

  return {
    isUpdating,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete
  };
}


