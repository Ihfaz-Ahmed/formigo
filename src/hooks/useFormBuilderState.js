import { useState, useCallback } from 'react';

// Default field types with their configurations
export const FIELD_TYPES = {
  text: {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
    defaultProps: {
      label: 'Text Field',
      name: 'text_field',
      placeholder: 'Enter text...',
      required: false,
      value: ''
    }
  },
  email: {
    type: 'email',
    label: 'Email',
    icon: '📧',
    defaultProps: {
      label: 'Email Address',
      name: 'email',
      placeholder: 'Enter your email...',
      required: false,
      value: ''
    }
  },
  password: {
    type: 'password',
    label: 'Password',
    icon: '🔒',
    defaultProps: {
      label: 'Password',
      name: 'password',
      placeholder: 'Enter password...',
      required: false,
      value: ''
    }
  },
  textarea: {
    type: 'textarea',
    label: 'Textarea',
    icon: '📄',
    defaultProps: {
      label: 'Message',
      name: 'message',
      placeholder: 'Enter your message...',
      required: false,
      value: ''
    }
  },
  select: {
    type: 'select',
    label: 'Select Dropdown',
    icon: '📋',
    defaultProps: {
      label: 'Select Option',
      name: 'select_field',
      placeholder: 'Choose an option...',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      value: ''
    }
  },
  radio: {
    type: 'radio',
    label: 'Radio Group',
    icon: '🔘',
    defaultProps: {
      label: 'Select One',
      name: 'radio_field',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      value: ''
    }
  },
  checkbox: {
    type: 'checkbox',
    label: 'Checkbox',
    icon: '☑️',
    defaultProps: {
      label: 'I agree to the terms',
      name: 'checkbox_field',
      required: false,
      value: false
    }
  },
  submit: {
    type: 'submit',
    label: 'Submit Button',
    icon: '🚀',
    defaultProps: {
      label: 'Submit Form',
      name: 'submit_button',
      value: ''
    }
  }
};

export const useFormBuilderState = () => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Generate unique ID for fields
  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Save state to history for undo/redo
  const saveToHistory = useCallback((newFields) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newFields]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);
  
  // Add field to canvas
  const addField = useCallback((fieldType) => {
    const fieldTemplate = FIELD_TYPES[fieldType];
    if (!fieldTemplate) return;
    
    const newField = {
      id: generateId(),
      ...fieldTemplate.defaultProps,
      type: fieldTemplate.type,
    };
    
    const newFields = [...fields, newField];
    setFields(newFields);
    saveToHistory(newFields);
    setSelectedField(newField);
  }, [fields, saveToHistory]);
  
  // Remove field from canvas
  const removeField = useCallback((fieldId) => {
    const newFields = fields.filter(field => field.id !== fieldId);
    setFields(newFields);
    saveToHistory(newFields);
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [fields, selectedField, saveToHistory]);
  
  // Update field properties
  const updateField = useCallback((fieldId, updates) => {
    const newFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(newFields);
    saveToHistory(newFields);
    
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  }, [fields, selectedField, saveToHistory]);
  
  // Reorder fields (for drag and drop)
  const reorderFields = useCallback((startIndex, endIndex) => {
    const newFields = [...fields];
    const [removed] = newFields.splice(startIndex, 1);
    newFields.splice(endIndex, 0, removed);
    
    setFields(newFields);
    saveToHistory(newFields);
  }, [fields, saveToHistory]);
  
  // Clear all fields
  const clearFields = useCallback(() => {
    setFields([]);
    setSelectedField(null);
    saveToHistory([]);
  }, [saveToHistory]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setFields([...previousState]);
      setHistoryIndex(newIndex);
      
      // Clear selection if the selected field no longer exists
      if (selectedField && !previousState.find(field => field.id === selectedField.id)) {
        setSelectedField(null);
      }
    }
  }, [history, historyIndex, selectedField]);
  
  // Redo last action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setFields([...nextState]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);
  
  // Duplicate field
  const duplicateField = useCallback((fieldId) => {
    const fieldToDuplicate = fields.find(field => field.id === fieldId);
    if (!fieldToDuplicate) return;
    
    const duplicatedField = {
      ...fieldToDuplicate,
      id: generateId(),
      name: `${fieldToDuplicate.name}_copy`,
      label: `${fieldToDuplicate.label} (Copy)`
    };
    
    const newFields = [...fields, duplicatedField];
    setFields(newFields);
    saveToHistory(newFields);
    setSelectedField(duplicatedField);
  }, [fields, saveToHistory]);
  
  return {
    fields,
    selectedField,
    setSelectedField,
    addField,
    removeField,
    updateField,
    reorderFields,
    clearFields,
    duplicateField,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    FIELD_TYPES
  };
}; 