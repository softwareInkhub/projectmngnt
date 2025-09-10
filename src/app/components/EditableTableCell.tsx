import React, { useState, useRef, useEffect } from 'react';

interface EditableTableCellProps {
  value: string | number | undefined | null;
  onSave: (newValue: string | number) => Promise<boolean>;
  type?: 'text' | 'number' | 'select' | 'date';
  options?: string[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function EditableTableCell({
  value,
  onSave,
  type = 'text',
  options = [],
  className = '',
  placeholder = '',
  disabled = false
}: EditableTableCellProps) {
  // Safely handle undefined/null values
  const safeValue = value ?? (type === 'number' ? 0 : '');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(safeValue.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const handleStartEdit = () => {
    if (disabled) return;
    setEditValue(safeValue.toString());
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setEditValue(safeValue.toString());
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (editValue === safeValue.toString()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      let processedValue: string | number = editValue;
      
      // Process value based on type
      if (type === 'number') {
        const numValue = parseFloat(editValue);
        if (isNaN(numValue)) {
          setError('Invalid number');
          setIsSaving(false);
          return;
        }
        processedValue = numValue;
      }

      const success = await onSave(processedValue);
      
      if (success) {
        setIsEditing(false);
      } else {
        setError('Failed to save');
      }
    } catch (err) {
      setError('Error saving changes');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        {type === 'select' ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            disabled={isSaving}
            autoFocus
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            disabled={isSaving}
            autoFocus
          />
        )}
        
        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`group flex items-center justify-between cursor-pointer hover:bg-blue-50/50 rounded px-1 py-0.5 transition-colors ${className}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling to parent row
        handleStartEdit();
      }}
      title="Click to edit"
    >
      <span className="flex-1 truncate">
        {type === 'date' && safeValue ? new Date(safeValue).toLocaleDateString() : safeValue}
      </span>
    </div>
  );
}
